import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { FolderStack } from "@/components/site/illustrations";
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
import { SuccessionForm } from "@/components/succession/succession-form";
import { SuccessionGuide } from "@/components/succession/succession-guide";
import { serviceHead } from "@/lib/seo";

export const Route = createFileRoute("/debarras-succession")({
  head: () =>
    serviceHead({
      path: "/debarras-succession",
      title: "Débarras succession : devis, prix et rapport notaire | Débarras France",
      description:
        "Débarras après succession de maison ou appartement : devis, objets à conserver, clés à distance et rapport PDF avant/après pour le notaire. Préparez votre dossier.",
      serviceName: "Débarras après succession",
      breadcrumb: "Débarras succession",
    }),
  component: Succession,
});

const STEPS = [
  [
    "Votre dossier",
    "Adresse, photos du logement, objets à conserver et échéance de vente ou de fin de bail.",
  ],
  [
    "Les propositions",
    "Les professionnels de votre secteur établissent un devis adapté au bien et aux consignes.",
  ],
  [
    "Le débarras",
    "Présence d'un héritier ou remise des clés à distance : l'intervention suit votre organisation.",
  ],
  [
    "Le rapport final",
    "Photos avant/après, volumes évacués et destinations déclarées par le professionnel dans un PDF pour le notaire.",
  ],
];

const COVERS = [
  [
    "Tri et mise de côté",
    "Papiers, photos, bijoux et souvenirs sont mis de côté avant toute évacuation. Vous indiquez à l'avance ce qui doit être conservé ou remis à un notaire.",
  ],
  [
    "Valorisation des biens",
    "Meubles anciens, vaisselle, outillage : lorsque des biens ont une valeur de revente, leur reprise peut réduire le montant du devis.",
  ],
  [
    "Évacuation complète",
    "Logement, cave, grenier, garage et dépendances sont vidés, avec tri en déchetterie et filières de recyclage.",
  ],
  [
    "Remise en état légère",
    "Balayage et nettoyage sommaire pour restituer le bien au notaire, à l'agence ou au bailleur.",
  ],
];

const PRICES = [
  { label: "Studio ou T1", volume: "6 à 12 m³", price: "450 – 950 €" },
  { label: "Appartement T3", volume: "15 à 25 m³", price: "1 100 – 1 900 €" },
  { label: "Maison avec cave et grenier", volume: "35 à 60 m³", price: "2 300 – 4 200 €" },
  { label: "Maison très encombrée", volume: "60 m³ et plus", price: "à partir de 4 500 €" },
];

const FAQ = [
  {
    q: "Peut-on débarrasser avant la fin de la succession ?",
    a: "Avant toute évacuation, donation ou vente, vérifiez avec les héritiers et le notaire les autorisations nécessaires et si un inventaire doit être établi. La démarche dépend du dossier : en cas de doute ou de désaccord, ne disposez pas des biens avant d'avoir obtenu leurs instructions.",
  },
  {
    q: "Puis-je organiser le débarras à distance ?",
    a: "Oui, selon l'organisation convenue avec le professionnel. Le dossier recueille les photos, les consignes et les modalités de remise des clés. Un proche ou une agence peut servir de relais ; le rapport PDF de fin de chantier permet ensuite de suivre le résultat à distance.",
  },
  {
    q: "Le débarras peut-il être gratuit ?",
    a: "Le coût peut être réduit, voire couvert, si la valeur de reprise proposée pour les biens compense l'intervention. Ce n'est pas garanti : seuls l'examen du mobilier et un devis détaillé permettent de le confirmer. La présence de meubles anciens ne suffit pas à assurer leur valeur de revente.",
  },
  {
    q: "Quel délai prévoir pour vider le logement avant une vente ?",
    a: "Indiquez votre date limite dans le dossier, puis faites confirmer la disponibilité et la durée du chantier par le professionnel. Le volume, l'accès, les dépendances et le tri influencent l'organisation. Aucun délai identique ne peut être garanti pour tous les logements.",
  },
  {
    q: "Que faire des meubles et objets de valeur après un décès ?",
    a: "Listez les objets à conserver avant le débarras et faites valider la destination des autres biens avec les personnes concernées par la succession. Vous pouvez demander un don ou une revente du mobilier. Les objets nécessitant une estimation de valeur doivent faire l'objet d'un avis adapté, distinct du devis de débarras.",
  },
  {
    q: "Que contient le rapport de débarras pour le notaire ?",
    a: "Le PDF contient les photos avant/après, le volume évacué et les filières ou destinations déclarées par le professionnel. Il précise le statut de validation de la fin de chantier. C'est un document de suivi, et non un inventaire successoral ou une expertise de valeur.",
  },
];

function Succession() {
  return (
    <main>
      {/* En-tête : ton posé, dossier illustré à droite */}
      <section className="pb-12 pt-6 sm:pb-16">
        <div className={`${wrap} grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16`}>
          <div>
            <Breadcrumb items={[{ label: "Succession" }]} />
            <h1 className="mt-6 text-[31px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[43px]">
              Débarras après succession de maison et d'appartement
            </h1>
            <p className="mt-6 max-w-[38em] text-[17px] leading-relaxed text-[#34433A]">
              Vider le logement d'un proche mérite une organisation attentive. Transmettez les
              photos, les consignes de conservation et votre échéance : les professionnels de votre
              secteur vous proposent un devis. À la fin du chantier, retrouvez un rapport PDF pour
              le notaire.
            </p>
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
              <a href="#dossier-succession" className={btnPrimary}>
                <FileText className="size-5" aria-hidden="true" />
                Ouvrir mon dossier succession
              </a>
              <a href="#guide" className={btnOutline}>
                Lire le guide
              </a>
            </div>
            <p className="mt-4 text-[15px] text-muted-foreground">
              Sans engagement. Vous comparez les propositions avant d'accepter.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <FolderStack />
          </div>
        </div>
      </section>

      {/* Les 4 étapes en file, une seule ligne de lecture */}
      <Section tone="tint">
        <SectionHeading
          title="Un dossier qui suit tout le chantier"
          lead="De vos consignes jusqu'au rapport de fin de chantier."
        />
        <ol className="mt-10 grid gap-px overflow-hidden rounded-[20px] bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([title, text], index) => (
            <li key={title} className="bg-white p-6">
              <span className="text-sm font-black text-primary tabular-nums">
                Étape {index + 1}
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-brand-ink">{title}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <h2 className={`${h2Class} text-brand-ink`}>Ce que couvre un débarras de succession</h2>
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {COVERS.map(([title, text]) => (
              <div key={title} className="border-t-2 border-brand-ink pt-4">
                <dt className="text-lg font-extrabold text-brand-ink">{title}</dt>
                <dd className="mt-1.5 text-base leading-relaxed text-muted-foreground">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section tone="tint">
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 className={`${h2Class} text-brand-ink`}>Prix d'un débarras de succession</h2>
            <p className={`${leadClass} text-muted-foreground`}>
              Exemples de budgets indicatifs, sans garantie de tarif. Le professionnel établit le
              devis définitif selon le volume, l'accès, le tri et les éventuels biens repris.
            </p>
          </div>
          <PriceTable rows={PRICES} />
        </div>
      </Section>

      <div id="guide" className="scroll-mt-20">
        <SuccessionGuide />
      </div>

      <SuccessionForm />

      <Section>
        <SectionHeading title="Questions fréquentes sur le débarras de succession" />
        <FaqList items={FAQ} />
      </Section>

      <Section tone="tint">
        <CityLinks title="Débarras de succession : trouver un professionnel par ville" />
      </Section>

      <CtaBand
        title="Préparez votre dossier de succession"
        text="Adresse, clés, objets à conserver et date limite : vos consignes accompagnent le chantier jusqu'au rapport final."
      >
        <a href="#dossier-succession" className={btnSoft}>
          Organiser le débarras de succession
        </a>
        <Link to="/partenaires-prescripteurs" className={btnWhite}>
          Je suis notaire ou agence
        </Link>
      </CtaBand>
    </main>
  );
}
