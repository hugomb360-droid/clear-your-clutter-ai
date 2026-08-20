import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Handshake, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/comment-ca-marche")({
  head: () => ({
    meta: [
      { title: "Comment ça marche — Clearo débarras" },
      {
        name: "description",
        content:
          "Photos, estimation IA, devis et mise en relation avec un débarrasseur près de chez vous : découvrez les 4 étapes Clearo.",
      },
      { property: "og:title", content: "Comment fonctionne Clearo" },
      {
        property: "og:description",
        content: "Estimez votre débarras en photo et recevez des propositions de pros locaux.",
      },
      { property: "og:url", content: "https://clearo.fr/comment-ca-marche" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://clearo.fr/comment-ca-marche" }],

  }),
  component: HowItWorks,
});

const STEPS = [
  {
    icon: Camera,
    title: "1. Prenez vos photos",
    text: "Cave, garage, appartement complet : photographiez ce qu'il y a à débarrasser. 1 à 8 photos suffisent.",
  },
  {
    icon: Sparkles,
    title: "2. L'IA estime le volume",
    text: "Notre IA identifie les objets, évalue le volume en m³ et applique la grille tarifaire Clearo pour un prix immédiat.",
  },
  {
    icon: MapPin,
    title: "3. Vous validez votre demande",
    text: "Ajoutez l'étage, l'accès, la date souhaitée et votre code postal. Le devis est enregistré dans votre espace.",
  },
  {
    icon: Handshake,
    title: "4. Les pros du coin répondent",
    text: "Les débarrasseurs de votre zone envoient leur proposition. Vous comparez, vous acceptez, vos coordonnées ne sont partagées qu'à ce moment.",
  },
];

function HowItWorks() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Comment ça marche</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Clearo remplace les visites d'estimation et les appels sans réponse par un parcours de deux
        minutes.
      </p>

      <ol className="mt-12 grid gap-6 sm:grid-cols-2">
        {STEPS.map((step) => (
          <li
            key={step.title}
            className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <step.icon className="size-5" />
            </span>
            <h2 className="mt-5 text-lg font-bold">{step.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-3xl bg-brand-soft p-8 text-center">
        <h2 className="text-2xl font-bold">Pas de photo sous la main ?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Le formulaire déclaratif fonctionne aussi : décrivez le bien et le contenu, l'estimation
          reste gratuite et sans engagement.
        </p>
        <Button asChild className="mt-6" size="lg">
          <Link to="/estimation">Démarrer mon estimation</Link>
        </Button>
      </div>
    </div>
  );
}
