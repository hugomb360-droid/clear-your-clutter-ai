import { Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import type { ReactNode } from "react";
import successionPhoto from "@/assets/gallery-apres.jpg";
import {
  BeforeAfter,
  CityLinks,
  CtaBand,
  FaqList,
  InfoGrid,
  NumberedSteps,
  PageHero,
  PriceTable,
  Section,
  SectionHeading,
  btnOutline,
  btnPrimary,
  btnSm,
  btnSoft,
  btnWhite,
  h2Class,
  leadClass,
  onDarkAccent,
  onDarkMuted,
} from "@/components/site/page-kit";

export interface ServiceBlock {
  title: string;
  text: string;
}

export interface ServiceLandingProps {
  succession?: boolean;
  guide?: ReactNode;
  /** Formulaire affiché après le guide (dossier succession). */
  form?: ReactNode;
  eyebrow: string;
  h1: string;
  intro: string;
  /** Photo de l'en-tête de page. */
  image?: string;
  imageAlt?: string;
  /** Étapes propres à la page ; sinon les étapes génériques de l'estimation. */
  stepsTitle?: string;
  steps?: { title: string; text: string }[];
  blocksTitle: string;
  blocksLead?: string;
  blocks: ServiceBlock[];
  /** Encadré de conseils pratiques (accès, annexes…). */
  notes?: { title: string; items: { label: string; text: string }[] };
  beforeAfter?: {
    before: string;
    after: string;
    beforeAlt: string;
    afterAlt: string;
    title: string;
    text: string;
  };
  priceTitle?: string;
  priceRows?: { label: string; volume: string; price: string }[];
  faqTitle?: string;
  faq?: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
  ctaSecondary?: { to: string; label: string };
}

const defaultSteps = [
  {
    title: "Photographiez",
    text: "Quelques photos par pièce suffisent : notre IA identifie les objets et calcule le volume à évacuer en m³.",
  },
  {
    title: "Précisez l'accès",
    text: "Type de bien, étage, ascenseur, distance de portage : ces éléments pèsent réellement sur le tarif final.",
  },
  {
    title: "Prix immédiat",
    text: "Vous obtenez une fourchette de prix en moins de 2 minutes, sans visite préalable ni engagement.",
  },
  {
    title: "Pros vérifiés",
    text: "Seuls les débarrasseurs couvrant votre code postal reçoivent la demande. Paiement sécurisé via Stripe Connect et bloqué jusqu'à la fin du chantier.",
  },
];

const successionSteps = [
  {
    title: "Votre dossier",
    text: "Adresse, photos du logement, objets à conserver et échéance de vente ou de fin de bail.",
  },
  {
    title: "Les propositions",
    text: "Les professionnels de votre secteur établissent un devis adapté au bien et aux consignes.",
  },
  {
    title: "Le débarras",
    text: "Présence d'un héritier ou remise des clés à distance : l'intervention suit votre organisation.",
  },
  {
    title: "Le rapport final",
    text: "Photos avant/après, volumes évacués et destinations déclarées par le professionnel dans un PDF pour le notaire.",
  },
];

export function ServiceLanding(props: ServiceLandingProps) {
  const steps = props.steps ?? (props.succession ? successionSteps : defaultSteps);
  const image = props.image ?? (props.succession ? successionPhoto : undefined);

  const primaryAction = props.succession ? (
    <a href="#dossier-succession" className={btnPrimary}>
      Ouvrir mon dossier succession
    </a>
  ) : (
    <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
      <Camera className="size-5" aria-hidden="true" />
      Lancer mon devis IA
    </Link>
  );

  return (
    <main>
      <PageHero
        crumbs={[{ label: props.eyebrow }]}
        title={props.h1}
        intro={props.intro}
        image={image}
        imageAlt={props.imageAlt ?? ""}
        actions={
          <>
            {primaryAction}
            <Link to="/tarifs" className={btnOutline}>
              Voir la grille tarifaire
            </Link>
          </>
        }
        note="Gratuit et sans engagement. Propositions des pros sous 48 h."
      />

      <Section tone="tint">
        <SectionHeading
          title={props.stepsTitle ?? "Comment ça marche"}
          lead={
            props.succession
              ? "Un dossier unique suit le débarras, de vos consignes jusqu'au rapport de fin de chantier."
              : "De vos photos à la proposition du pro, tout se suit depuis votre espace client."
          }
        />
        <NumberedSteps steps={steps} />
      </Section>

      <Section>
        <SectionHeading title={props.blocksTitle} lead={props.blocksLead} />
        <InfoGrid items={props.blocks} columns={props.blocks.length >= 4 ? 4 : 2} />
      </Section>

      {props.beforeAfter && (
        <Section tone="tint">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <h2 className={`${h2Class} text-brand-ink`}>{props.beforeAfter.title}</h2>
              <p className={`${leadClass} text-muted-foreground`}>{props.beforeAfter.text}</p>
              <Link to="/estimation" search={{ type: "photo" }} className={`${btnPrimary} mt-7`}>
                Estimer avec mes photos
              </Link>
            </div>
            <BeforeAfter {...props.beforeAfter} />
          </div>
        </Section>
      )}

      {props.notes && (
        <Section tone="dark">
          <h2 className={`${h2Class} text-white`}>{props.notes.title}</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {props.notes.items.map((note) => (
              <li key={note.label} className="rounded-[18px] bg-[#134A2B] px-6 py-5">
                <strong className={`text-lg ${onDarkAccent}`}>{note.label}</strong>
                <p className={`mt-1.5 text-base leading-relaxed ${onDarkMuted}`}>{note.text}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {props.priceRows && props.priceRows.length > 0 && (
        <Section tone={props.notes ? "tint" : props.beforeAfter ? "white" : "tint"}>
          <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div>
              <h2 className={`${h2Class} text-brand-ink`}>{props.priceTitle}</h2>
              <p className={`${leadClass} text-muted-foreground`}>
                {props.succession
                  ? "Exemples de budgets indicatifs, sans garantie de tarif. Le professionnel établit le devis définitif selon le volume, l'accès, le tri et les éventuels biens repris."
                  : "Fourchettes indicatives constatées sur la plateforme. Le prix définitif dépend du volume réel, de l'accès et du secteur ; votre estimation en photo affiche votre fourchette personnalisée."}
              </p>
              <Link to="/tarifs" className={`${btnOutline} ${btnSm} mt-7`}>
                Voir la grille complète
              </Link>
            </div>
            <PriceTable rows={props.priceRows} />
          </div>
        </Section>
      )}

      {props.guide}

      {props.form}

      {props.faq && props.faq.length > 0 && (
        <Section>
          <SectionHeading title={props.faqTitle ?? "Questions fréquentes"} />
          <FaqList items={props.faq} />
        </Section>
      )}

      <Section tone={props.faq ? "tint" : "white"}>
        <CityLinks
          title={
            props.succession
              ? "Débarras de succession : trouver un professionnel par ville"
              : "Nos villes les plus demandées"
          }
        />
      </Section>

      <CtaBand title={props.ctaTitle} text={props.ctaText}>
        {props.succession ? (
          <a href="#dossier-succession" className={btnSoft}>
            Organiser le débarras de succession
          </a>
        ) : (
          <Link to="/estimation" search={{ type: "photo" }} className={btnSoft}>
            <Camera className="size-5" aria-hidden="true" />
            Démarrer mon estimation
          </Link>
        )}
        {props.ctaSecondary && (
          <Link to={props.ctaSecondary.to} className={btnWhite}>
            {props.ctaSecondary.label}
          </Link>
        )}
      </CtaBand>
    </main>
  );
}

export function serviceHead(opts: {
  path: string;
  title: string;
  description: string;
  serviceName: string;
  breadcrumb: string;
}) {
  const canonical = `https://debarrasfrance.fr${opts.path}`;
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: opts.serviceName,
          serviceType: opts.serviceName,
          areaServed: "France",
          provider: {
            "@type": "Organization",
            name: "Débarras France",
            url: "https://debarrasfrance.fr",
          },
          url: canonical,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Accueil",
              item: "https://debarrasfrance.fr",
            },
            { "@type": "ListItem", position: 2, name: opts.breadcrumb, item: canonical },
          ],
        }),
      },
    ],
  };
}
