import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { Lock, ScrollText, ShieldCheck, Wallet } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { PaymentTestModeBanner } from "@/components/payments/payment-test-banner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createEscrowCheckout } from "@/lib/payments.functions";
import { getStripe, getStripeEnvironment, paymentsConfigured } from "@/lib/stripe";
import { euro } from "@/lib/pricing";
import { PAYMENTS_ENABLED, PAYMENTS_PAUSED_MESSAGE } from "@/lib/payments-availability";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bidId: string;
  price: number;
  companyName: string;
};

const GUARANTEES = [
  {
    icon: Lock,
    title: "Votre argent est bloqué",
    text: "Le montant est conservé sur un compte séquestre sécurisé. Le professionnel ne touche rien tant que le chantier n'est pas terminé et validé par vous.",
  },
  {
    icon: ShieldCheck,
    title: "Paiement 100 % sécurisé",
    text: "Le paiement est traité par Stripe (chiffrement bancaire, 3D Secure). Débarras France ne voit jamais votre numéro de carte.",
  },
  {
    icon: ScrollText,
    title: "Litige possible à tout moment",
    text: "Chantier non conforme ou non réalisé ? Vous ouvrez un litige avec photos : les fonds restent bloqués le temps que notre équipe tranche, remboursement possible.",
  },
  {
    icon: Wallet,
    title: "Le pro est payé après validation",
    text: "Une fois que vous confirmez la fin du chantier, les fonds sont libérés vers le professionnel. Aucun paiement en liquide, aucune avance.",
  },
];

export function EscrowCheckoutDialog({ open, onOpenChange, bidId, price, companyName }: Props) {
  const [started, setStarted] = useState(false);

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const result = await createEscrowCheckout({
      data: {
        bidId,
        returnUrl: `${window.location.origin}/paiement/retour?session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
      },
    });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("Session de paiement indisponible");
    return result.clientSecret;
  }, [bidId]);

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret]);

  const handleOpenChange = (next: boolean) => {
    if (!next) setStarted(false);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
        <div className="bg-proposal-emerald px-6 py-6 text-proposal-cream">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="font-display text-xl font-bold text-proposal-cream">
              Paiement sécurisé — {euro(price)}
            </DialogTitle>
            <DialogDescription className="text-proposal-cream/70">
              Mission confiée à {companyName}. Votre argent est bloqué par Débarras France jusqu'à la fin du
              chantier.
            </DialogDescription>
          </DialogHeader>
        </div>

        <PaymentTestModeBanner />

        <div className="p-6">
          {!started ? (
            <>
              <ul className="space-y-4">
                {GUARANTEES.map((g) => (
                  <li key={g.title} className="flex gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-proposal-emerald/10">
                      <g.icon className="size-4 text-proposal-emerald" />
                    </div>
                    <div>
                      <p className="font-semibold text-proposal-emerald">{g.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{g.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Montant de la mission (TTC)</span>
                  <span className="font-display text-lg font-extrabold text-proposal-emerald">
                    {euro(price)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Frais de service Débarras France inclus. Aucun supplément le jour du chantier : le prix est
                  ferme, sauf modification acceptée par vous.
                </p>
              </div>

              {!PAYMENTS_ENABLED ? (
                <p className="mt-6 rounded-xl bg-proposal-gold/15 p-4 text-sm font-medium text-proposal-emerald">
                  {PAYMENTS_PAUSED_MESSAGE}
                </p>
              ) : paymentsConfigured() ? (
                <Button
                  className="mt-6 w-full bg-proposal-gold text-proposal-emerald hover:bg-proposal-gold/90"
                  onClick={() => setStarted(true)}
                >
                  <Lock className="mr-1 size-4" /> Payer et bloquer les fonds
                </Button>
              ) : (
                <p className="mt-6 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                  Le paiement en ligne est en cours d'activation, réessayez dans quelques instants.
                </p>
              )}
            </>
          ) : (
            <EmbeddedCheckoutProvider stripe={getStripe()} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
