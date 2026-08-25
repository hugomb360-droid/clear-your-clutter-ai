import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Clock, Lock, MapPin, Package, ShieldCheck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClientMissionPanel } from "@/components/client/client-mission-panel";
import { EscrowCheckoutDialog } from "@/components/payments/escrow-checkout-dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { MISSION_STATUS_LABELS } from "@/lib/mission";
import { euro } from "@/lib/pricing";

export const Route = createFileRoute("/compte")({
  head: () => ({
    meta: [
      { title: "Mes devis de débarras — Clearo" },
      {
        name: "description",
        content:
          "Retrouvez vos demandes de débarras, les propositions reçues des professionnels et le suivi de vos missions.",
      },
      { property: "og:title", content: "Mon espace client Clearo" },
      { property: "og:description", content: "Suivez vos devis et les propositions des pros." },
    ],
  }),
  component: ClientAccount,
});

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  published: "En attente de propositions",
  matched: "Pro sélectionné",
};

function initialsFromName(name: string | null | undefined) {
  if (!name) return "PR";
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex text-proposal-gold" aria-label={`Note ${value} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${i < Math.round(value) ? "fill-current" : "fill-none text-proposal-gold/30"}`}
        />
      ))}
    </div>
  );
}

function ClientAccount() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkout, setCheckout] = useState<{ bidId: string; price: number; companyName: string } | null>(null);

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

      let profilesById: Record<string, { company_name: string; verified: boolean; description: string | null }> = {};
      if (proIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("pro_profiles")
          .select("user_id, company_name, verified, description")
          .in("user_id", proIds);
        if (!profilesError && profiles) {
          profilesById = Object.fromEntries(
            profiles.map((p) => [p.user_id, p]),
          );
        }
      }

      return (quotes ?? []).map((q) => ({
        ...q,
        bids: (q.bids ?? []).map((b) => ({
          ...b,
          pro_profiles: profilesById[b.pro_id] ?? null,
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
      return Object.fromEntries((data ?? []).map((p) => [p.bid_id, p]));
    },
  });

  if (loading || !user) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-muted-foreground">Chargement...</div>;
  }

  const quotes = quotesQuery.data ?? [];
  const payments = paymentsQuery.data ?? {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl tracking-tight">Mes demandes</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Suivez vos devis et comparez les propositions des débarrasseurs.
          </p>
        </div>
        <Button asChild>
          <Link to="/estimation">Nouvelle estimation</Link>
        </Button>
      </div>

      {quotes.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-border p-12 text-center">
          <Package className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-4 font-medium">Aucune demande pour le moment</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Lancez une estimation en photo, c'est gratuit.
          </p>
          <Button asChild className="mt-6">
            <Link to="/estimation">Estimer mon débarras</Link>
          </Button>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {quotes.map((quote) => {
          const bids = (quote.bids ?? []) as unknown as Array<{
            id: string;
            price: number;
            available_date: string | null;
            message: string | null;
            status: string;
            pro_id: string;
            pro_profiles?: {
              company_name: string;
              verified: boolean;
              description?: string | null;
            } | null;
          }>;
          const activeBid = bids.find((b) =>
            ["accepted", "awaiting_confirmation", "completed", "disputed"].includes(b.status),
          );

          return (
            <article
              key={quote.id}
              className="overflow-hidden rounded-[2rem] bg-white shadow-[var(--shadow-proposal)] ring-1 ring-proposal-emerald/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Left column — request summary */}
                <div className="relative flex flex-col justify-between bg-proposal-emerald p-6 text-proposal-cream md:col-span-5 sm:p-8 lg:p-10">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-proposal-emerald-light/60 px-3 py-1 text-xs font-semibold tracking-wider text-proposal-gold uppercase">
                      {quote.status === "matched" ? "Mission en cours" : STATUS_LABELS[quote.status] ?? quote.status}
                    </span>
                    <h2 className="font-display mt-5 text-2xl font-bold leading-tight lg:text-3xl">
                      {quote.property_type}
                      {quote.surface_m2 ? ` ${quote.surface_m2}m²` : ""}
                    </h2>
                    <p className="mt-3 font-body text-sm leading-relaxed text-proposal-cream/70">
                      {quote.notes || `Volume estimé : ${quote.volume_m3 ?? "?"} m³`}
                    </p>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-proposal-emerald-light/60">
                          <MapPin className="size-4 text-proposal-gold" />
                        </div>
                        <span className="font-body text-sm">
                          {quote.postal_code} {quote.city ?? ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-proposal-emerald-light/60">
                          <CalendarDays className="size-4 text-proposal-gold" />
                        </div>
                        <span className="font-body text-sm">
                          {quote.desired_date
                            ? `Prévu le ${new Date(quote.desired_date).toLocaleDateString("fr-FR")}`
                            : "Date à convenir"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 border-t border-proposal-emerald-light/40 pt-6 md:mt-12">
                    <p className="text-xs uppercase tracking-widest text-proposal-cream/50">Estimation Clearo</p>
                    {quote.price_min != null && quote.price_max != null ? (
                      <p className="font-display mt-1 text-2xl font-bold">
                        {euro(quote.price_min)} – {euro(quote.price_max)}
                      </p>
                    ) : quote.volume_m3 != null ? (
                      <p className="font-display mt-1 text-2xl font-bold">{quote.volume_m3} m³</p>
                    ) : (
                      <p className="font-display mt-1 text-2xl font-bold">Sur devis</p>
                    )}
                  </div>
                </div>

                {/* Right column — proposals */}
                <div className="bg-white p-6 md:col-span-7 sm:p-8 lg:p-10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold text-proposal-emerald">
                      Propositions reçues{" "}
                      <span className="text-proposal-gold">({bids.length})</span>
                    </h3>
                  </div>

                  {bids.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                      <Clock className="mx-auto size-6 text-muted-foreground" />
                      <p className="mt-3 font-body text-sm text-muted-foreground">
                        Votre demande est visible par les pros de votre secteur. Les premières réponses
                        arrivent en général sous 48 h.
                      </p>
                    </div>
                  ) : (
                    <ul className="mt-6 space-y-5">
                      {bids.map((bid) => {
                        const pro = bid.pro_profiles;
                        const companyName = pro?.company_name ?? `Pro ${initialsFromName(null)}`;
                        const isAccepted = !["pending"].includes(bid.status);

                        return (
                          <li
                            key={bid.id}
                            className="group relative rounded-2xl border border-border bg-[#fbfcf8] p-5 transition-all hover:border-proposal-gold/60 hover:shadow-md"
                          >
                            {/* Premium star badge for top/accepted proposal */}
                            {isAccepted && (
                              <div className="absolute -top-3 -right-3 flex size-8 items-center justify-center rounded-full bg-proposal-gold shadow-md">
                                <CheckCircle2 className="size-4 text-proposal-emerald" />
                              </div>
                            )}

                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-display font-bold text-proposal-emerald">
                                    {companyName}
                                  </span>
                                  {pro?.verified && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-proposal-emerald/10 px-2 py-0.5 text-[10px] font-semibold text-proposal-emerald">
                                      <ShieldCheck className="size-3" /> Vérifié
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                  <StarRating value={4.8} />
                                  <span className="text-[10px] font-medium text-proposal-emerald-light">
                                    4.8
                                  </span>
                                </div>
                              </div>
                              <div className="text-left sm:text-right">
                                <p className="font-display text-2xl font-extrabold text-proposal-emerald">
                                  {euro(bid.price)}
                                </p>
                                <p className="text-[10px] uppercase tracking-tighter text-muted-foreground">
                                  TVA incluse
                                </p>
                              </div>
                            </div>

                            {bid.message && (
                              <div className="mt-4 rounded-xl border border-border bg-white p-4">
                                <p className="font-body text-sm leading-relaxed text-muted-foreground italic">
                                  "{bid.message}"
                                </p>
                              </div>
                            )}

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-2 text-xs font-medium text-proposal-emerald-light">
                                <Clock className="size-4" />
                                {bid.available_date
                                  ? `Disponible le ${new Date(bid.available_date).toLocaleDateString("fr-FR")}`
                                  : "Date à convenir"}
                              </div>

                              {bid.status === "pending" ? (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    setCheckout({
                                      bidId: bid.id,
                                      price: bid.price,
                                      companyName,
                                    })
                                  }
                                  className="w-full gap-2 bg-proposal-gold text-proposal-emerald hover:bg-proposal-gold/90 sm:w-auto"
                                >
                                  <Lock className="size-4" /> Accepter et payer en sécurité
                                </Button>
                              ) : (
                                <Badge
                                  variant={bid.status === "disputed" ? "destructive" : "default"}
                                  className="bg-proposal-emerald-light text-white hover:bg-proposal-emerald-light"
                                >
                                  {MISSION_STATUS_LABELS[bid.status] ?? bid.status}
                                </Badge>
                              )}
                            </div>

                            {bid.status === "pending" && (
                              <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-proposal-emerald" />
                                Paiement sécurisé : votre argent est bloqué par Clearo et n'est
                                versé au pro qu'une fois le chantier terminé et validé par vous.
                              </p>
                            )}

                            {payments[bid.id] && (
                              <div
                                className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${
                                  payments[bid.id]!.status === "released"
                                    ? "bg-proposal-emerald/10 text-proposal-emerald"
                                    : payments[bid.id]!.status === "refunded"
                                      ? "bg-destructive/10 text-destructive"
                                      : "bg-proposal-gold/15 text-proposal-emerald"
                                }`}
                              >
                                <Lock className="size-3.5" />
                                {payments[bid.id]!.status === "held" &&
                                  `${euro(payments[bid.id]!.amount_total / 100)} bloqués en séquestre — versés au pro après votre validation`}
                                {payments[bid.id]!.status === "released" &&
                                  "Paiement libéré vers le professionnel"}
                                {payments[bid.id]!.status === "refunded" && "Paiement remboursé"}
                                {payments[bid.id]!.status === "pending" &&
                                  "Paiement en cours de confirmation..."}
                              </div>
                            )}

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
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
