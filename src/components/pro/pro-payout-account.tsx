import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, Banknote, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPayoutStatus, startPayoutOnboarding } from "@/lib/payouts.functions";
import { getStripeEnvironment, paymentsConfigured } from "@/lib/stripe";

/** Configuration des coordonnées bancaires du pro (IBAN saisi sur la page sécurisée Stripe). */
export function ProPayoutAccount() {
  const configured = paymentsConfigured();
  const getPayoutStatusFn = useServerFn(getPayoutStatus);
  const startPayoutOnboardingFn = useServerFn(startPayoutOnboarding);

  const statusQuery = useQuery({
    queryKey: ["pro-payout-status"],
    enabled: configured,
    queryFn: async () => {
      const res = await getPayoutStatusFn({ data: { environment: getStripeEnvironment() } });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
  });

  const onboarding = useMutation({
    mutationFn: async () => {
      const url = window.location.href;
      const res = await startPayoutOnboardingFn({
        data: { returnUrl: url, refreshUrl: url, environment: getStripeEnvironment() },
      });
      if ("error" in res) throw new Error(res.error);
      return res.url;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (error: Error) =>
      toast.error("Configuration impossible", { description: error.message }),
  });

  const status = statusQuery.data;
  const ready = Boolean(status?.payoutsEnabled);

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Banknote className="size-4 text-primary" /> Recevoir mes paiements
        </h2>
        {ready && (
          <Badge className="gap-1">
            <BadgeCheck className="size-3.5" /> Versements activés
          </Badge>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Renseignez une seule fois votre IBAN sur la page bancaire sécurisée Clearo. Dès que le
        client valide la fin de chantier, votre montant net (commission déjà déduite) est viré
        automatiquement sur ce compte.
      </p>

      {!configured ? (
        <p className="mt-4 rounded-2xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
          Les paiements ne sont pas encore activés sur cette version du site.
        </p>
      ) : (
        <>
          <div className="mt-5 rounded-2xl border border-border bg-secondary/30 p-4 text-sm">
            {statusQuery.isLoading ? (
              <span className="text-muted-foreground">Chargement du statut…</span>
            ) : statusQuery.isError ? (
              <span className="text-destructive">
                Statut indisponible : {(statusQuery.error as Error).message}
              </span>
            ) : ready ? (
              <span className="font-medium">
                Compte bancaire vérifié
                {status?.bankLast4 ? ` — IBAN se terminant par ${status.bankLast4}` : ""}. Vos
                virements partent automatiquement à chaque fin de chantier validée.
              </span>
            ) : status?.connected ? (
              <span className="text-muted-foreground">
                Vérification incomplète — reprenez la configuration pour ajouter votre IBAN et vos
                justificatifs.
              </span>
            ) : (
              <span className="text-muted-foreground">
                Aucun compte de versement configuré : vous ne pouvez pas encore être payé.
              </span>
            )}
          </div>

          <Button
            className="mt-4"
            onClick={() => onboarding.mutate()}
            disabled={onboarding.isPending}
          >
            {onboarding.isPending
              ? "Ouverture…"
              : ready
                ? "Modifier mes coordonnées bancaires"
                : "Configurer mon IBAN"}
            <ExternalLink className="size-4" />
          </Button>

          {onboarding.isError && (
            <div
              role="alert"
              className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            >
              <p className="font-semibold">Configuration bancaire temporairement indisponible</p>
              <p className="mt-1 leading-relaxed">{onboarding.error.message}</p>
            </div>
          )}

          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-proposal-emerald" />
            Vos coordonnées bancaires sont saisies et stockées par notre prestataire de paiement
            certifié : Clearo ne voit jamais votre IBAN complet.
          </p>
        </>
      )}
    </section>
  );
}
