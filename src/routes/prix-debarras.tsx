import { createFileRoute } from "@tanstack/react-router";
import { ServiceLanding, serviceHead } from "@/components/seo/service-landing";
import prixHero from "@/assets/gallery-camion.jpg";

export const Route = createFileRoute("/prix-debarras")({
  head: () =>
    serviceHead({
      path: "/prix-debarras",
      title: "Combien coûte un débarras ? Prix au m³ et exemples 2026 | Débarras France",
      description:
        "Prix d'un débarras de maison, d'appartement ou de cave : tarif au m³, majorations d'étage, exemples chiffrés et astuces pour payer moins. Estimation gratuite en photo.",
      serviceName: "Prix d'un débarras",
      breadcrumb: "Prix d'un débarras",
    }),
  component: () => (
    <ServiceLanding
      eyebrow="Guide des prix"
      image={prixHero}
      imageAlt="Camion de débarras chargé de meubles et d'un matelas"
      h1="Combien coûte un débarras ? Prix au m³ et exemples concrets"
      intro="Le prix d'un débarras dépend surtout du volume à évacuer (en m³), de l'accès (étage, ascenseur, portage) et de la valeur de revente des objets. Voici comment le calculer, puis obtenez votre propre fourchette en photographiant simplement vos pièces."
      blocksTitle="Ce qui fait varier le prix d'un débarras"
      blocks={[
        {
          title: "Le volume en m³",
          text: "C'est le critère principal : plus il y a d'objets à évacuer, plus il faut de main-d'œuvre, de trajets et de frais de déchetterie. Notre IA mesure ce volume à partir de vos photos.",
        },
        {
          title: "L'accès au logement",
          text: "Un étage sans ascenseur, un long portage ou un stationnement difficile allongent le chantier et augmentent le tarif.",
        },
        {
          title: "Les objets lourds ou spéciaux",
          text: "Piano, électroménager, gravats ou produits dangereux demandent du matériel ou une filière de traitement spécifique.",
        },
        {
          title: "La valeur de revente",
          text: "Meubles anciens, objets de collection ou électroménager récent peuvent être repris par le débarrasseur et venir en déduction du prix, parfois jusqu'à un débarras gratuit.",
        },
      ]}
      priceTitle="Exemples de prix d'un débarras"
      priceRows={[
        { label: "Cave ou petit garage", volume: "≈ 6 m³", price: "580 – 790 €" },
        { label: "Studio ou T2", volume: "≈ 16 m³", price: "1 550 – 2 100 €" },
        { label: "Appartement T3/T4", volume: "20 à 30 m³", price: "2 000 – 3 900 €" },
        { label: "Maison entière", volume: "≈ 38 m³", price: "3 680 – 4 980 €" },
      ]}
      faqTitle="Questions fréquentes sur le prix d'un débarras"
      faq={[
        {
          q: "Un débarras peut-il être gratuit ?",
          a: "Oui, lorsque la valeur des objets revendables couvre le coût du chantier. C'est rare pour un logement entier ; le plus souvent, la reprise réduit simplement la facture.",
        },
        {
          q: "Comment éviter les frais cachés ?",
          a: "Exigez un prix basé sur le volume réel et payez via un tiers de confiance. Sur Débarras France, votre paiement reste bloqué jusqu'à ce que vous validiez la fin du chantier.",
        },
        {
          q: "Le débarras d'une succession est-il déductible ?",
          a: "Les frais engagés pour vider le logement d'un défunt peuvent, sous conditions, être pris en compte dans la succession. Demandez conseil à votre notaire et conservez la facture.",
        },
      ]}
      ctaTitle="Connaître le prix de votre débarras"
      ctaText="Envoyez quelques photos : volume en m³ et fourchette de prix en 2 minutes, gratuitement et sans engagement."
    />
  ),
});
