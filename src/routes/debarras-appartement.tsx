import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { useState } from "react";
import { BuildingSection } from "@/components/site/illustrations";
import {
  Breadcrumb,
  CityLinks,
  CtaBand,
  FaqList,
  Section,
  SectionHeading,
  btnOutline,
  btnPrimary,
  btnSoft,
  btnWhite,
  h2Class,
  leadClass,
  wrap,
} from "@/components/site/page-kit";
import { PRICING, computePrice, euro } from "@/lib/pricing";
import { serviceHead } from "@/lib/seo";

export const Route = createFileRoute("/debarras-appartement")({
  head: () =>
    serviceHead({
      path: "/debarras-appartement",
      title: "Débarras d'appartement : prix et estimation en 2 min | Débarras France",
      description:
        "Estimez le prix du débarras de votre appartement en photos grâce à l'IA Débarras France : volume, étage, ascenseur et accès pris en compte. Pros vérifiés près de chez vous.",
      serviceName: "Débarras d'appartement",
      breadcrumb: "Débarras d'appartement",
    }),
  component: ApartmentClearance,
});

const STEPS = [
  {
    title: "Photographiez les pièces",
    text: "Salon, chambres, cuisine, cave ou box : quelques photos suffisent à l'IA pour estimer le volume à évacuer.",
  },
  {
    title: "Précisez l'étage et l'accès",
    text: "Étage, présence d'ascenseur, couloirs étroits ou stationnement difficile : ces contraintes d'appartement pèsent directement sur le prix.",
  },
  {
    title: "Recevez une fourchette de prix",
    text: "Volume en m³, majorations d'accès et fourchette indicative s'affichent immédiatement, avant tout engagement.",
  },
  {
    title: "Comparez les pros de votre secteur",
    text: "Votre demande part uniquement aux débarrasseurs qui interviennent sur votre code postal. Vos coordonnées ne sont transmises qu'après acceptation.",
  },
];

/** Volumes courants selon le logement : les bornes servent aussi au graphique. */
const CASES = [
  {
    title: "Studio ou T1",
    min: 8,
    max: 15,
    text: "Souvent réalisable en une demi-journée, à un ou deux intervenants.",
  },
  {
    title: "T2 / T3 meublé",
    min: 15,
    max: 30,
    text: "Mobilier, électroménager et cartons. L'étage sans ascenseur allonge nettement la manutention.",
  },
  {
    title: "Appartement complet après succession",
    min: 25,
    max: 45,
    text: "Cave, placards et combles inclus. Le tri des objets valorisables peut réduire la facture.",
  },
  {
    title: "Logement très encombré",
    min: 40,
    max: 70,
    text: "Accumulation importante ou syndrome de Diogène : volumes élevés, nettoyage et désinfection à prévoir.",
  },
];
const MAX_VOLUME = 70;

const ACCESS_NOTES = [
  ["Avec ascenseur", "Majoration limitée, le volume reste le facteur principal du prix."],
  ["Sans ascenseur", "Chaque étage ajoute du temps de portage, donc une majoration progressive."],
  [
    "Accès très contraint",
    "Rue étroite, stationnement éloigné, monte-meubles nécessaire : à signaler dès l'estimation.",
  ],
  [
    "Copropriété",
    "Pensez à réserver l'ascenseur ou une place devant l'immeuble le jour de l'intervention.",
  ],
];

const FAQ = [
  {
    q: "Faut-il vider les placards avant le passage des pros ?",
    a: "Non. Indiquez simplement ce qui doit être conservé : le reste est trié et évacué par le professionnel.",
  },
  {
    q: "L'ascenseur change-t-il vraiment le prix ?",
    a: `Oui. Sans ascenseur, chaque étage ajoute ${Math.round(PRICING.floorSurchargeRate * 100)} % au prix de base, dans la limite de ${Math.round(PRICING.maxFloorSurcharge * 100)} %. Avec ascenseur, aucune majoration d'étage.`,
  },
  {
    q: "Et la cave ou le box au sous-sol ?",
    a: "Photographiez-les avec le reste : ils s'ajoutent au volume total et le pro prévoit le portage correspondant.",
  },
];

function ApartmentClearance() {
  const [floor, setFloor] = useState(3);
  const [elevator, setElevator] = useState(false);
  const sample = computePrice({
    volumeM3: 20,
    floor,
    hasElevator: elevator,
    bulkyItems: false,
    hardAccess: false,
  });
  const surcharge = sample.surcharges.find((s) => s.label.startsWith("Étage"));

  return (
    <main>
      {/* En-tête : titre pleine largeur, puis une coupe d'immeuble interactive */}
      <section className="pb-6 pt-8">
        <div className={wrap}>
          <Breadcrumb items={[{ label: "Débarras d'appartement" }]} />
          <h1 className="mt-6 max-w-[22ch] text-[36px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[52px] lg:text-[60px]">
            Débarras d'appartement : le prix estimé en 2 minutes, en photos
          </h1>
          <p className="mt-6 max-w-[40em] text-lg leading-relaxed text-[#34433A]">
            En appartement, le prix d'un débarras dépend surtout du volume à évacuer, de l'étage et
            de l'ascenseur. Débarras France analyse vos photos, calcule le volume en m³, applique
            les contraintes d'accès, puis transmet votre demande à des débarrasseurs vérifiés de
            votre secteur.
          </p>
          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
            <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
              <Camera className="size-5" aria-hidden="true" />
              Lancer mon devis IA
            </Link>
            <Link to="/tarifs" className={btnOutline}>
              Voir la grille tarifaire
            </Link>
          </div>
        </div>
      </section>

      <Section tone="tint" className="!pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className={`${h2Class} text-brand-ink`}>À quel étage habitez-vous ?</h2>
            <p className={`${leadClass} text-muted-foreground`}>
              Choisissez un étage pour voir ce que change l'ascenseur sur un débarras de 20 m³, un
              T2 meublé typique.
            </p>
            <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Étage">
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFloor(level)}
                  aria-pressed={floor === level}
                  className={`min-h-11 min-w-[52px] rounded-full border-2 px-4 text-[15px] font-bold transition-colors ${
                    floor === level
                      ? "border-brand-ink bg-brand-ink text-white"
                      : "border-border bg-white text-brand-ink hover:border-brand-ink"
                  }`}
                >
                  {level === 0 ? "RDC" : `${level}e`}
                </button>
              ))}
            </div>
            <label className="mt-5 inline-flex min-h-11 cursor-pointer items-center gap-3 text-base font-semibold text-brand-ink">
              <input
                id="apt-elevator"
                type="checkbox"
                checked={elevator}
                onChange={(e) => setElevator(e.target.checked)}
                className="size-5 accent-primary"
              />
              Il y a un ascenseur
            </label>
            <div className="mt-7 rounded-[20px] bg-white p-6">
              <p className="text-sm font-bold text-muted-foreground">Exemple pour 20 m³</p>
              <p className="mt-1 text-[34px] font-black tabular-nums text-brand-ink">
                {euro(sample.priceMin)} – {euro(sample.priceMax)}
              </p>
              <p className="mt-1 text-[15px] text-muted-foreground">
                {surcharge
                  ? `dont ${euro(surcharge.amount)} de majoration pour ${floor === 1 ? "1 étage" : `${floor} étages`} sans ascenseur`
                  : "aucune majoration d'étage"}
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <BuildingSection floors={5} activeFloor={floor} />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="Volumes courants selon le logement"
          lead="Ces ordres de grandeur sont indicatifs : l'estimation Débarras France affine le volume à partir de vos photos et de vos réponses."
        />
        <ul className="mt-10 flex flex-col gap-6">
          {CASES.map((item) => (
            <li
              key={item.title}
              className="grid gap-3 border-t border-border pt-6 lg:grid-cols-[260px_1fr_1fr] lg:gap-8"
            >
              <h3 className="text-xl font-extrabold text-brand-ink">{item.title}</h3>
              <div>
                <div
                  className="relative h-4 w-full overflow-hidden rounded-full bg-secondary"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-y-0 rounded-full bg-primary"
                    style={{
                      left: `${(item.min / MAX_VOLUME) * 100}%`,
                      width: `${((item.max - item.min) / MAX_VOLUME) * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-[15px] font-bold tabular-nums text-brand-ink">
                  {item.min} à {item.max} m³
                </p>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <h2 className={`${h2Class} text-white`}>Comment se calcule le prix en appartement</h2>
          <ol className="flex flex-col divide-y divide-white/15">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-5 py-5 first:pt-0 last:pb-0">
                <span className="text-[28px] font-black leading-none text-[#6EDC97] tabular-nums">
                  {index + 1}
                </span>
                <span>
                  <strong className="block text-lg">{step.title}</strong>
                  <span className="mt-1 block text-base leading-relaxed text-[#BFD8C8]">
                    {step.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="tint">
        <SectionHeading title="Étage, ascenseur et stationnement" />
        <dl className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {ACCESS_NOTES.map(([label, text]) => (
            <div key={label} className="border-l-4 border-primary pl-5">
              <dt className="text-lg font-extrabold text-brand-ink">{label}</dt>
              <dd className="mt-1 text-base leading-relaxed text-muted-foreground">{text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <SectionHeading title="Questions sur le débarras d'appartement" />
        <FaqList items={FAQ} />
      </Section>

      <Section tone="tint">
        <CityLinks title="Débarras d'appartement dans votre ville" />
      </Section>

      <CtaBand
        title="Votre estimation d'appartement, tout de suite"
        text="Gratuit, sans engagement, et vos coordonnées ne sont partagées qu'une fois que vous acceptez une proposition."
      >
        <Link to="/estimation" search={{ type: "photo" }} className={btnSoft}>
          <Camera className="size-5" aria-hidden="true" />
          Démarrer mon estimation
        </Link>
        <Link to="/debarras-maison" className={btnWhite}>
          Débarras de maison
        </Link>
      </CtaBand>
    </main>
  );
}
