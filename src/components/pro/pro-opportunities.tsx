import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Quote } from "@/lib/pro-dashboard";
import { commissionOf, formatDate, netOf, quoteTitle } from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";

type Draft = { price: string; date: string; message: string };

export function ProOpportunities({ quotes, proId }: { quotes: Quote[]; proId: string }) {
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [sending, setSending] = useState<string | null>(null);

  const draftOf = (id: string) => drafts[id] ?? { price: "", date: "", message: "" };
  const patch = (id: string, next: Partial<Draft>) =>
    setDrafts((prev) => ({ ...prev, [id]: { ...draftOf(id), ...next } }));

  const send = async (quote: Quote) => {
    const draft = draftOf(quote.id);
    const price = Number.parseInt(draft.price, 10);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Indiquez un prix TTC");
      return;
    }
    setSending(quote.id);
    const { error } = await supabase.from("bids").insert({
      quote_id: quote.id,
      pro_id: proId,
      price,
      available_date: draft.date || null,
      message: draft.message || null,
    });
    setSending(null);
    if (error) {
      toast.error("Proposition refusée", { description: error.message });
      return;
    }
    toast.success("Proposition envoyée au client");
    setDrafts((prev) => ({ ...prev, [quote.id]: { price: "", date: "", message: "" } }));
    void queryClient.invalidateQueries({ queryKey: ["pro-missions"] });
    void queryClient.invalidateQueries({ queryKey: ["pro-bids"] });
  };

  if (quotes.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-border p-8 text-sm text-muted-foreground">
        Aucune nouvelle demande dans vos zones pour le moment. Élargissez vos codes postaux dans
        l'onglet « Ma fiche » pour recevoir plus de missions.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {quotes.map((quote) => {
        const draft = draftOf(quote.id);
        const price = Number.parseInt(draft.price, 10);
        return (
          <article key={quote.id} className="rounded-3xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{quoteTitle(quote)}</h3>
                  {quote.ai_analysis != null && (
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="size-3" /> Analysé par l'IA
                    </Badge>
                  )}
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> {quote.postal_code} {quote.city ?? ""}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" /> {formatDate(quote.desired_date)}
                  </span>
                  <span>
                    Étage {quote.floor}
                    {quote.has_elevator ? " avec ascenseur" : " sans ascenseur"}
                  </span>
                  {quote.surface_m2 ? <span>{quote.surface_m2} m²</span> : null}
                </p>
              </div>
              {quote.price_min != null && quote.price_max != null && (
                <p className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium">
                  Estimation Clearo : {euro(quote.price_min)} – {euro(quote.price_max)}
                </p>
              )}
            </div>

            {quote.notes && <p className="mt-3 text-sm text-muted-foreground">{quote.notes}</p>}

            <QuotePhotos quoteId={quote.id} />

            <div className="mt-5 grid gap-4 sm:grid-cols-[8rem_12rem_1fr]">
              <div className="grid gap-2">
                <Label htmlFor={`price-${quote.id}`}>Mon prix TTC</Label>
                <Input
                  id={`price-${quote.id}`}
                  inputMode="numeric"
                  placeholder="450"
                  value={draft.price}
                  onChange={(e) => patch(quote.id, { price: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`date-${quote.id}`}>Date proposée</Label>
                <Input
                  id={`date-${quote.id}`}
                  type="date"
                  value={draft.date}
                  onChange={(e) => patch(quote.id, { date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`msg-${quote.id}`}>Message au client</Label>
                <Textarea
                  id={`msg-${quote.id}`}
                  rows={2}
                  placeholder="Équipe de 2, camion 20 m³, évacuation en déchèterie agréée."
                  value={draft.message}
                  onChange={(e) => patch(quote.id, { message: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {Number.isFinite(price) && price > 0
                  ? `Commission Clearo ${euro(commissionOf(price))} · vous percevez ${euro(netOf(price))}`
                  : "Commission Clearo de 12 % prélevée uniquement si le client vous choisit."}
              </p>
              <Button onClick={() => send(quote)} disabled={sending === quote.id}>
                {sending === quote.id ? "Envoi..." : "Envoyer ma proposition"}
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
