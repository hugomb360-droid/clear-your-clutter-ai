import { createFileRoute } from "@tanstack/react-router";
import { ServiceLanding, serviceHead } from "@/components/seo/service-landing";
import { SuccessionForm } from "@/components/succession/succession-form";

export const Route = createFileRoute("/debarras-succession")({
  head: () =>
    serviceHead({
      path: "/debarras-succession",
      title: "Débarras après succession : prix, démarches et délais | Débarras France",
      description:
          "Organisez un débarras après succession : consignes pour les héritiers, clés à distance, don ou revente, date limite et rapport PDF avant/après destiné au notaire.",
      serviceName: "Débarras après succession",
      breadcrumb: "Débarras succession",
    }),
  component: () => (
    <>
    <ServiceLanding
      succession
      eyebrow="Succession"
      h1="Débarras après succession : un logement vidé sans vous déplacer"
       intro="Vider le logement d'un proche mérite une organisation attentive. Transmettez les photos, les consignes de conservation et votre échéance : les professionnels de votre secteur vous proposent un devis. À la fin du chantier, retrouvez un rapport PDF pour le notaire."
      blocksTitle="Ce que couvre un débarras de succession"
      blocks={[
        {
          title: "Tri et mise de côté",
          text: "Papiers, photos, bijoux et souvenirs sont mis de côté avant toute évacuation. Vous indiquez à l'avance ce qui doit être conservé ou remis à un notaire.",
        },
        {
          title: "Valorisation des biens",
          text: "Meubles anciens, vaisselle, outillage : lorsque des biens ont une valeur de revente, leur reprise peut réduire le montant du devis.",
        },
        {
          title: "Évacuation complète",
          text: "Logement, cave, grenier, garage et dépendances sont vidés, avec tri en déchetterie et filières de recyclage.",
        },
        {
          title: "Remise en état légère",
          text: "Balayage et nettoyage sommaire pour restituer le bien au notaire, à l'agence ou au bailleur.",
        },
      ]}
      priceTitle="Prix d'un débarras de succession"
      priceRows={[
        { label: "Studio ou T1", volume: "6 à 12 m³", price: "450 – 950 €" },
        { label: "Appartement T3", volume: "15 à 25 m³", price: "1 100 – 1 900 €" },
        { label: "Maison avec cave et grenier", volume: "35 à 60 m³", price: "2 300 – 4 200 €" },
        { label: "Maison très encombrée", volume: "60 m³ et plus", price: "à partir de 4 500 €" },
      ]}
      faqTitle="Questions fréquentes sur le débarras de succession"
      faq={[
        {
          q: "Peut-on débarrasser avant la fin de la succession ?",
          a: "L'accord de l'ensemble des héritiers est nécessaire. Une fois cet accord obtenu, le débarras peut être réalisé même si la succession n'est pas encore clôturée chez le notaire.",
        },
        {
          q: "Puis-je organiser le débarras à distance ?",
          a: "Oui. L'estimation se fait en photo, et un proche, un voisin ou l'agence peut remettre les clés le jour de l'intervention. Un rapport photo de fin de chantier vous est transmis.",
        },
        {
          q: "Le débarras peut-il être gratuit ?",
          a: "Il peut être fortement réduit, voire nul, lorsque la valeur des biens repris couvre le coût de la main-d'œuvre et de l'évacuation. C'est rare sur les logements standards, plus courant en présence de mobilier ancien.",
        },
      ]}
       ctaTitle="Préparez votre dossier de succession"
       ctaText="Adresse, clés, objets à conserver et date limite : vos consignes accompagnent le chantier jusqu'au rapport final."
    />
    <SuccessionForm />
    </>
  ),
});
