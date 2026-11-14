import { createFileRoute, Link } from "@tanstack/react-router";
import { EDITOR, LegalPage } from "@/components/site/legal-page";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — Débarras France" },
      {
        name: "description",
        content:
          "Quelles données Débarras France collecte, pourquoi, combien de temps, qui y accède et comment exercer vos droits.",
      },
      { property: "og:title", content: "Politique de confidentialité — Débarras France" },
      { property: "og:url", content: "https://debarrasfrance.fr/confidentialite" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/confidentialite" }],
  }),
  component: Privacy,
});

function Privacy() {
  const B = EDITOR.brand;
  return (
    <LegalPage
      crumb="Confidentialité"
      title="Politique de confidentialité"
      updated="14 novembre 2026"
      intro={
        <p>
          Cette page explique quelles données personnelles {B} collecte lorsque vous utilisez le
          site, pourquoi, pendant combien de temps, qui peut y accéder et comment exercer vos
          droits, conformément au règlement général sur la protection des données (RGPD) et à la loi
          Informatique et Libertés.
        </p>
      }
      sections={[
        {
          id: "responsable",
          title: "Responsable du traitement",
          body: (
            <p>
              <strong>{EDITOR.name}</strong>, {EDITOR.form}, SIREN {EDITOR.siren}, {EDITOR.address}.
              Contact pour toute question relative à vos données :{" "}
              <a href={`mailto:${EDITOR.email}`}>{EDITOR.email}</a>.
            </p>
          ),
        },
        {
          id: "donnees",
          title: "Données collectées",
          body: (
            <>
              <h3>Si vous êtes client</h3>
              <ul>
                <li>
                  Compte : adresse e-mail, mot de passe (chiffré), ou identifiant de votre compte
                  Google.
                </li>
                <li>
                  Demande : photos du lieu à débarrasser, type de bien, surface, étage, accès,
                  précisions, code postal et ville, adresse exacte, nom, téléphone, date souhaitée.
                </li>
                <li>
                  Dossier succession : en plus, modalités de remise des clés, objets à conserver,
                  échéance et motif, confirmation de l'accord des héritiers.
                </li>
                <li>
                  Paiement : montant, statut et identifiants de transaction transmis par Stripe. {B}{" "}
                  ne reçoit jamais votre numéro de carte.
                </li>
                <li>
                  Suivi : propositions reçues, acceptation, validation de fin de chantier, litiges,
                  avis.
                </li>
              </ul>
              <h3>Si vous êtes professionnel</h3>
              <ul>
                <li>
                  Compte : e-mail, mot de passe (chiffré) ou compte Google, nom du responsable,
                  téléphone.
                </li>
                <li>
                  Entreprise : raison sociale, SIRET, attestation d'assurance, zones d'intervention,
                  types de débarras, description, logo et photos de chantiers que vous publiez.
                </li>
                <li>
                  Versements : coordonnées bancaires collectées directement par Stripe pour créer
                  votre compte de versement ; {B} n'y a pas accès.
                </li>
                <li>
                  Activité : propositions, chantiers, photos de fin de chantier, notifications, avis
                  reçus.
                </li>
              </ul>
              <h3>Pour tous</h3>
              <ul>
                <li>
                  Données techniques strictement nécessaires : journaux de connexion, adresse IP,
                  type de navigateur, jeton de session.
                </li>
                <li>Messages que vous nous envoyez (contact, partenariat prescripteur).</li>
              </ul>
            </>
          ),
        },
        {
          id: "finalites",
          title: "Pourquoi nous les utilisons",
          body: (
            <ul>
              <li>
                <strong>Fournir le service</strong> (exécution du contrat) : estimer votre débarras,
                publier votre demande, la transmettre aux professionnels de votre secteur, gérer les
                propositions, le paiement, le chantier, les litiges et les avis.
              </li>
              <li>
                <strong>Vérifier les professionnels</strong> (intérêt légitime et obligation de
                loyauté de la plateforme) : contrôle du SIRET et de l'assurance avant activation du
                badge.
              </li>
              <li>
                <strong>Vous notifier</strong> (exécution du contrat) : e-mails et, pour les
                professionnels qui l'activent, notifications dans le navigateur ou sur mobile lors
                d'une nouvelle demande ou d'une proposition acceptée.
              </li>
              <li>
                <strong>Sécuriser le service et prévenir la fraude</strong> (intérêt légitime).
              </li>
              <li>
                <strong>Respecter nos obligations légales</strong> : comptabilité, facturation,
                conservation des preuves de transaction, réponses aux autorités.
              </li>
              <li>
                <strong>Répondre à vos messages</strong> (intérêt légitime ou mesures
                précontractuelles).
              </li>
            </ul>
          ),
        },
        {
          id: "photos",
          title: "Analyse des photos par intelligence artificielle",
          body: (
            <>
              <p>
                Lorsque vous choisissez le devis rapide par IA, vos photos et les informations
                déclarées sont transmises à un modèle d'analyse d'images via une passerelle
                technique opérée par notre hébergeur, afin d'estimer le volume et la nature des
                objets. Le résultat (volume, catégories, niveau de confiance) est enregistré avec
                votre demande. Les photos ne servent pas à entraîner ces modèles de notre fait.
              </p>
              <p>
                Évitez de photographier des personnes, des documents lisibles ou des objets révélant
                des informations sensibles. Vous pouvez à tout moment préférer le devis classique,
                qui n'utilise pas l'analyse automatique.
              </p>
            </>
          ),
        },
        {
          id: "destinataires",
          title: "Qui a accès à vos données",
          body: (
            <>
              <ul>
                <li>
                  <strong>Les professionnels de votre secteur</strong> voient votre demande (photos,
                  description, volume estimé, étage, accès, commune) pour y répondre.{" "}
                  <strong>
                    Votre adresse exacte et votre téléphone ne sont transmis qu'au professionnel
                    dont vous acceptez la proposition.
                  </strong>{" "}
                  Il s'engage à ne les utiliser que pour le chantier.
                </li>
                <li>
                  <strong>Les clients</strong> voient le profil public des professionnels (raison
                  sociale, zones, description, photos, avis anonymisés, badge de vérification).
                </li>
                <li>
                  <strong>Notre équipe</strong>, pour la vérification des professionnels,
                  l'assistance et l'arbitrage des litiges.
                </li>
              </ul>
              <h3>Nos sous-traitants techniques</h3>
              <ul>
                <li>
                  <strong>Lovable</strong> : hébergement du site, authentification, passerelle
                  d'analyse des photos.
                </li>
                <li>
                  <strong>Supabase</strong> : base de données et stockage des fichiers (photos,
                  justificatifs, rapports).
                </li>
                <li>
                  <strong>Stripe</strong> (Stripe Payments Europe Ltd, Irlande) : paiement en ligne,
                  conservation des fonds jusqu'à validation et versement aux professionnels.
                </li>
                <li>
                  <strong>Google</strong> : connexion avec un compte Google si vous la choisissez,
                  et service de notifications (Firebase) pour les professionnels qui les activent.
                </li>
              </ul>
              <p>
                Certains de ces prestataires peuvent traiter des données en dehors de l'Union
                européenne ; ces transferts sont encadrés par les garanties prévues par le RGPD
                (clauses contractuelles types, décisions d'adéquation). Nous ne vendons ni ne louons
                vos données.
              </p>
            </>
          ),
        },
        {
          id: "durees",
          title: "Combien de temps nous les conservons",
          body: (
            <ul>
              <li>
                Compte et profil : pendant la durée d'utilisation, puis 3 ans après la dernière
                activité.
              </li>
              <li>
                Demandes, photos et propositions : 3 ans après la clôture de la demande, sauf litige
                en cours.
              </li>
              <li>
                Justificatifs des professionnels (SIRET, assurance) : durée de l'inscription, puis 5
                ans.
              </li>
              <li>
                Données de paiement et factures : 10 ans (obligation comptable), chez Stripe et dans
                notre comptabilité.
              </li>
              <li>Litiges : 5 ans après leur clôture.</li>
              <li>Journaux techniques : 12 mois.</li>
              <li>Messages de contact : 3 ans.</li>
            </ul>
          ),
        },
        {
          id: "droits",
          title: "Vos droits",
          body: (
            <>
              <p>
                Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation,
                d'opposition et de portabilité de vos données, ainsi que du droit de définir des
                directives sur leur sort après votre décès. Lorsque le traitement repose sur votre
                consentement (notifications), vous pouvez le retirer à tout moment.
              </p>
              <p>
                Pour exercer ces droits, écrivez à{" "}
                <a href={`mailto:${EDITOR.email}`}>{EDITOR.email}</a> ou à {EDITOR.address}, en
                précisant l'adresse e-mail de votre compte. Nous répondons dans un délai d'un mois.
                Vous pouvez aussi supprimer votre compte depuis votre espace ou via la{" "}
                <Link to="/contact">page contact</Link>.
              </p>
              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL (
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
                  cnil.fr
                </a>
                ).
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies et stockage local",
          body: (
            <p>
              Le site n'utilise que des cookies et stockages techniques indispensables : maintien de
              votre session de connexion, enregistrement temporaire du brouillon de votre demande
              dans votre navigateur, préférence de notifications. Ils ne nécessitent pas de
              consentement. Aucun cookie publicitaire, de réseau social ou de mesure d'audience
              tiers n'est déposé. Si cela change, un bandeau de choix sera mis en place.
            </p>
          ),
        },
        {
          id: "securite",
          title: "Sécurité",
          body: (
            <p>
              Les échanges avec le site sont chiffrés (HTTPS). L'accès aux données est restreint
              selon le rôle de chaque utilisateur : un professionnel n'accède qu'aux demandes de ses
              zones et aux coordonnées des clients qui l'ont retenu ; les justificatifs et photos
              sont stockés dans des espaces privés accessibles par liens temporaires. Les mots de
              passe sont chiffrés et jamais lisibles par notre équipe.
            </p>
          ),
        },
        {
          id: "modifications",
          title: "Modifications",
          body: (
            <p>
              Cette politique peut être mise à jour pour suivre l'évolution du service ou de la
              réglementation. La date en haut de page indique la dernière version ; en cas de
              changement important, nous vous en informons par e-mail ou sur le site.
            </p>
          ),
        },
      ]}
    />
  );
}
