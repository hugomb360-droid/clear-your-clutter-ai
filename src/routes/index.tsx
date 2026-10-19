import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, MapPin, Quote, Sparkles, Star } from "lucide-react";
import heroBefore from "@/assets/hero-clearo-v2.jpg.asset.json";
import heroAfter from "@/assets/hero-apres-v1.jpg.asset.json";
import galleryEquipe from "@/assets/gallery-equipe.jpg";
import galleryAvant from "@/assets/gallery-avant.jpg";
import galleryApres from "@/assets/gallery-apres.jpg";
import galleryCamion from "@/assets/gallery-camion.jpg";
import galleryCave from "@/assets/gallery-cave.jpg";
import clipVideo from "@/assets/debarras-clip.mp4.asset.json";
import { Button } from "@/components/ui/button";
import { RoomVolume3D } from "@/components/room-volume-3d";
import { BeforeAfterSlider } from "@/components/before-after-slider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Débarras France – Devis rapide en photo avec IA" },
      {
        name: "description",
        content:
          "Photographiez ce que vous voulez débarrasser : notre IA estime le volume et le prix en quelques secondes, puis vous met en relation avec un débarrasseur près de chez vous.",
      },
      { property: "og:title", content: "Débarras France – Devis rapide en photo avec IA" },
      {
        property: "og:description",
        content:
          "Photographiez ce que vous voulez débarrasser : notre IA estime le volume et le prix en quelques secondes, puis vous met en relation avec un débarrasseur près de chez vous.",
      },
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

const steps = [
  {
    icon: Camera,
    title: "Prenez vos photos",
    text: "Cave, appartement, garage, succession : quelques photos suffisent.",
  },
  {
    icon: Sparkles,
    title: "L'IA estime tout",
    text: "Volume en m³, type d'objets, contraintes d'accès et fourchette de prix.",
  },
  {
    icon: MapPin,
    title: "Un pro du coin répond",
    text: "Les débarrasseurs de votre secteur vous envoient leurs propositions.",
  },
];


const reviews = [
  {
    name: "Paiement bloqué",
    location: "Séquestre sécurisé",
    text: "Vous payez en ligne, mais l'argent reste bloqué. Le professionnel n'est payé qu'une fois que vous avez validé la fin du chantier.",
  },
  {
    name: "Prix connu d'avance",
    location: "Estimation photo",
    text: "Le volume et la fourchette de prix sont calculés à partir de vos photos, avant tout déplacement. Pas de visite obligatoire.",
  },
  {
    name: "Pros vérifiés",
    location: "SIRET contrôlé",
    text: "Chaque débarrasseur renseigne son numéro SIRET et ses zones d'intervention avant de pouvoir vous faire une proposition.",
  },
  {
    name: "Litige possible",
    location: "Photos à l'appui",
    text: "Un problème à la fin du chantier ? Ouvrez un litige avec photos : les fonds restent bloqués le temps de l'examen.",
  },
];


const stats = [
  { value: "2 min", label: "pour une estimation photo" },
  { value: "0 €", label: "estimation gratuite" },
  { value: "100 %", label: "paiement sous séquestre" },
  { value: "40+", label: "grandes villes couvertes" },
];

const faq = [
  {
    question: "L'estimation par IA est-elle vraiment gratuite ?",
    answer:
      "Oui, l'estimation par photo est 100 % gratuite et sans engagement. Vous recevez une fourchette de prix instantanément.",
  },
  {
    question: "Que se passe-t-il après mon devis ?",
    answer:
      "Les débarrasseurs de votre secteur consultent votre demande et vous envoient leurs propositions personnalisées. Vous choisissez celle qui vous convient.",
  },
  {
    question: "Comment sont vérifiés les professionnels ?",
    answer:
      "Chaque pro doit fournir un numéro SIRET valide et une attestation d'assurance. Notre équipe valide manuellement chaque inscription.",
  },
  {
    question: "Puis-je refuser une proposition ?",
    answer:
      "Bien sûr. Vous n'êtes engagé qu'au moment où vous acceptez une offre. Avant cela, vous pouvez comparer librement.",
  },
];

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-12 lg:py-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand-ink sm:text-sm">
              <Sparkles className="size-4" /> Estimation par IA
            </span>
            <h1 className="mt-4 text-[2.5rem] font-extrabold leading-[1.05] tracking-tight sm:mt-5 sm:text-6xl lg:text-7xl">
              Votre débarras estimé
              <span className="text-brand"> en une photo</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:mt-5 sm:text-xl">
              Débarras France analyse vos photos, calcule le volume à évacuer et vous donne un prix immédiat.
              Puis on vous met en relation avec un débarrasseur près de chez vous.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="w-full rounded-full px-7 text-base sm:w-auto">
                <Link to="/estimation">Estimer mon débarras</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full rounded-full px-7 text-base sm:w-auto">
                <Link to="/comment-ca-marche">Comment ça marche</Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Gratuit, sans engagement · Réponse des pros sous 48 h
            </p>
          </div>
          <div className="relative">
            <BeforeAfterSlider
              beforeSrc={heroBefore.url}
              afterSrc={heroAfter.url}
              beforeAlt="Appartement encombré avant débarras"
              afterAlt="Appartement vide et nettoyé après débarras"
            />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Faites glisser la barre pour voir l'avant / après
            </p>
          </div>

        </div>
      </section>

      <section className="border-y border-border bg-secondary/40 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-6 sm:divide-x sm:divide-border lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:first:pl-0">
                <p className="text-2xl font-extrabold sm:text-3xl tracking-tight text-brand sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl tracking-tight">
            Trois étapes, zéro paperasse
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-[var(--shadow-soft)]"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink">
                  <step.icon className="size-5" />
                </div>
                <p className="mt-5 text-sm font-semibold text-muted-foreground">
                  Étape {index + 1}
                </p>
                <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="border-t border-border py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand-ink">
              Chantiers réels
            </span>
            <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl tracking-tight">
              À quoi ressemble un débarras Débarras France
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Appartements, caves, maisons : nos pros vident, trient et nettoient. Voici des
              chantiers en images.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-lift)] lg:col-span-2">
              <video
                src={clipVideo.url}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={galleryEquipe}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                Débarras d'appartement · Paris
              </span>
            </div>
            <div className="grid gap-5">
              <figure className="relative overflow-hidden rounded-[2rem] border border-border">
                <img
                  src={galleryAvant}
                  alt="Appartement encombré avant le débarras"
                  width={1280}
                  height={960}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                  Avant
                </figcaption>
              </figure>
              <figure className="relative overflow-hidden rounded-[2rem] border border-border">
                <img
                  src={galleryApres}
                  alt="Le même appartement vidé et nettoyé après le débarras"
                  width={1280}
                  height={960}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Après
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {[
              { src: galleryEquipe, alt: "Équipe de débarras évacuant cartons et meubles", caption: "Équipe de 2 pros" },
              { src: galleryCamion, alt: "Camion de débarras chargé de meubles et d'un matelas", caption: "Évacuation le jour même" },
              { src: galleryCave, alt: "Cave encombrée en cours de débarras", caption: "Caves & garages" },
            ].map((photo) => (
              <figure
                key={photo.caption}
                className="relative overflow-hidden rounded-[2rem] border border-border"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={1280}
                  height={960}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand-ink">
              <Star className="size-4" /> Nos engagements
            </span>
            <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl tracking-tight">
              Un débarras sans mauvaise surprise
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Arnaques, frais cachés, travail bâclé : voici comment nous vous protégeons à chaque étape.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="relative flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
              >
                <Quote className="absolute right-5 top-5 size-6 text-brand/30" />
                <p className="text-base font-bold">{review.name}</p>
                <p className="text-xs font-medium text-brand">{review.location}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RoomVolume3D />


      <section className="border-t border-border py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand-ink">
              FAQ
            </span>
            <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl tracking-tight">
              Vos questions, nos réponses
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {faq.map((item) => (
              <div
                key={item.question}
                className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
              >
                <h3 className="font-bold leading-snug">{item.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[2rem] bg-brand-ink px-8 py-14 text-center text-primary-foreground">
            <h2 className="text-2xl font-extrabold sm:text-3xl tracking-tight sm:text-4xl">
              Prêt à faire de la place ?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
              Quelques photos et vous savez combien coûte votre débarras. Les pros de votre secteur
              s'occupent du reste.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-7">
                <Link to="/estimation">Démarrer mon estimation</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/30 bg-transparent px-7 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/pros">Je suis un professionnel</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
