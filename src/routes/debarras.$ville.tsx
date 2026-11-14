import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Camera, MapPin } from "lucide-react";
import { lazy, Suspense } from "react";
import { CITIES, getCity } from "@/lib/cities";
import {
  Breadcrumb,
  CityLinks,
  CtaBand,
  FaqList,
  PriceTable,
  Section,
  SectionHeading,
  btnOutline,
  btnPrimary,
  btnSoft,
  btnWhite,
  h2Class,
  leadClass,
  onDarkMuted,
  wrap,
} from "@/components/site/page-kit";

const CitiesMap = lazy(() => import("@/components/site/cities-map"));

export const Route = createFileRoute("/debarras/$ville")({
  loader: ({ params }) => {
    const city = getCity(params.ville);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Ville non couverte | Débarras France" },
          { name: "robots", content: "noindex" },
        ],
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
        {
          property: "og:title",
          content: `Débarras ${city.name} — estimation en photo | Débarras France`,
        },
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
            provider: {
              "@type": "Organization",
              name: "Débarras France",
              url: "https://debarrasfrance.fr",
            },
            url: canonical,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Accueil",
                item: "https://debarrasfrance.fr",
              },
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
    <main className="bg-[#F2FAF4] py-16 sm:py-24">
      <div className={`${wrap} max-w-3xl text-center`}>
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white text-primary">
          <MapPin className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-[29px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[40px]">
          Ville non encore couverte
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
          Nous n'avons pas encore de page dédiée pour cette ville, mais nos débarrasseurs
          interviennent partout en France : lancez votre estimation, nous cherchons un pro près de
          chez vous.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
            Estimer mon débarras
          </Link>
          <Link to="/debarras" className={btnOutline}>
            Voir toutes les villes
          </Link>
        </div>
      </div>
    </main>
  );
}

const PRICE_ROWS = [
  { label: "Studio / T1", volume: "6 à 12 m³", price: "450 – 950 €" },
  { label: "Appartement T2 / T3", volume: "12 à 25 m³", price: "900 – 1 900 €" },
  { label: "Maison 4 pièces", volume: "30 à 50 m³", price: "2 000 – 3 600 €" },
  { label: "Cave, garage ou grenier seul", volume: "5 à 15 m³", price: "350 – 1 150 €" },
];

const TYPES = [
  {
    to: "/debarras-appartement",
    title: "Appartement",
    text: "Studio à grand T4, cave incluse : comptez généralement 8 à 30 m³ selon l'encombrement.",
  },
  {
    to: "/debarras-maison",
    title: "Maison",
    text: "Combles, garage, dépendances et extérieur : les volumes montent souvent entre 30 et 80 m³.",
  },
  {
    to: "/debarras-succession",
    title: "Succession",
    text: "Tri des affaires personnelles, valorisation du mobilier et évacuation complète, même à distance.",
  },
  {
    to: "/debarras-cave-garage",
    title: "Cave et garage",
    text: "Les annexes représentent souvent 30 % du volume total : faites-les estimer en même temps.",
  },
] as const;

function CityPageView() {
  const { city } = Route.useLoaderData();
  const others = CITIES.filter((c) => c.region === city.region && c.slug !== city.slug);
  const elsewhere = CITIES.filter((c) => c.region !== city.region).slice(0, 10);
  const capitalized = city.preposition.charAt(0).toUpperCase() + city.preposition.slice(1);

  return (
    <main>
      {/* Fiche locale : le nom de la ville en très grand, la carte centrée dessus */}
      <section className="bg-brand-ink pb-14 pt-8 text-white">
        <div className={wrap}>
          <Breadcrumb
            items={[{ label: "Débarras par ville", to: "/debarras" }, { label: city.name }]}
            dark
          />
          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-lg font-bold text-[#6EDC97]">Débarras {city.preposition}</p>
              <h1 className="mt-1 text-[48px] font-black leading-[0.95] tracking-[-0.04em] sm:text-[70px]">
                {city.name}
              </h1>
              <p className={`mt-6 max-w-[40em] text-[17px] leading-relaxed ${onDarkMuted}`}>
                {city.intro}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 rounded-[20px] bg-[#134A2B] p-6 text-[15px] lg:grid-cols-1">
              <div>
                <dt className={onDarkMuted}>Département</dt>
                <dd className="font-bold">{city.department}</dd>
              </div>
              <div>
                <dt className={onDarkMuted}>Région</dt>
                <dd className="font-bold">{city.region}</dd>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <dt className={onDarkMuted}>Codes postaux couverts</dt>
                <dd className="font-bold">{city.postalCodes}</dd>
              </div>
            </dl>
          </div>
          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
            <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
              <Camera className="size-5" aria-hidden="true" />
              Estimer mon débarras {city.preposition}
            </Link>
            <Link
              to="/tarifs"
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-white px-[22px] text-[15px] font-bold text-white hover:bg-white hover:text-brand-ink"
            >
              Voir la grille tarifaire
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className={`${wrap} grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14`}>
          <Suspense
            fallback={
              <div
                className="h-[420px] w-full animate-pulse rounded-[24px] bg-secondary"
                aria-hidden="true"
              />
            }
          >
            <CitiesMap activeSlug={city.slug} height={420} />
          </Suspense>
          <div>
            <h2 className={`${h2Class} text-brand-ink`}>Quartiers et secteurs desservis</h2>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {city.neighborhoods.map((n) => (
                <li
                  key={n}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2.5 text-[15px] font-semibold text-brand-ink"
                >
                  <MapPin className="size-4 text-primary" aria-hidden="true" />
                  {n}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Nos partenaires couvrent également les communes limitrophes de {city.department}.
            </p>
            {others.length > 0 && (
              <p className="mt-5 text-base text-muted-foreground">
                Aussi en {city.region} :{" "}
                {others.map((c, i) => (
                  <span key={c.slug}>
                    <Link
                      to="/debarras/$ville"
                      params={{ ville: c.slug }}
                      className="font-bold text-primary hover:underline"
                    >
                      {c.name}
                    </Link>
                    {i < others.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      </section>

      <Section tone="tint">
        <SectionHeading title={`Ce qui influence le prix d'un débarras ${city.preposition}`} />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {city.context.map((item, index) => (
            <li key={item} className="rounded-[20px] bg-white p-6">
              <span className="text-[29px] font-black leading-none text-primary tabular-nums">
                {index + 1}
              </span>
              <p className="mt-3 text-base leading-relaxed text-brand-ink">{item}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 className={`${h2Class} text-brand-ink`}>Prix d'un débarras {city.preposition}</h2>
            <p className={`${leadClass} text-muted-foreground`}>
              Fourchettes indicatives {city.preposition}, hors majorations d'accès et de salubrité.
              Votre estimation en photo affiche votre fourchette personnalisée en moins de 2
              minutes.
            </p>
          </div>
          <PriceTable
            rows={PRICE_ROWS}
            columns={["Type de bien", "Volume estimé", "Budget indicatif"]}
          />
        </div>
      </Section>

      <Section tone="tint">
        <SectionHeading title={`Comment obtenir votre devis de débarras ${city.preposition}`} />
        <ol className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {[
            [
              "Photographiez les pièces",
              "Pièces de vie, cave, garage, grenier : notre IA identifie les objets et estime le volume à évacuer en m³.",
            ],
            [
              "Précisez le type de bien et l'accès",
              `Étage, ascenseur, distance de portage : ces éléments pèsent réellement sur le tarif ${city.preposition}.`,
            ],
            [
              "Recevez une fourchette de prix",
              "Tarif au m³ dégressif sur les gros volumes, majorations d'accès et de salubrité incluses.",
            ],
            [
              "Comparez les pros locaux",
              "Seuls les débarrasseurs intervenant sur votre code postal reçoivent la demande. Vos coordonnées ne partent qu'après votre accord.",
            ],
          ].map(([title, text], index) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-ink text-base font-black text-white">
                {index + 1}
              </span>
              <span>
                <strong className="block text-lg text-brand-ink">{title}</strong>
                <span className="mt-1 block text-base leading-relaxed text-muted-foreground">
                  {text}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading title={`Type de bien à débarrasser ${city.preposition}`} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES.map((t) => (
            <li key={t.to}>
              <Link
                to={t.to}
                className="group block h-full rounded-[20px] border border-border p-6 text-brand-ink transition-colors hover:border-primary"
              >
                <h3 className="text-xl font-extrabold">
                  {t.title} {city.preposition}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{t.text}</p>
                <span className="mt-4 inline-block font-bold text-primary group-hover:underline">
                  Voir la page
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint">
        <SectionHeading title={`Questions fréquentes sur le débarras ${city.preposition}`} />
        <FaqList
          items={[
            {
              q: `Combien coûte un débarras ${city.preposition} ?`,
              a: `Le prix dépend avant tout du volume en m³, de l'étage et de la distance de portage. ${capitalized}, comptez le plus souvent entre 450 € pour un studio et 3 600 € pour une maison complète.`,
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
          ]}
        />
      </Section>

      <Section>
        <CityLinks title="Débarras dans d'autres villes" cities={elsewhere} />
      </Section>

      <CtaBand
        title={`Votre estimation de débarras ${city.preposition}, tout de suite`}
        text="Gratuit, sans engagement, et vos coordonnées ne sont partagées qu'une fois que vous acceptez une proposition."
      >
        <Link to="/estimation" search={{ type: "photo" }} className={btnSoft}>
          <Camera className="size-5" aria-hidden="true" />
          Démarrer mon estimation
        </Link>
        <Link to="/professionnels" search={{ region: city.region }} className={btnWhite}>
          Voir les pros de la région
        </Link>
      </CtaBand>
    </main>
  );
}
