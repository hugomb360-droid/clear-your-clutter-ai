import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";

type PaymentRow = {
  id: string;
  pro_id: string;
  pro_amount: number;
  environment: string;
  status: string;
  stripe_payment_intent_id: string | null;
  stripe_transfer_id: string | null;
};

export type TransferResult = { ok: true; transferId: string } | { ok: false; error: string };

/**
 * Vire le montant net du pro depuis le solde séquestre Débarras France vers son compte
 * bancaire (compte de versement Stripe Express). La commission Débarras France reste
 * sur le compte plateforme.
 */
export async function transferToPro(payment: PaymentRow): Promise<TransferResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  if (payment.stripe_transfer_id) {
    return { ok: true, transferId: payment.stripe_transfer_id };
  }

  const { data: proProfile } = await supabaseAdmin
    .from("pro_profiles")
    .select("stripe_account_id, payouts_enabled")
    .eq("user_id", payment.pro_id)
    .maybeSingle();

  if (!proProfile?.stripe_account_id || !proProfile.payouts_enabled) {
    const error = "Le professionnel n'a pas encore renseigné ses coordonnées bancaires Débarras France.";
    await supabaseAdmin.from("payments").update({ transfer_error: error }).eq("id", payment.id);
    return { ok: false, error };
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
      metadata: { paymentId: payment.id },
    });
    return { ok: true, transferId: transfer.id };
  } catch (error) {
    const message = getStripeErrorMessage(error);
    await supabaseAdmin.from("payments").update({ transfer_error: message }).eq("id", payment.id);
    return { ok: false, error: message };
  }
}

/** Marque le paiement comme libéré après un virement réussi. */
export async function markReleased(paymentId: string, transferId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin
    .from("payments")
    .update({
      status: "released",
      released_at: new Date().toISOString(),
      stripe_transfer_id: transferId,
      transfer_error: null,
    })
    .eq("id", paymentId);
}
