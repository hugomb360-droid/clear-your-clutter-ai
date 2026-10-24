import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, MapPin } from "lucide-react";
import hubPhoto from "@/assets/gallery-equipe.jpg";
import { CITIES } from "@/lib/cities";
import {
  CtaBand,
  PageHero,
  Section,
  SectionHeading,
  btnOutline,
  btnPrimary,
  btnSoft,
  btnWhite,
} from "@/components/site/page-kit";

const CANONICAL = "https://debarrasfrance.fr/debarras";
const DESCRIPTION =
  "Débarras dans 40 villes de France : Paris, Marseille, Lyon, Toulouse, Bordeaux, Lille, Rennes, Nantes… Prix estimé en photo en 2 minutes et débarrasseurs vérifiés près de chez vous.";

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

const REGIONS = [...new Set(CITIES.map((city) => city.region))].sort((a, b) =>
  a.localeCompare(b, "fr"),
);

function CitiesHub() {
  return (
    <main>
      <PageHero
        crumbs={[{ label: "Débarras par ville" }]}
        title="Débarras par ville : trouvez un pro près de chez vous"
        subtitle={`Partout en France, ${CITIES.length} grandes villes dans ${REGIONS.length} régions`}
        intro="Photographiez ce que vous voulez débarrasser, obtenez le volume en m³ et une fourchette de prix, puis comparez les propositions des débarrasseurs vérifiés de votre secteur."
        image={hubPhoto}
        imageAlt="Deux débarrasseurs évacuent cartons et fauteuil d'un appartement"
        actions={
          <>
            <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
              <Camera className="size-5" aria-hidden="true" />
              Estimer mon débarras
            </Link>
            <Link to="/professionnels" className={btnOutline}>
              Voir les pros par région
            </Link>
          </>
        }
      />

      {REGIONS.map((region, index) => {
        const cities = CITIES.filter((city) => city.region === region);
        return (
          <Section
            key={region}
            tone={index % 2 === 0 ? "tint" : "white"}
            className="!py-12 sm:!py-16"
          >
            <SectionHeading
              title={region}
              lead={`${cities.length} ville${cities.length > 1 ? "s" : ""} avec une page dédiée`}
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  to="/debarras/$ville"
                  params={{ ville: city.slug }}
                  className="group flex flex-col rounded-[20px] border border-border bg-card p-6 text-brand-ink transition-colors hover:border-primary"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <MapPin className="size-4 text-primary" aria-hidden="true" />
                    {city.department}
                  </span>
                  <h2 className="mt-3 text-[21px] font-extrabold">Débarras {city.name}</h2>
                  <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">
                    {city.intro}
                  </p>
                  <span className="mt-auto pt-4 text-[15px] font-bold text-primary group-hover:underline">
                    Voir les prix {city.preposition}
                  </span>
                </Link>
              ))}
            </div>
          </Section>
        );
      })}

      <CtaBand
        title="Votre ville n'est pas listée ?"
        text="Nos partenaires interviennent dans toute la France. Lancez votre estimation : la demande est diffusée aux débarrasseurs couvrant votre code postal."
      >
        <Link to="/estimation" search={{ type: "photo" }} className={btnSoft}>
          <Camera className="size-5" aria-hidden="true" />
          Démarrer mon estimation
        </Link>
        <Link to="/contact" className={btnWhite}>
          Nous contacter
        </Link>
      </CtaBand>
    </main>
  );
}
