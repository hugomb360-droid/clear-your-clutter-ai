import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Euro, MapPin, ShieldCheck, Truck } from "lucide-react";
import { CITIES, getCity } from "@/lib/cities";

export const Route = createFileRoute("/debarras/$ville")({
  loader: ({ params }) => {
    const city = getCity(params.ville);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Ville non couverte | Débarras France" }, { name: "robots", content: "noindex" }],
      };
    }
    const { city } = loaderData;
    const canonical = `https://debarrasfrance.fr/debarras/${params.ville}`;
    const title = `Débarras ${city.name} : devis en photo et prix immédiat | Débarras France`;
    const description = `Débarras ${city.preposition} : envoyez vos photos, obtenez le volume en m³ et une fourchette de prix en 2 minutes, puis comparez les débarrasseurs vérifiés de ${city.department}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: `Débarras ${city.name} — estimation en photo | Débarras France` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Débarras ${city.name}`,
            serviceType: "Débarras de maison et d'appartement",
            areaServed: {
              "@type": "City",
              name: city.name,
              address: {
                "@type": "PostalAddress",
                addressLocality: city.name,
                addressRegion: city.region,
                addressCountry: "FR",
              },
            },
            provider: { "@type": "Organization", name: "Débarras France", url: "https://debarrasfrance.fr" },
            url: canonical,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://debarrasfrance.fr" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Débarras par ville",
                item: "https://debarrasfrance.fr/debarras",
              },
              { "@type": "ListItem", position: 3, name: `Débarras ${city.name}`, item: canonical },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: CityNotFound,
  component: CityPageView,
});

function CityNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight">Ville non encore couverte</h1>
      <p className="mt-4 text-muted-foreground">
        Nous n'avons pas encore de page dédiée pour cette ville, mais nos débarrasseurs interviennent
        partout en France : lancez votre estimation, nous cherchons un pro près de chez vous.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link to="/estimation">Estimer mon débarras</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/debarras">Voir toutes les villes</Link>
        </Button>
      </div>
    </main>
  );
}

function CityPageView() {
  const { city } = Route.useLoaderData();
  const others = CITIES.filter((c) => c.slug !== city.slug).slice(0, 6);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <section className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <MapPin className="h-4 w-4" /> {city.department}
        </span>
        <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl tracking-tight sm:text-5xl">
          Débarras {city.preposition} : prix estimé en 2 minutes, en photos
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">{city.intro}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/estimation">Estimer mon débarras {city.preposition}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/tarifs">Voir la grille tarifaire</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Codes postaux couverts : {city.postalCodes}
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">
          Comment obtenir votre devis de débarras {city.preposition}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <Camera className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-semibold">1. Photographiez les pièces</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Pièces de vie, cave, garage, grenier : notre IA identifie les objets et estime le
              volume à évacuer en m³.
            </p>
          </Card>
          <Card className="p-6">
            <Truck className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-semibold">2. Précisez le type de bien et l'accès</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Étage, ascenseur, distance de portage : ces éléments pèsent réellement sur le tarif{" "}
              {city.preposition}.
            </p>
          </Card>
          <Card className="p-6">
            <Euro className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-semibold">3. Recevez une fourchette de prix</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tarif au m³ dégressif sur les gros volumes, majorations d'accès et de salubrité
              incluses.
            </p>
          </Card>
          <Card className="p-6">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-semibold">4. Comparez les pros locaux</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Seuls les débarrasseurs intervenant sur votre code postal reçoivent la demande. Vos
              coordonnées ne partent qu'après votre accord.
            </p>
          </Card>
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-muted/40 p-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Ce qui influence le prix d'un débarras {city.preposition}
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          {city.context.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">
          Quartiers et secteurs desservis {city.preposition}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {city.neighborhoods.map((n) => (
            <span key={n} className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground">
              {n}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Nos partenaires couvrent également les communes limitrophes de {city.department}.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">
          Prix d'un débarras {city.preposition} : fourchettes constatées
        </h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Type de bien</th>
                <th className="px-4 py-3 font-semibold">Volume estimé</th>
                <th className="px-4 py-3 font-semibold">Budget indicatif</th>
              </tr>
            </thead>
            <tbody>
              {[
                { l: "Studio / T1", v: "6 à 12 m³", p: "450 – 950 €" },
                { l: "Appartement T2 / T3", v: "12 à 25 m³", p: "900 – 1 900 €" },
                { l: "Maison 4 pièces", v: "30 à 50 m³", p: "2 000 – 3 600 €" },
                { l: "Cave, garage ou grenier seul", v: "5 à 15 m³", p: "350 – 1 150 €" },
              ].map((r) => (
                <tr key={r.l} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{r.l}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.v}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{r.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Fourchettes indicatives {city.preposition}, hors majorations d'accès et de salubrité.
          Votre estimation en photo affiche votre fourchette personnalisée en moins de 2 minutes.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">
          Questions fréquentes sur le débarras {city.preposition}
        </h2>
        <div className="mt-6 space-y-4">
          {[
            {
              q: `Combien coûte un débarras ${city.preposition} ?`,
              a: `Le prix dépend avant tout du volume en m³, de l'étage et de la distance de portage. ${city.preposition.charAt(0).toUpperCase() + city.preposition.slice(1)}, comptez le plus souvent entre 450 € pour un studio et 3 600 € pour une maison complète.`,
            },
            {
              q: `Sous quel délai un débarrasseur peut-il intervenir ${city.preposition} ?`,
              a: `Les professionnels couvrant les codes postaux ${city.postalCodes} répondent en général sous 24 à 48 h, pour une intervention dans la semaine.`,
            },
            {
              q: "Le débarras peut-il être gratuit ?",
              a: "Il peut être réduit lorsque du mobilier, de l'outillage ou des métaux ont une valeur de revente : cette reprise vient diminuer le devis proposé par le professionnel.",
            },
            {
              q: "Faut-il être présent pendant l'intervention ?",
              a: "Non. Une remise de clés suffit : vous recevez un rapport photo de fin de chantier et validez le paiement uniquement une fois le logement vidé.",
            },
          ].map((f) => (
            <Card key={f.q} className="p-6">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">Type de bien à débarrasser</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-semibold">Débarras d'appartement {city.preposition}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Studio à grand T4, cave incluse : comptez généralement 8 à 30 m³ selon
              l'encombrement.
            </p>
            <Button asChild variant="link" className="mt-2 px-0">
              <Link to="/debarras-appartement">Voir la page appartement</Link>
            </Button>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">Débarras de maison {city.preposition}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Combles, garage, dépendances et extérieur : les volumes montent souvent entre 30 et 80
              m³.
            </p>
            <Button asChild variant="link" className="mt-2 px-0">
              <Link to="/debarras-maison">Voir la page maison</Link>
            </Button>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">Débarras après succession {city.preposition}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tri des affaires personnelles, valorisation du mobilier et évacuation complète, même
              à distance.
            </p>
            <Button asChild variant="link" className="mt-2 px-0">
              <Link to="/debarras-succession">Voir la page succession</Link>
            </Button>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">Cave, garage et grenier {city.preposition}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Les annexes représentent souvent 30 % du volume total : faites-les estimer en même
              temps.
            </p>
            <Button asChild variant="link" className="mt-2 px-0">
              <Link to="/debarras-cave-garage">Voir la page cave et garage</Link>
            </Button>
          </Card>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border p-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Votre estimation de débarras {city.preposition}, tout de suite
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Gratuit, sans engagement, et vos coordonnées ne sont partagées qu'une fois que vous
          acceptez une proposition.
        </p>
        <div className="mt-6">
          <Button asChild size="lg">
            <Link to="/estimation">Démarrer mon estimation</Link>
          </Button>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-lg font-semibold">Débarras dans d'autres villes</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {others.map((c) => (
            <Link
              key={c.slug}
              to="/debarras/$ville"
              params={{ ville: c.slug }}
              className="rounded-full bg-secondary px-3 py-1.5 text-sm hover:bg-secondary/70"
            >
              Débarras {c.name}
            </Link>
          ))}
          <Link
            to="/debarras"
            className="rounded-full border px-3 py-1.5 text-sm hover:bg-secondary/50"
          >
            Toutes les villes
          </Link>
        </div>
      </section>
    </main>
  );
}
