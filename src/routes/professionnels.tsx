import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, Trophy } from "lucide-react";
import { Breadcrumb, CtaBand, btnSoft, btnWhite, wrap } from "@/components/site/page-kit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PublicProCard } from "@/components/pro/public-pro-card";
import { publicProfessionalsQuery } from "@/lib/public-profiles.queries";
import { REGIONS, rankProfessionals, regionsFor } from "@/lib/public-profiles";
export const Route = createFileRoute("/professionnels")({
  validateSearch: (search: Record<string, unknown>): { region?: string } => {
    const region = search["region"];
    return typeof region === "string" && REGIONS.some((r) => r.name === region) ? { region } : {};
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(publicProfessionalsQuery),
  head: () => ({
    meta: [
      { title: "Les meilleurs professionnels du débarras par région | Débarras France" },
      {
        name: "description",
        content:
          "Comparez les professionnels du débarras dans chaque région : avis clients réels, zones, spécialités et chantiers confirmés sur Débarras France.",
      },
      { property: "og:title", content: "Professionnels du débarras par région — Débarras France" },
      {
        property: "og:description",
        content:
          "Trouvez un professionnel près de chez vous et consultez ses avis, ses photos et ses spécialités.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://debarrasfrance.fr/professionnels" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/professionnels" }],
  }),
  errorComponent: () => (
    <div
      role="alert"
      className="mx-auto max-w-[1240px] px-4 py-20 text-lg text-brand-ink sm:px-6 lg:px-10"
    >
      Les professionnels ne peuvent pas être chargés pour le moment.
    </div>
  ),
  notFoundComponent: () => <p>Annuaire introuvable.</p>,
  component: ProfessionalsPage,
});
function ProfessionalsPage() {
  const { data: pros } = useSuspenseQuery(publicProfessionalsQuery);
  const { region = "all" } = Route.useSearch();
  const navigate = useNavigate();
  const regions = region === "all" ? REGIONS : REGIONS.filter((r) => r.name === region);
  return (
    <main>
      <section className="bg-[#F2FAF4] pb-12 pt-8 sm:pb-16">
        <div className={wrap}>
          <Breadcrumb items={[{ label: "Nos pros" }]} />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-[36px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[52px]">
                Les professionnels du débarras
                <br className="hidden sm:block" /> dans votre région
              </h1>
              <p className="mt-4 text-lg font-extrabold text-primary">Le réseau Débarras France</p>
              <p className="mt-3 text-lg leading-relaxed text-[#34433A]">
                Retrouvez les entreprises partenaires, leurs spécialités et les avis de leurs
                clients.
              </p>
            </div>
            <Select
              value={region}
              onValueChange={(value) =>
                void navigate({
                  to: "/professionnels",
                  search: value === "all" ? {} : { region: value },
                })
              }
            >
              <SelectTrigger
                className="h-12 w-full rounded-full border-2 border-brand-ink bg-white px-5 text-base font-semibold sm:w-80"
                aria-label="Choisir une région"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les régions</SelectItem>
                {REGIONS.map((r) => (
                  <SelectItem key={r.name} value={r.name}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="mt-8 flex items-start gap-2.5 rounded-2xl bg-white px-5 py-4 text-[15px] text-muted-foreground">
            <Trophy className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            Classement par note moyenne, puis nombre d’avis et chantiers confirmés. Les entreprises
            sans avis sont présentées sans classement.
          </p>
        </div>
      </section>
      <div className={`${wrap} space-y-14 py-14 sm:py-20`}>
        {regions.map((r) => {
          const regional = rankProfessionals(
            pros.filter((p) => regionsFor(p.postal_codes).includes(r.name)),
          );
          return (
            <section key={r.name}>
              <div className="mb-6 flex flex-wrap items-baseline gap-3 border-b border-border pb-4">
                <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-brand-ink">
                  {r.name}
                </h2>
                <span className="text-[15px] text-muted-foreground">
                  {regional.length} professionnel{regional.length > 1 ? "s" : ""}
                </span>
              </div>
              {regional.length ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {regional.map((pro, i) => (
                    <PublicProCard
                      key={pro.slug}
                      pro={pro}
                      rank={pro.reviews.length ? i + 1 : undefined}
                    />
                  ))}
                </div>
              ) : (
                <p className="flex items-center gap-2.5 rounded-2xl border border-dashed border-border px-5 py-4 text-[15px] text-muted-foreground">
                  <Search className="size-5" aria-hidden="true" />
                  Aucun profil public dans cette région pour le moment.
                </p>
              )}
            </section>
          );
        })}
      </div>
      <CtaBand
        title="Vous êtes débarrasseur ?"
        text="Rejoignez le réseau et recevez des demandes qualifiées dans vos zones d'intervention."
      >
        <Link to="/pros" className={btnSoft}>
          Devenir débarrasseur partenaire
        </Link>
        <Link to="/estimation" search={{ type: "photo" }} className={btnWhite}>
          Estimer mon débarras
        </Link>
      </CtaBand>
    </main>
  );
}
