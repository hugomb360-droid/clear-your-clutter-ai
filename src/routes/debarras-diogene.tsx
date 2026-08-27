import { createFileRoute } from "@tanstack/react-router";
import { ServiceLanding, serviceHead } from "@/components/seo/service-landing";

export const Route = createFileRoute("/debarras-diogene")({
  head: () =>
    serviceHead({
      path: "/debarras-diogene",
      title: "Débarras syndrome de Diogène : nettoyage extrême et prix | Débarras France",
      description:
        "Débarras et nettoyage d'un logement en syndrome de Diogène : intervention discrète, équipes équipées, désinfection. Estimation en photo et prix indicatif immédiat.",
      serviceName: "Débarras syndrome de Diogène et nettoyage extrême",
      breadcrumb: "Débarras Diogène",
    }),
  component: () => (
    <ServiceLanding
      eyebrow="Nettoyage extrême"
      h1="Débarras syndrome de Diogène : intervention discrète et complète"
      intro="Un logement en accumulation extrême demande des équipes équipées, un protocole d'hygiène et beaucoup de discrétion. Photographiez ce que vous pouvez : l'estimation prend en compte le volume, l'insalubrité et l'accès, puis seuls des professionnels formés à ce type de chantier reçoivent la demande."
      blocksTitle="Le déroulé d'une intervention Diogène"
      blocks={[
        {
          title: "Évaluation et protocole",
          text: "Volume, niveau d'insalubrité, présence de nuisibles et accès sont évalués avant l'intervention pour dimensionner l'équipe et les protections.",
        },
        {
          title: "Débarras intégral",
          text: "Évacuation de la totalité des encombrants, déchets et mobilier, avec tri en déchetterie et filières adaptées aux déchets spécifiques.",
        },
        {
          title: "Nettoyage et désinfection",
          text: "Nettoyage en profondeur, désinfection des surfaces et traitement des odeurs. Une désinsectisation peut être ajoutée si nécessaire.",
        },
        {
          title: "Discrétion garantie",
          text: "Véhicules non marqués sur demande, intervention en horaires choisis et rapport photo transmis uniquement à vous.",
        },
      ]}
      priceTitle="Prix d'un débarras Diogène"
      priceRows={[
        { label: "Studio ou T1 très encombré", volume: "10 à 20 m³", price: "1 200 – 2 400 €" },
        { label: "Appartement T3 en accumulation", volume: "25 à 40 m³", price: "2 600 – 4 800 €" },
        { label: "Maison en syndrome de Diogène", volume: "50 m³ et plus", price: "à partir de 5 500 €" },
        { label: "Désinfection / désinsectisation", volume: "Selon surface", price: "300 – 1 500 €" },
      ]}
      faqTitle="Questions fréquentes"
      faq={[
        {
          q: "L'intervention est-elle confidentielle ?",
          a: "Oui. Les équipes interviennent sans signalétique visible sur demande, et aucune information n'est communiquée au voisinage, à la copropriété ou au bailleur.",
        },
        {
          q: "Qui peut demander ce type de débarras ?",
          a: "L'occupant lui-même, un proche, un tuteur ou curateur, un bailleur ou un syndic dans le cadre d'une procédure d'insalubrité.",
        },
        {
          q: "Combien de temps dure le chantier ?",
          a: "D'une journée pour un petit logement à plusieurs jours pour une maison, en fonction du volume, de l'accès et du nettoyage requis.",
        },
      ]}
      ctaTitle="Faites estimer le chantier en toute discrétion"
      ctaText="Quelques photos suffisent pour obtenir un volume, une fourchette de prix et des professionnels habitués à ce type d'intervention."
    />
  ),
});
