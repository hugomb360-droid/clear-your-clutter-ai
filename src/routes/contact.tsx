import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, FileCheck2, Hammer, Landmark, Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, btnPrimary, wrap } from "@/components/site/page-kit";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contacter Débarras France" },
      {
        name: "description",
        content:
          "Une question sur un débarras, un devis ou un partenariat ? L'équipe Débarras France vous répond sous 24 h ouvrées.",
      },
      { property: "og:title", content: "Contacter l'équipe Débarras France" },
      { property: "og:description", content: "Réponse sous 24 h ouvrées, du lundi au samedi." },
      { property: "og:url", content: "https://debarrasfrance.fr/contact" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/contact" }],
  }),
  component: Contact,
});

const SHORTCUTS = [
  {
    to: "/estimation",
    icon: Camera,
    title: "Obtenir un prix",
    text: "Le devis rapide par IA donne une fourchette en 2 minutes.",
  },
  {
    to: "/debarras-succession",
    icon: FileCheck2,
    title: "Dossier succession",
    text: "Clés à distance, objets à conserver, rapport pour le notaire.",
  },
  {
    to: "/pros",
    icon: Hammer,
    title: "Devenir partenaire",
    text: "Vous êtes débarrasseur et cherchez des chantiers.",
  },
  {
    to: "/partenaires-prescripteurs",
    icon: Landmark,
    title: "Notaires, agences, EHPAD",
    text: "Accompagnez vos clients jusqu'à la remise du logement vidé.",
  },
] as const;

function Contact() {
  const [sending, setSending] = useState(false);

  return (
    <main className="bg-[#F2FAF4] pb-20 pt-8 sm:pb-28">
      <div className={wrap}>
        <Breadcrumb items={[{ label: "Contact" }]} />
        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div>
            <h1 className="max-w-[14ch] text-[36px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[52px]">
              Parlons de votre débarras
            </h1>
            <p className="mt-5 max-w-[34em] text-lg leading-relaxed text-[#34433A]">
              Pour une estimation, passez plutôt par le parcours en photo : c'est immédiat. Pour
              tout le reste, écrivez-nous.
            </p>
            <ul className="mt-8 flex flex-col gap-4 text-base">
              <li className="flex items-center gap-3.5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-white text-brand-ink">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <a
                  href="mailto:clientclearo@gmail.com"
                  className="font-semibold text-brand-ink hover:underline"
                >
                  clientclearo@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3.5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-white text-brand-ink">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                Du lundi au samedi, 9h – 19h
              </li>
              <li className="flex items-center gap-3.5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-white text-brand-ink">
                  <MessageCircle className="size-5" aria-hidden="true" />
                </span>
                Réponse sous 24 h ouvrées
              </li>
            </ul>

            <h2 className="mt-12 text-xl font-extrabold text-brand-ink">Vous cherchez peut-être</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {SHORTCUTS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex gap-3.5 rounded-[18px] border border-border bg-white p-4 text-brand-ink transition-colors hover:border-primary"
                >
                  <item.icon className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
                  <span>
                    <strong className="block group-hover:underline">{item.title}</strong>
                    <span className="text-sm leading-snug text-muted-foreground">{item.text}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <form
            className="rounded-[28px] bg-white p-6 shadow-[0_18px_40px_-22px_rgba(0,127,61,0.45)] sm:p-10"
            onSubmit={(event) => {
              event.preventDefault();
              setSending(true);
              setTimeout(() => {
                setSending(false);
                (event.target as HTMLFormElement).reset();
                toast.success("Message envoyé", {
                  description: "L'équipe Débarras France vous répond très vite.",
                });
              }, 500);
            }}
          >
            <h2 className="text-2xl font-extrabold text-brand-ink">Écrivez-nous</h2>
            <div className="mt-6 grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Camille Durand"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="vous@email.fr"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Votre message"
                  className="rounded-xl"
                />
              </div>
              <button type="submit" disabled={sending} className={`${btnPrimary} w-full`}>
                {sending ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
