import { createFileRoute } from "@tanstack/react-router";
import { ServiceLanding } from "@/components/seo/service-landing";
import photoAvant from "@/assets/gallery-avant.jpg";
import photoApres from "@/assets/gallery-apres.jpg";
import photoEquipe from "@/assets/gallery-equipe.jpg";

const CANONICAL = "https://debarrasfrance.fr/debarras-appartement";

export const Route = createFileRoute("/debarras-appartement")({
  head: () => ({
    meta: [
      { title: "Débarras d'appartement : prix et estimation en 2 min | Débarras France" },
      {
        name: "description",
        content:
          "Estimez le prix du débarras de votre appartement en photos grâce à l'IA Débarras France : volume, étage, ascenseur et accès pris en compte. Pros vérifiés près de chez vous.",
      },
      { property: "og:title", content: "Débarras d'appartement : prix et estimation immédiate" },
      {
        property: "og:description",
        content:
          "Photos, volume estimé, prix indicatif et mise en relation avec des débarrasseurs vérifiés dans votre ville.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Débarras d'appartement",
          serviceType: "Débarras d'appartement",
          areaServed: "France",
          provider: {
            "@type": "Organization",
            name: "Débarras France",
            url: "https://debarrasfrance.fr",
          },
          url: CANONICAL,
        }),
      },
    ],
  }),
  component: ApartmentClearance,
});

function ApartmentClearance() {
  return (
    <ServiceLanding
      eyebrow="Débarras d'appartement"
      h1="Débarras d'appartement : le prix estimé en 2 minutes, en photos"
      intro="En appartement, le prix d'un débarras dépend surtout du volume à évacuer, de l'étage et de l'ascenseur. Débarras France analyse vos photos, calcule le volume en m³, applique les contraintes d'accès, puis transmet votre demande à des débarrasseurs vérifiés de votre secteur."
      image={photoEquipe}
      imageAlt="Deux débarrasseurs évacuent cartons et fauteuil d'un appartement"
      stepsTitle="Comment se calcule le prix en appartement"
      steps={[
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
      ]}
      blocksTitle="Volumes courants selon le logement"
      blocksLead="Ces ordres de grandeur sont indicatifs : l'estimation Débarras France affine le volume à partir de vos photos et de vos réponses."
      blocks={[
        {
          title: "Studio ou T1",
          text: "Environ 8 à 15 m³ selon l'encombrement. Souvent réalisable en une demi-journée, à un ou deux intervenants.",
        },
        {
          title: "T2 / T3 meublé",
          text: "15 à 30 m³ avec mobilier, électroménager et cartons. L'étage sans ascenseur allonge nettement la manutention.",
        },
        {
          title: "Appartement complet après succession",
          text: "25 à 45 m³ : cave, placards et combles inclus. Le tri des objets valorisables peut réduire la facture.",
        },
        {
          title: "Logement très encombré",
          text: "Accumulation importante ou syndrome de Diogène : volumes élevés, nettoyage et désinfection à prévoir.",
        },
      ]}
      beforeAfter={{
        before: photoAvant,
        after: photoApres,
        beforeAlt: "Appartement encombré avant le débarras",
        afterAlt: "Le même appartement vidé et nettoyé",
        title: "Un appartement rendu vide, prêt à être remis",
        text: "Mobilier, cartons et électroménager évacués, tri vers le don, le réemploi ou la déchetterie, et un balayage avant la remise des clés.",
      }}
      notes={{
        title: "Étage, ascenseur et stationnement",
        items: [
          {
            label: "Avec ascenseur",
            text: "Majoration limitée, le volume reste le facteur principal du prix.",
          },
          {
            label: "Sans ascenseur",
            text: "Chaque étage ajoute du temps de portage, donc une majoration progressive.",
          },
          {
            label: "Accès très contraint",
            text: "Rue étroite, stationnement éloigné, monte-meubles nécessaire : à signaler dès l'estimation.",
          },
          {
            label: "Copropriété",
            text: "Pensez à réserver l'ascenseur ou une place devant l'immeuble le jour de l'intervention.",
          },
        ],
      }}
      ctaTitle="Votre estimation d'appartement, tout de suite"
      ctaText="Gratuit, sans engagement, et vos coordonnées ne sont partagées qu'une fois que vous acceptez une proposition."
    />
  );
}
