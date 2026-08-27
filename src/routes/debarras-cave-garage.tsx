import { createFileRoute } from "@tanstack/react-router";
import { ServiceLanding, serviceHead } from "@/components/seo/service-landing";

export const Route = createFileRoute("/debarras-cave-garage")({
  head: () =>
    serviceHead({
      path: "/debarras-cave-garage",
      title: "Débarras de cave, garage et grenier : prix au m³ | Débarras France",
      description:
        "Débarras de cave, garage, grenier ou box : estimation en photo en 2 minutes, prix au m³, évacuation et tri en déchetterie par des professionnels vérifiés.",
      serviceName: "Débarras de cave, garage et grenier",
      breadcrumb: "Débarras cave et garage",
    }),
  component: () => (
    <ServiceLanding
      eyebrow="Cave, garage, grenier"
      h1="Débarras de cave, garage et grenier : prix au m³ en 2 minutes"
      intro="Ce sont les espaces les plus sous-estimés : une cave de 6 m² contient souvent 8 à 10 m³ d'encombrants. Photographiez l'espace tel qu'il est, notre IA calcule le volume réel et vous obtenez une fourchette de prix avant même la visite d'un professionnel."
      blocksTitle="Ce qui fait varier le prix"
      blocks={[
        {
          title: "Le volume réel, pas la surface",
          text: "Un débarras se facture au m³ évacué. Les cartons empilés jusqu'au plafond comptent bien plus que la surface au sol ne le laisse penser.",
        },
        {
          title: "La distance de portage",
          text: "Cave en sous-sol avec escalier étroit, box au bout d'un parking, grenier accessible par trappe : le portage représente une part importante du temps de chantier.",
        },
        {
          title: "La nature des déchets",
          text: "Gravats, pots de peinture, pneus, produits chimiques ou électroménager partent dans des filières spécifiques, avec un coût de traitement à part.",
        },
        {
          title: "La revalorisation",
          text: "Outillage, vélos, mobilier ou métaux récupérables peuvent être repris et venir réduire le montant final du devis.",
        },
      ]}
      priceTitle="Prix indicatifs par type d'espace"
      priceRows={[
        { label: "Cave de copropriété", volume: "4 à 10 m³", price: "300 – 780 €" },
        { label: "Garage ou box", volume: "10 à 20 m³", price: "700 – 1 500 €" },
        { label: "Grenier / combles", volume: "12 à 25 m³", price: "850 – 1 900 €" },
        { label: "Local ou atelier avec gravats", volume: "15 à 30 m³", price: "1 200 – 2 600 €" },
      ]}
      faqTitle="Questions fréquentes"
      faq={[
        {
          q: "Faut-il être présent le jour du débarras ?",
          a: "Non, à condition qu'un accès soit prévu : remise des clés, badge de parking ou présence du gardien. Un rapport photo de fin de chantier vous est envoyé.",
        },
        {
          q: "Les gravats sont-ils acceptés ?",
          a: "Oui, mais ils sont traités dans une filière distincte et facturés à part car les déchèteries professionnelles les tarifent au poids.",
        },
        {
          q: "Le sol est-il nettoyé après l'évacuation ?",
          a: "Un balayage est systématiquement inclus. Un nettoyage plus poussé ou une désinfection peuvent être ajoutés à la demande.",
        },
      ]}
      ctaTitle="Estimez votre cave ou votre garage maintenant"
      ctaText="Deux ou trois photos suffisent pour obtenir le volume en m³ et une fourchette de prix, sans engagement."
    />
  ),
});
