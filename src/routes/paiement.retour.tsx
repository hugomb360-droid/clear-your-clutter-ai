import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/paiement/retour")({
  head: () => ({
    meta: [
      { title: "Paiement confirmé — Clearo" },
      {
        name: "description",
        content:
          "Votre paiement est sécurisé : les fonds sont bloqués par Clearo jusqu'à la validation de votre chantier de débarras.",
      },
      { property: "og:title", content: "Paiement sécurisé confirmé — Clearo" },
      {
        property: "og:description",
        content: "Vos fonds sont bloqués jusqu'à la fin du chantier.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search['session_id'] === "string" ? search['session_id'] : undefined,
  }),
  component: PaymentReturn,
});

function PaymentReturn() {
  const { session_id: sessionId } = Route.useSearch();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-[var(--shadow-proposal)] ring-1 ring-proposal-emerald/10 sm:p-12">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-proposal-emerald/10">
          <CheckCircle2 className="size-7 text-proposal-emerald" />
        </div>
        <h1 className="font-display mt-6 text-2xl font-extrabold tracking-tight text-proposal-emerald sm:text-3xl">
          {sessionId ? "Paiement confirmé" : "Paiement en cours de traitement"}
        </h1>
        <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
          Votre argent est <strong>bloqué en toute sécurité</strong> par Clearo. Le professionnel
          n'est payé qu'après la fin du chantier et votre validation. En cas de problème, vous
          pouvez ouvrir un litige avec photos depuis votre espace : les fonds restent bloqués
          jusqu'à résolution.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-proposal-emerald/10 px-4 py-2 text-xs font-semibold text-proposal-emerald">
          <Lock className="size-3.5" /> Fonds séquestrés — paiement protégé
        </div>
        <div className="mt-8">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/compte">Voir ma mission</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
