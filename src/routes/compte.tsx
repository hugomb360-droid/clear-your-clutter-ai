import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  Lock,
  Mail,
  Package,
  Plus,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ClientMissionPanel } from "@/components/client/client-mission-panel";
import { EscrowCheckoutDialog } from "@/components/payments/escrow-checkout-dialog";
import { QuotePhotos } from "@/components/pro/quote-photos";
import { RoleGuard } from "@/components/role-guard";
import {
  EmptyState,
  Facts,
  Notice,
  SectionHead,
  SpaceCard,
  SpaceLoading,
  StatusPill,
  sBtnOutline,
  sBtnPrimary,
  spaceWrap,
} from "@/components/space/space-kit";
import { bidTone } from "@/components/space/tones";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { MISSION_STATUS_LABELS } from "@/lib/mission";
import { PAYMENTS_ENABLED, PAYMENTS_PAUSED_MESSAGE } from "@/lib/payments-availability";
import { accessLabel } from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";
import { getPublicProfessionals } from "@/lib/public-profiles.functions";
import { averageRating, verifiedBadge } from "@/lib/public-profiles";
import { CONTACT_EMAIL } from "@/lib/site-nav";

const searchSchema = z.object({ demande: z.string().optional() });

export const Route = createFileRoute("/compte")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Mes devis de débarras — Débarras France" },
      {
        name: "description",
        content:
          "Retrouvez vos demandes de débarras, les propositions reçues des professionnels et le suivi de vos missions.",
      },
      { property: "og:title", content: "Mon espace client Débarras France" },
      { property: "og:description", content: "Suivez vos devis et les propositions des pros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ClientAccountPage,
});

type ProSummary = {
  company_name: string;
  verified: boolean;
  description: string | null;
  public_slug: string | null;
  public_enabled: boolean;
  siret_verified: boolean;
  insurance_verified: boolean;
};

type ClientBid = {
  id: string;
  price: number;
  available_date: string | null;
  message: string | null;
  status: string;
  pro_id: string;
  rating: number | null;
  pro_profiles?: ProSummary | null;
};

type PaymentRow = {
  bid_id: string;
  status: string;
  amount_total: number;
  released_at: string | null;
};

const ACTIVE_STATUSES = ["accepted", "awaiting_confirmation", "completed", "disputed"];

const frDate = (value: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(value),
  );

function initials(name: string | null | undefined) {
  if (!name) return "PR";
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function quoteLabel(quote: { property_type: string | null; city: string | null }) {
  const type =
    quote.property_type && quote.property_type !== "Non précisé" ? quote.property_type : "Débarras";
  return quote.city ? `${type}, ${quote.city}` : type;
}

/** Les cinq étapes d'une demande, avec l'étape en cours. */
function buildSteps(args: { createdAt: string; bidCount: number; active: ClientBid | undefined }) {
  const { createdAt, bidCount, active } = args;
  const status = active?.status;
  const current = !active
    ? bidCount === 0
      ? 1
      : 2
    : status === "accepted"
      ? 3
      : status === "completed"
        ? 5
        : 4;
  const steps = [
    { title: "Demande publiée", detail: frDate(createdAt) },
    {
      title: "Propositions",
      detail:
        bidCount === 0 ? "en attente des pros" : `${bidCount} reçue${bidCount > 1 ? "s" : ""}`,
    },
    {
      title: "Choix du pro",
      detail: active ? (active.pro_profiles?.company_name ?? "pro choisi") : "à vous de choisir",
    },
    {
      title: "Chantier",
      detail: active?.available_date ? frDate(active.available_date) : "date à confirmer",
    },
    {
      title: "Validation",
      detail:
        status === "completed"
          ? "chantier validé"
          : status === "disputed"
            ? "litige en cours"
            : status === "awaiting_confirmation"
              ? "à vous de valider"
              : "après le chantier",
    },
  ];
  return { steps, current };
}

function Steps({
  steps,
  current,
}: {
  steps: { title: string; detail: string }[];
  current: number;
}) {
  return (
    <ol className="grid gap-2 sm:grid-cols-5">
      {steps.map((step, index) => {
        const done = index < current;
        const now = index === current;
        return (
          <li
            key={step.title}
            aria-current={now ? "step" : undefined}
            className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 sm:flex-col sm:items-start sm:gap-2 ${
              now ? "bg-brand-ink text-white" : done ? "bg-brand-soft" : "bg-secondary/60"
            }`}
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                now
                  ? "bg-white text-brand-ink"
                  : done
                    ? "bg-primary text-primary-foreground"
                    : "bg-white text-muted-foreground"
              }`}
            >
              {done ? <Check className="size-4" aria-hidden="true" /> : index + 1}
            </span>
            <span className="min-w-0">
              <span
                className={`block text-sm font-extrabold leading-tight ${now ? "text-white" : "text-brand-ink"}`}
              >
                {step.title}
                {done && <span className="sr-only"> (fait)</span>}
              </span>
              <span
                className={`block text-xs leading-snug ${now ? "text-white/85" : "text-muted-foreground"}`}
              >
                {step.detail}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Rating({ value }: { value: number | null }) {
  if (value === null) return <span className="text-muted-foreground">Pas encore d'avis</span>;
  return (
    <span className="flex items-center gap-1 font-bold text-brand-ink">
      <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
      {value.toFixed(1).replace(".", ",")} / 5
    </span>
  );
}

function PaymentLine({ payment }: { payment: PaymentRow }) {
  const tone =
    payment.status === "released" ? "success" : payment.status === "refunded" ? "danger" : "info";
  return (
    <div className="mt-4">
      <Notice tone={tone} icon={Lock}>
        {payment.status === "held" &&
          `${euro(payment.amount_total / 100)} bloqués. Ils seront versés au pro après votre validation.`}
        {payment.status === "released" && "Paiement versé au professionnel."}
        {payment.status === "refunded" && "Paiement remboursé."}
        {payment.status === "pending" && "Paiement en cours de confirmation…"}
        {!["held", "released", "refunded", "pending"].includes(payment.status) &&
          "Paiement enregistré."}
      </Notice>
    </div>
  );
}

function ClientAccount() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { demande } = Route.useSearch();
  const [checkout, setCheckout] = useState<{
    bidId: string;
    price: number;
    companyName: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/compte" } });
  }, [loading, user, navigate]);

  const quotesQuery = useQuery({
    queryKey: ["my-quotes", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data: quotes, error } = await supabase
        .from("quotes")
        .select("*, bids(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const bids = (quotes ?? []).flatMap((q) => q.bids ?? []);
      const proIds = Array.from(new Set(bids.map((b) => b.pro_id).filter(Boolean)));

      let profilesById: Record<string, ProSummary> = {};
      if (proIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("pro_profiles")
          .select(
            "user_id, company_name, verified, description, public_slug, public_enabled, siret_verified, insurance_verified",
          )
          .in("user_id", proIds);
        if (!profilesError && profiles) {
          profilesById = Object.fromEntries(profiles.map((p) => [p.user_id, p]));
        }
      }

      const publicPros = await getPublicProfessionals();
      return (quotes ?? []).map((q) => ({
        ...q,
        bids: (q.bids ?? []).map((b) => ({
          ...b,
          pro_profiles: profilesById[b.pro_id] ?? null,
          rating: averageRating(
            publicPros.find((p) => p.slug === profilesById[b.pro_id]?.public_slug)?.reviews ?? [],
          ),
        })),
      }));
    },
  });

  const paymentsQuery = useQuery({
    queryKey: ["my-payments", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("bid_id, status, amount_total, released_at");
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((p) => [p.bid_id, p])) as Record<
        string,
        PaymentRow
      >;
    },
  });

  if (loading || !user) return <SpaceLoading />;

  const quotes = quotesQuery.data ?? [];
  const payments = paymentsQuery.data ?? {};
  const quote = quotes.find((q) => q.id === demande) ?? quotes[0];

  const header = (
    <div className="border-b border-border bg-brand-soft/60">
      <div className={`${spaceWrap} py-7`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-primary">Mon espace</p>
            <h1 className="mt-1 text-[26px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[32px]">
              Mes demandes de débarras
            </h1>
          </div>
          <Link to="/estimation" className={sBtnPrimary}>
            <Plus className="size-4" aria-hidden="true" /> Nouvelle demande
          </Link>
        </div>

        {quotes.length > 1 && (
          <nav
            aria-label="Mes demandes"
            className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            {quotes.map((q) => {
              const isActive = q.id === quote?.id;
              const pendingCount = (q.bids ?? []).filter((b) => b.status === "pending").length;
              const hasActive = (q.bids ?? []).some((b) => ACTIVE_STATUSES.includes(b.status));
              return (
                <Link
                  key={q.id}
                  to="/compte"
                  search={{ demande: q.id }}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-bright ${
                    isActive
                      ? "bg-brand-ink text-white"
                      : "bg-white text-brand-ink hover:bg-brand-ink/10"
                  }`}
                >
                  {quoteLabel(q)}
                  {!hasActive && pendingCount > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
                        isActive ? "bg-white text-brand-ink" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );

  if (quotesQuery.isPending) {
    return (
      <>
        {header}
        <SpaceLoading />
      </>
    );
  }

  if (quotesQuery.isError) {
    return (
      <>
        {header}
        <div className={`${spaceWrap} py-10`}>
          <Notice
            tone="danger"
            icon={AlertTriangle}
            action={
              <button
                type="button"
                className={sBtnOutline}
                onClick={() => void quotesQuery.refetch()}
              >
                Réessayer
              </button>
            }
          >
            Vos demandes n'ont pas pu être chargées. Vérifiez votre connexion.
          </Notice>
        </div>
      </>
    );
  }

  if (!quote) {
    return (
      <>
        {header}
        <div className={`${spaceWrap} py-10`}>
          <EmptyState
            icon={Package}
            title="Aucune demande pour le moment"
            text="Envoyez quelques photos : vous obtenez une estimation en 2 minutes, puis les pros de votre secteur vous font leurs propositions."
            action={
              <Link to="/estimation" className={sBtnPrimary}>
                Estimer mon débarras
              </Link>
            }
          />
        </div>
      </>
    );
  }

  const bids = (quote.bids ?? []) as unknown as ClientBid[];
  const activeBid = bids.find((b) => ACTIVE_STATUSES.includes(b.status));
  const pending = bids.filter((b) => b.status === "pending").sort((a, b) => a.price - b.price);
  const { steps, current } = buildSteps({
    createdAt: quote.created_at,
    bidCount: bids.filter((b) => b.status !== "withdrawn").length,
    active: activeBid,
  });
  const hasRange = quote.price_min != null && quote.price_max != null;

  const renderBid = (bid: ClientBid, options: { best?: boolean; canAccept: boolean }) => {
    const pro = bid.pro_profiles;
    const companyName = pro?.company_name ?? "Professionnel";
    const payment = payments[bid.id];
    return (
      <li key={bid.id} className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-sm font-black text-primary"
            aria-hidden="true"
          >
            {initials(pro?.company_name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[18px] font-extrabold leading-tight text-brand-ink">
                {companyName}
              </h3>
              {options.best && <StatusPill tone="green">Prix le plus bas</StatusPill>}
              {bid.status !== "pending" && (
                <StatusPill tone={bidTone(bid.status)}>
                  {MISSION_STATUS_LABELS[bid.status] ?? bid.status}
                </StatusPill>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
              <Rating value={bid.rating} />
              {pro && verifiedBadge(pro) && (
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <BadgeCheck className="size-4" aria-hidden="true" /> SIRET et assurance vérifiés
                </span>
              )}
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarDays className="size-4" aria-hidden="true" />
                {bid.available_date
                  ? `Propose le ${frDate(bid.available_date)}`
                  : "Date à convenir"}
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[28px] font-black leading-none tracking-[-0.02em] text-brand-ink tabular-nums">
              {euro(bid.price)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">TTC, tout compris</p>
          </div>
        </div>

        {bid.message && (
          <p className="mt-4 rounded-2xl bg-brand-soft/60 px-4 py-3 text-sm leading-relaxed text-brand-ink">
            « {bid.message} »
          </p>
        )}

        {(options.canAccept || (pro?.public_slug && pro.public_enabled)) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {options.canAccept && (
              <button
                type="button"
                className={sBtnPrimary}
                onClick={() => setCheckout({ bidId: bid.id, price: bid.price, companyName })}
              >
                Accepter cette proposition
              </button>
            )}
            {pro?.public_slug && pro.public_enabled && (
              <Link to="/pro/$slug" params={{ slug: pro.public_slug }} className={sBtnOutline}>
                Voir le profil <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        )}

        {payment && <PaymentLine payment={payment} />}

        {activeBid?.id === bid.id && (
          <ClientMissionPanel
            bidId={bid.id}
            quoteId={quote.id}
            clientId={user.id}
            proId={bid.pro_id}
            status={bid.status}
          />
        )}
      </li>
    );
  };

  return (
    <>
      {header}
      <div className={`${spaceWrap} space-y-6 py-8`}>
        <SpaceCard>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-[20px] font-extrabold leading-tight text-brand-ink">
              {quoteLabel(quote)}
              {quote.surface_m2 ? ` · ${quote.surface_m2} m²` : ""}
            </h2>
            <p className="text-sm text-muted-foreground">
              {quote.volume_m3 != null ? `${quote.volume_m3} m³ estimés` : "Volume à préciser"}
              {hasRange ? ` · repère ${euro(quote.price_min!)} – ${euro(quote.price_max!)}` : ""}
            </p>
          </div>
          <Steps steps={steps} current={current} />
        </SpaceCard>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            {activeBid ? (
              <section>
                <SectionHead
                  title="Votre professionnel"
                  hint={
                    activeBid.status === "awaiting_confirmation"
                      ? "Le pro a déclaré la fin du chantier. Regardez ses photos, puis validez."
                      : activeBid.status === "accepted"
                        ? "Mission confirmée. Le pro vous contacte pour organiser sa venue."
                        : undefined
                  }
                />
                <ul className="space-y-4">{renderBid(activeBid, { canAccept: false })}</ul>
              </section>
            ) : (
              <section>
                <SectionHead
                  title={
                    pending.length === 0
                      ? "Propositions"
                      : `${pending.length} proposition${pending.length > 1 ? "s" : ""} à comparer`
                  }
                  hint={
                    pending.length > 1 ? "Triées du prix le plus bas au plus élevé." : undefined
                  }
                />
                {pending.length === 0 ? (
                  <EmptyState
                    icon={Clock}
                    title="En attente des premières propositions"
                    text="Votre demande est visible par les pros de votre secteur. Les premières réponses arrivent en général sous 48 h."
                  />
                ) : (
                  <>
                    {!PAYMENTS_ENABLED && (
                      <div className="mb-4">
                        <Notice tone="warn" icon={Clock}>
                          {PAYMENTS_PAUSED_MESSAGE}
                        </Notice>
                      </div>
                    )}
                    <ul className="space-y-4">
                      {pending.map((bid, index) =>
                        renderBid(bid, {
                          best: index === 0 && pending.length > 1,
                          canAccept: true,
                        }),
                      )}
                    </ul>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      Votre adresse et votre téléphone ne sont transmis qu'au pro que vous acceptez.
                      Votre paiement reste bloqué jusqu'à ce que vous validiez la fin du chantier.
                    </p>
                  </>
                )}
              </section>
            )}

            {activeBid && pending.length > 0 && (
              <details className="rounded-3xl border border-border bg-card p-5 sm:p-6">
                <summary className="cursor-pointer text-sm font-bold text-brand-ink">
                  Voir les {pending.length} autre{pending.length > 1 ? "s" : ""} proposition
                  {pending.length > 1 ? "s" : ""} reçue{pending.length > 1 ? "s" : ""}
                </summary>
                <ul className="mt-4 space-y-4">
                  {pending.map((bid) => renderBid(bid, { canAccept: false }))}
                </ul>
              </details>
            )}
          </div>

          <aside className="space-y-6">
            <SpaceCard>
              <h2 className="text-[17px] font-extrabold text-brand-ink">Ma demande</h2>
              <QuotePhotos quoteId={quote.id} label="Vos photos" />
              <div className="mt-3">
                <Facts
                  items={[
                    {
                      label: "Lieu",
                      value: `${quote.postal_code ?? ""} ${quote.city ?? ""}`.trim() || "—",
                    },
                    {
                      label: "Volume estimé",
                      value: quote.volume_m3 != null ? `${quote.volume_m3} m³` : "À préciser",
                    },
                    {
                      label: "Accès",
                      value: accessLabel(quote.floor, quote.has_elevator),
                    },
                    {
                      label: "Date souhaitée",
                      value: quote.desired_date ? frDate(quote.desired_date) : "À convenir",
                    },
                    {
                      label: "Estimation",
                      value: hasRange
                        ? `${euro(quote.price_min!)} – ${euro(quote.price_max!)}`
                        : "Sur devis",
                    },
                  ]}
                />
              </div>
              {quote.notes && (
                <p className="mt-3 rounded-2xl bg-brand-soft/60 px-4 py-3 text-sm leading-relaxed text-brand-ink">
                  {quote.notes}
                </p>
              )}
            </SpaceCard>

            <SpaceCard>
              <h2 className="text-[17px] font-extrabold text-brand-ink">Après le chantier</h2>
              <ol className="mt-3 space-y-2.5 text-sm leading-relaxed text-brand-ink">
                <li className="flex gap-2.5">
                  <span className="font-black text-primary">1.</span>
                  Le pro envoie ici ses photos de fin de chantier.
                </li>
                <li className="flex gap-2.5">
                  <span className="font-black text-primary">2.</span>
                  Vous validez et vous laissez une note : il est payé.
                </li>
                <li className="flex gap-2.5">
                  <span className="font-black text-primary">3.</span>
                  Un problème ? Vous ouvrez un litige avec photos, les fonds restent bloqués.
                </li>
              </ol>
            </SpaceCard>

            <SpaceCard>
              <h2 className="text-[17px] font-extrabold text-brand-ink">Besoin d'aide ?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Écrivez-nous en indiquant la ville de votre demande.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Ma demande : ${quoteLabel(quote)}`)}`}
                className={`${sBtnOutline} mt-4 w-full`}
              >
                <Mail className="size-4" aria-hidden="true" /> Nous écrire
              </a>
            </SpaceCard>
          </aside>
        </div>
      </div>

      {checkout && (
        <EscrowCheckoutDialog
          open={Boolean(checkout)}
          onOpenChange={(open) => {
            if (!open) {
              setCheckout(null);
              void queryClient.invalidateQueries({ queryKey: ["my-quotes"] });
              void queryClient.invalidateQueries({ queryKey: ["my-payments"] });
            }
          }}
          bidId={checkout.bidId}
          price={checkout.price}
          companyName={checkout.companyName}
        />
      )}
    </>
  );
}

function ClientAccountPage() {
  return (
    <RoleGuard role="client" redirect="/compte">
      <ClientAccount />
    </RoleGuard>
  );
}
