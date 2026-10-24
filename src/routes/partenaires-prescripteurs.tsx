import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Files,
  HeartHandshake,
  Landmark,
  Loader2,
  Mail,
} from "lucide-react";
import {
  InfoGrid,
  PageHero,
  Section,
  SectionHeading,
  btnOnDark,
  btnOutline,
  btnPrimary,
  btnSm,
  h2Class,
  onDarkMuted,
} from "@/components/site/page-kit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactReferral } from "@/lib/succession.functions";
import { referralSchema } from "@/lib/succession.schemas";
import partnerPhoto from "@/assets/gallery-equipe.jpg";

export const Route = createFileRoute("/partenaires-prescripteurs")({
  head: () => ({
    meta: [
      { title: "Partenaires prescripteurs : notaires, agences et EHPAD | Débarras France" },
      {
        name: "description",
        content:
          "Organisez le débarras des biens de vos clients avec Débarras France : coordination à distance, rapport PDF pour le notaire et projet de suivi multi-dossiers.",
      },
      { property: "og:title", content: "Partenaires prescripteurs — Débarras France" },
      {
        property: "og:description",
        content:
          "Un interlocuteur pour les dossiers de débarras des notaires, agences immobilières et EHPAD.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/partenaires-prescripteurs" }],
  }),
  component: Partners,
});

function Partners() {
  const submit = useServerFn(contactReferral);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  return (
    <main>
      <PageHero
        crumbs={[{ label: "Partenaires prescripteurs" }]}
        title="Partenaires prescripteurs Débarras France"
        subtitle="Notaires, agences immobilières et EHPAD"
        intro="Accompagnez vos clients jusqu'à la remise d'un logement vidé, même à distance."
        image={partnerPhoto}
        imageAlt="Équipe de professionnels du débarras"
        actions={
          <>
            <a href="#devenir-partenaire" className={btnPrimary}>
              Devenir partenaire
            </a>
            <Link to="/debarras-succession" className={btnOutline}>
              Ouvrir un dossier succession
            </Link>
          </>
        }
      />
      <Section tone="tint">
        <SectionHeading title="Pour qui ?" />
        <InfoGrid
          columns={3}
          items={[
            {
              icon: <Landmark className="size-6" aria-hidden="true" />,
              title: "Études notariales",
              text: "Successions, biens à libérer, souvenirs à préserver et rapport de fin de chantier.",
            },
            {
              icon: <Building2 className="size-6" aria-hidden="true" />,
              title: "Agences immobilières",
              text: "Préparation à la vente, fins de bail et coordination de la remise des clés.",
            },
            {
              icon: <HeartHandshake className="size-6" aria-hidden="true" />,
              title: "EHPAD",
              text: "Accompagnement des familles pour vider un logement lors d'une entrée en établissement.",
            },
          ]}
        />
      </Section>
      <Section tone="dark">
        <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
          <span className="flex size-20 items-center justify-center rounded-3xl bg-[#134A2B] text-[#6EDC97]">
            <Files className="size-10" aria-hidden="true" />
          </span>
          <div>
            <h2 className={`${h2Class} text-white`}>Un suivi multi-dossiers pour votre équipe</h2>
            <p className={`mt-4 max-w-[44em] text-lg leading-relaxed ${onDarkMuted}`}>
              Notre engagement : réunir les adresses, échéances, propositions et rapports de vos
              dossiers dans un même espace. Ce tableau de bord prescripteur est en préparation ;
              contactez-nous pour participer à son lancement.
            </p>
            <Link to="/debarras-succession" className={`${btnOnDark} ${btnSm} mt-7`}>
              Ouvrir un dossier succession
            </Link>
          </div>
        </div>
      </Section>
      <section id="devenir-partenaire" className="scroll-mt-20 bg-[#F2FAF4] py-16 sm:py-24">
        <div className="mx-auto grid w-full max-w-[1240px] items-start gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:px-10">
          <div>
            <h2 className={`${h2Class} text-brand-ink`}>Devenir partenaire</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Échangeons sur votre secteur et vos besoins de débarras.
            </p>
            <a
              href="mailto:clientclearo@gmail.com"
              className="mt-6 inline-flex items-center gap-2.5 break-all font-semibold text-primary hover:underline"
            >
              <Mail className="size-5 shrink-0" aria-hidden="true" />
              clientclearo@gmail.com
            </a>
          </div>
          {sent ? (
            <div role="status" className="rounded-[28px] bg-white p-8 sm:p-10">
              <CheckCircle2 className="size-10 text-primary" />
              <h3 className="mt-4 text-2xl font-extrabold text-brand-ink">
                Votre demande est enregistrée
              </h3>
              <p className="mt-3 text-muted-foreground">
                L'équipe Débarras France pourra vous contacter à l'adresse indiquée.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className={`${btnOutline} ${btnSm} mt-6`}
              >
                Nouvelle demande
              </button>
            </div>
          ) : (
            <form
              className="space-y-5 rounded-[28px] bg-white p-6 shadow-[0_18px_40px_-22px_rgba(0,127,61,0.45)] sm:p-10"
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                const fields = new FormData(e.currentTarget);
                const parsed = referralSchema.safeParse({
                  ...Object.fromEntries(fields),
                  consent: fields.get("consent") === "on",
                });
                if (!parsed.success) {
                  setError(
                    "Vérifiez vos coordonnées, votre message (10 caractères minimum) et votre accord pour être contacté.",
                  );
                  return;
                }
                setSending(true);
                try {
                  await submit({ data: parsed.data });
                  setSent(true);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Envoi impossible");
                } finally {
                  setSending(false);
                }
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="p-profession">Votre activité</Label>
                <select
                  id="p-profession"
                  name="profession"
                  className="h-12 rounded-xl border border-input bg-background px-3 text-base"
                >
                  <option value="notaire">Notaire</option>
                  <option value="agence">Agence immobilière</option>
                  <option value="ehpad">EHPAD</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-organization">Nom de votre structure</Label>
                <Input
                  id="p-organization"
                  name="organization"
                  required
                  minLength={2}
                  maxLength={150}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-name">Votre nom</Label>
                <Input id="p-name" name="name" required minLength={2} maxLength={100} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="p-email">E-mail professionnel</Label>
                  <Input id="p-email" name="email" type="email" required maxLength={255} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="p-phone">Téléphone (facultatif)</Label>
                  <Input id="p-phone" name="phone" type="tel" maxLength={30} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-message">Vos besoins et votre secteur</Label>
                <Textarea
                  id="p-message"
                  name="message"
                  rows={4}
                  required
                  minLength={10}
                  maxLength={3000}
                  placeholder="Secteur d'intervention, nombre de dossiers, besoins de vos clients…"
                />
              </div>
              <input
                name="website"
                tabIndex={-1}
                aria-hidden="true"
                className="hidden"
                autoComplete="off"
                defaultValue=""
              />
              <label className="flex items-start gap-3 text-sm">
                <input
                  name="consent"
                  type="checkbox"
                  required
                  className="mt-1 size-4 shrink-0 accent-primary"
                />
                J'accepte d'être contacté au sujet de ce partenariat. Mes informations servent
                uniquement à traiter cette demande.
              </label>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <button type="submit" disabled={sending} className={`${btnPrimary} w-full sm:w-auto`}>
                {sending && <Loader2 className="size-4 animate-spin" />}Demander un échange
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
