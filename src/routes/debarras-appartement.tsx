import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Camera, Clock, Euro, MoveVertical, ShieldCheck } from "lucide-react";

const CANONICAL = "https://debarrasfrance.fr/debarras-appartement";

export const Route = createFileRoute("/debarras-appartement")({
  head: () => ({
    meta: [
      { title: "Débarras d'appartement : prix et estimation en 2 min | Débarras France" },
      {
        name: "description",
        content:
          "Estimez le prix du débarras de votre appartement en photos grâce à l'IA Débarras France : volume, étage, ascenseur et accès pris en compte. Pros vérifiés près de chez vous.",
      },
      { property: "og:title", content: "Débarras d'appartement : prix et estimation immédiate" },
      {
        property: "og:description",
        content:
          "Photos, volume estimé, prix indicatif et mise en relation avec des débarrasseurs vérifiés dans votre ville.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Débarras d'appartement",
          serviceType: "Débarras d'appartement",
          areaServed: "France",
          provider: {
            "@type": "Organization",
            name: "Débarras France",
            url: "https://debarrasfrance.fr",
          },
          url: CANONICAL,
        }),
      },
    ],
  }),
  component: ApartmentClearance,
});

const steps = [
  {
    icon: Camera,
    title: "1. Photographiez les pièces",
    text: "Salon, chambres, cuisine, cave ou box : quelques photos suffisent à l'IA pour estimer le volume à évacuer.",
  },
  {
    icon: MoveVertical,
    title: "2. Précisez l'étage et l'accès",
    text: "Étage, présence d'ascenseur, couloirs étroits ou stationnement difficile : ces contraintes d'appartement pèsent directement sur le prix.",
  },
  {
    icon: Euro,
    title: "3. Recevez une fourchette de prix",
    text: "Volume en m³, majorations d'accès et fourchette indicative s'affichent immédiatement, avant tout engagement.",
  },
  {
    icon: ShieldCheck,
    title: "4. Comparez les pros de votre secteur",
    text: "Votre demande part uniquement aux débarrasseurs qui interviennent sur votre code postal. Vos coordonnées ne sont transmises qu'après acceptation.",
  },
];

const cases = [
  {
    title: "Studio ou T1",
    text: "Environ 8 à 15 m³ selon l'encombrement. Souvent réalisable en une demi-journée, à un ou deux intervenants.",
  },
  {
    title: "T2 / T3 meublé",
    text: "15 à 30 m³ avec mobilier, électroménager et cartons. L'étage sans ascenseur allonge nettement la manutention.",
  },
  {
    title: "Appartement complet après succession",
    text: "25 à 45 m³ : cave, placards et combles inclus. Le tri des objets valorisables peut réduire la facture.",
  },
  {
    title: "Logement très encombré",
    text: "Accumulation importante ou syndrome de Diogène : volumes élevés, nettoyage et désinfection à prévoir.",
  },
];

function ApartmentClearance() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <section className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <Building2 className="h-4 w-4" /> Débarras d'appartement
        </span>
        <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl tracking-tight sm:text-5xl">
          Débarras d'appartement : le prix estimé en 2 minutes, en photos
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          En appartement, le prix d'un débarras dépend surtout du volume à évacuer, de l'étage et de
          l'ascenseur. Débarras France analyse vos photos, calcule le volume en m³, applique les contraintes
          d'accès, puis transmet votre demande à des débarrasseurs vérifiés de votre secteur.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/estimation">Estimer mon débarras</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/tarifs">Voir la grille tarifaire</Link>
          </Button>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">Comment se calcule le prix en appartement</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {steps.map((step) => (
            <Card key={step.title} className="p-6">
              <step.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">Volumes courants selon le logement</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ces ordres de grandeur sont indicatifs : l'estimation Débarras France affine le volume à partir de
          vos photos et de vos réponses.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {cases.map((item) => (
            <Card key={item.title} className="p-6">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-muted/40 p-8">
        <h2 className="text-2xl font-bold tracking-tight">Étage, ascenseur et stationnement</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Avec ascenseur :</strong> majoration limitée, le
            volume reste le facteur principal du prix.
          </li>
          <li>
            <strong className="text-foreground">Sans ascenseur :</strong> chaque étage ajoute du
            temps de portage, donc une majoration progressive.
          </li>
          <li>
            <strong className="text-foreground">Accès très contraint :</strong> rue étroite,
            stationnement éloigné, monte-meubles nécessaire : à signaler dès l'estimation.
          </li>
          <li>
            <strong className="text-foreground">Copropriété :</strong> pensez à réserver
            l'ascenseur ou une place devant l'immeuble le jour de l'intervention.
          </li>
        </ul>
      </section>

      <section className="mt-16 rounded-2xl border p-8 text-center">
        <Clock className="mx-auto h-7 w-7 text-primary" />
        <h2 className="mt-3 text-2xl font-bold tracking-tight">
          Votre estimation d'appartement, tout de suite
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Gratuit, sans engagement, et vos coordonnées ne sont partagées qu'une fois que vous
          acceptez une proposition.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/estimation">Démarrer mon estimation</Link>
        </Button>
      </section>
    </main>
  );
}
