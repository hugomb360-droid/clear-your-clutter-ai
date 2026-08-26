import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { CITIES } from "@/lib/cities";

const CANONICAL = "https://debarrasfrance.fr/debarras";
const DESCRIPTION =
  "Trouvez un débarrasseur vérifié dans votre ville : Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Bordeaux, Lille. Estimation en photo en 2 minutes.";

export const Route = createFileRoute("/debarras/")({
  head: () => ({
    meta: [
      { title: "Débarras par ville : prix et débarrasseurs près de chez vous | Débarras France" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Débarras par ville — Débarras France" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Débarras par ville",
          itemListElement: CITIES.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `Débarras ${c.name}`,
            url: `https://debarrasfrance.fr/debarras/${c.slug}`,
          })),
        }),
      },
    ],
  }),
  component: CitiesHub,
});

function CitiesHub() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <section className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <MapPin className="h-4 w-4" /> Partout en France
        </span>
        <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl tracking-tight sm:text-5xl">
          Débarras par ville : trouvez un pro près de chez vous
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Photographiez ce que vous voulez débarrasser, obtenez le volume en m³ et une fourchette de
          prix, puis comparez les propositions des débarrasseurs vérifiés de votre secteur.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link to="/estimation">Estimer mon débarras</Link>
          </Button>
        </div>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CITIES.map((city) => (
          <Card key={city.slug} className="p-6">
            <h2 className="font-semibold">Débarras {city.name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{city.department}</p>
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{city.intro}</p>
            <Button asChild variant="link" className="mt-2 px-0">
              <Link to="/debarras/$ville" params={{ ville: city.slug }}>
                Voir les prix {city.preposition}
              </Link>
            </Button>
          </Card>
        ))}
      </section>

      <section className="mt-14 rounded-2xl bg-muted/40 p-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Votre ville n'est pas listée ?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Nos partenaires interviennent dans toute la France. Lancez votre estimation : la demande
          est diffusée aux débarrasseurs couvrant votre code postal.
        </p>
        <div className="mt-6">
          <Button asChild size="lg">
            <Link to="/estimation">Démarrer mon estimation</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
