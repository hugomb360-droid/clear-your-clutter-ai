import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";

export type PayoutStatus = {
  connected: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  bankLast4: string | null;
};

type StatusResult = PayoutStatus | { error: string };
type LinkResult = { url: string } | { error: string };

/**
 * Un compte de versement créé en mode test n'existe pas en mode réel (et
 * inversement) : Stripe répond alors « account_invalid ». Dans ce cas on
 * oublie l'identifiant enregistré et on en crée un nouveau dans
 * l'environnement courant.
 */
function isUnknownConnectedAccount(message: string): boolean {
  return (
    message.includes("does not have access to account") ||
    message.includes("account_invalid") ||
    message.includes("not connected to your platform") ||
    message.includes("No such account")
  );
}

/** Statut du compte de versement (coordonnées bancaires) du pro connecté. */
export const getPayoutStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: StripeEnv }) => data)
  .handler(async ({ data, context }): Promise<StatusResult> => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("pro_profiles")
      .select("stripe_account_id, payouts_enabled")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.stripe_account_id) {
      return { connected: false, payoutsEnabled: false, detailsSubmitted: false, bankLast4: null };
    }

    try {
      const stripe = createStripeClient(data.environment);
      const account = await stripe.accounts.retrieve(profile.stripe_account_id);
      const bank = account.external_accounts?.data?.find((a) => a.object === "bank_account") as
        | { last4?: string }
        | undefined;
      const payoutsEnabled = Boolean(account.payouts_enabled);

      if (payoutsEnabled !== profile.payouts_enabled) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin
          .from("pro_profiles")
          .update({
            payouts_enabled: payoutsEnabled,
            payouts_ready_at: payoutsEnabled ? new Date().toISOString() : null,
          })
          .eq("user_id", userId);
      }

      return {
        connected: true,
        payoutsEnabled,
        detailsSubmitted: Boolean(account.details_submitted),
        bankLast4: bank?.last4 ?? null,
      };
    } catch (error) {
      const message = getStripeErrorMessage(error);
      if (isUnknownConnectedAccount(message)) {
        // Compte créé dans l'autre environnement (test/réel) : on l'oublie.
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin
          .from("pro_profiles")
          .update({ stripe_account_id: null, payouts_enabled: false, payouts_ready_at: null })
          .eq("user_id", userId);
        return { connected: false, payoutsEnabled: false, detailsSubmitted: false, bankLast4: null };
      }
      if (message.includes("signed up for Connect")) {
        return {
          error:
            "Les versements professionnels ne sont pas encore activés sur le compte de paiement Débarras France. L’administrateur doit terminer l’activation de la plateforme de paiement avant que vous puissiez renseigner votre IBAN.",
        };
      }
      return { error: message };
    }
  });

/** Ouvre (ou reprend) la configuration sécurisée des coordonnées bancaires du pro. */
export const startPayoutOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { returnUrl: string; refreshUrl: string; environment: StripeEnv }) => data)
  .handler(async ({ data, context }): Promise<LinkResult> => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("pro_profiles")
      .select("stripe_account_id, company_name")
      .eq("user_id", userId)
      .maybeSingle();
    if (!profile) return { error: "Complétez d'abord votre fiche entreprise" };

    try {
      const stripe = createStripeClient(data.environment);
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      let accountId = profile.stripe_account_id;

      if (!accountId) {
        const { data: userData } = await supabase.auth.getUser();
        const account = await stripe.accounts.create({
          type: "express",
          country: "FR",
          ...(userData.user?.email && { email: userData.user.email }),
          capabilities: { transfers: { requested: true } },
          business_profile: {
            name: profile.company_name ?? undefined,
            product_description: "Prestations de débarras via la plateforme Débarras France",
          },
          metadata: { proId: userId },
        });
        accountId = account.id;
        await supabaseAdmin
          .from("pro_profiles")
          .update({ stripe_account_id: accountId })
          .eq("user_id", userId);
      }

      const link = await stripe.accountLinks.create({
        account: accountId,
        type: "account_onboarding",
        return_url: data.returnUrl,
        refresh_url: data.refreshUrl,
      });
      return { url: link.url };
    } catch (error) {
      const message = getStripeErrorMessage(error);
      if (message.includes("signed up for Connect")) {
        return {
          error:
            "Les versements professionnels ne sont pas encore activés sur le compte de paiement Débarras France. L’administrateur doit terminer l’activation de la plateforme de paiement avant que vous puissiez renseigner votre IBAN.",
        };
      }
      return { error: message };
    }
  });
