import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Euro, Target, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pros")({
  head: () => ({
    meta: [
      { title: "Devenir débarrasseur partenaire — Clearo" },
      {
        name: "description",
        content:
          "Recevez des demandes de débarras qualifiées près de chez vous, avec volume estimé et photos. Inscription gratuite sur Clearo.",
      },
      { property: "og:title", content: "Rejoindre le réseau de pros Clearo" },
      {
        property: "og:description",
        content: "Des missions de débarras qualifiées dans vos zones d'intervention.",
      },
      { property: "og:url", content: "https://clearo.fr/pros" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://clearo.fr/pros" }],

  }),
  component: ProsLanding,
});

const BENEFITS = [
  {
    icon: Target,
    title: "Des demandes qualifiées",
    text: "Photos, volume estimé en m³, étage et accès : vous savez à quoi vous engager avant de répondre.",
  },
  {
    icon: Euro,
    title: "Vous fixez votre prix",
    text: "L'estimation Clearo sert de repère, votre proposition reste la vôtre.",
  },
  {
    icon: Truck,
    title: "Vos zones, vos règles",
    text: "Renseignez vos codes postaux et vos types de débarras : vous ne recevez que ce qui vous concerne.",
  },
  {
    icon: BadgeCheck,
    title: "Badge pro vérifié",
    text: "SIRET et assurance contrôlés : les clients choisissent en confiance.",
  },
];

function ProsLanding() {
  return (
    <div>
      <section className="border-b border-border bg-brand-soft/60">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Espace professionnels
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold sm:text-4xl tracking-tight sm:text-5xl">
            Remplissez vos camions avec des missions de débarras près de chez vous
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Clearo estime le volume et le budget avant de vous transmettre la demande. Vous
            répondez, le client choisit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/auth" search={{ mode: "signup", role: "pro" }}>
                Créer mon compte pro
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/pro/dashboard">Accéder à mon espace</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="rounded-3xl border border-border bg-card p-7">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <benefit.icon className="size-5" />
              </span>
              <h2 className="mt-5 text-lg font-bold">{benefit.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{benefit.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-border bg-card p-8">
          <h2 className="text-2xl font-bold">Comment ça se passe</h2>
          <ol className="mt-6 grid gap-5 sm:grid-cols-3">
            {[
              "Créez votre compte pro et renseignez vos zones d'intervention.",
              "Consultez les demandes publiées dans vos codes postaux.",
              "Envoyez votre prix et votre date ; les coordonnées arrivent dès l'acceptation.",
            ].map((step, index) => (
              <li key={step} className="rounded-2xl bg-secondary/60 p-5 text-sm">
                <span className="text-2xl font-extrabold text-brand">{index + 1}</span>
                <p className="mt-2 text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
