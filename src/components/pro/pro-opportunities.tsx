import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuotePhotos } from "@/components/pro/quote-photos";
import { supabase } from "@/integrations/supabase/client";
import type { Quote } from "@/lib/pro-dashboard";
import { commissionOf, formatDate, netOf, quoteTitle } from "@/lib/pro-dashboard";
import { useFoundingStatus } from "@/hooks/useFoundingStatus";
import { euro } from "@/lib/pricing";
import { SectorResponse } from "@/components/pro/pro-notifications";

type Draft = { price: string; date: string; message: string };

export function ProOpportunities({ quotes, proId }: { quotes: Quote[]; proId: string }) {
  const queryClient = useQueryClient();
  const founding = useFoundingStatus();
  const freeMission = founding.freeRemaining > 0;
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
      <div className="rounded-[2rem] border border-dashed border-proposal-emerald/20 bg-proposal-cream/30 p-6 sm:p-10 text-center">
        <Sparkles className="mx-auto size-6 text-proposal-gold" />
        <p className="mt-3 font-body text-sm text-muted-foreground">
          Aucune nouvelle demande dans vos zones pour le moment. Élargissez vos codes postaux dans
          vos paramètres pour recevoir plus de missions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {quotes.map((quote) => {
        const draft = draftOf(quote.id);
        const price = Number.parseInt(draft.price, 10);
        return (
          <article
            key={quote.id}
            className="overflow-hidden rounded-[2rem] bg-white shadow-[var(--shadow-proposal)] ring-1 ring-proposal-emerald/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="flex flex-col justify-between bg-proposal-emerald p-5 sm:p-7 text-proposal-cream md:col-span-4 lg:p-8">
                <div>
                  {quote.ai_analysis != null && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-proposal-emerald-light/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-proposal-gold">
                      <Sparkles className="size-3" /> Analysé par l'IA
                    </span>
                  )}
                  <h3 className="font-display mt-4 text-2xl font-bold leading-tight">
                    {quoteTitle(quote)}
                  </h3>
                  <div className="mt-6 space-y-3 font-body text-sm">
                    <p className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-proposal-emerald-light/60">
                        <MapPin className="size-4 text-proposal-gold" />
                      </span>
                      {quote.postal_code} {quote.city ?? ""}
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-proposal-emerald-light/60">
                        <CalendarDays className="size-4 text-proposal-gold" />
                      </span>
                      {formatDate(quote.desired_date)}
                    </p>
                  </div>
                  <p className="mt-5 font-body text-xs leading-relaxed text-proposal-cream/70">
                    Étage {quote.floor}
                    {quote.has_elevator ? " avec ascenseur" : " sans ascenseur"}
                    {quote.surface_m2 ? ` · ${quote.surface_m2} m²` : ""}
                  </p>
                  {quote.notes && (
                    <p className="mt-3 font-body text-xs italic leading-relaxed text-proposal-cream/70">
                      « {quote.notes} »
                    </p>
                  )}
                </div>

                <div className="mt-8 border-t border-proposal-emerald-light/40 pt-5">
                  <p className="text-[10px] uppercase tracking-widest text-proposal-cream/50">
                    Estimation Débarras France
                  </p>
                  <p className="font-display mt-1 text-xl font-bold">
                    {quote.price_min != null && quote.price_max != null
                      ? `${euro(quote.price_min)} – ${euro(quote.price_max)}`
                      : "Sur devis"}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 sm:p-7 md:col-span-8 lg:p-8">
                <QuotePhotos quoteId={quote.id} />
                <SectorResponse postal={quote.postal_code} />

                <div className="mt-5 grid gap-4 sm:grid-cols-[8rem_12rem]">
                  <div className="grid gap-2">
                    <Label htmlFor={`price-${quote.id}`}>Mon prix TTC</Label>
                    <Input
                      id={`price-${quote.id}`}
                      inputMode="numeric"
                      placeholder="450"
                      className="rounded-xl"
                      value={draft.price}
                      onChange={(e) => patch(quote.id, { price: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`date-${quote.id}`}>Date proposée</Label>
                    <Input
                      id={`date-${quote.id}`}
                      type="date"
                      className="rounded-xl"
                      value={draft.date}
                      onChange={(e) => patch(quote.id, { date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-4 grid gap-2">
                  <Label htmlFor={`msg-${quote.id}`}>Message au client</Label>
                  <Textarea
                    id={`msg-${quote.id}`}
                    rows={2}
                    className="rounded-xl"
                    placeholder="Équipe de 2, camion 20 m³, évacuation en déchèterie agréée."
                    value={draft.message}
                    onChange={(e) => patch(quote.id, { message: e.target.value })}
                  />
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                  <p className="font-body text-xs text-muted-foreground">
                    {Number.isFinite(price) && price > 0
                      ? freeMission
                        ? `Offre fondateur : 0 € de commission · vous percevez ${euro(price)}`
                        : `Commission ${euro(commissionOf(price))} · vous percevez ${euro(netOf(price))}`
                      : "Commission Débarras France de 12 % uniquement si le client vous choisit."}
                  </p>
                  <Button
                    onClick={() => send(quote)}
                    disabled={sending === quote.id}
                    className="w-full rounded-xl bg-proposal-gold font-semibold text-proposal-emerald hover:bg-proposal-gold/90 sm:w-auto"
                  >
                    {sending === quote.id ? "Envoi..." : "Envoyer ma proposition"}
                  </Button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
