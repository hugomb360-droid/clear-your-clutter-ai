import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Clock, Euro, Home, ShieldCheck, Warehouse } from "lucide-react";

const CANONICAL = "https://clearo.fr/debarras-maison";

export const Route = createFileRoute("/debarras-maison")({
  head: () => ({
    meta: [
      { title: "Débarras de maison : prix et estimation en photo | Débarras France" },
      {
        name: "description",
        content:
          "Estimez le prix du débarras de votre maison en photos : combles, garage, cave, jardin et gros volumes pris en compte. Pros vérifiés près de chez vous.",
      },
      { property: "og:title", content: "Débarras de maison : prix et estimation immédiate" },
      {
        property: "og:description",
        content:
          "Photos, volume en m³, prix indicatif et mise en relation avec des débarrasseurs vérifiés de votre secteur.",
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
          name: "Débarras de maison",
          serviceType: "Débarras de maison",
          areaServed: "France",
          provider: { "@type": "Organization", name: "Débarras France", url: "https://clearo.fr" },
          url: CANONICAL,
        }),
      },
    ],
  }),
  component: HouseClearance,
});

const steps = [
  {
    icon: Camera,
    title: "1. Photographiez la maison",
    text: "Pièces de vie, chambres, combles, garage, cave, dépendances et extérieur : plus les photos couvrent la maison, plus l'estimation est juste.",
  },
  {
    icon: Warehouse,
    title: "2. Ajoutez les annexes",
    text: "Grenier, sous-sol, atelier, abri de jardin : ce sont souvent eux qui font grimper le volume total à évacuer.",
  },
  {
    icon: Euro,
    title: "3. Recevez une fourchette de prix",
    text: "Volume estimé en m³, tarif dégressif sur les gros volumes et majorations d'accès s'affichent immédiatement.",
  },
  {
    icon: ShieldCheck,
    title: "4. Comparez les pros de votre secteur",
    text: "Seuls les débarrasseurs intervenant sur votre code postal reçoivent la demande. Vos coordonnées ne partent qu'après votre accord.",
  },
];

const cases = [
  {
    title: "Petite maison de plain-pied",
    text: "20 à 35 m³ en moyenne avec mobilier et cartons. Une journée d'intervention suffit généralement.",
  },
  {
    title: "Maison familiale avec garage",
    text: "35 à 60 m³ : garage, outillage, électroménager et mobilier de jardin s'ajoutent au volume intérieur.",
  },
  {
    title: "Maison après succession",
    text: "50 à 90 m³ combles et cave inclus. Le tri des objets valorisables peut réduire la facture finale.",
  },
  {
    title: "Maison très encombrée",
    text: "Accumulation importante ou insalubrité : volumes élevés, nettoyage et évacuations spécifiques à prévoir.",
  },
];

function HouseClearance() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <section className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <Home className="h-4 w-4" /> Débarras de maison
        </span>
        <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl tracking-tight sm:text-5xl">
          Débarras de maison : le prix estimé en 2 minutes, en photos
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          En maison, le volume à évacuer dépasse presque toujours celui d'un appartement : combles,
          cave, garage et dépendances s'ajoutent aux pièces de vie. Débarras France analyse vos photos,
          calcule le volume en m³, applique un tarif dégressif sur les gros volumes, puis transmet
          votre demande à des débarrasseurs vérifiés près de chez vous.
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
        <h2 className="text-2xl font-bold tracking-tight">Comment se calcule le prix en maison</h2>
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
        <h2 className="text-2xl font-bold tracking-tight">Volumes courants selon la maison</h2>
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
        <h2 className="text-2xl font-bold tracking-tight">Combles, cave, garage et jardin</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Combles :</strong> accès par trappe ou escalier
            étroit, portage plus long, à signaler dès l'estimation.
          </li>
          <li>
            <strong className="text-foreground">Cave et sous-sol :</strong> humidité, meubles
            dégradés et gros volumes de cartons à évacuer.
          </li>
          <li>
            <strong className="text-foreground">Garage et atelier :</strong> outillage, pneus,
            peintures ou produits chimiques qui suivent des filières de tri spécifiques.
          </li>
          <li>
            <strong className="text-foreground">Extérieur :</strong> abri de jardin, ferraille ou
            gravats : précisez-les, ils changent le volume et le mode d'évacuation.
          </li>
        </ul>
      </section>

      <section className="mt-16 rounded-2xl border p-8 text-center">
        <Clock className="mx-auto h-7 w-7 text-primary" />
        <h2 className="mt-3 text-2xl font-bold tracking-tight">
          Votre estimation de maison, tout de suite
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Gratuit, sans engagement, et vos coordonnées ne sont partagées qu'une fois que vous
          acceptez une proposition.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/estimation">Démarrer mon estimation</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/debarras-appartement">Débarras d'appartement</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
