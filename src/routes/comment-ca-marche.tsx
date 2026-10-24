import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, CircleCheck, Lock, MessageSquareWarning, PencilLine } from "lucide-react";
import heroPhoto from "@/assets/gallery-equipe.jpg";
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
} from "@/components/site/page-kit";

export const Route = createFileRoute("/comment-ca-marche")({
  head: () => ({
    meta: [
      { title: "Comment ça marche — Débarras France débarras" },
      {
        name: "description",
        content:
          "Photos, estimation IA, devis et mise en relation avec un débarrasseur près de chez vous : découvrez les 4 étapes Débarras France.",
      },
      { property: "og:title", content: "Comment fonctionne Débarras France" },
      {
        property: "og:description",
        content: "Estimez votre débarras en photo et recevez des propositions de pros locaux.",
      },
      { property: "og:url", content: "https://debarrasfrance.fr/comment-ca-marche" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/comment-ca-marche" }],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    title: "1. Prenez vos photos",
    text: "Cave, garage, appartement complet : photographiez ce qu'il y a à débarrasser. 1 à 8 photos suffisent.",
  },
  {
    title: "2. L'IA estime le volume",
    text: "Notre IA identifie les objets, évalue le volume en m³ et applique la grille tarifaire Débarras France pour un prix immédiat.",
  },
  {
    title: "3. Vous validez votre demande",
    text: "Ajoutez l'étage, l'accès, la date souhaitée et votre code postal. Le devis est enregistré dans votre espace.",
  },
  {
    title: "4. Les pros du coin répondent",
    text: "Les débarrasseurs de votre zone envoient leur proposition. Vous comparez, vous acceptez, vos coordonnées ne sont partagées qu'à ce moment.",
  },
];

function HowItWorks() {
  return (
    <main>
      <PageHero
        crumbs={[{ label: "Comment ça marche" }]}
        title="Comment ça marche"
        subtitle="Un parcours de deux minutes, de la photo à la proposition"
        intro="Débarras France remplace les visites d'estimation et les appels sans réponse par un parcours de deux minutes."
        image={heroPhoto}
        imageAlt="Deux débarrasseurs évacuent cartons et fauteuil d'un appartement"
        actions={
          <>
            <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
              <Camera className="size-5" aria-hidden="true" />
              Lancer mon devis IA
            </Link>
            <Link to="/estimation" search={{ type: "manuel" }} className={btnOutline}>
              Devis classique
            </Link>
          </>
        }
      />

      <Section tone="tint">
        <SectionHeading
          title="Votre demande, en 4 étapes"
          lead="Gratuit et sans engagement tant que vous n'avez pas accepté une proposition."
        />
        <NumberedSteps steps={STEPS} />
      </Section>

      <Section>
        <SectionHeading
          title="Et après avoir accepté une proposition ?"
          lead="Le chantier se suit depuis votre espace client, jusqu'au paiement du professionnel."
        />
        <InfoGrid
          columns={3}
          items={[
            {
              icon: <Lock className="size-6" aria-hidden="true" />,
              title: "Paiement sous séquestre",
              text: "Vous payez en ligne via Stripe Connect. L'argent reste bloqué pendant toute la durée du chantier.",
            },
            {
              icon: <CircleCheck className="size-6" aria-hidden="true" />,
              title: "Vous validez la fin du chantier",
              text: "Le professionnel envoie ses photos de fin de chantier. Il n'est payé qu'après votre validation.",
            },
            {
              icon: <MessageSquareWarning className="size-6" aria-hidden="true" />,
              title: "Un litige si besoin",
              text: "Un problème ? Ouvrez un litige avec photos depuis votre espace : les fonds restent bloqués jusqu'à résolution.",
            },
          ]}
        />
      </Section>

      <CtaBand
        title="Pas de photo sous la main ?"
        text="Le formulaire déclaratif fonctionne aussi : décrivez le bien et le contenu, l'estimation reste gratuite et sans engagement."
      >
        <Link to="/estimation" search={{ type: "manuel" }} className={btnSoft}>
          <PencilLine className="size-5" aria-hidden="true" />
          Démarrer mon estimation
        </Link>
        <Link to="/tarifs" className={btnWhite}>
          Voir les tarifs
        </Link>
      </CtaBand>
    </main>
  );
}
