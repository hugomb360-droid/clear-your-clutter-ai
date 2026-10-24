import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Check, Clock, Hammer, Lock, MapPin, Minus, Plus, ShieldCheck } from "lucide-react";
import galleryEquipe from "@/assets/gallery-equipe.jpg";
import galleryAvant from "@/assets/gallery-avant.jpg";
import galleryApres from "@/assets/gallery-apres.jpg";
import galleryCamion from "@/assets/gallery-camion.jpg";
import galleryCave from "@/assets/gallery-cave.jpg";
import photoVideMaison from "@/assets/avis-claire-avant.jpg";
import photoDiogene from "@/assets/avis-sophie-avant.jpg";
import { CITIES } from "@/lib/cities";
import { PRICING, computePrice, euro } from "@/lib/pricing";

const DESCRIPTION =
  "Devis rapide par IA à partir de vos photos, propositions de débarrasseurs vérifiés près de chez vous et paiement sous séquestre via Stripe Connect.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Débarras France – Devis rapide par IA et débarrasseurs vérifiés" },
      { name: "description", content: DESCRIPTION },
      {
        property: "og:title",
        content: "Débarras France – Devis rapide par IA et débarrasseurs vérifiés",
      },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://debarrasfrance.fr/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }),
      },
    ],
  }),
  component: Home,
});

/* ---------- Données de la page ---------- */

const REGION_COUNT = new Set(CITIES.map((city) => city.region)).size;

const services = [
  {
    to: "/debarras-appartement",
    title: "Débarras d'appartement",
    text: "Studio ou T5, avec ou sans ascenseur. Le portage est intégré au prix.",
    image: galleryAvant,
  },
  {
    to: "/debarras-maison",
    title: "Débarras de maison",
    text: "Toutes les pièces, dépendances et extérieurs, souvent en une journée.",
    image: galleryCamion,
  },
  {
    to: "/debarras-cave-garage",
    title: "Cave et garage",
    text: `Encombrants, cartons, ferraille. À partir de ${euro(PRICING.minimumPrice)} pour un petit volume.`,
    image: galleryCave,
  },
  {
    to: "/debarras-succession",
    title: "Débarras après succession",
    text: "Objets à conserver, clés à distance, rapport PDF pour le notaire.",
    image: galleryApres,
  },
  {
    to: "/vide-maison",
    title: "Vide-maison",
    text: "Vendez ce qui peut l'être, puis faites évacuer et nettoyer le reste.",
    image: photoVideMaison,
  },
  {
    to: "/debarras-diogene",
    title: "Syndrome de Diogène",
    text: "Débarras intégral, nettoyage et désinfection, en toute discrétion.",
    image: photoDiogene,
    dark: true,
  },
] as const;

const steps = [
  {
    title: "Estimation",
    text: "Envoyez jusqu'à 8 photos : l'IA calcule un prix immédiat. Ou décrivez votre logement pour un devis classique.",
  },
  {
    title: "Propositions",
    text: "Les pros de votre secteur sont prévenus et répondent sous 48 h, avec leurs avis et leurs chantiers.",
  },
  {
    title: "Réservation",
    text: "Vous choisissez une offre et payez en ligne. L'argent est bloqué sous séquestre via Stripe Connect.",
  },
  {
    title: "Validation",
    text: "Le pro envoie ses photos de fin de chantier. Vous validez, il est payé. Un souci ? Ouvrez un litige.",
  },
];

/** Volumes courants : cohérents avec les fourchettes utilisées par l'estimation IA. */
const priceExamples = [
  { place: "Cave", volume: 6 },
  { place: "Garage ou box", volume: 10 },
  { place: "Studio", volume: 12 },
  { place: "Appartement T3", volume: 30 },
  { place: "Maison", volume: 45 },
].map((row) => ({
  ...row,
  price: computePrice({
    volumeM3: row.volume,
    floor: 0,
    hasElevator: true,
    bulkyItems: false,
    hardAccess: false,
  }),
}));

const aiExample = computePrice({
  volumeM3: 12,
  floor: 0,
  hasElevator: true,
  bulkyItems: false,
  hardAccess: false,
});

const pct = (rate: number) => `${Math.round(rate * 100)} %`;
const num = (value: number) => new Intl.NumberFormat("fr-FR").format(value);

const comparison = [
  { row: "Prix", us: "Connu avant toute visite", them: "Souvent après une visite sur place" },
  { row: "Choix du pro", us: "Plusieurs propositions à comparer", them: "Un devis à la fois" },
  {
    row: "Vérification",
    us: "SIRET et assurance contrôlés par notre équipe",
    them: "À vérifier vous-même",
  },
  {
    row: "Paiement",
    us: "Bloqué via Stripe Connect jusqu'à votre validation",
    them: "Acompte ou paiement direct",
  },
  {
    row: "En cas de problème",
    us: "Litige avec photos, fonds gelés",
    them: "À régler à l'amiable",
  },
  { row: "Suivi", us: "Espace client, photos et rapport PDF", them: "Variable" },
];

const proBenefits = [
  {
    title: "Des demandes qualifiées",
    text: "Photos, volume en m³, étage et accès avant de répondre.",
  },
  {
    title: "Vous fixez votre prix",
    text: "L'estimation sert de repère, votre proposition reste la vôtre.",
  },
  { title: "Vos zones, vos règles", text: "Codes postaux et types de débarras choisis par vous." },
  {
    title: "Paiement garanti",
    text: "Le client paie avant le chantier, les fonds vous sont versés via Stripe Connect à la validation.",
  },
];

const faq = [
  {
    question: "L'estimation est-elle vraiment gratuite ?",
    answer:
      "Oui, 100 % gratuite et sans engagement. Avec vos photos, vous recevez une fourchette de prix tout de suite.",
  },
  {
    question: "Que se passe-t-il après ma demande ?",
    answer:
      "Les débarrasseurs de votre secteur consultent votre demande et vous envoient leurs propositions. Vous choisissez celle qui vous convient.",
  },
  {
    question: "Comment les pros sont-ils vérifiés ?",
    answer:
      "Chaque pro fournit un SIRET valide et une attestation d'assurance. Notre équipe valide chaque inscription manuellement.",
  },
  {
    question: "Puis-je refuser une proposition ?",
    answer: "Bien sûr. Vous n'êtes engagé qu'au moment où vous acceptez une offre.",
  },
  {
    question: "Quand le pro est-il payé ?",
    answer:
      "Seulement après que vous avez validé la fin du chantier. D'ici là, l'argent reste bloqué sous séquestre via Stripe Connect, puis il est versé directement sur le compte du pro.",
  },
  {
    question: "Et si le chantier se passe mal ?",
    answer:
      "Ouvrez un litige depuis votre espace, photos à l'appui. Les fonds restent bloqués le temps de l'examen.",
  },
];

const FEATURED_CITIES = CITIES.slice(0, 15);

/* ---------- Styles réutilisés ---------- */

const wrap = "mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10";
const section = "py-16 sm:py-24";
const h2 =
  "text-[30px] font-extrabold leading-[1.08] tracking-[-0.02em] text-brand-ink sm:text-[42px]";
const lead = "mt-4 max-w-[40em] text-lg leading-relaxed text-muted-foreground";
const btn =
  "inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-[26px] text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-bright focus-visible:ring-offset-2";
const btnPrimary = `${btn} bg-primary text-primary-foreground hover:bg-primary/90`;
const btnOutline = `${btn} border-2 border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-white`;
const btnSoft = `${btn} bg-brand-soft text-brand-ink shadow-[inset_0_0_0_2px_var(--brand-bright)] hover:bg-brand-soft/70`;

/* ---------- Page ---------- */

function Home() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="pb-16 pt-10 sm:pb-[72px] sm:pt-16">
        <div className={`${wrap} grid items-center gap-10 lg:grid-cols-2 lg:gap-14`}>
          <div>
            <h1 className="text-[40px] font-black leading-[1.04] tracking-[-0.03em] text-brand-ink sm:text-[52px] lg:text-[60px]">
              Votre logement vidé, trié et nettoyé, sans mauvaise surprise.
            </h1>
            <p className="mt-5 text-xl font-extrabold leading-snug text-primary sm:text-[22px]">
              Appartement, maison, cave, garage, succession, syndrome de Diogène
            </p>
            <p className="mt-5 max-w-[32em] text-lg leading-relaxed text-[#34433A]">
              Des débarrasseurs vérifiés près de chez vous, un prix connu avant toute visite.
            </p>
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
              <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
                <Camera className="size-5" aria-hidden="true" />
                Lancer mon devis IA
              </Link>
              <Link to="/estimation" search={{ type: "manuel" }} className={btnOutline}>
                Devis classique
              </Link>
            </div>
          </div>

          <div className="relative h-[400px] sm:h-[520px]">
            <img
              src={galleryEquipe}
              alt="Deux débarrasseurs évacuent cartons et fauteuil d'un appartement"
              width={1280}
              height={960}
              className="absolute right-0 top-0 h-[92%] w-full rounded-[28px] object-cover sm:w-[90%]"
            />
            <div className="absolute left-0 top-[150px] hidden max-w-[300px] items-center gap-3.5 rounded-[18px] bg-white p-4 shadow-[0_12px_32px_rgba(12,61,34,0.16)] sm:flex">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-brand-soft text-brand-ink">
                <Lock className="size-6" aria-hidden="true" />
              </span>
              <span className="text-[15px] leading-snug">
                <strong>Paiement bloqué</strong>
                <br />
                <span className="text-muted-foreground">
                  via Stripe Connect, jusqu'à la fin du chantier
                </span>
              </span>
            </div>
            <div className="absolute bottom-0 left-3 right-3 rounded-2xl bg-brand-ink p-4 text-white shadow-[0_18px_40px_rgba(12,61,34,0.3)] sm:left-auto sm:right-[18px] sm:w-[290px]">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-extrabold">
                  <Camera className="size-[15px] text-[#6EDC97]" aria-hidden="true" />
                  Analyse IA de vos photos
                </span>
                <span className="text-xs text-[#BFD8C8]">Exemple</span>
              </div>
              <dl className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[13px]">
                <dt className="text-[#BFD8C8]">Volume</dt>
                <dd className="text-right font-bold">12 m³</dd>
                <dt className="text-[#BFD8C8]">Objets</dt>
                <dd className="text-right font-semibold">mobilier, cartons, électroménager</dd>
              </dl>
              <div className="mt-2.5 flex items-baseline justify-between gap-3 border-t border-white/15 pt-2.5">
                <span className="whitespace-nowrap text-[13px] text-[#BFD8C8]">Prix estimé</span>
                <span className="whitespace-nowrap text-[19px] font-black tabular-nums text-[#6EDC97]">
                  {num(aiExample.priceMin)} – {euro(aiExample.priceMax)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bande de preuves */}
      <section className="bg-brand-ink py-9 text-white">
        <ul className={`${wrap} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
          <ProofItem icon={Camera} title="2 minutes" text="pour un devis rapide par IA" />
          <ProofItem icon={Clock} title="48 heures" text="pour recevoir les propositions" />
          <ProofItem
            icon={Lock}
            title="100 % sous séquestre"
            text="paiement bloqué via Stripe Connect"
          />
          <ProofItem
            icon={MapPin}
            title={`${CITIES.length} grandes villes`}
            text={`dans ${REGION_COUNT} régions`}
          />
        </ul>
      </section>

      {/* Services */}
      <section id="services" className={`${section} scroll-mt-20`}>
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className={h2}>Tous les débarras, du grenier à la maison entière</h2>
              <p className={lead}>
                Chaque situation a sa page, ses conseils et ses prix. Choisissez la vôtre.
              </p>
            </div>
            <Link to="/estimation" className={`${btnOutline} min-h-11 px-5 text-[15px]`}>
              Je ne sais pas, estimer directement
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const dark = "dark" in service && service.dark;
              return (
                <Link
                  key={service.to}
                  to={service.to}
                  className={`group block overflow-hidden rounded-[20px] border transition-colors ${
                    dark
                      ? "border-brand-ink bg-brand-ink text-white"
                      : "border-border bg-card text-brand-ink hover:border-primary"
                  }`}
                >
                  <img
                    src={service.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <div className="px-6 pb-6 pt-5">
                    <h3 className="text-[21px] font-extrabold">{service.title}</h3>
                    <p
                      className={`mb-3.5 mt-2 text-base leading-relaxed ${
                        dark ? "text-[#BFD8C8]" : "text-muted-foreground"
                      }`}
                    >
                      {service.text}
                    </p>
                    <span
                      className={`text-[15px] font-bold group-hover:underline ${
                        dark ? "text-[#6EDC97]" : "text-primary"
                      }`}
                    >
                      Voir le service
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notre méthode */}
      <section id="methode" className={`${section} scroll-mt-20 bg-[#F2FAF4]`}>
        <div className={wrap}>
          <h2 className={h2}>Notre méthode, en 4 étapes</h2>
          <p className={lead}>
            De la première photo à la remise des clés, tout se suit depuis votre espace client.
          </p>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-[20px] bg-white p-7">
                <span
                  className={`flex size-11 items-center justify-center rounded-full text-lg font-extrabold ${
                    index === steps.length - 1
                      ? "bg-brand-soft text-brand-ink"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {index + 1}
                </span>
                <h3 className="mt-[18px] text-xl font-extrabold">{step.title}</h3>
                <p className="mt-2.5 text-base leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/estimation" className={btnPrimary}>
              Commencer mon estimation
            </Link>
            <Link to="/comment-ca-marche" className="font-bold text-primary hover:underline">
              Voir le détail de la méthode
            </Link>
          </div>
        </div>
      </section>

      {/* Avant / après */}
      <section className={section}>
        <div className={`${wrap} grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14`}>
          <div>
            <h2 className={h2}>Ce que vous récupérez à la fin du chantier</h2>
            <p className={lead}>
              Un lieu vide et balayé, des objets orientés vers le don, le réemploi ou la
              déchetterie, et des photos avant/après dans votre espace.
            </p>
            <ul className="mt-7 flex flex-col gap-3.5">
              {[
                "Évacuation, tri et nettoyage inclus",
                "Photos de fin de chantier envoyées par le pro",
                "Rapport PDF téléchargeable pour une succession",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-[17px]">
                  <Check
                    className="mt-0.5 size-[22px] shrink-0 text-primary"
                    strokeWidth={2.6}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <figure className="relative">
              <img
                src={galleryAvant}
                alt="Appartement encombré avant le débarras"
                loading="lazy"
                className="aspect-[3/4] w-full rounded-[22px] object-cover"
              />
              <figcaption className="absolute bottom-3.5 left-3.5 rounded-full bg-white px-3.5 py-2 text-[15px] font-extrabold text-brand-ink">
                Avant
              </figcaption>
            </figure>
            <figure className="relative">
              <img
                src={galleryApres}
                alt="Le même appartement vidé et nettoyé"
                loading="lazy"
                className="aspect-[3/4] w-full rounded-[22px] object-cover"
              />
              <figcaption className="absolute bottom-3.5 left-3.5 rounded-full bg-brand-soft px-3.5 py-2 text-[15px] font-extrabold text-brand-ink">
                Après
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className={`${section} scroll-mt-20 bg-[#F2FAF4]`}>
        <div className={`${wrap} grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14`}>
          <div>
            <h2 className={h2}>Nos tarifs, sans frais cachés</h2>
            <p className={lead}>
              Le prix se calcule sur le volume à évacuer, puis s'ajuste selon l'accès. Aucune
              commission pour le particulier.
            </p>
            <dl className="mt-7 rounded-[20px] bg-white px-6 py-2">
              <PriceFactor label="Prix au m³" value={euro(PRICING.pricePerM3)} />
              <PriceFactor label="Minimum par chantier" value={euro(PRICING.minimumPrice)} />
              <PriceFactor
                label="Par étage sans ascenseur"
                value={`+${pct(PRICING.floorSurchargeRate)}, max. ${pct(PRICING.maxFloorSurcharge)}`}
              />
              <PriceFactor
                label="Objets lourds ou volumineux"
                value={`+${pct(PRICING.bulkySurchargeRate)}`}
              />
              <PriceFactor
                label="Accès difficile"
                value={`+${pct(PRICING.hardAccessSurchargeRate)}`}
                last
              />
            </dl>
          </div>
          <div className="overflow-x-auto rounded-[20px] bg-white px-7 pb-6 pt-3">
            <table className="w-full min-w-[380px] border-collapse">
              <caption className="pb-3 pt-4 text-left text-xl font-extrabold text-brand-ink">
                Exemples de prix
              </caption>
              <thead>
                <tr className="text-sm text-muted-foreground">
                  <th scope="col" className="pb-2.5 text-left font-bold">
                    Lieu
                  </th>
                  <th scope="col" className="pb-2.5 text-right font-bold">
                    Volume courant
                  </th>
                  <th scope="col" className="pb-2.5 text-right font-bold">
                    Fourchette
                  </th>
                </tr>
              </thead>
              <tbody>
                {priceExamples.map((row) => (
                  <tr key={row.place} className="border-t border-border">
                    <td className="py-[15px]">{row.place}</td>
                    <td className="py-[15px] text-right tabular-nums text-muted-foreground">
                      {row.volume} m³
                    </td>
                    <td className="py-[15px] text-right font-bold tabular-nums">
                      {num(row.price.priceMin)} – {euro(row.price.priceMax)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-normal text-muted-foreground">
              Au rez-de-chaussée ou avec ascenseur. Votre prix exact dépend de vos photos ou de
              votre description.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/estimation" className={`${btnPrimary} min-h-11 px-5 text-[15px]`}>
                Calculer mon prix
              </Link>
              <Link to="/tarifs" className={`${btnOutline} min-h-11 px-5 text-[15px]`}>
                Grille complète
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi nous */}
      <section className={section}>
        <div className={wrap}>
          <h2 className={h2}>Pourquoi passer par Débarras France ?</h2>
          <p className={lead}>
            Ce que la plateforme ajoute par rapport à un débarrasseur trouvé seul.
          </p>
          <div className="mt-9 overflow-x-auto rounded-[20px] border border-border">
            <table className="w-full min-w-[620px] border-collapse text-left text-base">
              <thead>
                <tr>
                  <th scope="col" className="w-[40%] border-b border-border px-[18px] py-4" />
                  <th
                    scope="col"
                    className="border-b border-border bg-primary px-[18px] py-4 font-bold text-primary-foreground"
                  >
                    Avec Débarras France
                  </th>
                  <th
                    scope="col"
                    className="border-b border-border px-[18px] py-4 text-sm font-bold text-muted-foreground"
                  >
                    En direct, sans plateforme
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, index) => {
                  const border = index < comparison.length - 1 ? "border-b border-border" : "";
                  return (
                    <tr key={item.row}>
                      <th
                        scope="row"
                        className={`${border} px-[18px] py-4 font-bold text-brand-ink`}
                      >
                        {item.row}
                      </th>
                      <td className={`${border} bg-[#F2FAF4] px-[18px] py-4 font-semibold`}>
                        {item.us}
                      </td>
                      <td className={`${border} px-[18px] py-4 text-muted-foreground`}>
                        {item.them}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Succession & prescripteurs */}
      <section id="succession" className={`${section} scroll-mt-20 bg-brand-ink text-white`}>
        <div className={wrap}>
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <h2 className={`${h2} text-white`}>Débarras après succession, même à distance</h2>
              <p className="mt-4 text-lg leading-relaxed text-[#BFD8C8]">
                Une maison ou un appartement à vider après le décès d'un proche ? Préparez les
                consignes pour les héritiers, la remise des clés, les objets à conserver et votre
                date limite.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/debarras-succession" className={btnSoft}>
                  Organiser un débarras de succession
                </Link>
              </div>
            </div>
            <ul className="flex flex-col gap-3.5">
              {[
                [
                  "Objets à conserver",
                  "Listez les souvenirs et papiers à mettre de côté pour la famille.",
                ],
                [
                  "Clés et accès à distance",
                  "Indiquez qui remet les clés et quand, sans vous déplacer.",
                ],
                [
                  "Rapport pour le notaire",
                  "Un PDF avant/après téléchargeable à la fin du chantier.",
                ],
              ].map(([title, text]) => (
                <li key={title} className="flex gap-4 rounded-[18px] bg-[#134A2B] px-[22px] py-5">
                  <Check
                    className="mt-0.5 size-6 shrink-0 text-[#6EDC97]"
                    strokeWidth={2.4}
                    aria-hidden="true"
                  />
                  <span className="text-base leading-normal">
                    <strong>{title}</strong>
                    <br />
                    <span className="text-[#BFD8C8]">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-16 grid gap-6 border-t border-white/15 pt-10 sm:grid-cols-3">
            {[
              ["Études notariales", "Successions, biens à libérer, rapport de fin de chantier."],
              ["Agences immobilières", "Préparation à la vente, fins de bail, remise des clés."],
              ["EHPAD", "Vider un logement lors d'une entrée en établissement."],
            ].map(([title, text]) => (
              <div key={title}>
                <h3 className="text-[19px] font-extrabold">{title}</h3>
                <p className="mt-2 text-base leading-relaxed text-[#BFD8C8]">{text}</p>
              </div>
            ))}
          </div>
          <Link
            to="/partenaires-prescripteurs"
            className="mt-7 inline-block font-bold text-[#6EDC97] hover:underline"
          >
            Vous êtes prescripteur ? Devenez partenaire
          </Link>
        </div>
      </section>

      {/* Villes */}
      <section id="villes" className={`${section} scroll-mt-20`}>
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className={h2}>Débarras dans votre ville</h2>
              <p className={lead}>
                {CITIES.length} grandes villes, avec les contraintes locales : stationnement,
                étages, quartiers.
              </p>
            </div>
            <Link to="/professionnels" className={`${btnOutline} min-h-11 px-5 text-[15px]`}>
              Voir les pros par région
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 border-t border-border pt-4 sm:grid-cols-3 lg:grid-cols-5">
            {FEATURED_CITIES.map((city) => (
              <li key={city.slug}>
                <Link
                  to="/debarras/$ville"
                  params={{ ville: city.slug }}
                  className="block py-1.5 text-[15px] text-brand-ink hover:text-primary hover:underline"
                >
                  Débarras {city.preposition}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/debarras" className="mt-5 inline-block font-bold text-primary hover:underline">
            Voir les {CITIES.length} villes
          </Link>
        </div>
      </section>

      {/* Recrutement des pros */}
      <section id="pros" className={`${section} scroll-mt-20 bg-brand-soft`}>
        <div className={`${wrap} grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14`}>
          <div>
            <span className="inline-flex size-12 items-center justify-center rounded-[14px] bg-white text-brand-ink">
              <Hammer className="size-6" aria-hidden="true" />
            </span>
            <h2 className={`${h2} mt-5`}>
              Vous êtes débarrasseur ? Recevez des chantiers près de chez vous.
            </h2>
            <p className={`${lead} text-[#34433A]`}>
              <strong className="text-brand-ink">
                Offre fondateur : 0 % de commission sur vos 5 premiers chantiers
              </strong>{" "}
              pour les 20 premiers pros inscrits. Vous encaissez 100 % du montant.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/pros" className={`${btn} bg-brand-ink text-white hover:bg-brand-ink/90`}>
                Devenir débarrasseur partenaire
              </Link>
              <Link to="/auth" search={{ mode: "signin", role: "pro" }} className={btnOutline}>
                Espace pro
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {proBenefits.map((benefit) => (
              <div key={benefit.title} className="rounded-[18px] bg-white p-[22px]">
                <h3 className="text-lg font-extrabold">{benefit.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={section}>
        <div className={wrap}>
          <h2 className={h2}>Questions fréquentes</h2>
          <div className="mt-9 grid items-start gap-3.5 md:grid-cols-2">
            {[faq.slice(0, 3), faq.slice(3)].map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-3.5">
                {column.map((item, index) => (
                  <details
                    key={item.question}
                    open={columnIndex === 0 && index === 0}
                    className="group rounded-2xl border border-border bg-card px-[22px] open:border-primary"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[17px] font-bold text-brand-ink [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <Plus
                        className="size-[22px] shrink-0 text-primary group-open:hidden"
                        aria-hidden="true"
                      />
                      <Minus
                        className="hidden size-[22px] shrink-0 text-primary group-open:block"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="pb-5 text-base leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dernier appel */}
      <section className="pb-16 sm:pb-24">
        <div className={wrap}>
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-[28px] bg-primary px-7 py-12 text-primary-foreground sm:px-14 sm:py-14">
            <div className="max-w-[34em]">
              <h2 className={`${h2} text-white`}>Prêt à faire de la place ?</h2>
              <p className="mt-3.5 text-lg leading-relaxed text-white/85">
                Estimez votre débarras en 2 minutes, ou laissez-nous un message et nous revenons
                vers vous.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/estimation"
                search={{ type: "photo" }}
                className={`${btn} bg-brand-soft text-brand-ink hover:bg-white`}
              >
                <Camera className="size-5" aria-hidden="true" />
                Lancer mon devis IA
              </Link>
              <Link to="/contact" className={`${btn} bg-white text-brand-ink hover:bg-brand-soft`}>
                Être recontacté
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProofItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
}) {
  return (
    <li className="flex items-center gap-3.5">
      <Icon className="size-[30px] shrink-0 text-[#6EDC97]" aria-hidden="true" />
      <span className="text-base leading-snug">
        <strong className="text-lg">{title}</strong>
        <br />
        <span className="text-[#BFD8C8]">{text}</span>
      </span>
    </li>
  );
}

function PriceFactor({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 py-4 text-base ${last ? "" : "border-b border-border"}`}
    >
      <dt>{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}
