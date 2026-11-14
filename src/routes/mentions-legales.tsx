import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumb, wrap } from "@/components/site/page-kit";

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
      {
        property: "og:description",
        content: "Informations légales de la plateforme Débarras France.",
      },
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
    <main className="bg-[#F2FAF4] pb-20 pt-8 sm:pb-28">
      <div className={wrap}>
        <Breadcrumb items={[{ label: "Mentions légales" }]} />
        <h1 className="mt-6 text-[36px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[52px]">
          Mentions légales
        </h1>
        <div className="mt-10 max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
          <section className="rounded-[20px] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-brand-ink">Éditeur</h2>
            <p className="mt-3">
              Le site Débarras France est édité par l'auto-entreprise{" "}
              <strong className="text-brand-ink">Monsallut Barranger</strong>, SIREN 105 524 110,
              dont le siège est situé 27 rue Marcel Pointeau, 16000 Angoulême, France.
              <br />
              Contact :{" "}
              <a className="text-primary underline" href="mailto:clientclearo@gmail.com">
                clientclearo@gmail.com
              </a>{" "}
              —{" "}
              <a className="text-primary underline" href="tel:+33609957915">
                06 09 95 79 15
              </a>
              <br />
              Directeur de la publication : Monsallut Barranger.
            </p>
          </section>
          <section className="rounded-[20px] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-brand-ink">Rôle de la plateforme</h2>
            <p className="mt-3">
              Débarras France est un intermédiaire technique. Les prestations de débarras sont
              réalisées par des professionnels indépendants qui contractent directement avec le
              client. Les estimations affichées sont indicatives et ne constituent pas un devis
              contractuel tant qu'un professionnel n'a pas confirmé son offre.
            </p>
          </section>
          <section className="rounded-[20px] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-brand-ink">Données personnelles</h2>
            <p className="mt-3">
              Les photos et informations transmises servent uniquement à estimer le débarras et à
              mettre le client en relation avec des professionnels de sa zone. Les coordonnées
              précises (adresse, téléphone) ne sont communiquées au professionnel qu'après
              acceptation de sa proposition. Vous pouvez demander la suppression de vos données
              depuis la page contact.
            </p>
          </section>
          <section className="rounded-[20px] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-brand-ink">Propriété intellectuelle</h2>
            <p className="mt-3">
              L'ensemble des éléments du site (marque Débarras France, contenus, interface) est
              protégé. Toute reproduction sans autorisation est interdite.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
