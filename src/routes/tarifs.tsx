import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING, euro } from "@/lib/pricing";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs débarras — Clearo" },
      {
        name: "description",
        content:
          "Prix au m³, majorations d'étage et d'accès : la grille tarifaire Clearo est transparente et sans frais cachés.",
      },
      { property: "og:title", content: "Tarifs Clearo : le débarras au m³" },
      {
        property: "og:description",
        content: "Une grille claire, un devis gratuit, aucune commission pour le particulier.",
      },
      { property: "og:url", content: "https://clearo.fr/tarifs" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://clearo.fr/tarifs" }],

  }),
  component: Pricing,
});

const EXAMPLES = [
  { label: "Cave ou box", volume: 6, detail: "Cartons, vieux meubles, vélos" },
  { label: "Studio / T2", volume: 16, detail: "Mobilier, électroménager, effets personnels" },
  { label: "Maison complète", volume: 38, detail: "Débarras total avant vente ou succession" },
];

function Pricing() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-extrabold sm:text-4xl tracking-tight sm:text-5xl">Des tarifs lisibles</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Le prix d'un débarras dépend surtout du volume. Voici la base utilisée par l'estimation
        Clearo, avant les propositions des pros de votre secteur.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-7">
          <p className="text-sm text-muted-foreground">Prix de base</p>
          <p className="mt-2 text-2xl font-extrabold sm:text-3xl">{euro(PRICING.pricePerM3)}/m³</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Minimum d'intervention {euro(PRICING.minimumPrice)}
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-7">
          <p className="text-sm text-muted-foreground">Étage sans ascenseur</p>
          <p className="mt-2 text-2xl font-extrabold sm:text-3xl">
            +{Math.round(PRICING.floorSurchargeRate * 100)}%
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Par étage, plafonné à {Math.round(PRICING.maxFloorSurcharge * 100)}%
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-7">
          <p className="text-sm text-muted-foreground">Encombrants / accès difficile</p>
          <p className="mt-2 text-2xl font-extrabold sm:text-3xl">
            +{Math.round(PRICING.bulkySurchargeRate * 100)}%
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Piano, gravats, électroménager, rue étroite
          </p>
        </div>
      </div>

      <h2 className="mt-14 text-2xl font-bold">Exemples courants</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {EXAMPLES.map((example) => {
          const base = Math.max(PRICING.minimumPrice, example.volume * PRICING.pricePerM3);
          return (
            <div
              key={example.label}
              className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]"
            >
              <h3 className="text-lg font-bold">{example.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">≈ {example.volume} m³</p>
              <p className="mt-4 text-2xl font-extrabold text-brand">
                {euro(Math.round(base * 0.85))} – {euro(Math.round(base * 1.15))}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{example.detail}</p>
            </div>
          );
        })}
      </div>

      <ul className="mt-12 grid gap-3 sm:grid-cols-2">
        {[
          "Estimation et devis 100% gratuits",
          "Aucun engagement tant que vous n'acceptez pas une proposition",
          "Objets réutilisables donnés ou revendus, déduction possible",
          "Tri et dépôt en déchetterie inclus par les pros partenaires",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-brand" />
            {item}
          </li>
        ))}
      </ul>

      <Button asChild size="lg" className="mt-10">
        <Link to="/estimation">Obtenir mon prix</Link>
      </Button>
    </div>
  );
}
