import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Euro, ShieldCheck, Truck } from "lucide-react";
import { CITIES } from "@/lib/cities";
import successionPhoto from "@/assets/gallery-apres.jpg";
import type { ReactNode } from "react";

export interface ServiceBlock {
  title: string;
  text: string;
}

export interface ServiceLandingProps {
  succession?: boolean;
  guide?: ReactNode;
  eyebrow: string;
  h1: string;
  intro: string;
  blocksTitle: string;
  blocks: ServiceBlock[];
  priceTitle: string;
  priceRows: { label: string; volume: string; price: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
}

const steps = [
  {
    icon: Camera,
    title: "1. Photographiez",
    text: "Quelques photos par pièce suffisent : notre IA identifie les objets et calcule le volume à évacuer en m³.",
  },
  {
    icon: Truck,
    title: "2. Précisez l'accès",
    text: "Type de bien, étage, ascenseur, distance de portage : ces éléments pèsent réellement sur le tarif final.",
  },
  {
    icon: Euro,
    title: "3. Prix immédiat",
    text: "Vous obtenez une fourchette de prix en moins de 2 minutes, sans visite préalable ni engagement.",
  },
  {
    icon: ShieldCheck,
    title: "4. Pros vérifiés",
    text: "Seuls les débarrasseurs couvrant votre code postal reçoivent la demande. Paiement sécurisé et bloqué jusqu'à la fin du chantier.",
  },
];

export function ServiceLanding(props: ServiceLandingProps) {
  const cities = CITIES.slice(0, 12);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <section className={props.succession ? "relative isolate overflow-hidden rounded-lg px-5 py-12 text-center text-primary-foreground" : "text-center"}>
        {props.succession && <><img src={successionPhoto} alt="Logement vidé après débarras" className="absolute inset-0 -z-20 size-full object-cover" /><div className="absolute inset-0 -z-10 bg-foreground/65" /></>}
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          {props.eyebrow}
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          {props.h1}
        </h1>
        <p className={`mx-auto mt-5 max-w-2xl ${props.succession ? "text-primary-foreground" : "text-muted-foreground"}`}>{props.intro}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            {props.succession ? <a href="#dossier-succession">Ouvrir mon dossier succession</a> : <Link to="/estimation">Estimer en photo (2 min)</Link>}
          </Button>
          <Button asChild size="lg" variant="outline" className={props.succession ? "text-foreground" : undefined}>
            <Link to="/tarifs">Voir la grille tarifaire</Link>
          </Button>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">Comment ça marche</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(props.succession ? [
            { icon: Camera, title: "1. Votre dossier", text: "Adresse, photos du logement, objets à conserver et échéance de vente ou de fin de bail." },
            { icon: Euro, title: "2. Les propositions", text: "Les professionnels de votre secteur établissent un devis adapté au bien et aux consignes." },
            { icon: Truck, title: "3. Le débarras", text: "Présence d'un héritier ou remise des clés à distance : l'intervention suit votre organisation." },
            { icon: ShieldCheck, title: "4. Le rapport final", text: "Photos avant/après, volumes évacués et destinations déclarées par le professionnel dans un PDF pour le notaire." },
          ] : steps).map((s) => (
            <Card key={s.title} className="p-6">
              <s.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">{props.blocksTitle}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {props.blocks.map((b) => (
            <Card key={b.title} className="p-6">
              <h3 className="font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-muted/40 p-6 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight">{props.priceTitle}</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 pr-4 font-semibold">Situation</th>
                <th className="pb-3 pr-4 font-semibold">Volume estimé</th>
                <th className="pb-3 font-semibold">Budget indicatif</th>
              </tr>
            </thead>
            <tbody>
              {props.priceRows.map((r) => (
                <tr key={r.label} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{r.label}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{r.volume}</td>
                  <td className="py-3 font-semibold text-primary">{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {props.succession
            ? "Exemples de budgets indicatifs, sans garantie de tarif. Le professionnel établit le devis définitif selon le volume, l'accès, le tri et les éventuels biens repris."
            : "Fourchettes indicatives constatées sur la plateforme. Le prix définitif dépend du volume réel, de l'accès et du secteur ; votre estimation en photo affiche votre fourchette personnalisée."}
        </p>
      </section>

      {props.guide}

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">{props.faqTitle}</h2>
        <div className="mt-6 space-y-4">
          {props.faq.map((f) => (
            <Card key={f.q} className="p-6">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border p-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{props.ctaTitle}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{props.ctaText}</p>
        <div className="mt-6">
          <Button asChild size="lg">
            {props.succession ? <a href="#dossier-succession">Organiser le débarras de succession</a> : <Link to="/estimation">Démarrer mon estimation</Link>}
          </Button>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-lg font-semibold">{props.succession ? "Débarras de succession : trouver un professionnel par ville" : "Nos villes les plus demandées"}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {cities.map((c) => (
            <Link
              key={c.slug}
              to="/debarras/$ville"
              params={{ ville: c.slug }}
              className="rounded-full bg-secondary px-3 py-1.5 text-sm hover:bg-secondary/70"
            >
              Débarras {c.name}
            </Link>
          ))}
          <Link to="/debarras" className="rounded-full border px-3 py-1.5 text-sm hover:bg-secondary/50">
            Toutes les villes
          </Link>
        </div>
      </section>
    </main>
  );
}

export function serviceHead(opts: {
  path: string;
  title: string;
  description: string;
  serviceName: string;
  breadcrumb: string;
}) {
  const canonical = `https://debarrasfrance.fr${opts.path}`;
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
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
          name: opts.serviceName,
          serviceType: opts.serviceName,
          areaServed: "France",
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
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://debarrasfrance.fr" },
            { "@type": "ListItem", position: 2, name: opts.breadcrumb, item: canonical },
          ],
        }),
      },
    ],
  };
}
