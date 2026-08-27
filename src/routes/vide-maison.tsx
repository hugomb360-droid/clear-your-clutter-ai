import { createFileRoute } from "@tanstack/react-router";
import { ServiceLanding, serviceHead } from "@/components/seo/service-landing";

export const Route = createFileRoute("/vide-maison")({
  head: () =>
    serviceHead({
      path: "/vide-maison",
      title: "Vide-maison : organisation, prix et débarras du reste | Débarras France",
      description:
        "Vide-maison : comment l'organiser, ce que vous pouvez vendre, et comment faire évacuer tout l'invendu. Estimation du débarras en photo en 2 minutes, pros vérifiés.",
      serviceName: "Vide-maison et débarras complet",
      breadcrumb: "Vide-maison",
    }),
  component: () => (
    <ServiceLanding
      eyebrow="Vide-maison"
      h1="Vide-maison : vendez ce qui a de la valeur, faites débarrasser le reste"
      intro="Un vide-maison permet d'écouler une partie du mobilier, mais il reste presque toujours 10 à 40 m³ d'invendus à évacuer. Photographiez ce qui reste : notre IA calcule le volume et vous donne une fourchette de prix immédiate, puis des débarrasseurs vérifiés de votre secteur vous font une proposition."
      blocksTitle="Bien organiser son vide-maison"
      blocks={[
        {
          title: "Trier avant d'annoncer",
          text: "Séparez ce qui se revend (meubles en bon état, électroménager récent, outillage) de ce qui part en déchetterie. Photographier pièce par pièce vous aide à ne rien oublier.",
        },
        {
          title: "Fixer une date et prévenir",
          text: "Un vide-maison se déclare en mairie dans la plupart des communes lorsqu'il est ouvert au public. Prévoyez le stationnement et la sécurité des accès.",
        },
        {
          title: "Anticiper les invendus",
          text: "En moyenne, la moitié du mobilier ne trouve pas preneur. Programmez le débarras dans les jours qui suivent pour libérer le logement à temps.",
        },
        {
          title: "Faire évacuer et nettoyer",
          text: "Le débarras final inclut le démontage, l'évacuation, le tri en déchetterie et un balayage. Le logement est rendu vide, prêt pour la vente ou la location.",
        },
      ]}
      priceTitle="Combien coûte l'évacuation après un vide-maison"
      priceRows={[
        { label: "Invendus d'un appartement", volume: "8 à 15 m³", price: "600 – 1 200 €" },
        { label: "Invendus d'une maison", volume: "20 à 40 m³", price: "1 400 – 2 900 €" },
        { label: "Maison entière sans vide-maison", volume: "40 à 80 m³", price: "2 600 – 5 200 €" },
        { label: "Cave, grenier et dépendances seules", volume: "10 à 25 m³", price: "750 – 1 900 €" },
      ]}
      faqTitle="Questions fréquentes sur le vide-maison"
      faq={[
        {
          q: "Faut-il une autorisation pour un vide-maison ?",
          a: "Lorsqu'il est ouvert au public, un vide-maison relève des ventes au déballage : une déclaration en mairie est généralement demandée, dans la limite de deux ventes par an pour un particulier.",
        },
        {
          q: "Le débarras peut-il être déduit de la valeur des meubles ?",
          a: "Oui. Si les biens restants ont une valeur de revente, les débarrasseurs peuvent proposer une reprise qui vient diminuer le montant du devis, voire un débarras à coût réduit.",
        },
        {
          q: "En combien de temps le logement est-il vidé ?",
          a: "Comptez une demi-journée pour un appartement et une à deux journées pour une maison avec dépendances, selon le volume et l'accès.",
        },
      ]}
      ctaTitle="Il reste des invendus à évacuer ?"
      ctaText="Envoyez vos photos : volume en m³, fourchette de prix et propositions de débarrasseurs vérifiés près de chez vous."
    />
  ),
});
