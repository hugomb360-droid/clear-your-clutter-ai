import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Clock3, Leaf, MapPin, Quote, ShieldCheck, Sparkles, Star } from "lucide-react";
import heroImage from "@/assets/hero-clearo.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clearo — devis de débarras en photo grâce à l'IA" },
      {
        name: "description",
        content:
          "Photographiez ce que vous voulez débarrasser : notre IA estime le volume et le prix en quelques secondes, puis vous met en relation avec un débarrasseur près de chez vous.",
      },
      { property: "og:title", content: "Clearo — votre débarras estimé en photo" },
      {
        property: "og:description",
        content:
          "Devis instantané par IA et mise en relation avec des professionnels du débarras près de chez vous.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

const trust = [
  { icon: ShieldCheck, title: "Pros vérifiés", text: "SIRET et assurance contrôlés." },
  { icon: Clock3, title: "Devis en 2 minutes", text: "Sans visite, sans appel commercial." },
  { icon: Leaf, title: "Tri responsable", text: "Réemploi et recyclage privilégiés." },
  { icon: Star, title: "Prix transparents", text: "Grille publique, zéro frais caché." },
];

const reviews = [
  {
    name: "Sophie L.",
    location: "Paris 12e",
    rating: 5,
    text: "J'ai envoyé 4 photos de mon appartement, j'ai eu un prix en moins d'une minute. Le pro est venu 2 jours après, tout était propre.",
  },
  {
    name: "Marc D.",
    location: "Bordeaux",
    rating: 5,
    text: "Génial pour vider la cave de ma mère. L'estimation IA était juste, et j'ai reçu 3 propositions de pros du coin.",
  },
  {
    name: "Claire & Julien",
    location: "Lyon",
    rating: 4,
    text: "Simple, rapide, pas d'appels insistants. On a comparé les offres et choisi le débarrasseur qui nous convenait.",
  },
  {
    name: "Karim B.",
    location: "Nantes",
    rating: 5,
    text: "Service impeccable. J'ai pu suivre mon devis depuis mon espace client et valider la proposition en un clic.",
  },
];

const stats = [
  { value: "12 000+", label: "débarras estimés" },
  { value: "850+", label: "pros vérifiés" },
  { value: "4,8/5", label: "note moyenne" },
  { value: "2 min", label: "pour un devis IA" },
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
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand-ink">
              <Sparkles className="size-4" /> Estimation par IA
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Votre débarras estimé
              <span className="text-brand"> en une photo</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Clearo analyse vos photos, calcule le volume à évacuer et vous donne un prix immédiat.
              Puis on vous met en relation avec un débarrasseur près de chez vous.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/estimation">Estimer mon débarras</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/comment-ca-marche">Comment ça marche</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Gratuit, sans engagement · Réponse des pros sous 48 h
            </p>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Équipe de débarras évacuant cartons et meubles d'un appartement"
              width={1600}
              height={1200}
              className="w-full rounded-[2rem] object-cover shadow-[var(--shadow-lift)]"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">
            Trois étapes, zéro paperasse
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]"
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

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((item) => (
            <div key={item.title} className="rounded-3xl border border-border p-6">
              <item.icon className="size-5 text-brand" />
              <h3 className="mt-4 font-bold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand-ink">
              <Star className="size-4" /> Avis clients
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight">
              Ils ont fait de la place avec Clearo
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Des milliers de clients ont déjà estimé leur débarras par photo et trouvé un pro près de chez eux.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="relative flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
              >
                <Quote className="absolute right-5 top-5 size-6 text-brand/20" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < review.rating ? "fill-brand text-brand" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                  "{review.text}"
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-brand-soft font-bold text-brand-ink">
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[2rem] bg-brand-ink px-8 py-14 text-center text-primary-foreground">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
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
