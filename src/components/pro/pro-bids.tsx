import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { BidWithQuote } from "@/lib/pro-dashboard";
import {
  BID_STATUS_LABELS,
  BID_STATUS_TONE,
  formatDate,
  netOf,
  quoteTitle,
} from "@/lib/pro-dashboard";
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
      <p className="rounded-3xl border border-dashed border-border p-8 text-sm text-muted-foreground">
        Vous n'avez pas encore envoyé de proposition. Rendez-vous dans l'onglet « Demandes ».
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <article
          key={bid.id}
          className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-border bg-card p-6"
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold">{quoteTitle(bid.quotes)}</h3>
              <Badge variant={BID_STATUS_TONE[bid.status] ?? "secondary"}>
                {BID_STATUS_LABELS[bid.status] ?? bid.status}
              </Badge>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" /> {bid.quotes?.postal_code ?? "—"}{" "}
                {bid.quotes?.city ?? ""}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" /> {formatDate(bid.available_date)}
              </span>
            </p>
            {bid.message && <p className="mt-2 text-sm text-muted-foreground">{bid.message}</p>}
          </div>

          <div className="flex flex-col items-end gap-2">
            {editing === bid.id ? (
              <div className="flex items-center gap-2">
                <Input
                  className="w-28"
                  inputMode="numeric"
                  value={priceDraft}
                  onChange={(e) => setPriceDraft(e.target.value)}
                />
                <Button size="sm" onClick={() => updatePrice(bid.id)}>
                  Valider
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                  Annuler
                </Button>
              </div>
            ) : (
              <>
                <p className="text-lg font-extrabold">{euro(bid.price)}</p>
                <p className="text-xs text-muted-foreground">Net : {euro(netOf(bid.price))}</p>
              </>
            )}
            {bid.status === "pending" && editing !== bid.id && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
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
