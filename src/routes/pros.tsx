import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Euro, Target, Truck } from "lucide-react";
import heroPhoto from "@/assets/gallery-camion.jpg";
import { useAuth } from "@/hooks/useAuth";
import {
  Breadcrumb,
  CtaBand,
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
import { CLEARO_COMMISSION_RATE } from "@/lib/pro-dashboard";

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
    icon: Target,
    title: "Des demandes qualifiées",
    text: "Photos, volume estimé en m³, étage et accès : vous savez à quoi vous engager avant de répondre.",
  },
  {
    icon: Euro,
    title: "Vous fixez votre prix",
    text: "L'estimation Débarras France sert de repère, votre proposition reste la vôtre.",
  },
  {
    icon: Truck,
    title: "Vos zones, vos règles",
    text: "Renseignez vos codes postaux et vos types de débarras : vous ne recevez que ce qui vous concerne.",
  },
  {
    icon: BadgeCheck,
    title: "Badge pro vérifié",
    text: "SIRET et assurance contrôlés : les clients choisissent en confiance.",
  },
];

const STEPS = [
  "Créez votre compte pro et renseignez vos zones d'intervention.",
  "Consultez les demandes publiées dans vos codes postaux.",
  "Envoyez votre prix et votre date ; les coordonnées arrivent dès l'acceptation.",
];

function ProsLanding() {
  const { user, isPro } = useAuth();

  const secondary = isPro ? (
    <Link to="/pro/dashboard" className={btnOnDark}>
      Accéder à mon espace pro
    </Link>
  ) : user ? (
    <Link to="/compte" className={btnOnDark}>
      Accéder à mon espace client
    </Link>
  ) : (
    <Link to="/auth" search={{ mode: "signin", role: "pro" }} className={btnOnDark}>
      Se connecter
    </Link>
  );

  return (
    <main>
      {/* Page de recrutement : photo plein cadre, texte par-dessus */}
      <section className="relative isolate overflow-hidden bg-brand-ink text-white">
        <img src={heroPhoto} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-ink via-brand-ink/90 to-brand-ink/40"
          aria-hidden="true"
        />
        <div className={`${wrap} pb-16 pt-6 sm:pb-24`}>
          <Breadcrumb items={[{ label: "Devenir débarrasseur partenaire" }]} dark />
          <p className="mt-10 text-lg font-bold text-[#6EDC97]">Espace professionnels</p>
          <h1 className="mt-2 max-w-[16ch] text-[34px] font-black leading-[1.02] tracking-[-0.03em] sm:text-[51px]">
            Remplissez vos camions avec des missions de débarras près de chez vous
          </h1>
          <p className={`mt-6 max-w-[34em] text-[17px] leading-relaxed ${onDarkMuted}`}>
            Débarras France estime le volume et le budget avant de vous transmettre la demande. Vous
            répondez, le client choisit.
          </p>
          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
            <Link to="/auth" search={{ mode: "signup", role: "pro" }} className={btnPrimary}>
              Créer mon compte pro
            </Link>
            {secondary}
          </div>
        </div>
      </section>

      {/* L'offre fondateur, en très grand */}
      <section className="bg-brand-soft py-14 sm:py-20">
        <div className={`${wrap} grid items-center gap-8 lg:grid-cols-[auto_1fr]`}>
          <p
            className="text-[77px] font-black leading-none tracking-[-0.05em] text-brand-ink sm:text-[112px]"
            aria-hidden="true"
          >
            0 %
          </p>
          <div>
            <h2 className={`${h2Class} text-brand-ink`}>Offre fondateur</h2>
            <p className="mt-3 max-w-[40em] text-[17px] leading-relaxed text-[#34433A]">
              Pour les 20 premiers pros inscrits :{" "}
              <strong className="text-brand-ink">
                0 % de commission Débarras France sur vos 5 premiers chantiers
              </strong>
              . Vous encaissez 100 % du montant. Ensuite, la commission est de{" "}
              {Math.round(CLEARO_COMMISSION_RATE * 100)} % par chantier, prélevée uniquement quand
              vous êtes payé.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading title="Pourquoi rejoindre le réseau" />
        <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title} className="flex gap-5">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-ink text-[#6EDC97]">
                <benefit.icon className="size-7" aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-xl font-extrabold text-brand-ink">
                  {benefit.title}
                </strong>
                <span className="mt-1.5 block text-base leading-relaxed text-muted-foreground">
                  {benefit.text}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <h2 className={`${h2Class} text-white`}>Comment ça se passe</h2>
          <ol className="flex flex-col gap-6">
            {STEPS.map((step, index) => (
              <li key={step} className="flex items-start gap-5 border-l-2 border-[#6EDC97] pl-6">
                <span
                  className={`text-[34px] font-black leading-none tabular-nums ${onDarkAccent}`}
                >
                  {index + 1}
                </span>
                <span className="pt-2 text-[17px] leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
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
