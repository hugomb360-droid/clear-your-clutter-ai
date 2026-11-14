import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { lazy, Suspense } from "react";
import {
  Breadcrumb,
  CtaBand,
  btnOutline,
  btnPrimary,
  btnSoft,
  btnWhite,
  wrap,
} from "@/components/site/page-kit";
import { CITIES } from "@/lib/cities";

const CitiesMap = lazy(() => import("@/components/site/cities-map"));

const CANONICAL = "https://debarrasfrance.fr/debarras";

export const Route = createFileRoute("/debarras/")({
  head: () => ({
    meta: [
      { title: "Débarras par ville : prix et débarrasseurs près de chez vous | Débarras France" },
      {
        name: "description",
        content:
          "Trouvez un débarrasseur vérifié dans votre ville : prix au m³, estimation en photo en 2 minutes et propositions de professionnels locaux partout en France.",
      },
      { property: "og:title", content: "Débarras par ville — Débarras France" },
      {
        property: "og:description",
        content: "Estimation en photo et débarrasseurs vérifiés dans les grandes villes de France.",
      },
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
      {/* Carte en pleine largeur, liste des régions en dessous */}
      <section className="pb-8 pt-8">
        <div className={wrap}>
          <Breadcrumb items={[{ label: "Débarras par ville" }]} />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-[31px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[43px]">
                Débarras par ville
              </h1>
              <p className="mt-4 max-w-[36em] text-[17px] leading-relaxed text-[#34433A]">
                {CITIES.length} villes ont leur page, avec les contraintes locales : stationnement,
                étages, quartiers. Partout ailleurs, votre demande part aux pros qui couvrent votre
                code postal.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
                <Camera className="size-5" aria-hidden="true" />
                Estimer mon débarras
              </Link>
              <Link to="/professionnels" className={btnOutline}>
                Les pros par région
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <Suspense
              fallback={
                <div
                  className="h-[520px] w-full animate-pulse rounded-[24px] bg-secondary"
                  aria-hidden="true"
                />
              }
            >
              <CitiesMap />
            </Suspense>
            <p className="mt-2 text-sm text-muted-foreground">
              Cliquez sur un repère pour ouvrir la page de la ville.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className={`${wrap} grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3`}>
          {REGIONS.map((region) => {
            const cities = CITIES.filter((city) => city.region === region);
            return (
              <div key={region}>
                <h2 className="border-b-2 border-brand-ink pb-2 text-xl font-extrabold text-brand-ink">
                  {region}
                </h2>
                <ul className="mt-3 flex flex-col">
                  {cities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        to="/debarras/$ville"
                        params={{ ville: city.slug }}
                        className="flex items-baseline justify-between gap-3 py-2 text-base text-brand-ink hover:text-primary"
                      >
                        <span className="font-semibold">Débarras {city.name}</span>
                        <span className="text-sm text-muted-foreground">{city.department}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

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
