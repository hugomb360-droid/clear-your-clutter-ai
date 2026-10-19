import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function SuccessionGuide() {
  return (
    <div className="mt-16 space-y-12">
      <section aria-labelledby="succession-preparation">
        <h2 id="succession-preparation" className="text-2xl font-bold">Vider une maison après un décès : par où commencer ?</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">Le débarras d'une succession ne consiste pas seulement à évacuer des meubles. Il faut distinguer les biens à conserver, ceux dont la destination doit être décidée avec les héritiers et ce qui peut être donné, revendu ou recyclé. Débarras France vous permet de transmettre ces consignes dans un dossier dédié, pour une maison comme pour un appartement.</p>
        <ol className="mt-5 list-decimal space-y-4 pl-6 text-muted-foreground">
          <li><strong className="text-foreground">Clarifier les autorisations.</strong> Avant d'enlever, de donner ou de vendre des biens, faites le point avec les héritiers et le notaire sur les accords et l'éventuel inventaire à réaliser. En cas de désaccord ou de doute sur la succession, attendez leurs instructions.</li>
          <li><strong className="text-foreground">Identifier ce qui doit rester.</strong> Regroupez les papiers, photos de famille, bijoux, collections et souvenirs. Précisez les objets de valeur à mettre de côté ; une photo peut aider le professionnel à les reconnaître, mais ne remplace pas une expertise de leur valeur.</li>
          <li><strong className="text-foreground">Photographier les espaces concernés.</strong> Ajoutez des vues des pièces, sans oublier cave, garage ou grenier si ces espaces font partie du débarras. Ces images accompagnent la demande de devis et constituent les photos avant du rapport.</li>
          <li><strong className="text-foreground">Préparer l'accès et l'échéance.</strong> Indiquez l'adresse du bien, la présence d'un héritier, les modalités de remise des clés et la date limite liée à une vente ou une fin de bail. La date effective reste à convenir avec le professionnel.</li>
        </ol>
        <p className="mt-5 text-sm text-muted-foreground">Repères officiels : <a href="https://www.notaires.fr/fr/article/linventaire-successoral-quand-comment" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">l'inventaire successoral, Notaires de France</a> et <a href="https://www.service-public.fr/particuliers/vosdroits/F1296" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">l'indivision entre héritiers, Service-Public</a>. Ces informations générales ne remplacent pas les conseils du notaire pour votre dossier.</p>
      </section>

      <section aria-labelledby="succession-budget">
        <h2 id="succession-budget" className="text-2xl font-bold">Combien coûte un débarras après succession ?</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">Le budget dépend d'abord du volume à évacuer en m³, et pas seulement de la surface du logement. Un appartement peu meublé et une maison avec plusieurs dépendances n'impliquent pas le même travail. Les étages, l'ascenseur, le portage jusqu'au camion, le tri demandé et les objets lourds influencent aussi la proposition du débarrasseur.</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">La revente de certains meubles peut réduire le coût si le professionnel accepte leur reprise et la chiffre dans son devis. Un débarras gratuit n'est donc pas automatique : demandez que le coût de l'intervention et la valeur de reprise soient clairement distingués. Le don du mobilier dépend de son état et des possibilités d'accueil des associations.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild variant="outline"><Link to="/prix-debarras">Comprendre le prix d'un débarras</Link></Button>
          <Button asChild variant="outline"><Link to="/vide-maison">Organiser un vide-maison</Link></Button>
        </div>
      </section>

      <section aria-labelledby="succession-distance">
        <h2 id="succession-distance" className="text-2xl font-bold">Organiser un débarras de succession à distance</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">Vous n'habitez pas près du bien ? Le formulaire distingue la présence d'un héritier sur place et la remise des clés à distance. Un proche ou une agence peut être le relais, selon l'organisation convenue avec le professionnel. Précisez qui remet les clés et comment les récupérer, les objets qui ne doivent pas partir et votre souhait de don ou de revente.</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">Le dossier est transmis aux professionnels couvrant le code postal du logement. Vous comparez leurs propositions avant d'en accepter une. Les disponibilités dépendent du secteur et des professionnels : prévoyez une marge avant une vente ou la restitution du logement, sans attendre le dernier jour.</p>
      </section>

      <section aria-labelledby="succession-notaire">
        <h2 id="succession-notaire" className="text-2xl font-bold">Un rapport PDF de fin de débarras pour le notaire</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">À la fin du chantier, le professionnel transmet ses photos et renseigne le volume évacué ainsi que les filières de recyclage, de don ou les destinations des biens. Le rapport téléchargeable rassemble les photos avant/après, l'identification du dossier et ces informations. Il indique si la fin du chantier est encore en attente de votre validation.</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">Vous pouvez transmettre ce PDF au notaire ou à la personne chargée du suivi du bien. Les volumes et destinations sont déclarés par le professionnel : ce document de suivi ne remplace ni un inventaire successoral, ni une expertise des objets, ni un bordereau réglementaire de déchets.</p>
        <div className="mt-5"><Button asChild variant="outline"><Link to="/partenaires-prescripteurs">Notaires et agences : devenir prescripteur</Link></Button></div>
      </section>
    </div>
  );
}