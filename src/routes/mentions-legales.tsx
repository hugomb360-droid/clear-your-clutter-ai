import { createFileRoute, Link } from "@tanstack/react-router";
import { EDITOR, LegalPage } from "@/components/site/legal-page";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Débarras France" },
      {
        name: "description",
        content:
          "Éditeur, hébergeur, rôle de la plateforme, médiation de la consommation et propriété intellectuelle du site Débarras France.",
      },
      { property: "og:title", content: "Mentions légales — Débarras France" },
      { property: "og:url", content: "https://debarrasfrance.fr/mentions-legales" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/mentions-legales" }],
  }),
  component: Legal,
});

function Legal() {
  return (
    <LegalPage
      crumb="Mentions légales"
      title="Mentions légales"
      updated="14 novembre 2026"
      sections={[
        {
          id: "editeur",
          title: "Éditeur du site",
          body: (
            <>
              <p>
                Le site {EDITOR.brand} ({EDITOR.site}) est édité par <strong>{EDITOR.name}</strong>,{" "}
                {EDITOR.form}, immatriculée sous le numéro SIREN {EDITOR.siren}, dont le siège est
                situé {EDITOR.address}.
              </p>
              <p>
                Téléphone : <a href={EDITOR.phoneHref}>{EDITOR.phone}</a>
                <br />
                Courriel : <a href={`mailto:${EDITOR.email}`}>{EDITOR.email}</a>
                <br />
                Directeur de la publication : {EDITOR.name}.
              </p>
              <p>TVA non applicable, article 293 B du Code général des impôts.</p>
            </>
          ),
        },
        {
          id: "hebergeur",
          title: "Hébergement",
          body: (
            <>
              <p>
                L'hébergement du site est assuré par <strong>Lovable (Lovable, Inc.)</strong>, dont
                la plateforme est accessible à l'adresse{" "}
                <a href="https://lovable.app" target="_blank" rel="noopener noreferrer">
                  https://lovable.app
                </a>
                .
              </p>
              <p>
                L'infrastructure de déploiement et la distribution du site sont assurées par les
                services cloud de Lovable, hébergés au sein de l'Union européenne et des États-Unis
                selon les régions de point de présence. Le prestataire de paiement est Stripe (voir
                la <Link to="/confidentialite">politique de confidentialité</Link>).
              </p>
            </>
          ),
        },
        {
          id: "plateforme",
          title: "Rôle de la plateforme",
          body: (
            <>
              <p>
                {EDITOR.brand} est un <strong>opérateur de plateforme en ligne</strong> au sens de
                l'article L111-7 du Code de la consommation : il met en relation des personnes
                souhaitant faire débarrasser un lieu (« clients ») et des professionnels
                indépendants du débarras (« professionnels »).
              </p>
              <p>
                {EDITOR.brand} n'est pas le prestataire du débarras. Le contrat de prestation est
                conclu directement entre le client et le professionnel qu'il choisit. Les
                estimations affichées sont indicatives et ne constituent pas un devis contractuel
                tant qu'un professionnel n'a pas confirmé son offre.
              </p>
              <h3>Référencement et classement des professionnels</h3>
              <ul>
                <li>
                  Un professionnel est référencé après création d'un compte, renseignement de son
                  numéro SIRET, de son attestation d'assurance et de ses zones d'intervention, puis
                  validation par notre équipe. Le référencement est gratuit.
                </li>
                <li>
                  Dans l'annuaire public, les professionnels sont classés par note moyenne des avis
                  clients, puis par nombre d'avis, puis par nombre de chantiers confirmés. Les
                  professionnels sans avis sont affichés sans classement. Aucune rémunération
                  n'influence cet ordre.
                </li>
                <li>
                  Lorsqu'un client reçoit des propositions, elles lui sont présentées avec le prix,
                  la date et le profil de chaque professionnel ; le client choisit librement.
                </li>
                <li>
                  {EDITOR.brand} se rémunère par une commission prélevée sur le professionnel lors
                  du versement du prix du chantier (voir les{" "}
                  <Link to="/conditions-generales">conditions générales</Link>). Le service est
                  gratuit pour le client.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "mediation",
          title: "Médiation de la consommation",
          body: (
            <>
              <p>
                Conformément aux articles L612-1 et suivants du Code de la consommation, tout client
                consommateur a le droit de recourir gratuitement à un médiateur de la consommation
                en vue de la résolution amiable d'un litige l'opposant à {EDITOR.brand}, après avoir
                tenté de le résoudre directement auprès de nous par écrit à {EDITOR.email}.
              </p>
              <p>
                Médiateur désigné : <strong>en cours de désignation</strong>. Ses coordonnées seront
                publiées sur cette page dès l'adhésion effective. Vous pouvez également utiliser la
                plateforme européenne de règlement en ligne des litiges :{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ec.europa.eu/consumers/odr
                </a>
                .
              </p>
            </>
          ),
        },
        {
          id: "donnees",
          title: "Données personnelles et cookies",
          body: (
            <p>
              Le traitement de vos données est décrit dans la{" "}
              <Link to="/confidentialite">politique de confidentialité</Link>. Le site n'utilise que
              des cookies et stockages techniques nécessaires à son fonctionnement (session de
              connexion, brouillon de demande) ; aucun cookie publicitaire ni outil de mesure
              d'audience tiers n'est déposé.
            </p>
          ),
        },
        {
          id: "propriete",
          title: "Propriété intellectuelle",
          body: (
            <p>
              L'ensemble des éléments du site (nom {EDITOR.brand}, logo, textes, interface,
              illustrations, code) est protégé par le droit de la propriété intellectuelle. Toute
              reproduction ou représentation, totale ou partielle, sans autorisation écrite
              préalable est interdite. Les photographies transmises par les utilisateurs restent
              leur propriété ; ils accordent à {EDITOR.brand} et aux professionnels concernés le
              droit de les utiliser pour les seuls besoins de l'estimation, de la mise en relation
              et du suivi du chantier.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Nous contacter",
          body: (
            <p>
              Pour toute question : <a href={`mailto:${EDITOR.email}`}>{EDITOR.email}</a>,{" "}
              <a href={EDITOR.phoneHref}>{EDITOR.phone}</a>, ou par courrier à {EDITOR.address}.
              Voir aussi la <Link to="/contact">page contact</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
