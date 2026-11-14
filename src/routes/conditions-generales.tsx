import { createFileRoute, Link } from "@tanstack/react-router";
import { EDITOR, LegalPage } from "@/components/site/legal-page";
import { CLEARO_COMMISSION_RATE } from "@/lib/pro-dashboard";
import { PRICING, euro } from "@/lib/pricing";

export const Route = createFileRoute("/conditions-generales")({
  head: () => ({
    meta: [
      { title: "Conditions générales d'utilisation et de vente — Débarras France" },
      {
        name: "description",
        content:
          "Règles d'utilisation de la plateforme Débarras France : estimation, demandes, propositions des professionnels, paiement bloqué, rétractation, annulation, litiges et commission.",
      },
      { property: "og:title", content: "Conditions générales — Débarras France" },
      { property: "og:url", content: "https://debarrasfrance.fr/conditions-generales" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/conditions-generales" }],
  }),
  component: Terms,
});

const pct = (rate: number) => `${Math.round(rate * 100)} %`;

function Terms() {
  const B = EDITOR.brand;
  return (
    <LegalPage
      crumb="Conditions générales"
      title="Conditions générales d'utilisation et de vente"
      updated="14 novembre 2026"
      intro={
        <p>
          Ces conditions s'appliquent à toute personne qui utilise {B}, qu'elle demande un débarras
          (« client ») ou qu'elle le réalise (« professionnel »). En créant un compte, en envoyant
          une demande ou en répondant à une demande, vous les acceptez. Lisez en particulier les
          articles 6 (paiement), 8 (droit de rétractation) et 10 (fin de chantier et litiges).
        </p>
      }
      sections={[
        {
          id: "definitions",
          title: "Définitions",
          body: (
            <ul>
              <li>
                <strong>Plateforme</strong> : le site {EDITOR.site} et ses services, édités par{" "}
                {EDITOR.name} ({EDITOR.form}, SIREN {EDITOR.siren}, {EDITOR.address}), ci-après «{" "}
                {B} » ou « nous ».
              </li>
              <li>
                <strong>Client</strong> : toute personne, particulier ou professionnel, qui publie
                une demande de débarras sur la plateforme.
              </li>
              <li>
                <strong>Professionnel</strong> : toute entreprise de débarras, identifiée par un
                numéro SIRET, inscrite sur la plateforme pour recevoir des demandes et proposer ses
                services.
              </li>
              <li>
                <strong>Demande</strong> : la description d'un débarras (photos, type de bien,
                accès, lieu, date souhaitée) publiée par un client.
              </li>
              <li>
                <strong>Proposition</strong> : l'offre de prix et de date qu'un professionnel
                adresse en réponse à une demande.
              </li>
              <li>
                <strong>Chantier</strong> : la prestation de débarras convenue entre un client et un
                professionnel à la suite de l'acceptation d'une proposition.
              </li>
              <li>
                <strong>Consommateur</strong> : un client personne physique agissant à des fins qui
                n'entrent pas dans le cadre de son activité professionnelle.
              </li>
            </ul>
          ),
        },
        {
          id: "objet",
          title: "Objet et rôle de la plateforme",
          body: (
            <>
              <p>
                {B} est un service d'intermédiation : il permet à un client d'obtenir une estimation
                indicative du prix de son débarras, de publier sa demande, de recevoir et de
                comparer des propositions de professionnels, de payer en ligne et de suivre le
                chantier jusqu'à sa validation.
              </p>
              <p>
                <strong>{B} n'est pas le prestataire du débarras.</strong> Le contrat de prestation
                est conclu directement entre le client et le professionnel dont la proposition est
                acceptée. Le professionnel est seul responsable de l'exécution du chantier, de son
                personnel, de son matériel, de ses assurances et du traitement des déchets
                conformément à la réglementation.
              </p>
              <p>
                Le service est gratuit pour le client. {B} se rémunère par une commission prélevée
                sur le professionnel (article 7).
              </p>
            </>
          ),
        },
        {
          id: "compte",
          title: "Création de compte",
          body: (
            <>
              <p>
                Un compte est nécessaire pour envoyer une demande, répondre à une demande ou payer.
                Il se crée avec une adresse e-mail et un mot de passe, ou via un compte Google. Vous
                vous engagez à fournir des informations exactes, à les tenir à jour et à garder vos
                identifiants confidentiels. Vous êtes responsable de toute action réalisée depuis
                votre compte.
              </p>
              <h3>Compte professionnel</h3>
              <p>
                Pour recevoir des demandes, un professionnel renseigne sa raison sociale, son numéro
                SIRET, son attestation d'assurance responsabilité civile professionnelle en cours de
                validité, ses zones d'intervention (codes postaux) et ses types de débarras. Notre
                équipe vérifie ces éléments avant d'activer le badge « SIRET et assurance vérifiés
                ». Toute modification des justificatifs suspend le badge jusqu'à nouvelle
                vérification. Le professionnel garantit être en règle de ses obligations fiscales,
                sociales et réglementaires, et informer {B} sans délai de tout changement
                (cessation, perte d'assurance, procédure collective).
              </p>
              <p>
                Vous devez avoir 18 ans révolus et la capacité juridique de contracter pour utiliser
                la plateforme.
              </p>
            </>
          ),
        },
        {
          id: "estimation",
          title: "Estimation du prix",
          body: (
            <>
              <p>
                À partir des photos et des informations transmises (type de bien, surface, étage,
                ascenseur, accès), la plateforme calcule une estimation du volume à évacuer et une
                fourchette de prix. Le calcul repose sur une grille publique :{" "}
                {euro(PRICING.pricePerM3)} par mètre cube, un minimum de{" "}
                {euro(PRICING.minimumPrice)} par chantier, une majoration de{" "}
                {pct(PRICING.floorSurchargeRate)} par étage sans ascenseur (plafonnée à{" "}
                {pct(PRICING.maxFloorSurcharge)}), de {pct(PRICING.bulkySurchargeRate)} pour les
                objets lourds ou volumineux et de {pct(PRICING.hardAccessSurchargeRate)} en cas
                d'accès difficile, la fourchette encadrant ce total à plus ou moins{" "}
                {pct(PRICING.spreadRate)}. Un parcours déclaratif sans analyse de photos donne une
                estimation selon la surface et l'encombrement déclarés.
              </p>
              <p>
                <strong>L'estimation est indicative.</strong> Elle est produite automatiquement, à
                partir d'images, et peut s'écarter du volume réel. Elle n'engage ni {B} ni les
                professionnels. Seule la proposition acceptée fixe le prix du chantier.
              </p>
            </>
          ),
        },
        {
          id: "demandes",
          title: "Demandes et propositions",
          body: (
            <>
              <h3>Publication de la demande</h3>
              <p>
                Le client décrit son débarras et indique le code postal du lieu, une date souhaitée
                et ses coordonnées. La demande (photos, description, volume estimé, étage, accès,
                commune) est transmise aux professionnels inscrits qui couvrent ce code postal.{" "}
                <strong>
                  L'adresse exacte et le numéro de téléphone ne sont communiqués qu'au professionnel
                  dont la proposition est acceptée.
                </strong>
              </p>
              <p>
                Le client garantit avoir le droit de faire débarrasser le lieu et les biens
                concernés (propriétaire, locataire autorisé, héritier mandaté, mandataire). Les
                photos ne doivent pas représenter de personnes identifiables ni de documents
                confidentiels lisibles.
              </p>
              <h3>Propositions</h3>
              <p>
                Chaque professionnel fixe librement son prix et sa date. L'estimation de {B} n'est
                qu'un repère. La proposition est ferme pour le périmètre décrit dans la demande ;
                elle est valable jusqu'à son retrait par le professionnel ou jusqu'à ce que le
                client en accepte une autre. Le client peut comparer plusieurs propositions et n'en
                accepter qu'une par demande.
              </p>
              <p>
                Les utilisateurs s'engagent à ne pas conclure en dehors de la plateforme un chantier
                dont la mise en relation est issue de {B}. Un professionnel qui contourne la
                plateforme pour échapper à la commission peut être suspendu définitivement.
              </p>
            </>
          ),
        },
        {
          id: "paiement",
          title: "Acceptation, prix et paiement",
          body: (
            <>
              <p>
                L'acceptation d'une proposition par le client, suivie du paiement en ligne, forme le
                contrat de prestation entre le client et le professionnel aux conditions de la
                proposition et des présentes.
              </p>
              <p>
                <strong>Le prix est payé en totalité en ligne au moment de l'acceptation</strong>,
                par carte bancaire via notre prestataire de paiement Stripe. {B} ne voit ni ne
                conserve les données de carte. Les fonds sont conservés par le prestataire de
                paiement et ne sont versés au professionnel qu'après la validation de la fin du
                chantier par le client ou, en cas de litige, après la décision prévue à l'article
                10. Aucun paiement direct au professionnel (acompte, espèces, virement) n'est dû ni
                ne doit être demandé. Un professionnel qui réclame un paiement hors plateforme
                s'expose à la suspension de son compte ; le client est invité à nous le signaler.
              </p>
              <p>
                Le prix est ferme pour le périmètre convenu. Si, le jour du chantier, le périmètre
                réel diffère sensiblement de la demande (pièces non déclarées, volume très
                supérieur, accès non signalé), le professionnel peut proposer un complément ; il
                n'est dû que s'il est accepté par le client sur la plateforme avant exécution. À
                défaut d'accord, chacune des parties peut renoncer au chantier et le client est
                remboursé, sous réserve de l'article 9.
              </p>
              <p>
                Les prix sont exprimés toutes taxes comprises. Le professionnel émet la facture de
                la prestation au client ; {B} émet au professionnel la facture de sa commission.
              </p>
            </>
          ),
        },
        {
          id: "commission",
          title: "Commission et offre de lancement",
          body: (
            <>
              <p>
                {B} prélève sur le professionnel une commission de{" "}
                <strong>
                  {pct(CLEARO_COMMISSION_RATE)} du montant TTC de la proposition acceptée
                </strong>
                , déduite automatiquement lors du versement du prix après validation du chantier. Le
                professionnel reçoit le solde sur le compte de versement qu'il a renseigné. Aucune
                commission n'est due si le chantier est annulé et le client remboursé.
              </p>
              <p>
                <strong>Offre de lancement :</strong> les 20 premiers professionnels inscrits et
                validés bénéficient d'une commission de 0 % sur leurs 5 premiers chantiers validés.
                L'offre est personnelle, non cessible, et son décompte est visible dans l'espace
                professionnel.
              </p>
              <p>
                Le référencement, la réception des demandes et l'envoi de propositions sont
                gratuits. {B}
                peut faire évoluer le taux de commission avec un préavis de 30 jours notifié aux
                professionnels ; le nouveau taux ne s'applique qu'aux propositions acceptées après
                son entrée en vigueur.
              </p>
            </>
          ),
        },
        {
          id: "retractation",
          title: "Droit de rétractation (clients consommateurs)",
          body: (
            <>
              <p>
                Le client consommateur dispose d'un délai de <strong>14 jours</strong> à compter de
                l'acceptation de la proposition pour se rétracter sans motif, conformément aux
                articles L221-18 et suivants du Code de la consommation. Il suffit de nous le
                notifier par écrit (<a href={`mailto:${EDITOR.email}`}>{EDITOR.email}</a>) ou depuis
                son espace client ; le formulaire type figure à la fin de cet article. Le
                remboursement intervient dans les 14 jours suivant la notification, par le même
                moyen de paiement.
              </p>
              <p>
                <strong>Chantier avant la fin du délai.</strong> Si le client souhaite que le
                débarras ait lieu avant l'expiration des 14 jours, il en fait la demande expresse
                lors du paiement en cochant la case prévue à cet effet. Il reconnaît alors qu'après
                exécution complète du chantier, il perd son droit de rétractation (article L221-28,
                1°), et qu'en cas de rétractation après un début d'exécution, il doit le prix
                correspondant à la part exécutée.
              </p>
              <p>
                Les professionnels et les clients agissant dans le cadre de leur activité n'ont pas
                de droit de rétractation.
              </p>
              <h3>Formulaire de rétractation</h3>
              <p>
                À l'attention de {EDITOR.name}, {EDITOR.address}, {EDITOR.email} : « Je vous notifie
                par la présente ma rétractation du contrat portant sur la prestation de débarras
                acceptée le [date], demande n° [référence], nom du client, adresse, signature (si
                papier), date. »
              </p>
            </>
          ),
        },
        {
          id: "annulation",
          title: "Annulation et report",
          body: (
            <>
              <p>Hors exercice du droit de rétractation, les règles suivantes s'appliquent :</p>
              <ul>
                <li>
                  <strong>Annulation par le client plus de 48 heures</strong> avant la date convenue
                  : remboursement intégral.
                </li>
                <li>
                  <strong>Annulation par le client moins de 48 heures</strong> avant la date
                  convenue, ou impossibilité d'accéder au lieu le jour du chantier du fait du client
                  : le professionnel peut demander une indemnité couvrant ses frais engagés, dans la
                  limite de 20 % du prix ; {B} arbitre sur justificatifs et rembourse le solde au
                  client.
                </li>
                <li>
                  <strong>Annulation par le professionnel</strong> : remboursement intégral du
                  client dans les 14 jours, et le client peut accepter une autre proposition. Des
                  annulations répétées entraînent la suspension du professionnel.
                </li>
                <li>
                  <strong>Report</strong> : une nouvelle date peut être convenue d'un commun accord
                  sur la plateforme, sans frais.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "chantier",
          title: "Exécution, fin de chantier et litiges",
          body: (
            <>
              <h3>Exécution</h3>
              <p>
                Le professionnel réalise le chantier conformément à la proposition : évacuation,
                tri, balayage, et orientation des biens et déchets vers des filières autorisées
                (don, réemploi, recyclage, déchèterie). Il respecte les consignes de conservation
                données par le client. Le client assure l'accès au lieu à la date convenue
                (présence, remise des clés, stationnement, réservation d'ascenseur le cas échéant).
              </p>
              <h3>Fin de chantier et validation</h3>
              <p>
                À la fin du chantier, le professionnel déclare son achèvement sur la plateforme et y
                dépose des photos. Le client dispose de <strong>7 jours</strong> pour valider la fin
                du chantier ou signaler un problème. La validation déclenche le versement au
                professionnel, commission déduite. À défaut de validation ou de signalement dans ce
                délai, et après un rappel, {B} peut libérer les fonds au professionnel.
              </p>
              <h3>Litiges entre client et professionnel</h3>
              <p>
                En cas de chantier non réalisé, incomplet ou non conforme, le client ouvre un litige
                depuis son espace, avec photos et explications. Les fonds restent bloqués. {B}{" "}
                examine les éléments des deux parties et s'efforce de rendre une décision sous 48
                heures ouvrées : versement au professionnel, remboursement total ou partiel du
                client, ou reprise du chantier. Cette décision règle la libération des fonds détenus
                via la plateforme ; elle ne prive aucune partie de ses recours de droit commun
                contre l'autre.
              </p>
              <h3>Rapport de fin de chantier</h3>
              <p>
                Pour les dossiers de succession, un rapport PDF rassemble les photos avant/après et
                les informations déclarées par le professionnel (volume évacué, destinations). C'est
                un document de suivi, qui ne vaut ni inventaire successoral, ni expertise, ni
                bordereau réglementaire de déchets.
              </p>
            </>
          ),
        },
        {
          id: "avis",
          title: "Avis",
          body: (
            <p>
              Après un chantier validé, le client peut laisser une note et un commentaire sur le
              professionnel. Seuls les clients ayant payé un chantier sur la plateforme peuvent
              déposer un avis, ce qui en garantit l'authenticité ; les avis sont publiés sans
              contrepartie et ne sont pas modifiés sur le fond. {B} peut retirer un avis
              manifestement injurieux, hors sujet ou contraire à la loi, et en informe son auteur.
              Les avis sont affichés de manière anonymisée sur les profils publics.
            </p>
          ),
        },
        {
          id: "obligations",
          title: "Obligations et comportements interdits",
          body: (
            <ul>
              <li>Fournir des informations exactes et ne pas usurper l'identité d'un tiers.</li>
              <li>
                Ne pas publier de demandes fictives, d'avis de complaisance, ni de contenus
                illicites.
              </li>
              <li>
                Ne pas solliciter ni accepter de paiement en dehors de la plateforme pour un
                chantier issu de {B}.
              </li>
              <li>
                Pour les professionnels : ne pas sous-traiter un chantier sans l'accord du client,
                et respecter la réglementation applicable au transport et au traitement des déchets.
              </li>
              <li>
                Ne pas tenter d'accéder aux données d'autres utilisateurs ni de perturber le
                fonctionnement du service.
              </li>
            </ul>
          ),
        },
        {
          id: "responsabilite",
          title: "Responsabilité",
          body: (
            <>
              <p>
                {B} met en œuvre des moyens raisonnables pour assurer la disponibilité et la
                sécurité du service, vérifier les justificatifs des professionnels et traiter les
                litiges avec impartialité. {B} ne garantit pas qu'une demande reçoive des
                propositions, ni le résultat des chantiers, qui relèvent de la seule responsabilité
                des professionnels.
              </p>
              <p>
                La responsabilité de {B} ne peut être engagée pour les dommages causés par un
                professionnel ou un client, pour l'inexactitude des informations fournies par les
                utilisateurs, ni pour les indisponibilités dues à la maintenance, aux prestataires
                techniques ou à un cas de force majeure. Lorsqu'elle est engagée, elle est limitée,
                pour les professionnels, au montant des commissions perçues au titre du chantier
                concerné. Ces limitations ne s'appliquent pas aux consommateurs dans la mesure où la
                loi l'interdit.
              </p>
            </>
          ),
        },
        {
          id: "suspension",
          title: "Suspension, résiliation et modification",
          body: (
            <>
              <p>
                Vous pouvez fermer votre compte à tout moment depuis votre espace ou en nous
                écrivant, sous réserve des chantiers en cours. {B} peut suspendre ou fermer un
                compte en cas de manquement aux présentes, après notification et possibilité de
                répondre, sauf urgence (fraude, mise en danger, paiement hors plateforme).
              </p>
              <p>
                {B} peut modifier les présentes conditions. Les utilisateurs sont informés par
                e-mail ou sur la plateforme au moins 15 jours avant l'entrée en vigueur des
                nouvelles conditions, qui ne s'appliquent pas aux chantiers déjà acceptés.
              </p>
            </>
          ),
        },
        {
          id: "donnees",
          title: "Données personnelles",
          body: (
            <p>
              Les traitements de données réalisés par {B} sont décrits dans la{" "}
              <Link to="/confidentialite">politique de confidentialité</Link>. Chaque professionnel
              est responsable des données du client qu'il reçoit (adresse, téléphone, photos) et
              s'engage à ne les utiliser que pour le chantier concerné puis à les supprimer.
            </p>
          ),
        },
        {
          id: "droit",
          title: "Droit applicable et médiation",
          body: (
            <>
              <p>
                Les présentes sont soumises au droit français. En cas de réclamation, écrivez-nous
                d'abord à <a href={`mailto:${EDITOR.email}`}>{EDITOR.email}</a>. Le client
                consommateur peut ensuite recourir gratuitement au médiateur de la consommation
                indiqué dans les <Link to="/mentions-legales">mentions légales</Link>, ou à la
                plateforme européenne de règlement en ligne des litiges. À défaut d'accord amiable,
                les tribunaux français sont compétents ; le consommateur peut saisir la juridiction
                de son domicile.
              </p>
              <p>
                Pour les professionnels, tout litige relatif aux présentes relève des tribunaux du
                ressort du siège de {EDITOR.name}.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
