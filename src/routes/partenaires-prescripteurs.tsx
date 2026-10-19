import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Building2, CheckCircle2, Files, HeartHandshake, Landmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactReferral } from "@/lib/succession.functions";
import { referralSchema } from "@/lib/succession.schemas";
import partnerPhoto from "@/assets/gallery-equipe.jpg";

export const Route = createFileRoute("/partenaires-prescripteurs")({
  head: () => ({ meta: [
    { title: "Partenaires prescripteurs : notaires, agences et EHPAD | Débarras France" },
    { name: "description", content: "Organisez le débarras des biens de vos clients avec Débarras France : coordination à distance, rapport PDF pour le notaire et projet de suivi multi-dossiers." },
    { property: "og:title", content: "Partenaires prescripteurs — Débarras France" },
    { property: "og:description", content: "Un interlocuteur pour les dossiers de débarras des notaires, agences immobilières et EHPAD." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "https://debarrasfrance.fr/partenaires-prescripteurs" }] }),
  component: Partners,
});

function Partners() {
  const submit = useServerFn(contactReferral);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  return <main>
    <section className="relative isolate flex min-h-80 items-end overflow-hidden bg-brand-ink">
      <img src={partnerPhoto} alt="Équipe de professionnels du débarras" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-foreground/65" />
      <div className="mx-auto w-full max-w-5xl px-4 py-12 text-primary-foreground"><p className="text-sm font-semibold">Notaires · Agences immobilières · EHPAD</p><h1 className="mt-3 max-w-2xl text-3xl font-extrabold sm:text-4xl">Partenaires prescripteurs<br />Débarras France</h1><p className="mt-4 max-w-xl">Accompagnez vos clients jusqu'à la remise d'un logement vidé, même à distance.</p></div>
    </section>
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid gap-8 sm:grid-cols-3">{[{ icon: Landmark, title: "Études notariales", text: "Successions, biens à libérer, souvenirs à préserver et rapport de fin de chantier." }, { icon: Building2, title: "Agences immobilières", text: "Préparation à la vente, fins de bail et coordination de la remise des clés." }, { icon: HeartHandshake, title: "EHPAD", text: "Accompagnement des familles pour vider un logement lors d'une entrée en établissement." }].map(item => <div key={item.title}><item.icon className="size-6 text-primary" /><h2 className="mt-3 text-lg font-bold">{item.title}</h2><p className="mt-2 text-sm text-muted-foreground">{item.text}</p></div>)}</div>
      <div className="mt-12 border-y border-border py-8"><Files className="size-6 text-primary" /><h2 className="mt-3 text-2xl font-bold">Un suivi multi-dossiers pour votre équipe</h2><p className="mt-3 max-w-2xl text-muted-foreground">Notre engagement : réunir les adresses, échéances, propositions et rapports de vos dossiers dans un même espace. Ce tableau de bord prescripteur est en préparation ; contactez-nous pour participer à son lancement.</p><Button asChild variant="outline" className="mt-5"><Link to="/debarras-succession">Ouvrir un dossier succession</Link></Button></div>
    </section>
    <section className="bg-secondary/50"><div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-[1fr_1.2fr]">
      <div><h2 className="text-2xl font-bold">Devenir partenaire</h2><p className="mt-4 text-muted-foreground">Échangeons sur votre secteur et vos besoins de débarras.</p><a href="mailto:clientclearo@gmail.com" className="mt-5 inline-block break-all text-sm text-primary underline">clientclearo@gmail.com</a></div>
      {sent ? <div role="status" className="py-8"><CheckCircle2 className="size-8 text-primary" /><h3 className="mt-4 text-xl font-bold">Votre demande est enregistrée</h3><p className="mt-3 text-muted-foreground">L'équipe Débarras France pourra vous contacter à l'adresse indiquée.</p><Button variant="outline" onClick={() => setSent(false)} className="mt-5">Nouvelle demande</Button></div> : <form className="space-y-4" onSubmit={async e => {
        e.preventDefault(); setError(""); const fields = new FormData(e.currentTarget);
        const parsed = referralSchema.safeParse({ ...Object.fromEntries(fields), consent: fields.get("consent") === "on" });
        if (!parsed.success) { setError("Vérifiez vos coordonnées, votre message (10 caractères minimum) et votre accord pour être contacté."); return; }
        setSending(true); try { await submit({ data: parsed.data }); setSent(true); } catch (err) { setError(err instanceof Error ? err.message : "Envoi impossible"); } finally { setSending(false); }
      }}>
        <div className="grid gap-2"><Label htmlFor="p-profession">Votre activité</Label><select id="p-profession" name="profession" className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="notaire">Notaire</option><option value="agence">Agence immobilière</option><option value="ehpad">EHPAD</option></select></div>
        <div className="grid gap-2"><Label htmlFor="p-organization">Nom de votre structure</Label><Input id="p-organization" name="organization" required minLength={2} maxLength={150} /></div>
        <div className="grid gap-2"><Label htmlFor="p-name">Votre nom</Label><Input id="p-name" name="name" required minLength={2} maxLength={100} /></div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="grid gap-2"><Label htmlFor="p-email">E-mail professionnel</Label><Input id="p-email" name="email" type="email" required maxLength={255} /></div><div className="grid gap-2"><Label htmlFor="p-phone">Téléphone (facultatif)</Label><Input id="p-phone" name="phone" type="tel" maxLength={30} /></div></div>
        <div className="grid gap-2"><Label htmlFor="p-message">Vos besoins et votre secteur</Label><Textarea id="p-message" name="message" rows={4} required minLength={10} maxLength={3000} placeholder="Secteur d'intervention, nombre de dossiers, besoins de vos clients…" /></div>
        <input name="website" tabIndex={-1} aria-hidden="true" className="hidden" autoComplete="off" defaultValue="" />
        <label className="flex items-start gap-3 text-sm"><input name="consent" type="checkbox" required className="mt-1 size-4 shrink-0 accent-primary" />J'accepte d'être contacté au sujet de ce partenariat. Mes informations servent uniquement à traiter cette demande.</label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={sending}>{sending && <Loader2 className="mr-2 size-4 animate-spin" />}Demander un échange</Button>
      </form>}
    </div></section>
  </main>;
}