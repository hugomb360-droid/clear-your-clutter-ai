import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, PencilLine } from "lucide-react";
import {
  Breadcrumb,
  CtaBand,
  btnOutline,
  btnPrimary,
  btnSoft,
  btnWhite,
  wrap,
} from "@/components/site/page-kit";

export const Route = createFileRoute("/comment-ca-marche")({
  head: () => ({
    meta: [
      { title: "Comment ça marche — Débarras France débarras" },
      {
        name: "description",
        content:
          "Photos, estimation IA du volume et du prix, demande transmise aux débarrasseurs de votre secteur : découvrez le parcours Débarras France en 2 minutes.",
      },
      { property: "og:title", content: "Comment ça marche — Débarras France" },
      {
        property: "og:description",
        content: "Un parcours de deux minutes, de la photo à la proposition du pro.",
      },
      { property: "og:url", content: "https://debarrasfrance.fr/comment-ca-marche" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/comment-ca-marche" }],
  }),
  component: HowItWorks,
});

/** Le parcours complet, de la photo au paiement du pro. Les 4 premières étapes sont celles du site. */
const TIMELINE = [
  {
    who: "Vous",
    time: "2 minutes",
    title: "Prenez vos photos",
    text: "Cave, garage, appartement complet : photographiez ce qu'il y a à débarrasser. 1 à 8 photos suffisent.",
  },
  {
    who: "L'IA",
    time: "quelques secondes",
    title: "L'IA estime le volume",
    text: "Notre IA identifie les objets, évalue le volume en m³ et applique la grille tarifaire Débarras France pour un prix immédiat.",
  },
  {
    who: "Vous",
    time: "1 minute",
    title: "Vous validez votre demande",
    text: "Ajoutez l'étage, l'accès, la date souhaitée et votre code postal. Le devis est enregistré dans votre espace.",
  },
  {
    who: "Les pros",
    time: "sous 48 h",
    title: "Les pros du coin répondent",
    text: "Les débarrasseurs de votre zone envoient leur proposition. Vous comparez, vous acceptez, vos coordonnées ne sont partagées qu'à ce moment.",
  },
  {
    who: "Vous",
    time: "le jour du chantier",
    title: "Le chantier a lieu",
    text: "Le pro vide, trie et nettoie. À la fin, il envoie ses photos de fin de chantier dans votre espace.",
  },
  {
    who: "Vous",
    time: "après le chantier",
    title: "Vous validez, le pro est payé",
    text: "Votre paiement était bloqué depuis la réservation. Vous validez, il est versé. Un souci ? Ouvrez un litige avec photos, les fonds restent bloqués.",
  },
];

function HowItWorks() {
  return (
    <main>
      {/* Ouverture typographique : pas de photo, un seul chiffre */}
      <section className="pb-12 pt-8">
        <div className={wrap}>
          <Breadcrumb items={[{ label: "Comment ça marche" }]} />
          <div className="mt-10 grid items-end gap-8 lg:grid-cols-[auto_1fr]">
            <p
              className="text-[120px] font-black leading-[0.85] tracking-[-0.05em] text-primary sm:text-[180px]"
              aria-hidden="true"
            >
              2<span className="text-[40px] tracking-normal sm:text-[56px]"> min</span>
            </p>
            <div className="max-w-[34em]">
              <h1 className="text-[34px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[44px]">
                Comment ça marche
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-[#34433A]">
                Débarras France remplace les visites d'estimation et les appels sans réponse par un
                parcours de deux minutes.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
            <Link to="/estimation" search={{ type: "photo" }} className={btnPrimary}>
              <Camera className="size-5" aria-hidden="true" />
              Lancer mon devis IA
            </Link>
            <Link to="/estimation" search={{ type: "manuel" }} className={btnOutline}>
              <PencilLine className="size-5" aria-hidden="true" />
              Devis classique
            </Link>
          </div>
        </div>
      </section>

      {/* Frise verticale */}
      <section className="border-t border-border py-16 sm:py-24">
        <div className={wrap}>
          <ol className="relative mx-auto max-w-[920px]">
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[27px] top-6 w-0.5 bg-border sm:left-[139px]"
            />
            {TIMELINE.map((step, index) => (
              <li
                key={step.title}
                className="relative grid gap-4 py-7 sm:grid-cols-[120px_56px_1fr] sm:gap-0"
              >
                <div className="hidden pr-6 pt-2 text-right sm:block">
                  <p className="text-sm font-black text-brand-ink">{step.who}</p>
                  <p className="text-sm text-muted-foreground">{step.time}</p>
                </div>
                <div className="relative z-[1] flex items-start">
                  <span
                    className={`flex size-14 items-center justify-center rounded-full border-4 border-white text-lg font-black ${
                      index === TIMELINE.length - 1
                        ? "bg-brand-soft text-brand-ink"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="sm:pl-8">
                  <p className="text-sm font-bold text-muted-foreground sm:hidden">
                    {step.who} · {step.time}
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold text-brand-ink sm:mt-2">
                    {step.title}
                  </h2>
                  <p className="mt-2 max-w-[52ch] text-[17px] leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#F2FAF4] py-16 sm:py-20">
        <div className={`${wrap} grid gap-8 md:grid-cols-3`}>
          {[
            ["Gratuit", "L'estimation et la mise en relation ne coûtent rien au particulier."],
            [
              "Sans engagement",
              "Vous n'êtes engagé qu'au moment où vous acceptez une proposition.",
            ],
            ["Vos coordonnées", "Transmises uniquement au pro dont vous acceptez l'offre."],
          ].map(([title, text]) => (
            <div key={title}>
              <h2 className="text-2xl font-extrabold text-brand-ink">{title}</h2>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        title="Pas de photo sous la main ?"
        text="Le formulaire déclaratif fonctionne aussi : décrivez le bien et le contenu, l'estimation reste gratuite et sans engagement."
      >
        <Link to="/estimation" search={{ type: "manuel" }} className={btnSoft}>
          <PencilLine className="size-5" aria-hidden="true" />
          Démarrer mon estimation
        </Link>
        <Link to="/tarifs" className={btnWhite}>
          Voir les tarifs
        </Link>
      </CtaBand>
    </main>
  );
}
