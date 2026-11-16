import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuotePhotos } from "@/components/pro/quote-photos";
import {
  EmptyState,
  StatusPill,
  fieldClass,
  sBtnGhost,
  sBtnOutline,
  sBtnPrimary,
} from "@/components/space/space-kit";
import { bidTone } from "@/components/space/tones";
import { supabase } from "@/integrations/supabase/client";
import type { BidWithQuote } from "@/lib/pro-dashboard";
import { BID_STATUS_LABELS, formatDate, netOf, quoteTitle } from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";
import { useFoundingStatus } from "@/hooks/useFoundingStatus";

export function ProBids({ bids }: { bids: BidWithQuote[] }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const freeMission = useFoundingStatus().freeRemaining > 0;

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
    setBusy(bidId);
    const { error } = await supabase.from("bids").update({ price }).eq("id", bidId);
    setBusy(null);
    if (error) {
      toast.error("Modification impossible", { description: error.message });
      return;
    }
    setEditing(null);
    toast.success("Prix mis à jour");
    refresh();
  };

  const withdraw = async (bidId: string) => {
    setBusy(bidId);
    const { error } = await supabase.from("bids").update({ status: "withdrawn" }).eq("id", bidId);
    setBusy(null);
    if (error) {
      toast.error("Retrait impossible", { description: error.message });
      return;
    }
    toast.success("Proposition retirée");
    refresh();
  };

  if (bids.length === 0) {
    return (
      <EmptyState
        icon={Send}
        title="Aucune proposition envoyée"
        text="Chiffrez une demande : votre proposition apparaîtra ici en attendant la réponse du client."
      />
    );
  }

  return (
    <ul className="grid gap-4 xl:grid-cols-2">
      {bids.map((bid) => (
        <li
          key={bid.id}
          className="flex flex-col rounded-3xl border border-border bg-card p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[18px] font-extrabold leading-tight text-brand-ink">
                {quoteTitle(bid.quotes)}
              </h3>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-primary" aria-hidden="true" />
                  {bid.quotes?.postal_code ?? "—"} {bid.quotes?.city ?? ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                  {formatDate(bid.available_date)}
                </span>
              </p>
            </div>
            <StatusPill tone={bidTone(bid.status)}>
              {BID_STATUS_LABELS[bid.status] ?? bid.status}
            </StatusPill>
          </div>

          {bid.message && (
            <p className="mt-3 rounded-2xl bg-brand-soft/60 px-4 py-3 text-sm leading-relaxed text-brand-ink">
              « {bid.message} »
            </p>
          )}

          <QuotePhotos quoteId={bid.quote_id} />

          <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
            {editing === bid.id ? (
              <form
                className="flex flex-wrap items-end gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  void updatePrice(bid.id);
                }}
              >
                <div className="grid gap-1.5">
                  <Label htmlFor={`edit-price-${bid.id}`}>Nouveau prix TTC (€)</Label>
                  <Input
                    id={`edit-price-${bid.id}`}
                    className={`${fieldClass} w-32`}
                    inputMode="numeric"
                    value={priceDraft}
                    onChange={(e) => setPriceDraft(e.target.value)}
                  />
                </div>
                <button type="submit" className={sBtnPrimary} disabled={busy === bid.id}>
                  Valider
                </button>
                <button type="button" className={sBtnGhost} onClick={() => setEditing(null)}>
                  Annuler
                </button>
              </form>
            ) : (
              <div>
                <p className="text-[26px] font-black leading-none tracking-[-0.02em] text-brand-ink tabular-nums">
                  {euro(bid.price)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Net pour vous : {euro(netOf(bid.price, freeMission))}
                </p>
              </div>
            )}

            {bid.status === "pending" && editing !== bid.id && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={sBtnOutline}
                  onClick={() => {
                    setEditing(bid.id);
                    setPriceDraft(String(bid.price));
                  }}
                >
                  Modifier le prix
                </button>
                <button
                  type="button"
                  className={sBtnGhost}
                  disabled={busy === bid.id}
                  onClick={() => void withdraw(bid.id)}
                >
                  Retirer
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
