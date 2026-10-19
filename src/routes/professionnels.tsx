import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MapPin, Search, Trophy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PublicProCard } from "@/components/pro/public-pro-card";
import { publicProfessionalsQuery } from "@/lib/public-profiles.queries";
import { REGIONS, rankProfessionals, regionsFor } from "@/lib/public-profiles";
export const Route = createFileRoute("/professionnels")({
  validateSearch: (search: Record<string, unknown>) => ({ region: typeof search.region === "string" && REGIONS.some(r => r.name === search.region) ? search.region : "all" }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicProfessionalsQuery),
  head: () => ({ meta: [{ title: "Les meilleurs professionnels du débarras par région | Débarras France" }, { name: "description", content: "Comparez les professionnels du débarras dans chaque région : avis clients réels, zones, spécialités et chantiers confirmés sur Débarras France." }, { property: "og:title", content: "Professionnels du débarras par région — Débarras France" }, { property: "og:description", content: "Trouvez un professionnel près de chez vous et consultez ses avis, ses photos et ses spécialités." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { property: "og:url", content: "https://debarrasfrance.fr/professionnels" }], links: [{ rel: "canonical", href: "https://debarrasfrance.fr/professionnels" }] }),
  errorComponent: () => <div role="alert" className="mx-auto max-w-6xl px-4 py-16">Les professionnels ne peuvent pas être chargés pour le moment.</div>,
  notFoundComponent: () => <p>Annuaire introuvable.</p>,
  component: ProfessionalsPage,
});
function ProfessionalsPage() {
  const { data: pros } = useSuspenseQuery(publicProfessionalsQuery);
  const { region } = Route.useSearch();
  const navigate = useNavigate();
  const regions = region === "all" ? REGIONS : REGIONS.filter(r => r.name === region);
  return <main className="mx-auto max-w-6xl px-4 py-12">
    <p className="flex items-center gap-2 text-sm font-semibold text-primary"><MapPin className="size-4" />Le réseau Débarras France</p>
    <div className="mt-3 flex flex-wrap items-end justify-between gap-6"><div className="max-w-2xl"><h1 className="font-display text-3xl font-extrabold sm:text-4xl">Les professionnels du débarras<br className="hidden sm:block" /> dans votre région</h1><p className="mt-4 leading-relaxed text-muted-foreground">Retrouvez les entreprises partenaires, leurs spécialités et les avis de leurs clients.</p></div>
      <Select value={region} onValueChange={value => void navigate({ search: { region: value } })}><SelectTrigger className="w-full sm:w-72" aria-label="Choisir une région"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Toutes les régions</SelectItem>{REGIONS.map(r => <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>)}</SelectContent></Select>
    </div>
    <p className="mt-6 flex items-start gap-2 border-y border-border py-4 text-xs text-muted-foreground"><Trophy className="size-4 shrink-0 text-proposal-gold" />Classement par note moyenne, puis nombre d’avis et chantiers confirmés. Les entreprises sans avis sont présentées sans classement.</p>
    <div className="mt-10 space-y-12">{regions.map(r => {
      const regional = rankProfessionals(pros.filter(p => regionsFor(p.postal_codes).includes(r.name)));
      return <section key={r.name}><div className="mb-5 flex flex-wrap items-center gap-3"><h2 className="font-display text-2xl font-bold">{r.name}</h2><span className="text-sm text-muted-foreground">{regional.length} professionnel{regional.length > 1 ? "s" : ""}</span></div>{regional.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{regional.map((pro, i) => <PublicProCard key={pro.slug} pro={pro} rank={pro.reviews.length ? i + 1 : undefined} />)}</div> : <p className="flex items-center gap-2 border-l-2 border-border py-3 pl-4 text-sm text-muted-foreground"><Search className="size-4" />Aucun profil public dans cette région pour le moment.</p>}</section>;
    })}</div>
  </main>;
}