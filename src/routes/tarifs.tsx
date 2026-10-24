import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import heroPhoto from "@/assets/gallery-camion.jpg";
import { PRICING, computePrice, euro } from "@/lib/pricing";
import {
  CheckList,
  CtaBand,
  PageHero,
  Section,
  SectionHeading,
  btnOutline,
  btnPrimary,
  btnSoft,
  btnWhite,
  h2Class,
  onDarkAccent,
  onDarkMuted,
} from "@/components/site/page-kit";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs débarras — Débarras France" },
      {
        name: "description",
        content:
          "Prix au m³, majorations d'étage et d'accès : la grille tarifaire Débarras France est transparente et sans frais cachés.",
      },
      { property: "og:title", content: "Tarifs Débarras France : le débarras au m³" },
      {
        property: "og:description",
        content: "Une grille claire, un devis gratuit, aucune commission pour le particulier.",
      },
      { property: "og:url", content: "https://debarrasfrance.fr/tarifs" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/tarifs" }],
  }),
  component: Pricing,
});

const EXAMPLES = [
  { label: "Cave ou box", volume: 6, detail: "Cartons, vieux meubles, vélos" },
  { label: "Studio / T2", volume: 16, detail: "Mobilier, électroménager, effets personnels" },
  { label: "Maison complète", volume: 38, detail: "Débarras total avant vente ou succession" },
].map((example) => ({
  ...example,
  price: computePrice({
    volumeM3: example.volume,
    floor: 0,
    hasElevator: true,
    bulkyItems: false,
    hardAccess: false,
  }),
}));

const pct = (rate: number) => `${Math.round(rate * 100)} %`;
const num = (value: number) => new Intl.NumberFormat("fr-FR").format(value);

const FACTORS = [
  {
    label: "Prix de base",
    value: `${euro(PRICING.pricePerM3)}/m³`,
    detail: `Minimum d'intervention ${euro(PRICING.minimumPrice)}`,
  },
  {
    label: "Étage sans ascenseur",
    value: `+${pct(PRICING.floorSurchargeRate)}`,
    detail: `Par étage, plafonné à ${pct(PRICING.maxFloorSurcharge)}`,
  },
  {
    label: "Encombrants",
    value: `+${pct(PRICING.bulkySurchargeRate)}`,
    detail: "Piano, gravats, électroménager",
  },
  {
    label: "Accès difficile",
    value: `+${pct(PRICING.hardAccessSurchargeRate)}`,
    detail: "Rue étroite, portage long",
  },
];

function Pricing() {
  return (
    <main>
      <PageHero
        crumbs={[{ label: "Tarifs" }]}
        title="Des tarifs lisibles"
        subtitle="Aucune commission pour le particulier"
        intro="Le prix d'un débarras dépend surtout du volume. Voici la base utilisée par l'estimation Débarras France, avant les propositions des pros de votre secteur."
        image={heroPhoto}
        imageAlt="Camion de débarras chargé de meubles et d'un matelas"
        actions={
          <>
            <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
              <Camera className="size-5" aria-hidden="true" />
              Obtenir mon prix
            </Link>
            <Link to="/prix-debarras" className={btnOutline}>
              Guide des prix
            </Link>
          </>
        }
      />

      <Section tone="dark">
        <h2 className={`${h2Class} text-white`}>La grille de calcul</h2>
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACTORS.map((factor) => (
            <div key={factor.label} className="rounded-[20px] bg-[#134A2B] p-6">
              <dt className={`text-[15px] font-semibold ${onDarkMuted}`}>{factor.label}</dt>
              <dd>
                <span
                  className={`mt-2 block text-[34px] font-black tracking-tight ${onDarkAccent}`}
                >
                  {factor.value}
                </span>
                <span className={`mt-1 block text-[15px] ${onDarkMuted}`}>{factor.detail}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="tint">
        <SectionHeading
          title="Exemples courants"
          lead="Au rez-de-chaussée ou avec ascenseur. Votre prix exact dépend de vos photos ou de votre description."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {EXAMPLES.map((example) => (
            <div key={example.label} className="rounded-[20px] bg-white p-7 text-brand-ink">
              <h3 className="text-xl font-extrabold">{example.label}</h3>
              <p className="mt-1 text-[15px] text-muted-foreground">≈ {example.volume} m³</p>
              <p className="mt-5 text-[28px] font-black tabular-nums text-primary">
                {num(example.price.priceMin)} – {euro(example.price.priceMax)}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {example.detail}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <h2 className={`${h2Class} text-brand-ink`}>Ce qui est inclus, sans surprise</h2>
          <CheckList
            items={[
              "Estimation et devis 100 % gratuits",
              "Aucun engagement tant que vous n'acceptez pas une proposition",
              "Objets réutilisables donnés ou revendus, déduction possible",
              "Tri et dépôt en déchetterie inclus par les pros partenaires",
              "Paiement bloqué via Stripe Connect jusqu'à la fin du chantier",
            ]}
          />
        </div>
      </Section>

      <CtaBand
        title="Combien pour votre débarras ?"
        text="Envoyez vos photos : volume en m³ et fourchette de prix en 2 minutes."
      >
        <Link to="/estimation" search={{ type: "photo" }} className={btnSoft}>
          <Camera className="size-5" aria-hidden="true" />
          Obtenir mon prix
        </Link>
        <Link to="/comment-ca-marche" className={btnWhite}>
          Comment ça marche
        </Link>
      </CtaBand>
    </main>
  );
}
