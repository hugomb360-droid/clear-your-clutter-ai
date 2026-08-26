import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
      { property: "og:url", content: "https://clearo.fr/contact" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://clearo.fr/contact" }],

  }),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 sm:py-16 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="text-3xl font-extrabold sm:text-4xl tracking-tight">Parlons de votre débarras</h1>
        <p className="mt-4 text-muted-foreground">
          Pour une estimation, passez plutôt par le parcours en photo : c'est immédiat. Pour tout le
          reste, écrivez-nous.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Mail className="size-4" />
            </span>
            bonjour@clearo.fr
          </li>
          <li className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Phone className="size-4" />
            </span>
            Du lundi au samedi, 9h – 19h
          </li>
          <li className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <MessageCircle className="size-4" />
            </span>
            Réponse sous 24 h ouvrées
          </li>
        </ul>
      </div>

      <form
        className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]"
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
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" required placeholder="Camille Durand" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required placeholder="vous@email.fr" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required rows={6} placeholder="Votre message" />
          </div>
          <Button type="submit" size="lg" disabled={sending}>
            {sending ? "Envoi..." : "Envoyer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
