import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, EyeOff } from "lucide-react";
import {
  Breadcrumb,
  CityLinks,
  CtaBand,
  FaqList,
  PriceTable,
  Section,
  btnOutline,
  btnPrimary,
  btnSoft,
  btnWhite,
  wrap,
} from "@/components/site/page-kit";
import { serviceHead } from "@/lib/seo";

export const Route = createFileRoute("/debarras-diogene")({
  head: () =>
    serviceHead({
      path: "/debarras-diogene",
      title: "Débarras syndrome de Diogène : nettoyage extrême et prix | Débarras France",
      description:
        "Débarras et nettoyage d'un logement en syndrome de Diogène : intervention discrète, évacuation complète, désinfection. Estimation en photo et professionnels formés près de chez vous.",
      serviceName: "Débarras syndrome de Diogène",
      breadcrumb: "Débarras Diogène",
    }),
  component: Diogene,
});

const PROTOCOL = [
  [
    "Évaluation et protocole",
    "Volume, niveau d'insalubrité, présence de nuisibles et accès sont évalués avant l'intervention pour dimensionner l'équipe et les protections.",
  ],
  [
    "Débarras intégral",
    "Évacuation de la totalité des encombrants, déchets et mobilier, avec tri en déchetterie et filières adaptées aux déchets spécifiques.",
  ],
  [
    "Nettoyage et désinfection",
    "Nettoyage en profondeur, désinfection des surfaces et traitement des odeurs. Une désinsectisation peut être ajoutée si nécessaire.",
  ],
  [
    "Discrétion garantie",
    "Véhicules non marqués sur demande, intervention en horaires choisis et rapport photo transmis uniquement à vous.",
  ],
];

const PRICES = [
  { label: "Studio ou T1 très encombré", volume: "10 à 20 m³", price: "1 200 – 2 400 €" },
  { label: "Appartement T3 en accumulation", volume: "25 à 40 m³", price: "2 600 – 4 800 €" },
  { label: "Maison en syndrome de Diogène", volume: "50 m³ et plus", price: "à partir de 5 500 €" },
  { label: "Désinfection / désinsectisation", volume: "Selon surface", price: "300 – 1 500 €" },
];

const WHO = [
  "L'occupant lui-même",
  "Un proche ou la famille",
  "Un tuteur ou curateur",
  "Un bailleur ou un syndic",
];

const FAQ = [
  {
    q: "L'intervention est-elle confidentielle ?",
    a: "Oui. Les équipes interviennent sans signalétique visible sur demande, et aucune information n'est communiquée au voisinage, à la copropriété ou au bailleur.",
  },
  {
    q: "Qui peut demander ce type de débarras ?",
    a: "L'occupant lui-même, un proche, un tuteur ou curateur, un bailleur ou un syndic dans le cadre d'une procédure d'insalubrité.",
  },
  {
    q: "Combien de temps dure le chantier ?",
    a: "D'une journée pour un petit logement à plusieurs jours pour une maison, en fonction du volume, de l'accès et du nettoyage requis.",
  },
];

function Diogene() {
  return (
    <main>
      {/* Page volontairement sobre : colonne de lecture étroite, pas de photo */}
      <section className="pb-14 pt-8">
        <div className={`${wrap} max-w-[880px]`}>
          <Breadcrumb items={[{ label: "Syndrome de Diogène" }]} />
          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-[15px] font-bold text-brand-ink">
            <EyeOff className="size-4" aria-hidden="true" />
            Intervention discrète, sans signalétique sur demande
          </p>
          <h1 className="mt-5 text-[29px] font-black leading-[1.08] tracking-[-0.03em] text-brand-ink sm:text-[40px]">
            Débarras syndrome de Diogène : intervention discrète et complète
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-[#34433A]">
            Un logement en accumulation extrême demande des équipes équipées, un protocole d'hygiène
            et beaucoup de discrétion. Photographiez ce que vous pouvez : l'estimation prend en
            compte le volume, l'insalubrité et l'accès, puis seuls des professionnels formés à ce
            type de chantier reçoivent la demande.
          </p>
          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
            <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
              <Camera className="size-5" aria-hidden="true" />
              Estimer en toute discrétion
            </Link>
            <Link to="/contact" className={btnOutline}>
              Parler à quelqu'un d'abord
            </Link>
          </div>
          <p className="mt-5 text-[15px] text-muted-foreground">
            Vous n'avez pas besoin de tout photographier. Une pièce suffit pour commencer.
          </p>
        </div>
      </section>

      <Section tone="tint" className="!py-14">
        <div className={`mx-auto max-w-[880px]`}>
          <h2 className="text-[23px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[28px]">
            Le protocole, étape par étape
          </h2>
          <ol className="mt-8 flex flex-col gap-4">
            {PROTOCOL.map(([title, text], index) => (
              <li key={title} className="flex gap-5 rounded-[18px] bg-white p-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-ink text-base font-black text-white">
                  {index + 1}
                </span>
                <span>
                  <strong className="block text-lg text-brand-ink">{title}</strong>
                  <span className="mt-1 block text-base leading-relaxed text-muted-foreground">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section className="!py-14">
        <div className="mx-auto grid max-w-[880px] gap-10 md:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-[23px] font-extrabold tracking-[-0.02em] text-brand-ink">
              Qui peut faire la demande
            </h2>
            <ul className="mt-5 divide-y divide-border">
              {WHO.map((item) => (
                <li key={item} className="py-3 text-base text-brand-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[23px] font-extrabold tracking-[-0.02em] text-brand-ink">
              Ce que vous recevez
            </h2>
            <ul className="mt-5 divide-y divide-border">
              {[
                "Une fourchette de prix avant tout déplacement",
                "Des pros habitués à ce type de chantier",
                "Un rapport photo transmis uniquement à vous",
                "Un paiement bloqué jusqu'à votre validation",
              ].map((item) => (
                <li key={item} className="py-3 text-base text-brand-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="tint" className="!py-14">
        <div className="mx-auto max-w-[880px]">
          <h2 className="text-[23px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[28px]">
            Prix d'un débarras Diogène
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Fourchettes indicatives constatées sur la plateforme. Le prix définitif dépend du volume
            réel, de l'accès et du nettoyage nécessaire.
          </p>
          <div className="mt-6">
            <PriceTable rows={PRICES} />
          </div>
        </div>
      </Section>

      <Section className="!py-14">
        <div className="mx-auto max-w-[880px]">
          <h2 className="text-[23px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[28px]">
            Questions fréquentes
          </h2>
          <FaqList items={FAQ} twoColumns={false} />
        </div>
      </Section>

      <Section tone="tint" className="!py-14">
        <div className="mx-auto max-w-[880px]">
          <CityLinks title="Professionnels formés dans votre ville" />
        </div>
      </Section>

      <CtaBand
        title="Faites estimer le chantier en toute discrétion"
        text="Quelques photos suffisent pour obtenir un volume, une fourchette de prix et des professionnels habitués à ce type d'intervention."
      >
        <Link to="/estimation" search={{ type: "photo" }} className={btnSoft}>
          <Camera className="size-5" aria-hidden="true" />
          Démarrer mon estimation
        </Link>
        <Link to="/contact" className={btnWhite}>
          Nous écrire
        </Link>
      </CtaBand>
    </main>
  );
}
