import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuotePhotos } from "@/components/pro/quote-photos";
import { supabase } from "@/integrations/supabase/client";
import type { BidWithQuote } from "@/lib/pro-dashboard";
import { BID_STATUS_LABELS, formatDate, netOf, quoteTitle } from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";

export function ProBids({ bids }: { bids: BidWithQuote[] }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState("");

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["pro-bids"] });
    void queryClient.invalidateQueries({ queryKey: ["pro-missions"] });
  };

  const updatePrice = async (bidId: string) => {
    const price = Number.parseInt(priceDraft, 10);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Prix invalide");
      return;
    }
    const { error } = await supabase.from("bids").update({ price }).eq("id", bidId);
    if (error) {
      toast.error("Modification impossible", { description: error.message });
      return;
    }
    setEditing(null);
    toast.success("Prix mis à jour");
    refresh();
  };

  const withdraw = async (bidId: string) => {
    const { error } = await supabase.from("bids").update({ status: "withdrawn" }).eq("id", bidId);
    if (error) {
      toast.error("Retrait impossible", { description: error.message });
      return;
    }
    toast.success("Proposition retirée");
    refresh();
  };

  if (bids.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-proposal-emerald/20 bg-proposal-cream/30 p-10 text-center">
        <Clock className="mx-auto size-6 text-proposal-gold" />
        <p className="mt-3 font-body text-sm text-muted-foreground">
          Vous n'avez pas encore envoyé de proposition. Chiffrez une demande ci-dessus.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {bids.map((bid) => (
        <article
          key={bid.id}
          className="rounded-[1.75rem] bg-white p-6 shadow-[var(--shadow-proposal)] ring-1 ring-proposal-emerald/10"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-proposal-emerald">
                {quoteTitle(bid.quotes)}
              </h3>
              <p className="mt-1.5 flex flex-wrap items-center gap-3 font-body text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-proposal-gold" />{" "}
                  {bid.quotes?.postal_code ?? "—"} {bid.quotes?.city ?? ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 text-proposal-gold" />{" "}
                  {formatDate(bid.available_date)}
                </span>
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                bid.status === "pending"
                  ? "bg-proposal-gold/15 text-proposal-emerald"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {BID_STATUS_LABELS[bid.status] ?? bid.status}
            </span>
          </div>

          {bid.message && (
            <p className="mt-3 rounded-xl bg-proposal-cream/40 p-3 font-body text-sm italic text-muted-foreground">
              « {bid.message} »
            </p>
          )}

          <QuotePhotos quoteId={bid.quote_id} />

          <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
            {editing === bid.id ? (
              <div className="flex items-center gap-2">
                <Input
                  className="w-28 rounded-xl"
                  inputMode="numeric"
                  value={priceDraft}
                  onChange={(e) => setPriceDraft(e.target.value)}
                />
                <Button size="sm" className="rounded-xl" onClick={() => updatePrice(bid.id)}>
                  Valider
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                  Annuler
                </Button>
              </div>
            ) : (
              <div>
                <p className="font-display text-2xl font-extrabold text-proposal-emerald">
                  {euro(bid.price)}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Net pour vous : {euro(netOf(bid.price))}
                </p>
              </div>
            )}

            {bid.status === "pending" && editing !== bid.id && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    setEditing(bid.id);
                    setPriceDraft(String(bid.price));
                  }}
                >
                  Modifier le prix
                </Button>
                <Button size="sm" variant="ghost" onClick={() => withdraw(bid.id)}>
                  Retirer
                </Button>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
