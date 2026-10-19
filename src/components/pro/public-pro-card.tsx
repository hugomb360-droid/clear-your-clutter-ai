import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Building2, ShieldCheck, Star, MapPin } from "lucide-react";
import { averageRating, verifiedBadge, type PublicPro } from "@/lib/public-profiles";
export function PublicProCard({ pro, rank }: { pro: PublicPro; rank?: number }) {
  const rating = averageRating(pro.reviews);
  return <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
    <div className="flex items-start gap-4">{pro.logo_url ? <img src={pro.logo_url} alt={`Logo ${pro.company_name}`} className="size-14 shrink-0 rounded-lg object-contain" /> : <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary"><Building2 className="size-6" /></div>}
      <div className="min-w-0"><p className="text-xs text-muted-foreground">{rank ? `N° ${rank} · Avis clients` : "Professionnel partenaire"}</p><h3 className="mt-1 break-words font-display text-xl font-bold"><Link to="/pro/$slug" params={{ slug: pro.slug }} className="hover:text-primary">{pro.company_name}</Link></h3></div>
    </div>
    {verifiedBadge(pro) && <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary"><ShieldCheck className="size-4" />SIRET et assurance vérifiés</p>}
    <p className="mt-4 flex items-center gap-2 text-sm"><Star className="size-4 text-proposal-gold" />{rating === null ? "Pas encore d’avis" : `${rating.toFixed(1)} / 5 · ${pro.reviews.length} avis`}</p>
    <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" /><span>Zones : {pro.postal_codes.join(", ")}</span></p>
    <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{pro.description || pro.service_types.join(" · ")}</p>
    <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4 mt-6"><span className="text-xs text-muted-foreground">{pro.completed_count} chantier{pro.completed_count > 1 ? "s" : ""} réalisé{pro.completed_count > 1 ? "s" : ""}</span><Link to="/pro/$slug" params={{ slug: pro.slug }} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">Voir le profil <ArrowUpRight className="size-4" /></Link></div>
  </article>;
}