import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import {
  Breadcrumb,
  CityLinks,
  CtaBand,
  FaqList,
  PriceTable,
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
import { serviceHead } from "@/lib/seo";

export const Route = createFileRoute("/vide-maison")({
  head: () =>
    serviceHead({
      path: "/vide-maison",
      title: "Vide-maison : organisation, prix et débarras du reste | Débarras France",
      description:
        "Organiser un vide-maison : tri, déclaration, vente puis évacuation des invendus. Estimez en photo le débarras de ce qui reste, avec des professionnels vérifiés près de chez vous.",
      serviceName: "Débarras après vide-maison",
      breadcrumb: "Vide-maison",
    }),
  component: VideMaison,
});

/** Les quatre étapes du site, replacées sur un rétroplanning. */
const PLAN = [
  {
    when: "J-15",
    title: "Trier avant d'annoncer",
    text: "Séparez ce qui se revend (meubles en bon état, électroménager récent, outillage) de ce qui part en déchetterie. Photographier pièce par pièce vous aide à ne rien oublier.",
  },
  {
    when: "J-10",
    title: "Fixer une date et prévenir",
    text: "Un vide-maison se déclare en mairie dans la plupart des communes lorsqu'il est ouvert au public. Prévoyez le stationnement et la sécurité des accès.",
  },
  {
    when: "Jour J",
    title: "Anticiper les invendus",
    text: "En moyenne, la moitié du mobilier ne trouve pas preneur. Programmez le débarras dans les jours qui suivent pour libérer le logement à temps.",
  },
  {
    when: "J+3",
    title: "Faire évacuer et nettoyer",
    text: "Le débarras final inclut le démontage, l'évacuation, le tri en déchetterie et un balayage. Le logement est rendu vide, prêt pour la vente ou la location.",
  },
];

const PRICES = [
  { label: "Invendus d'un appartement", volume: "8 à 15 m³", price: "600 – 1 200 €" },
  { label: "Invendus d'une maison", volume: "20 à 40 m³", price: "1 400 – 2 900 €" },
  { label: "Maison entière sans vide-maison", volume: "40 à 80 m³", price: "2 600 – 5 200 €" },
  { label: "Cave, grenier et dépendances seules", volume: "10 à 25 m³", price: "750 – 1 900 €" },
];

const SELL = [
  "Meubles en bon état",
  "Électroménager récent",
  "Outillage et jardinage",
  "Vaisselle complète",
  "Vélos, poussettes",
  "Livres, vinyles",
];
const CLEAR = [
  "Matelas et literie",
  "Mobilier abîmé",
  "Cartons de papiers",
  "Textiles usés",
  "Peintures, produits",
  "Gravats, ferraille",
];

const FAQ = [
  {
    q: "Faut-il une autorisation pour un vide-maison ?",
    a: "Lorsqu'il est ouvert au public, un vide-maison relève des ventes au déballage : une déclaration en mairie est généralement demandée, dans la limite de deux ventes par an pour un particulier.",
  },
  {
    q: "Le débarras peut-il être déduit de la valeur des meubles ?",
    a: "Oui. Si les biens restants ont une valeur de revente, les débarrasseurs peuvent proposer une reprise qui vient diminuer le montant du devis, voire un débarras à coût réduit.",
  },
  {
    q: "En combien de temps le logement est-il vidé ?",
    a: "Comptez une demi-journée pour un appartement et une à deux journées pour une maison avec dépendances, selon le volume et l'accès.",
  },
];

function VideMaison() {
  return (
    <main>
      {/* En-tête centré, sans photo : le rétroplanning est l'image de la page */}
      <section className="bg-[#F2FAF4] pb-12 pt-6 sm:pb-16">
        <div className={`${wrap} text-center`}>
          <div className="flex justify-center">
            <Breadcrumb items={[{ label: "Vide-maison" }]} />
          </div>
          <h1 className="mx-auto mt-6 max-w-[20ch] text-[31px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[45px]">
            Vide-maison : vendez ce qui a de la valeur, faites débarrasser le reste
          </h1>
          <p className="mx-auto mt-6 max-w-[42em] text-[17px] leading-relaxed text-[#34433A]">
            Un vide-maison permet d'écouler une partie du mobilier, mais il reste presque toujours
            10 à 40 m³ d'invendus à évacuer. Photographiez ce qui reste : notre IA calcule le volume
            et vous donne une fourchette de prix immédiate, puis des débarrasseurs vérifiés de votre
            secteur vous font une proposition.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row">
            <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
              <Camera className="size-5" aria-hidden="true" />
              Estimer les invendus
            </Link>
            <Link to="/prix-debarras" className={btnOutline}>
              Comprendre le prix
            </Link>
          </div>
        </div>

        {/* Rétroplanning horizontal */}
        <div className={`${wrap} mt-16`}>
          <ol className="relative grid gap-8 md:grid-cols-4">
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-[22px] hidden h-1 bg-primary/30 md:block"
            />
            {PLAN.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  className={`relative z-[1] inline-flex h-11 items-center rounded-full px-4 text-[15px] font-black ${
                    index === 2 ? "bg-brand-ink text-white" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {step.when}
                </span>
                <h2 className="mt-5 text-xl font-extrabold text-brand-ink">{step.title}</h2>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Section>
        <SectionHeading
          title="Ce qui se vend, ce qui part"
          lead="Un repère pour trier vite. Ce que vous mettez à droite, c'est ce que le débarrasseur viendra chercher."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[20px] border-2 border-primary p-7">
            <h3 className="text-xl font-extrabold text-primary">Se vend bien au vide-maison</h3>
            <ul className="mt-4 columns-2 gap-6 text-base text-brand-ink">
              {SELL.map((item) => (
                <li key={item} className="py-1.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[20px] bg-brand-ink p-7 text-white">
            <h3 className="text-xl font-extrabold text-[#6EDC97]">Part avec le débarrasseur</h3>
            <ul className="mt-4 columns-2 gap-6 text-base text-[#BFD8C8]">
              {CLEAR.map((item) => (
                <li key={item} className="py-1.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="tint">
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 className={`${h2Class} text-brand-ink`}>
              Combien coûte l'évacuation après un vide-maison
            </h2>
            <p className={`${leadClass} text-muted-foreground`}>
              Fourchettes indicatives constatées sur la plateforme. Le prix définitif dépend du
              volume réel, de l'accès et du secteur ; votre estimation en photo affiche votre
              fourchette personnalisée.
            </p>
          </div>
          <PriceTable rows={PRICES} />
        </div>
      </Section>

      <Section>
        <SectionHeading title="Questions fréquentes sur le vide-maison" />
        <FaqList items={FAQ} />
      </Section>

      <Section tone="tint">
        <CityLinks title="Débarras après vide-maison dans votre ville" />
      </Section>

      <CtaBand
        title="Il reste des invendus à évacuer ?"
        text="Envoyez vos photos : volume en m³, fourchette de prix et propositions de débarrasseurs vérifiés près de chez vous."
      >
        <Link to="/estimation" search={{ type: "photo" }} className={btnSoft}>
          <Camera className="size-5" aria-hidden="true" />
          Démarrer mon estimation
        </Link>
        <Link to="/debarras-succession" className={btnWhite}>
          Après une succession
        </Link>
      </CtaBand>
    </main>
  );
}
