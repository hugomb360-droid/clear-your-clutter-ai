import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import photoCave from "@/assets/gallery-cave.jpg";
import { VolumeCubes } from "@/components/site/illustrations";
import {
  Breadcrumb,
  CityLinks,
  CtaBand,
  FaqList,
  Section,
  SectionHeading,
  btnOnDark,
  btnPrimary,
  btnSoft,
  btnWhite,
  h2Class,
  onDarkAccent,
  onDarkMuted,
  wrap,
} from "@/components/site/page-kit";
import { serviceHead } from "@/lib/seo";

export const Route = createFileRoute("/debarras-cave-garage")({
  head: () =>
    serviceHead({
      path: "/debarras-cave-garage",
      title: "Débarras de cave, garage et grenier : prix au m³ | Débarras France",
      description:
        "Débarras de cave, garage, grenier ou box : estimation en photo en 2 minutes, prix au m³, évacuation et tri en déchetterie par des professionnels vérifiés.",
      serviceName: "Débarras de cave, garage et grenier",
      breadcrumb: "Débarras cave et garage",
    }),
  component: CaveGarage,
});

const SPACES = [
  { label: "Cave de copropriété", volume: "4 à 10 m³", cubes: 7, price: "300 – 780 €" },
  { label: "Garage ou box", volume: "10 à 20 m³", cubes: 15, price: "700 – 1 500 €" },
  { label: "Grenier / combles", volume: "12 à 25 m³", cubes: 18, price: "850 – 1 900 €" },
  {
    label: "Local ou atelier avec gravats",
    volume: "15 à 30 m³",
    cubes: 22,
    price: "1 200 – 2 600 €",
  },
];

const FACTORS = [
  [
    "Le volume réel, pas la surface",
    "Un débarras se facture au m³ évacué. Les cartons empilés jusqu'au plafond comptent bien plus que la surface au sol ne le laisse penser.",
  ],
  [
    "La distance de portage",
    "Cave en sous-sol avec escalier étroit, box au bout d'un parking, grenier accessible par trappe : le portage représente une part importante du temps de chantier.",
  ],
  [
    "La nature des déchets",
    "Gravats, pots de peinture, pneus, produits chimiques ou électroménager partent dans des filières spécifiques, avec un coût de traitement à part.",
  ],
  [
    "La revalorisation",
    "Outillage, vélos, mobilier ou métaux récupérables peuvent être repris et venir réduire le montant final du devis.",
  ],
];

const SORTING = [
  ["Déchetterie", "Cartons, bois, mobilier abîmé, plastiques"],
  ["Filière spéciale", "Peintures, solvants, pneus, batteries, gravats"],
  ["Réemploi et don", "Outillage, vélos, meubles en état"],
  ["Ferraille", "Métaux, radiateurs, étagères métalliques"],
];

const FAQ = [
  {
    q: "Faut-il être présent le jour du débarras ?",
    a: "Non, à condition qu'un accès soit prévu : remise des clés, badge de parking ou présence du gardien. Un rapport photo de fin de chantier vous est envoyé.",
  },
  {
    q: "Les gravats sont-ils acceptés ?",
    a: "Oui, mais ils sont traités dans une filière distincte et facturés à part car les déchèteries professionnelles les tarifent au poids.",
  },
  {
    q: "Le sol est-il nettoyé après l'évacuation ?",
    a: "Un balayage est systématiquement inclus. Un nettoyage plus poussé ou une désinfection peuvent être ajoutés à la demande.",
  },
];

function CaveGarage() {
  return (
    <main>
      {/* En-tête sombre, pleine largeur, photo en bandeau */}
      <section className="bg-brand-ink pb-0 pt-8 text-white">
        <div className={wrap}>
          <Breadcrumb items={[{ label: "Cave, garage, grenier" }]} dark />
          <div className="mt-6 grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1 className="text-[31px] font-black leading-[1.05] tracking-[-0.03em] sm:text-[45px]">
                Débarras de cave, garage et grenier : prix au m³ en 2 minutes
              </h1>
              <p className={`mt-5 max-w-[38em] text-[17px] leading-relaxed ${onDarkMuted}`}>
                Ce sont les espaces les plus sous-estimés : une cave de 6 m² contient souvent 8 à 10
                m³ d'encombrants. Photographiez l'espace tel qu'il est, notre IA calcule le volume
                réel et vous obtenez une fourchette de prix avant même la visite d'un professionnel.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
                <Camera className="size-5" aria-hidden="true" />
                Lancer mon devis IA
              </Link>
              <Link to="/tarifs" className={btnOnDark}>
                Voir la grille tarifaire
              </Link>
            </div>
          </div>
        </div>
        <figure className="mt-12">
          <img
            src={photoCave}
            alt="Cave encombrée en cours de débarras"
            className="h-[260px] w-full object-cover sm:h-[420px]"
          />
        </figure>
      </section>

      {/* Les volumes en cubes */}
      <Section>
        <SectionHeading
          title="6 m² au sol, 10 m³ à évacuer"
          lead="Le prix suit le volume, pas la surface. Voici les volumes et les prix indicatifs constatés pour chaque type d'espace, hors majorations d'accès."
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SPACES.map((space) => (
            <li
              key={space.label}
              className="flex flex-col items-center rounded-[20px] border border-border bg-card p-6 text-center"
            >
              <VolumeCubes count={space.cubes} label={space.volume} />
              <h3 className="mt-3 text-lg font-extrabold text-brand-ink">{space.label}</h3>
              <p className="mt-1 text-[20px] font-black tabular-nums text-primary">{space.price}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          Fourchettes indicatives constatées sur la plateforme. Votre estimation en photo affiche
          votre fourchette personnalisée.
        </p>
      </Section>

      <Section tone="tint">
        <SectionHeading title="Ce qui fait varier le prix" />
        <ol className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {FACTORS.map(([title, text], index) => (
            <li key={title} className="border-t-4 border-brand-ink pt-4">
              <span className="text-sm font-black text-primary tabular-nums">0{index + 1}</span>
              <h3 className="mt-1 text-xl font-extrabold text-brand-ink">{title}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 className={`${h2Class} text-white`}>Où part chaque chose</h2>
            <p className={`mt-4 text-[17px] leading-relaxed ${onDarkMuted}`}>
              Les pros trient sur place. Chaque filière a son coût, c'est pour ça qu'un garage plein
              de pneus ne vaut pas un garage plein de cartons.
            </p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {SORTING.map(([title, text]) => (
              <div key={title} className="rounded-[18px] bg-[#134A2B] px-6 py-5">
                <dt className={`text-lg font-extrabold ${onDarkAccent}`}>{title}</dt>
                <dd className={`mt-1 text-base ${onDarkMuted}`}>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section>
        <SectionHeading title="Questions fréquentes" />
        <FaqList items={FAQ} />
      </Section>

      <Section tone="tint">
        <CityLinks title="Cave et garage dans votre ville" />
      </Section>

      <CtaBand
        title="Estimez votre cave ou votre garage maintenant"
        text="Deux ou trois photos suffisent pour obtenir le volume en m³ et une fourchette de prix, sans engagement."
      >
        <Link to="/estimation" search={{ type: "photo" }} className={btnSoft}>
          <Camera className="size-5" aria-hidden="true" />
          Démarrer mon estimation
        </Link>
        <Link to="/debarras-maison" className={btnWhite}>
          Toute la maison
        </Link>
      </CtaBand>
    </main>
  );
}
