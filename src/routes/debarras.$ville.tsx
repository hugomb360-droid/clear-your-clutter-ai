import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Camera, MapPin } from "lucide-react";
import cityPhoto from "@/assets/gallery-camion.jpg";
import { CITIES, getCity } from "@/lib/cities";
import {
  CityLinks,
  CtaBand,
  FaqList,
  InfoGrid,
  NumberedSteps,
  PageHero,
  PriceTable,
  Section,
  SectionHeading,
  btnOutline,
  btnPrimary,
  btnSoft,
  btnWhite,
  h2Class,
  leadClass,
  onDarkAccent,
  onDarkMuted,
  wrap,
} from "@/components/site/page-kit";

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
    <main className="bg-[#F2FAF4] py-20 sm:py-28">
      <div className={`${wrap} max-w-3xl text-center`}>
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white text-primary">
          <MapPin className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-[34px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[46px]">
          Ville non encore couverte
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
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

function CityPageView() {
  const { city } = Route.useLoaderData();
  const others = CITIES.filter((c) => c.slug !== city.slug).slice(0, 15);
  const capitalized = city.preposition.charAt(0).toUpperCase() + city.preposition.slice(1);

  return (
    <main>
      <PageHero
        crumbs={[{ label: "Débarras par ville", to: "/debarras" }, { label: city.name }]}
        title={`Débarras ${city.preposition} : prix estimé en 2 minutes, en photos`}
        subtitle={city.department}
        intro={city.intro}
        image={cityPhoto}
        imageAlt={`Camion de débarras chargé de meubles ${city.preposition}`}
        trustCard={false}
        actions={
          <>
            <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
              <Camera className="size-5" aria-hidden="true" />
              Estimer mon débarras {city.preposition}
            </Link>
            <Link to="/tarifs" className={btnOutline}>
              Voir la grille tarifaire
            </Link>
          </>
        }
        note={`Codes postaux couverts : ${city.postalCodes}`}
        floating={
          <div className="rounded-2xl bg-brand-ink p-5 text-white shadow-[0_18px_40px_rgba(12,61,34,0.3)]">
            <p className="flex items-center gap-2 text-[15px] font-extrabold">
              <MapPin className={`size-[18px] ${onDarkAccent}`} aria-hidden="true" />
              Débarras {city.preposition}
            </p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <dt className={onDarkMuted}>Région</dt>
              <dd className="text-right font-semibold">{city.region}</dd>
              <dt className={onDarkMuted}>Département</dt>
              <dd className="text-right font-semibold">{city.department}</dd>
              <dt className={onDarkMuted}>Codes postaux</dt>
              <dd className="text-right font-semibold">{city.postalCodes}</dd>
            </dl>
          </div>
        }
      />

      <Section tone="tint">
        <SectionHeading title={`Comment obtenir votre devis de débarras ${city.preposition}`} />
        <NumberedSteps
          steps={[
            {
              title: "Photographiez les pièces",
              text: "Pièces de vie, cave, garage, grenier : notre IA identifie les objets et estime le volume à évacuer en m³.",
            },
            {
              title: "Précisez le type de bien et l'accès",
              text: `Étage, ascenseur, distance de portage : ces éléments pèsent réellement sur le tarif ${city.preposition}.`,
            },
            {
              title: "Recevez une fourchette de prix",
              text: "Tarif au m³ dégressif sur les gros volumes, majorations d'accès et de salubrité incluses.",
            },
            {
              title: "Comparez les pros locaux",
              text: "Seuls les débarrasseurs intervenant sur votre code postal reçoivent la demande. Vos coordonnées ne partent qu'après votre accord.",
            },
          ]}
        />
      </Section>

      <Section tone="dark">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <h2 className={`${h2Class} text-white`}>
            Ce qui influence le prix d'un débarras {city.preposition}
          </h2>
          <ul className="flex flex-col gap-4">
            {city.context.map((item) => (
              <li
                key={item}
                className={`rounded-[18px] bg-[#134A2B] px-6 py-5 text-base leading-relaxed ${onDarkMuted}`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 className={`${h2Class} text-brand-ink`}>
              Quartiers et secteurs desservis {city.preposition}
            </h2>
            <p className={`${leadClass} text-muted-foreground`}>
              Nos partenaires couvrent également les communes limitrophes de {city.department}.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {city.neighborhoods.map((n) => (
              <li
                key={n}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-[15px] font-semibold text-brand-ink"
              >
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="tint">
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 className={`${h2Class} text-brand-ink`}>
              Prix d'un débarras {city.preposition} : fourchettes constatées
            </h2>
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

      <Section>
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

      <Section tone="tint">
        <SectionHeading title="Type de bien à débarrasser" />
        <InfoGrid
          columns={4}
          items={[
            {
              title: `Débarras d'appartement ${city.preposition}`,
              text: "Studio à grand T4, cave incluse : comptez généralement 8 à 30 m³ selon l'encombrement.",
              footer: (
                <Link to="/debarras-appartement" className="font-bold text-primary hover:underline">
                  Voir la page appartement
                </Link>
              ),
            },
            {
              title: `Débarras de maison ${city.preposition}`,
              text: "Combles, garage, dépendances et extérieur : les volumes montent souvent entre 30 et 80 m³.",
              footer: (
                <Link to="/debarras-maison" className="font-bold text-primary hover:underline">
                  Voir la page maison
                </Link>
              ),
            },
            {
              title: `Débarras après succession ${city.preposition}`,
              text: "Tri des affaires personnelles, valorisation du mobilier et évacuation complète, même à distance.",
              footer: (
                <Link to="/debarras-succession" className="font-bold text-primary hover:underline">
                  Voir la page succession
                </Link>
              ),
            },
            {
              title: `Cave, garage et grenier ${city.preposition}`,
              text: "Les annexes représentent souvent 30 % du volume total : faites-les estimer en même temps.",
              footer: (
                <Link to="/debarras-cave-garage" className="font-bold text-primary hover:underline">
                  Voir la page cave et garage
                </Link>
              ),
            },
          ]}
        />
      </Section>

      <Section>
        <CityLinks title="Débarras dans d'autres villes" cities={others} />
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
