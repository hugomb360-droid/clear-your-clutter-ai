import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, Lock } from "lucide-react";
import { btnOutline, btnPrimary, wrap } from "@/components/site/page-kit";

export const Route = createFileRoute("/paiement/retour")({
  head: () => ({
    meta: [
      { title: "Paiement confirmé — Débarras France" },
      {
        name: "description",
        content:
          "Votre paiement est sécurisé : les fonds sont bloqués par Débarras France jusqu'à la validation de votre chantier de débarras.",
      },
      { property: "og:title", content: "Paiement sécurisé confirmé — Débarras France" },
      {
        property: "og:description",
        content: "Vos fonds sont bloqués jusqu'à la fin du chantier.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { session_id?: string | undefined } => ({
    session_id: typeof search["session_id"] === "string" ? search["session_id"] : undefined,
  }),
  component: PaymentReturn,
});

function PaymentReturn() {
  const { session_id: sessionId } = Route.useSearch();

  return (
    <main className="bg-[#F2FAF4] py-16 sm:py-24">
      <div className={`${wrap} max-w-2xl`}>
        <div className="rounded-[28px] bg-white p-8 text-center shadow-[0_18px_40px_-22px_rgba(0,127,61,0.45)] sm:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-soft text-primary">
            {sessionId ? (
              <CheckCircle2 className="size-8" aria-hidden="true" />
            ) : (
              <Clock className="size-8" aria-hidden="true" />
            )}
          </div>
          <h1 className="mt-6 text-[30px] font-black leading-tight tracking-[-0.02em] text-brand-ink sm:text-[38px]">
            {sessionId ? "Paiement confirmé" : "Paiement en cours de traitement"}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Votre argent est <strong className="text-brand-ink">bloqué en toute sécurité</strong>{" "}
            par Débarras France. Le professionnel n'est payé qu'après la fin du chantier et votre
            validation. En cas de problème, vous pouvez ouvrir un litige avec photos depuis votre
            espace : les fonds restent bloqués jusqu'à résolution.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand-ink">
            <Lock className="size-4" aria-hidden="true" /> Fonds séquestrés via Stripe Connect —
            paiement protégé
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/compte" className={btnPrimary}>
              Voir ma mission
            </Link>
            <Link to="/" className={btnOutline}>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
