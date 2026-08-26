import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Débarras France" },
      {
        name: "description",
        content:
          "Éditeur, hébergement, données personnelles et rôle d'intermédiaire de la plateforme Débarras France.",
      },
      { property: "og:title", content: "Mentions légales Débarras France" },
      { property: "og:description", content: "Informations légales de la plateforme Débarras France." },
      { property: "og:url", content: "https://debarrasfrance.fr/mentions-legales" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/mentions-legales" }],

  }),
  component: Legal,
});

function Legal() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-extrabold sm:text-4xl tracking-tight">Mentions légales</h1>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground">Éditeur</h2>
          <p className="mt-2">
            Le site Débarras France est édité par l'auto-entreprise <strong>Monsallut Barranger</strong>,
            SIREN 105 524 110, dont le siège est situé 27 rue Marcel Pointeau, 16000 Angoulême,
            France.
            <br />
            Contact : <a className="underline" href="mailto:clientclearo@gmail.com">clientclearo@gmail.com</a>{" "}
            — <a className="underline" href="tel:+33609957915">06 09 95 79 15</a>
            <br />
            Directeur de la publication : Monsallut Barranger.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground">Rôle de la plateforme</h2>
          <p className="mt-2">
            Débarras France est un intermédiaire technique. Les prestations de débarras sont réalisées par
            des professionnels indépendants qui contractent directement avec le client. Les
            estimations affichées sont indicatives et ne constituent pas un devis contractuel tant
            qu'un professionnel n'a pas confirmé son offre.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground">Données personnelles</h2>
          <p className="mt-2">
            Les photos et informations transmises servent uniquement à estimer le débarras et à
            mettre le client en relation avec des professionnels de sa zone. Les coordonnées
            précises (adresse, téléphone) ne sont communiquées au professionnel qu'après acceptation
            de sa proposition. Vous pouvez demander la suppression de vos données depuis la page
            contact.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground">Propriété intellectuelle</h2>
          <p className="mt-2">
            L'ensemble des éléments du site (marque Débarras France, contenus, interface) est protégé. Toute
            reproduction sans autorisation est interdite.
          </p>
        </section>
      </div>
    </div>
  );
}
