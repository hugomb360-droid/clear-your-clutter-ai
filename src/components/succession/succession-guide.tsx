import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import {
  Section,
  btnOutline,
  btnSm,
  btnOnDark,
  h2Class,
  onDarkMuted,
} from "@/components/site/page-kit";

export function SuccessionGuide() {
  return (
    <>
      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <h2 id="succession-preparation" className={`${h2Class} text-brand-ink`}>
              Vider une maison après un décès : par où commencer ?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Le débarras d'une succession ne consiste pas seulement à évacuer des meubles. Il faut
              distinguer les biens à conserver, ceux dont la destination doit être décidée avec les
              héritiers et ce qui peut être donné, revendu ou recyclé. Débarras France vous permet
              de transmettre ces consignes dans un dossier dédié, pour une maison comme pour un
              appartement.
            </p>
          </div>
          <div>
            <ol className="flex flex-col gap-4">
              {[
                [
                  "Clarifier les autorisations.",
                  "Avant d'enlever, de donner ou de vendre des biens, faites le point avec les héritiers et le notaire sur les accords et l'éventuel inventaire à réaliser. En cas de désaccord ou de doute sur la succession, attendez leurs instructions.",
                ],
                [
                  "Identifier ce qui doit rester.",
                  "Regroupez les papiers, photos de famille, bijoux, collections et souvenirs. Précisez les objets de valeur à mettre de côté ; une photo peut aider le professionnel à les reconnaître, mais ne remplace pas une expertise de leur valeur.",
                ],
                [
                  "Photographier les espaces concernés.",
                  "Ajoutez des vues des pièces, sans oublier cave, garage ou grenier si ces espaces font partie du débarras. Ces images accompagnent la demande de devis et constituent les photos avant du rapport.",
                ],
                [
                  "Préparer l'accès et l'échéance.",
                  "Indiquez l'adresse du bien, la présence d'un héritier, les modalités de remise des clés et la date limite liée à une vente ou une fin de bail. La date effective reste à convenir avec le professionnel.",
                ],
              ].map(([title, text], index) => (
                <li
                  key={title}
                  className="flex gap-5 rounded-[20px] border border-border bg-card p-6"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-base leading-relaxed text-muted-foreground">
                    <strong className="block text-lg text-brand-ink">{title}</strong>
                    {text}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Repères officiels :{" "}
              <a
                href="https://www.notaires.fr/fr/article/linventaire-successoral-quand-comment"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                l'inventaire successoral, Notaires de France
              </a>{" "}
              et{" "}
              <a
                href="https://www.service-public.fr/particuliers/vosdroits/F1296"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                l'indivision entre héritiers, Service-Public
              </a>
              . Ces informations générales ne remplacent pas les conseils du notaire pour votre
              dossier.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="tint">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 id="succession-budget" className={`${h2Class} text-brand-ink`}>
              Combien coûte un débarras après succession ?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Le budget dépend d'abord du volume à évacuer en m³, et pas seulement de la surface du
              logement. Un appartement peu meublé et une maison avec plusieurs dépendances
              n'impliquent pas le même travail. Les étages, l'ascenseur, le portage jusqu'au camion,
              le tri demandé et les objets lourds influencent aussi la proposition du débarrasseur.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              La revente de certains meubles peut réduire le coût si le professionnel accepte leur
              reprise et la chiffre dans son devis. Un débarras gratuit n'est donc pas automatique :
              demandez que le coût de l'intervention et la valeur de reprise soient clairement
              distingués. Le don du mobilier dépend de son état et des possibilités d'accueil des
              associations.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/prix-debarras" className={`${btnOutline} ${btnSm}`}>
                Comprendre le prix d'un débarras
              </Link>
              <Link to="/vide-maison" className={`${btnOutline} ${btnSm}`}>
                Organiser un vide-maison
              </Link>
            </div>
          </div>
          <div>
            <h2 id="succession-distance" className={`${h2Class} text-brand-ink`}>
              Organiser un débarras de succession à distance
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Vous n'habitez pas près du bien ? Le formulaire distingue la présence d'un héritier
              sur place et la remise des clés à distance. Un proche ou une agence peut être le
              relais, selon l'organisation convenue avec le professionnel. Précisez qui remet les
              clés et comment les récupérer, les objets qui ne doivent pas partir et votre souhait
              de don ou de revente.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Le dossier est transmis aux professionnels couvrant le code postal du logement. Vous
              comparez leurs propositions avant d'en accepter une. Les disponibilités dépendent du
              secteur et des professionnels : prévoyez une marge avant une vente ou la restitution
              du logement, sans attendre le dernier jour.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="dark">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div>
            <h2 id="succession-notaire" className={`${h2Class} text-white`}>
              Un rapport PDF de fin de débarras pour le notaire
            </h2>
            <p className={`mt-5 text-base leading-relaxed ${onDarkMuted}`}>
              À la fin du chantier, le professionnel transmet ses photos et renseigne le volume
              évacué ainsi que les filières de recyclage, de don ou les destinations des biens. Le
              rapport téléchargeable rassemble les photos avant/après, l'identification du dossier
              et ces informations. Il indique si la fin du chantier est encore en attente de votre
              validation.
            </p>
            <p className={`mt-4 text-base leading-relaxed ${onDarkMuted}`}>
              Vous pouvez transmettre ce PDF au notaire ou à la personne chargée du suivi du bien.
              Les volumes et destinations sont déclarés par le professionnel : ce document de suivi
              ne remplace ni un inventaire successoral, ni une expertise des objets, ni un bordereau
              réglementaire de déchets.
            </p>
            <Link to="/partenaires-prescripteurs" className={`${btnOnDark} ${btnSm} mt-7`}>
              Notaires et agences : devenir prescripteur
            </Link>
          </div>
          <div className="rounded-[22px] bg-white p-6 text-brand-ink shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft">
                <FileText className="size-6" aria-hidden="true" />
              </span>
              <span>
                <strong className="block">Rapport de fin de débarras</strong>
                <span className="text-sm text-muted-foreground">PDF téléchargeable</span>
              </span>
            </div>
            <ul className="mt-5 divide-y divide-border text-[15px]">
              {[
                "Photos avant / après",
                "Identification du dossier",
                "Volume évacué déclaré",
                "Filières : recyclage, don, destinations",
                "Statut de validation de la fin de chantier",
              ].map((item) => (
                <li key={item} className="py-2.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
