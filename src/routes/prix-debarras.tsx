import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import {
  Breadcrumb,
  CtaBand,
  FaqList,
  PriceTable,
  btnOutline,
  btnPrimary,
  btnSoft,
  btnWhite,
  wrap,
} from "@/components/site/page-kit";
import { PRICING, computePrice, euro } from "@/lib/pricing";
import { serviceHead } from "@/lib/seo";

export const Route = createFileRoute("/prix-debarras")({
  head: () =>
    serviceHead({
      path: "/prix-debarras",
      title: "Combien coûte un débarras ? Prix au m³ et exemples 2026 | Débarras France",
      description:
        "Prix d'un débarras : tarif au m³, majorations d'étage et d'accès, exemples par type de logement et conseils pour payer le juste prix. Estimation gratuite en photo.",
      serviceName: "Estimation du prix d'un débarras",
      breadcrumb: "Prix d'un débarras",
    }),
  component: PriceGuide,
});

const TOC = [
  ["criteres", "Ce qui fait le prix"],
  ["calcul", "Comment on le calcule"],
  ["exemples", "Exemples de prix"],
  ["conseils", "Payer le juste prix"],
  ["faq", "Questions fréquentes"],
];

const CRITERIA = [
  [
    "Le volume en m³",
    "C'est le critère principal : plus il y a d'objets à évacuer, plus il faut de main-d'œuvre, de trajets et de frais de déchetterie. Notre IA mesure ce volume à partir de vos photos.",
  ],
  [
    "L'accès au logement",
    "Un étage sans ascenseur, un long portage ou un stationnement difficile allongent le chantier et augmentent le tarif.",
  ],
  [
    "Les objets lourds ou spéciaux",
    "Piano, électroménager, gravats ou produits dangereux demandent du matériel ou une filière de traitement spécifique.",
  ],
  [
    "La valeur de revente",
    "Meubles anciens, objets de collection ou électroménager récent peuvent être repris par le débarrasseur et venir en déduction du prix, parfois jusqu'à un débarras gratuit.",
  ],
];

const EXAMPLES = [
  { label: "Cave ou petit garage", volume: 6, display: "≈ 6 m³" },
  { label: "Studio ou T2", volume: 16, display: "≈ 16 m³" },
  { label: "Appartement T3/T4", volume: 25, display: "20 à 30 m³" },
  { label: "Maison entière", volume: 38, display: "≈ 38 m³" },
].map((row) => ({
  ...row,
  price: computePrice({
    volumeM3: row.volume,
    floor: 0,
    hasElevator: true,
    bulkyItems: false,
    hardAccess: false,
  }),
}));

const FAQ = [
  {
    q: "Un débarras peut-il être gratuit ?",
    a: "Oui, lorsque la valeur des objets revendables couvre le coût du chantier. C'est rare pour un logement entier ; le plus souvent, la reprise réduit simplement la facture.",
  },
  {
    q: "Comment éviter les frais cachés ?",
    a: "Exigez un prix basé sur le volume réel et payez via un tiers de confiance. Sur Débarras France, votre paiement reste bloqué jusqu'à ce que vous validiez la fin du chantier.",
  },
  {
    q: "Le débarras d'une succession est-il déductible ?",
    a: "Les frais engagés pour vider le logement d'un défunt peuvent, sous conditions, être pris en compte dans la succession. Demandez conseil à votre notaire et conservez la facture.",
  },
];

const pct = (rate: number) => `${Math.round(rate * 100)} %`;

function PriceGuide() {
  return (
    <main>
      {/* Guide long : sommaire collant à gauche, article à droite */}
      <section className="border-b border-border pb-10 pt-8">
        <div className={wrap}>
          <Breadcrumb items={[{ label: "Prix d'un débarras" }]} />
          <p className="mt-6 text-[15px] font-bold text-primary">Guide des prix</p>
          <h1 className="mt-2 max-w-[20ch] text-[36px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[52px]">
            Combien coûte un débarras ? Prix au m³ et exemples concrets
          </h1>
          <p className="mt-6 max-w-[40em] text-lg leading-relaxed text-[#34433A]">
            Le prix d'un débarras dépend surtout du volume à évacuer (en m³), de l'accès (étage,
            ascenseur, portage) et de la valeur de revente des objets. Voici comment le calculer,
            puis obtenez votre propre fourchette en photographiant simplement vos pièces.
          </p>
        </div>
      </section>

      <div className={`${wrap} grid gap-12 py-14 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20`}>
        <nav aria-label="Sommaire" className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-bold text-muted-foreground">Sommaire</p>
          <ol className="mt-3 flex flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-0">
            {TOC.map(([id, label], index) => (
              <li
                key={id}
                className="lg:border-l-2 lg:border-border lg:pl-4 lg:py-2 lg:hover:border-primary"
              >
                <a
                  href={`#${id}`}
                  className="text-[15px] font-semibold text-brand-ink hover:text-primary"
                >
                  <span className="mr-2 text-primary tabular-nums">{index + 1}.</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
          <Link
            to="/estimation"
            search={{ type: "photo" }}
            className={`${btnPrimary} mt-8 hidden w-full lg:inline-flex`}
          >
            <Camera className="size-5" aria-hidden="true" />
            Mon prix en 2 min
          </Link>
        </nav>

        <article className="max-w-[70ch]">
          <section id="criteres" className="scroll-mt-24">
            <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[34px]">
              Ce qui fait le prix
            </h2>
            <dl className="mt-6 flex flex-col gap-6">
              {CRITERIA.map(([title, text]) => (
                <div key={title}>
                  <dt className="text-xl font-extrabold text-brand-ink">{title}</dt>
                  <dd className="mt-1.5 text-[17px] leading-relaxed text-[#34433A]">{text}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="calcul" className="mt-16 scroll-mt-24">
            <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[34px]">
              Comment on le calcule
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[#34433A]">
              L'estimation Débarras France part d'un prix au mètre cube, applique un minimum par
              chantier, puis des majorations selon l'accès et les objets. La fourchette affichée
              encadre ce total à plus ou moins {pct(PRICING.spreadRate)}.
            </p>
            <div className="mt-6 overflow-hidden rounded-[20px] border border-border">
              <div className="grid grid-cols-[1fr_auto] gap-4 bg-brand-ink px-6 py-4 text-white">
                <span className="font-bold">Prix de base</span>
                <span className="font-black tabular-nums text-[#6EDC97]">
                  {euro(PRICING.pricePerM3)} / m³
                </span>
              </div>
              {[
                ["Minimum par chantier", euro(PRICING.minimumPrice)],
                [
                  "Par étage sans ascenseur",
                  `+${pct(PRICING.floorSurchargeRate)} (max. ${pct(PRICING.maxFloorSurcharge)})`,
                ],
                ["Objets lourds ou volumineux", `+${pct(PRICING.bulkySurchargeRate)}`],
                ["Accès difficile", `+${pct(PRICING.hardAccessSurchargeRate)}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[1fr_auto] gap-4 border-t border-border px-6 py-4 text-base"
                >
                  <span>{label}</span>
                  <span className="font-bold tabular-nums text-brand-ink">{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[15px] text-muted-foreground">
              Cette grille sert de repère aux pros : chaque professionnel reste libre de son prix
              dans sa proposition.
            </p>
          </section>

          <section id="exemples" className="mt-16 scroll-mt-24">
            <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[34px]">
              Exemples de prix d'un débarras
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[#34433A]">
              Calculés avec la grille ci-dessus, au rez-de-chaussée ou avec ascenseur, sans objets
              lourds.
            </p>
            <div className="mt-6 rounded-[20px] bg-[#F2FAF4] p-2">
              <PriceTable
                columns={["Logement", "Volume", "Fourchette"]}
                rows={EXAMPLES.map((e) => ({
                  label: e.label,
                  volume: e.display,
                  price: `${euro(e.price.priceMin)} – ${euro(e.price.priceMax)}`,
                }))}
              />
            </div>
          </section>

          <section id="conseils" className="mt-16 scroll-mt-24">
            <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[34px]">
              Payer le juste prix
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {[
                "Faites chiffrer sur le volume réel, en m³, pas sur la surface du logement.",
                "Signalez l'étage, l'ascenseur et le stationnement dès le départ : les oublier fait gonfler la facture le jour J.",
                "Demandez que la valeur de reprise des meubles soit distinguée du coût du chantier.",
                "Comparez plusieurs propositions avant d'accepter. Sur Débarras France, les pros de votre secteur répondent à la même demande.",
                "Ne payez pas d'acompte en direct : passez par un paiement bloqué jusqu'à la fin du chantier.",
              ].map((tip, index) => (
                <li key={tip} className="flex gap-4 rounded-[18px] border border-border p-5">
                  <span className="text-xl font-black text-primary tabular-nums">{index + 1}</span>
                  <span className="text-[17px] leading-relaxed text-[#34433A]">{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="faq" className="mt-16 scroll-mt-24">
            <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[34px]">
              Questions fréquentes sur le prix
            </h2>
            <FaqList items={FAQ} twoColumns={false} />
          </section>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link to="/tarifs" className={btnOutline}>
              Voir la page Tarifs
            </Link>
            <Link to="/debarras" className={btnOutline}>
              Prix par ville
            </Link>
          </div>
        </article>
      </div>

      <CtaBand
        title="Connaître le prix de votre débarras"
        text="Envoyez quelques photos : volume en m³ et fourchette de prix en 2 minutes, gratuitement et sans engagement."
      >
        <Link to="/estimation" search={{ type: "photo" }} className={btnSoft}>
          <Camera className="size-5" aria-hidden="true" />
          Démarrer mon estimation
        </Link>
        <Link to="/estimation" search={{ type: "manuel" }} className={btnWhite}>
          Devis classique
        </Link>
      </CtaBand>
    </main>
  );
}
