import { createFileRoute } from "@tanstack/react-router";
import { ServiceLanding } from "@/components/seo/service-landing";
import photoCamion from "@/assets/gallery-camion.jpg";
import photoAvant from "@/assets/avis-claire-avant.jpg";
import photoApres from "@/assets/avis-claire-apres.jpg";

const CANONICAL = "https://debarrasfrance.fr/debarras-maison";

export const Route = createFileRoute("/debarras-maison")({
  head: () => ({
    meta: [
      { title: "Débarras de maison : prix et estimation en photo | Débarras France" },
      {
        name: "description",
        content:
          "Estimez le prix du débarras de votre maison en photos : combles, garage, cave, jardin et gros volumes pris en compte. Pros vérifiés près de chez vous.",
      },
      { property: "og:title", content: "Débarras de maison : prix et estimation immédiate" },
      {
        property: "og:description",
        content:
          "Photos, volume en m³, prix indicatif et mise en relation avec des débarrasseurs vérifiés de votre secteur.",
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
          name: "Débarras de maison",
          serviceType: "Débarras de maison",
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
  component: HouseClearance,
});

function HouseClearance() {
  return (
    <ServiceLanding
      eyebrow="Débarras de maison"
      h1="Débarras de maison : le prix estimé en 2 minutes, en photos"
      intro="En maison, le volume à évacuer dépasse presque toujours celui d'un appartement : combles, cave, garage et dépendances s'ajoutent aux pièces de vie. Débarras France analyse vos photos, calcule le volume en m³, applique un tarif dégressif sur les gros volumes, puis transmet votre demande à des débarrasseurs vérifiés près de chez vous."
      image={photoCamion}
      imageAlt="Camion de débarras chargé de meubles devant une maison"
      stepsTitle="Comment se calcule le prix en maison"
      steps={[
        {
          title: "Photographiez la maison",
          text: "Pièces de vie, chambres, combles, garage, cave, dépendances et extérieur : plus les photos couvrent la maison, plus l'estimation est juste.",
        },
        {
          title: "Ajoutez les annexes",
          text: "Grenier, sous-sol, atelier, abri de jardin : ce sont souvent eux qui font grimper le volume total à évacuer.",
        },
        {
          title: "Recevez une fourchette de prix",
          text: "Volume estimé en m³, tarif dégressif sur les gros volumes et majorations d'accès s'affichent immédiatement.",
        },
        {
          title: "Comparez les pros de votre secteur",
          text: "Seuls les débarrasseurs intervenant sur votre code postal reçoivent la demande. Vos coordonnées ne partent qu'après votre accord.",
        },
      ]}
      blocksTitle="Volumes courants selon la maison"
      blocksLead="Ces ordres de grandeur sont indicatifs : l'estimation Débarras France affine le volume à partir de vos photos et de vos réponses."
      blocks={[
        {
          title: "Petite maison de plain-pied",
          text: "20 à 35 m³ en moyenne avec mobilier et cartons. Une journée d'intervention suffit généralement.",
        },
        {
          title: "Maison familiale avec garage",
          text: "35 à 60 m³ : garage, outillage, électroménager et mobilier de jardin s'ajoutent au volume intérieur.",
        },
        {
          title: "Maison après succession",
          text: "50 à 90 m³ combles et cave inclus. Le tri des objets valorisables peut réduire la facture finale.",
        },
        {
          title: "Maison très encombrée",
          text: "Accumulation importante ou insalubrité : volumes élevés, nettoyage et évacuations spécifiques à prévoir.",
        },
      ]}
      beforeAfter={{
        before: photoAvant,
        after: photoApres,
        beforeAlt: "Combles remplis de meubles, matelas et malles",
        afterAlt: "Les mêmes combles entièrement vidés",
        title: "Combles et annexes compris",
        text: "Les espaces qu'on oublie souvent sont vidés avec le reste de la maison : combles, cave, garage et dépendances.",
      }}
      notes={{
        title: "Combles, cave, garage et jardin",
        items: [
          {
            label: "Combles",
            text: "Accès par trappe ou escalier étroit, portage plus long, à signaler dès l'estimation.",
          },
          {
            label: "Cave et sous-sol",
            text: "Humidité, meubles dégradés et gros volumes de cartons à évacuer.",
          },
          {
            label: "Garage et atelier",
            text: "Outillage, pneus, peintures ou produits chimiques qui suivent des filières de tri spécifiques.",
          },
          {
            label: "Extérieur",
            text: "Abri de jardin, ferraille ou gravats : précisez-les, ils changent le volume et le mode d'évacuation.",
          },
        ],
      }}
      ctaTitle="Votre estimation de maison, tout de suite"
      ctaText="Gratuit, sans engagement, et vos coordonnées ne sont partagées qu'une fois que vous acceptez une proposition."
      ctaSecondary={{ to: "/debarras-appartement", label: "Débarras d'appartement" }}
    />
  );
}
