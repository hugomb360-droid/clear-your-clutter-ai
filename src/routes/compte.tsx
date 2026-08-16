import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, MapPin, Package } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClientMissionPanel } from "@/components/client/client-mission-panel";
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

function ClientAccount() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/compte" } });
  }, [loading, user, navigate]);

  const quotesQuery = useQuery({
    queryKey: ["my-quotes", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*, bids(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const acceptBid = async (quoteId: string, bidId: string) => {
    const { error } = await supabase
      .from("bids")
      .update({ status: "accepted" })
      .eq("id", bidId)
      .eq("quote_id", quoteId);
    if (error) {
      toast.error("Impossible d'accepter cette proposition");
      return;
    }
    await supabase.from("quotes").update({ status: "matched" }).eq("id", quoteId);
    toast.success("Proposition acceptée ! Le pro reçoit vos coordonnées.");
    void queryClient.invalidateQueries({ queryKey: ["my-quotes"] });
  };

  if (loading || !user) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-muted-foreground">Chargement...</div>;
  }

  const quotes = quotesQuery.data ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Mes demandes</h1>
          <p className="mt-2 text-sm text-muted-foreground">
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

      <div className="mt-8 space-y-6">
        {quotes.map((quote) => {
          const bids = quote.bids ?? [];
          return (
            <article
              key={quote.id}
              className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">
                    {quote.property_type} · {quote.volume_m3 ?? "?"} m³
                  </h2>
                  <p className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" /> {quote.postal_code} {quote.city ?? ""}
                    </span>
                    {quote.desired_date && (
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" />
                        {new Date(quote.desired_date).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </p>
                </div>
                <Badge variant={quote.status === "matched" ? "default" : "secondary"}>
                  {STATUS_LABELS[quote.status] ?? quote.status}
                </Badge>
              </div>

              {quote.price_min != null && quote.price_max != null && (
                <p className="mt-4 text-2xl font-extrabold text-brand">
                  {euro(quote.price_min)} – {euro(quote.price_max)}
                </p>
              )}

              <div className="mt-6 border-t border-border pt-5">
                <h3 className="text-sm font-semibold">
                  Propositions reçues ({bids.length})
                </h3>
                {bids.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Votre demande est visible par les pros de votre secteur. Les premières réponses
                    arrivent en général sous 48 h.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {bids.map((bid) => (
                      <li key={bid.id} className="rounded-2xl bg-secondary/60 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{euro(bid.price)}</p>
                            <p className="text-sm text-muted-foreground">
                              {bid.available_date
                                ? `Disponible le ${new Date(bid.available_date).toLocaleDateString("fr-FR")}`
                                : "Date à convenir"}
                              {bid.message ? ` · ${bid.message}` : ""}
                            </p>
                          </div>
                          {bid.status === "pending" ? (
                            <Button size="sm" onClick={() => acceptBid(quote.id, bid.id)}>
                              Accepter
                            </Button>
                          ) : (
                            <Badge variant={bid.status === "disputed" ? "destructive" : "default"}>
                              {MISSION_STATUS_LABELS[bid.status] ?? bid.status}
                            </Badge>
                          )}
                        </div>
                        {["accepted", "awaiting_confirmation", "completed", "disputed"].includes(
                          bid.status,
                        ) && (
                          <ClientMissionPanel
                            bidId={bid.id}
                            quoteId={quote.id}
                            clientId={user.id}
                            proId={bid.pro_id}
                            status={bid.status}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
