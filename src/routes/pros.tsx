import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Euro, Gift, Lock, Target, Truck } from "lucide-react";
import heroPhoto from "@/assets/gallery-camion.jpg";
import { useAuth } from "@/hooks/useAuth";
import {
  CtaBand,
  InfoGrid,
  NumberedSteps,
  PageHero,
  Section,
  SectionHeading,
  btnOutline,
  btnPrimary,
  btnSoft,
  btnWhite,
  h2Class,
  onDarkMuted,
} from "@/components/site/page-kit";

export const Route = createFileRoute("/pros")({
  head: () => ({
    meta: [
      { title: "Devenir débarrasseur partenaire — Débarras France" },
      {
        name: "description",
        content:
          "Recevez des demandes de débarras qualifiées près de chez vous, avec volume estimé et photos. Inscription gratuite sur Débarras France.",
      },
      { property: "og:title", content: "Rejoindre le réseau de pros Débarras France" },
      {
        property: "og:description",
        content: "Des missions de débarras qualifiées dans vos zones d'intervention.",
      },
      { property: "og:url", content: "https://debarrasfrance.fr/pros" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/pros" }],
  }),
  component: ProsLanding,
});

const BENEFITS = [
  {
    icon: <Target className="size-6" aria-hidden="true" />,
    title: "Des demandes qualifiées",
    text: "Photos, volume estimé en m³, étage et accès : vous savez à quoi vous engager avant de répondre.",
  },
  {
    icon: <Euro className="size-6" aria-hidden="true" />,
    title: "Vous fixez votre prix",
    text: "L'estimation Débarras France sert de repère, votre proposition reste la vôtre.",
  },
  {
    icon: <Truck className="size-6" aria-hidden="true" />,
    title: "Vos zones, vos règles",
    text: "Renseignez vos codes postaux et vos types de débarras : vous ne recevez que ce qui vous concerne.",
  },
  {
    icon: <BadgeCheck className="size-6" aria-hidden="true" />,
    title: "Badge pro vérifié",
    text: "SIRET et assurance contrôlés : les clients choisissent en confiance.",
  },
];

function ProsLanding() {
  const { user, isPro } = useAuth();

  const secondary = isPro ? (
    <Link to="/pro/dashboard" className={btnOutline}>
      Accéder à mon espace pro
    </Link>
  ) : user ? (
    <Link to="/compte" className={btnOutline}>
      Accéder à mon espace client
    </Link>
  ) : (
    <Link to="/auth" search={{ mode: "signin" }} className={btnOutline}>
      Se connecter
    </Link>
  );

  return (
    <main>
      <PageHero
        crumbs={[{ label: "Devenir débarrasseur partenaire" }]}
        title="Remplissez vos camions avec des missions de débarras près de chez vous"
        subtitle="Espace professionnels"
        intro="Débarras France estime le volume et le budget avant de vous transmettre la demande. Vous répondez, le client choisit."
        image={heroPhoto}
        imageAlt="Débarrasseurs chargeant un camion de meubles"
        trustCard={false}
        actions={
          <>
            <Link to="/auth" search={{ mode: "signup", role: "pro" }} className={btnPrimary}>
              Créer mon compte pro
            </Link>
            {secondary}
          </>
        }
        floating={
          <div className="rounded-2xl bg-brand-ink p-5 text-white shadow-[0_18px_40px_rgba(12,61,34,0.3)]">
            <p className="flex items-center gap-2 text-[15px] font-extrabold">
              <Gift className="size-[18px] text-[#6EDC97]" aria-hidden="true" />
              Offre fondateur
            </p>
            <p className={`mt-2 text-sm leading-relaxed ${onDarkMuted}`}>
              Pour les 20 premiers pros inscrits :{" "}
              <strong className="text-white">
                0 % de commission Débarras France sur vos 5 premiers chantiers
              </strong>
              . Vous encaissez 100 % du montant.
            </p>
          </div>
        }
      />

      <Section tone="tint">
        <SectionHeading title="Pourquoi rejoindre le réseau" />
        <InfoGrid items={BENEFITS} columns={4} />
      </Section>

      <Section>
        <SectionHeading title="Comment ça se passe" />
        <NumberedSteps
          columns={3}
          steps={[
            {
              title: "Inscription",
              text: "Créez votre compte pro et renseignez vos zones d'intervention.",
            },
            { title: "Demandes", text: "Consultez les demandes publiées dans vos codes postaux." },
            {
              title: "Proposition",
              text: "Envoyez votre prix et votre date ; les coordonnées arrivent dès l'acceptation.",
            },
          ]}
        />
      </Section>

      <Section tone="dark">
        <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
          <span className="flex size-20 items-center justify-center rounded-3xl bg-[#134A2B] text-[#6EDC97]">
            <Lock className="size-10" aria-hidden="true" />
          </span>
          <div>
            <h2 className={`${h2Class} text-white`}>Un paiement garanti via Stripe Connect</h2>
            <p className={`mt-4 max-w-[44em] text-lg leading-relaxed ${onDarkMuted}`}>
              Le client paie en ligne avant le chantier et l'argent reste bloqué sous séquestre. Une
              fois la fin du chantier validée, les fonds sont versés directement sur votre compte
              Stripe Connect.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Prêt à recevoir vos premières demandes ?"
        text="Inscription gratuite. Vous choisissez vos zones et vos types de débarras."
      >
        <Link to="/auth" search={{ mode: "signup", role: "pro" }} className={btnSoft}>
          Créer mon compte pro
        </Link>
        <Link to="/professionnels" className={btnWhite}>
          Voir le réseau de pros
        </Link>
      </CtaBand>
    </main>
  );
}
