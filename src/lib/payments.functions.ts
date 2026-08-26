import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import { CLEARO_COMMISSION_RATE } from "@/lib/pro-dashboard";

type CheckoutResult = { clientSecret: string } | { error: string };
type FoundingResult =
  | { isFounding: boolean; paidMissions: number; freeRemaining: number }
  | { error: string };
type ActionResult = { ok: true } | { error: string };

/** Crée la session de paiement sécurisé (fonds bloqués) pour une proposition acceptée. */
export const createEscrowCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { bidId: string; returnUrl: string; environment: StripeEnv }) => data)
  .handler(async ({ data, context }): Promise<CheckoutResult> => {
    const { supabase, userId } = context;

    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .select("id, price, pro_id, quote_id, quotes(id, client_id, property_type, city, postal_code)")
      .eq("id", data.bidId)
      .maybeSingle();

    if (bidError || !bid) return { error: "Proposition introuvable" };
    const quote = bid.quotes as unknown as {
      id: string;
      client_id: string;
      property_type: string | null;
      city: string | null;
      postal_code: string | null;
    } | null;
    if (!quote || quote.client_id !== userId) return { error: "Accès refusé" };

    const amountTotal = Math.round(bid.price * 100);
    if (amountTotal < 100) return { error: "Montant invalide" };

    // Offre de lancement : 20 premiers pros, 5 premiers chantiers sans commission Clearo.
    const { getFoundingStatus } = await import("@/lib/founding.server");
    const founding = await getFoundingStatus(bid.pro_id);
    const commission = founding.freeRemaining > 0
      ? 0
      : Math.round(amountTotal * CLEARO_COMMISSION_RATE);

    try {
      const stripe = createStripeClient(data.environment);
      const { data: userData } = await supabase.auth.getUser();

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        line_items: [
          {
            price_data: {
              currency: "eur",
              unit_amount: amountTotal,
              product_data: {
                name: `Débarras ${quote.property_type ?? ""} ${quote.city ?? quote.postal_code ?? ""}`.trim(),
                description:
                  "Paiement sécurisé Clearo — les fonds sont conservés jusqu'à la fin du chantier.",
              },
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          description: `Débarras Clearo — mission ${bid.id.slice(0, 8)}`,
        },
        ...(userData.user?.email && { customer_email: userData.user.email }),
        metadata: {
          bidId: bid.id,
          quoteId: quote.id,
          clientId: userId,
          proId: bid.pro_id,
        },
      });

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("payments").upsert(
        {
          bid_id: bid.id,
          quote_id: quote.id,
          client_id: userId,
          pro_id: bid.pro_id,
          amount_total: amountTotal,
          commission_amount: commission,
          pro_amount: amountTotal - commission,
          currency: "eur",
          status: "pending",
          environment: data.environment,
          stripe_session_id: session.id,
        },
        { onConflict: "bid_id" },
      );

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

/** Libère les fonds séquestrés vers le pro (client après validation du chantier, ou admin). */
export const releaseEscrow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { bidId: string }) => data)
  .handler(async ({ data, context }): Promise<ActionResult> => {
    const { supabase, userId } = context;

    const { data: payment } = await supabase
      .from("payments")
      .select(
        "id, client_id, pro_id, status, pro_amount, environment, stripe_payment_intent_id, stripe_transfer_id",
      )
      .eq("bid_id", data.bidId)
      .maybeSingle();
    if (!payment) return { error: "Paiement introuvable" };

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (payment.client_id !== userId && !isAdmin) return { error: "Accès refusé" };
    if (payment.status === "released") return { ok: true };
    if (payment.status !== "held") return { error: "Les fonds ne sont pas encore encaissés" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Virement automatique vers le compte bancaire du pro (via son compte de versement Clearo).
    const { data: proProfile } = await supabaseAdmin
      .from("pro_profiles")
      .select("stripe_account_id, payouts_enabled")
      .eq("user_id", payment.pro_id)
      .maybeSingle();

    let transferId = payment.stripe_transfer_id;
    if (!transferId) {
      if (!proProfile?.stripe_account_id || !proProfile.payouts_enabled) {
        await supabaseAdmin
          .from("payments")
          .update({
            transfer_error:
              "Le professionnel n'a pas encore renseigné ses coordonnées bancaires Clearo.",
          })
          .eq("id", payment.id);
        return {
          error:
            "Le professionnel doit d'abord renseigner ses coordonnées bancaires dans ses paramètres pour recevoir le virement.",
        };
      }
      try {
        const stripe = createStripeClient(payment.environment as StripeEnv);
        let sourceTransaction: string | undefined;
        if (payment.stripe_payment_intent_id) {
          const intent = await stripe.paymentIntents.retrieve(payment.stripe_payment_intent_id);
          const latest = (intent as unknown as { latest_charge?: string | { id: string } })
            .latest_charge;
          sourceTransaction = typeof latest === "string" ? latest : latest?.id;
        }
        const transfer = await stripe.transfers.create({
          amount: payment.pro_amount,
          currency: "eur",
          destination: proProfile.stripe_account_id,
          ...(sourceTransaction && { source_transaction: sourceTransaction }),
          metadata: { bidId: data.bidId, paymentId: payment.id },
        });
        transferId = transfer.id;
      } catch (error) {
        const message = getStripeErrorMessage(error);
        await supabaseAdmin
          .from("payments")
          .update({ transfer_error: message })
          .eq("id", payment.id);
        return { error: `Virement impossible : ${message}` };
      }
    }

    const { error } = await supabaseAdmin
      .from("payments")
      .update({
        status: "released",
        released_at: new Date().toISOString(),
        stripe_transfer_id: transferId,
        transfer_error: null,
      })
      .eq("id", payment.id);
    if (error) return { error: "Libération impossible" };
    return { ok: true };
  });


/** Rembourse intégralement le client (résolution de litige, réservé à l'admin). */
export const refundEscrow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { bidId: string; environment: StripeEnv }) => data)
  .handler(async ({ data, context }): Promise<ActionResult> => {
    const { supabase, userId } = context;

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) return { error: "Accès refusé" };

    const { data: payment } = await supabase
      .from("payments")
      .select("id, status, stripe_payment_intent_id")
      .eq("bid_id", data.bidId)
      .maybeSingle();
    if (!payment?.stripe_payment_intent_id) return { error: "Paiement introuvable" };
    if (payment.status === "refunded") return { ok: true };

    try {
      const stripe = createStripeClient(data.environment);
      await stripe.refunds.create({ payment_intent: payment.stripe_payment_intent_id });
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("payments")
      .update({ status: "refunded", refunded_at: new Date().toISOString() })
      .eq("id", payment.id);
    return { ok: true };
  });

/** Statut de l'offre de lancement du pro connecté (chantiers sans commission restants). */
export const getMyFoundingStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<FoundingResult> => {
    const { getFoundingStatus } = await import("@/lib/founding.server");
    try {
      return await getFoundingStatus(context.userId);
    } catch {
      return { error: "Statut indisponible" };
    }
  });
