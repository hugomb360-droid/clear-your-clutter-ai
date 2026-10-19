import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Building2, MapPin, ShieldCheck, Star, Hammer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { publicProfessionalsQuery } from "@/lib/public-profiles.queries";
import { averageRating, regionsFor, verifiedBadge } from "@/lib/public-profiles";

export const Route = createFileRoute("/pro/$slug")({
  loader: async ({ context, params }) => {
    const pros = await context.queryClient.ensureQueryData(publicProfessionalsQuery);
    const pro = pros.find(p => p.slug === params.slug);
    if (!pro) throw notFound();
    return pro;
  },
  head: ({ loaderData: pro, params }) => {
    const title = pro ? `${pro.company_name} — professionnel du débarras | Débarras France` : "Professionnel introuvable — Débarras France";
    const description = pro ? `Découvrez ${pro.company_name} : zones d’intervention, spécialités, photos de chantiers et avis clients sur Débarras France.` : "Ce profil professionnel n’est pas disponible.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "profile" }, { name: "twitter:card", content: "summary_large_image" }, { property: "og:url", content: `https://debarrasfrance.fr/pro/${params.slug}` }, ...(!pro ? [{ name: "robots", content: "noindex" }] : [])], links: [{ rel: "canonical", href: `https://debarrasfrance.fr/pro/${params.slug}` }] };
  },
  errorComponent: () => <div role="alert" className="mx-auto max-w-6xl px-4 py-16">Le profil n’a pas pu être chargé. Réessayez dans un instant.</div>,
  notFoundComponent: () => <div className="mx-auto max-w-6xl px-4 py-16"><h1 className="text-2xl font-bold">Profil indisponible</h1><Link to="/professionnels" className="mt-4 inline-block text-primary">Retrouver les professionnels</Link></div>,
  component: PublicProfilePage,
});
function PublicProfilePage() {
  const { slug } = Route.useParams();
  const { data: pros } = useSuspenseQuery(publicProfessionalsQuery);
  const pro = pros.find(p => p.slug === slug);
  if (!pro) return null;
  const rating = averageRating(pro.reviews);
  return <main>
    <header className="border-b border-border bg-secondary/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <Link to="/professionnels" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" />Les professionnels</Link>
        <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-6">
            {pro.logo_url ? <img src={pro.logo_url} alt={`Logo ${pro.company_name}`} className="size-20 shrink-0 rounded-lg bg-card object-contain sm:size-24" /> : <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-card text-primary sm:size-24"><Building2 className="size-9" /></div>}
            <div className="min-w-0"><p className="text-xs font-semibold uppercase text-primary">Professionnel du débarras</p><h1 className="mt-2 break-words font-display text-3xl font-extrabold sm:text-4xl">{pro.company_name}</h1><p className="mt-3 text-sm text-muted-foreground">{regionsFor(pro.postal_codes).join(" · ")}</p>
              {verifiedBadge(pro) && <Badge className="mt-4 gap-1"><ShieldCheck className="size-4" />SIRET et assurance vérifiés</Badge>}
            </div>
          </div>
          <Button asChild><Link to="/estimation">Demander une estimation</Link></Button>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6"><span className="inline-flex items-center gap-2"><Star className="size-5 text-proposal-gold" />{rating === null ? "Pas encore d’avis" : `${rating.toFixed(1)} / 5 · ${pro.reviews.length} avis`}</span><span className="inline-flex items-center gap-2 text-muted-foreground"><Hammer className="size-5" />{pro.completed_count} chantier{pro.completed_count > 1 ? "s" : ""} confirmé{pro.completed_count > 1 ? "s" : ""} via la plateforme</span></div>
      </div>
    </header>
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_300px]">
      <div className="min-w-0 space-y-10"><section><h2 className="text-xl font-bold">L’entreprise</h2><p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">{pro.description || "Ce professionnel n’a pas encore ajouté sa présentation."}</p><h3 className="mt-6 font-semibold">Spécialités</h3><div className="mt-3 flex flex-wrap gap-2">{pro.service_types.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}</div></section>
        <section><h2 className="text-xl font-bold">Photos de chantiers</h2>{pro.portfolio_urls?.length ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{pro.portfolio_urls.map((url, i) => <a key={url} href={url} target="_blank" rel="noreferrer"><img src={url} alt={`Chantier de ${pro.company_name}, photo ${i + 1}`} className="aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" /></a>)}</div> : <p className="mt-4 text-sm text-muted-foreground">Aucune photo publiée pour le moment.</p>}</section>
        <section><h2 className="text-xl font-bold">Avis clients {pro.reviews.length > 0 && `(${pro.reviews.length})`}</h2>{pro.reviews.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">Ce professionnel n’a pas encore reçu d’avis après un chantier confirmé.</p> : <div className="mt-5 divide-y divide-border">{pro.reviews.map((review, i) => <article key={`${review.created_at}-${i}`} className="py-5"><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">Client de la plateforme · <span className="text-primary">{review.rating} / 5</span></p><time className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString("fr-FR")}</time></div>{review.comment && <p className="mt-3 whitespace-pre-line text-muted-foreground">{review.comment}</p>}</article>)}</div>}</section>
      </div><aside className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><h2 className="flex items-center gap-2 text-lg font-bold"><MapPin className="size-5 text-primary" />Zones d’intervention</h2><ul className="mt-5 space-y-3">{regionsFor(pro.postal_codes).map(region => <li key={region} className="text-sm">{region}</li>)}</ul><div className="mt-5 flex flex-wrap gap-2">{pro.postal_codes.map(zone => <Badge key={zone} variant="outline">{zone.length === 2 ? `Département ${zone}` : zone}</Badge>)}</div><p className="mt-6 text-xs text-muted-foreground">Les avis et chantiers comptabilisés proviennent exclusivement des missions confirmées sur Débarras France.</p></aside>
    </div>
  </main>;
}