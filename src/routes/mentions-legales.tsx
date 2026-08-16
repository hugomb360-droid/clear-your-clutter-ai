import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Clearo" },
      {
        name: "description",
        content:
          "Éditeur, hébergement, données personnelles et rôle d'intermédiaire de la plateforme Clearo.",
      },
      { property: "og:title", content: "Mentions légales Clearo" },
      { property: "og:description", content: "Informations légales de la plateforme Clearo." },
    ],
  }),
  component: Legal,
});

function Legal() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight">Mentions légales</h1>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-bold text-foreground">Éditeur</h2>
          <p className="mt-2">
            Clearo — plateforme de mise en relation dans le domaine du débarras. Coordonnées
            complètes de la société à compléter avant la mise en ligne officielle.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-foreground">Rôle de la plateforme</h2>
          <p className="mt-2">
            Clearo est un intermédiaire technique. Les prestations de débarras sont réalisées par
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
            L'ensemble des éléments du site (marque Clearo, contenus, interface) est protégé. Toute
            reproduction sans autorisation est interdite.
          </p>
        </section>
      </div>
    </div>
  );
}
