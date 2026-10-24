import { createFileRoute } from "@tanstack/react-router";
import { ServiceLanding, serviceHead } from "@/components/seo/service-landing";
import { SuccessionForm } from "@/components/succession/succession-form";
import { SuccessionGuide } from "@/components/succession/succession-guide";

export const Route = createFileRoute("/debarras-succession")({
  head: () =>
    serviceHead({
      path: "/debarras-succession",
      title: "Débarras succession : devis, prix et rapport notaire | Débarras France",
      description:
        "Débarras après succession de maison ou appartement : devis, objets à conserver, clés à distance et rapport PDF avant/après pour le notaire. Préparez votre dossier.",
      serviceName: "Débarras après succession",
      breadcrumb: "Débarras succession",
    }),
  component: () => (
    <>
      <ServiceLanding
        succession
        guide={<SuccessionGuide />}
        form={<SuccessionForm />}
        eyebrow="Succession"
        h1="Débarras après succession de maison et d'appartement"
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
            a: "Avant toute évacuation, donation ou vente, vérifiez avec les héritiers et le notaire les autorisations nécessaires et si un inventaire doit être établi. La démarche dépend du dossier : en cas de doute ou de désaccord, ne disposez pas des biens avant d'avoir obtenu leurs instructions.",
          },
          {
            q: "Puis-je organiser le débarras à distance ?",
            a: "Oui, selon l'organisation convenue avec le professionnel. Le dossier recueille les photos, les consignes et les modalités de remise des clés. Un proche ou une agence peut servir de relais ; le rapport PDF de fin de chantier permet ensuite de suivre le résultat à distance.",
          },
          {
            q: "Le débarras peut-il être gratuit ?",
            a: "Le coût peut être réduit, voire couvert, si la valeur de reprise proposée pour les biens compense l'intervention. Ce n'est pas garanti : seuls l'examen du mobilier et un devis détaillé permettent de le confirmer. La présence de meubles anciens ne suffit pas à assurer leur valeur de revente.",
          },
          {
            q: "Quel délai prévoir pour vider le logement avant une vente ?",
            a: "Indiquez votre date limite dans le dossier, puis faites confirmer la disponibilité et la durée du chantier par le professionnel. Le volume, l'accès, les dépendances et le tri influencent l'organisation. Aucun délai identique ne peut être garanti pour tous les logements.",
          },
          {
            q: "Que faire des meubles et objets de valeur après un décès ?",
            a: "Listez les objets à conserver avant le débarras et faites valider la destination des autres biens avec les personnes concernées par la succession. Vous pouvez demander un don ou une revente du mobilier. Les objets nécessitant une estimation de valeur doivent faire l'objet d'un avis adapté, distinct du devis de débarras.",
          },
          {
            q: "Que contient le rapport de débarras pour le notaire ?",
            a: "Le PDF contient les photos avant/après, le volume évacué et les filières ou destinations déclarées par le professionnel. Il précise le statut de validation de la fin de chantier. C'est un document de suivi, et non un inventaire successoral ou une expertise de valeur.",
          },
        ]}
        ctaTitle="Préparez votre dossier de succession"
        ctaText="Adresse, clés, objets à conserver et date limite : vos consignes accompagnent le chantier jusqu'au rapport final."
      />
    </>
  ),
});
