import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { useState } from "react";
import { HouseSection } from "@/components/site/illustrations";
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
import { computePrice, euro } from "@/lib/pricing";
import { serviceHead } from "@/lib/seo";

export const Route = createFileRoute("/debarras-maison")({
  head: () =>
    serviceHead({
      path: "/debarras-maison",
      title: "Débarras de maison : prix et estimation en photo | Débarras France",
      description:
        "Débarras de maison complet : combles, cave, garage et dépendances. Estimez le prix en photos en 2 minutes, tarif dégressif sur les gros volumes, pros vérifiés près de chez vous.",
      serviceName: "Débarras de maison",
      breadcrumb: "Débarras de maison",
    }),
  component: HouseClearance,
});

const ZONES = [
  {
    id: "combles",
    label: "Combles",
    text: "Accès par trappe ou escalier étroit, portage plus long, à signaler dès l'estimation.",
  },
  {
    id: "etage",
    label: "Étage",
    text: "Chambres et salles de bain : mobilier, literie et textiles, souvent le volume le plus régulier.",
  },
  {
    id: "rdc",
    label: "Rez-de-chaussée",
    text: "Pièces de vie, cuisine et électroménager : les objets les plus lourds partent d'ici.",
  },
  {
    id: "cave",
    label: "Cave et sous-sol",
    text: "Humidité, meubles dégradés et gros volumes de cartons à évacuer.",
  },
  {
    id: "garage",
    label: "Garage et atelier",
    text: "Outillage, pneus, peintures ou produits chimiques qui suivent des filières de tri spécifiques.",
  },
  {
    id: "jardin",
    label: "Extérieur",
    text: "Abri de jardin, ferraille ou gravats : précisez-les, ils changent le volume et le mode d'évacuation.",
  },
];

const CASES = [
  {
    label: "Petite maison de plain-pied",
    volume: "20 à 35 m³",
    mid: 28,
    text: "Mobilier et cartons. Une journée d'intervention suffit généralement.",
  },
  {
    label: "Maison familiale avec garage",
    volume: "35 à 60 m³",
    mid: 48,
    text: "Garage, outillage, électroménager et mobilier de jardin s'ajoutent au volume intérieur.",
  },
  {
    label: "Maison après succession",
    volume: "50 à 90 m³",
    mid: 70,
    text: "Combles et cave inclus. Le tri des objets valorisables peut réduire la facture finale.",
  },
  {
    label: "Maison très encombrée",
    volume: "80 m³ et plus",
    mid: 90,
    text: "Accumulation importante ou insalubrité : volumes élevés, nettoyage et évacuations spécifiques à prévoir.",
  },
].map((row) => ({
  ...row,
  price: computePrice({
    volumeM3: row.mid,
    floor: 0,
    hasElevator: true,
    bulkyItems: false,
    hardAccess: false,
  }),
}));

const STEPS = [
  [
    "Photographiez la maison",
    "Pièces de vie, chambres, combles, garage, cave, dépendances et extérieur : plus les photos couvrent la maison, plus l'estimation est juste.",
  ],
  [
    "Ajoutez les annexes",
    "Grenier, sous-sol, atelier, abri de jardin : ce sont souvent eux qui font grimper le volume total à évacuer.",
  ],
  [
    "Recevez une fourchette de prix",
    "Volume estimé en m³, tarif dégressif sur les gros volumes et majorations d'accès s'affichent immédiatement.",
  ],
  [
    "Comparez les pros de votre secteur",
    "Seuls les débarrasseurs intervenant sur votre code postal reçoivent la demande. Vos coordonnées ne partent qu'après votre accord.",
  ],
];

const FAQ = [
  {
    q: "Combien de temps dure le débarras d'une maison ?",
    a: "Une journée pour une maison de plain-pied peu encombrée, deux à trois jours avec combles, cave et garage pleins. Le pro précise la durée dans sa proposition.",
  },
  {
    q: "Faut-il être présent ?",
    a: "Non. Une remise de clés suffit : vous recevez les photos de fin de chantier et validez le paiement une fois la maison vidée.",
  },
  {
    q: "Que deviennent les meubles encore bons ?",
    a: "Le professionnel oriente ce qui peut l'être vers le don ou le réemploi. Si certains biens ont une valeur de revente, leur reprise peut réduire le devis.",
  },
];

function HouseClearance() {
  const [active, setActive] = useState("rdc");
  const zone = ZONES.find((z) => z.id === active) ?? ZONES[2]!;

  return (
    <main>
      {/* En-tête sur fond vert pâle, titre et plan côte à côte */}
      <section className="bg-[#F2FAF4] pb-12 pt-6 sm:pb-16">
        <div className={`${wrap} grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16`}>
          <div>
            <Breadcrumb items={[{ label: "Débarras de maison" }]} />
            <h1 className="mt-6 text-[31px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[43px]">
              Débarras de maison : le prix estimé en 2 minutes, en photos
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-[#34433A]">
              En maison, le volume à évacuer dépasse presque toujours celui d'un appartement :
              combles, cave, garage et dépendances s'ajoutent aux pièces de vie. Débarras France
              analyse vos photos, calcule le volume en m³, applique un tarif dégressif sur les gros
              volumes, puis transmet votre demande à des débarrasseurs vérifiés près de chez vous.
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
          <div className="rounded-[28px] bg-white p-6 sm:p-8">
            <p className="text-sm font-bold text-muted-foreground">Touchez une zone de la maison</p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Zones de la maison">
              {ZONES.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setActive(z.id)}
                  aria-pressed={active === z.id}
                  className={`min-h-10 rounded-full border-2 px-3.5 text-sm font-bold transition-colors ${
                    active === z.id
                      ? "border-brand-ink bg-brand-ink text-white"
                      : "border-border text-brand-ink hover:border-brand-ink"
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <HouseSection active={active} />
            </div>
            <p className="mt-2 rounded-2xl bg-[#F2FAF4] px-5 py-4 text-base leading-relaxed text-brand-ink">
              <strong>{zone.label} :</strong> {zone.text}
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 className={`${h2Class} text-brand-ink`}>Volumes courants selon la maison</h2>
            <p className={`${leadClass} text-muted-foreground`}>
              Ces ordres de grandeur sont indicatifs : l'estimation Débarras France affine le volume
              à partir de vos photos et de vos réponses. Les prix sont calculés au rez-de-chaussée,
              sans objets lourds.
            </p>
          </div>
          <PriceTable
            columns={["Maison", "Volume", "Prix indicatif"]}
            rows={CASES.map((c) => ({
              label: (
                <span>
                  <strong className="block text-brand-ink">{c.label}</strong>
                  <span className="text-sm text-muted-foreground">{c.text}</span>
                </span>
              ),
              volume: c.volume,
              price: `${euro(c.price.priceMin)} – ${euro(c.price.priceMax)}`,
            }))}
          />
        </div>
      </Section>

      <Section tone="tint">
        <SectionHeading title="Comment se calcule le prix en maison" />
        <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {STEPS.map(([title, text], index) => (
            <li key={title} className="flex gap-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-black text-primary">
                {index + 1}
              </span>
              <span>
                <strong className="block text-xl font-extrabold text-brand-ink">{title}</strong>
                <span className="mt-1.5 block text-base leading-relaxed text-muted-foreground">
                  {text}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading title="Questions sur le débarras de maison" />
        <FaqList items={FAQ} />
      </Section>

      <Section tone="tint">
        <CityLinks title="Débarras de maison dans votre ville" />
      </Section>

      <CtaBand
        title="Votre estimation de maison, tout de suite"
        text="Gratuit, sans engagement, et vos coordonnées ne sont partagées qu'une fois que vous acceptez une proposition."
      >
        <Link to="/estimation" search={{ type: "photo" }} className={btnSoft}>
          <Camera className="size-5" aria-hidden="true" />
          Démarrer mon estimation
        </Link>
        <Link to="/debarras-appartement" className={btnWhite}>
          Débarras d'appartement
        </Link>
      </CtaBand>
    </main>
  );
}
