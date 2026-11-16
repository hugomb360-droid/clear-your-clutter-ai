import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, ChevronDown, Inbox, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuotePhotos } from "@/components/pro/quote-photos";
import {
  EmptyState,
  StatusPill,
  fieldClass,
  sBtnGhost,
  sBtnPrimary,
} from "@/components/space/space-kit";
import { supabase } from "@/integrations/supabase/client";
import type { Quote } from "@/lib/pro-dashboard";
import { accessLabel, commissionOf, formatDate, netOf, quoteTitle } from "@/lib/pro-dashboard";
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
  const [open, setOpen] = useState<string | null>(null);

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
    setOpen(null);
    void queryClient.invalidateQueries({ queryKey: ["pro-missions"] });
    void queryClient.invalidateQueries({ queryKey: ["pro-bids"] });
  };

  if (quotes.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Aucune nouvelle demande dans vos zones"
        text="Vous serez prévenu dès qu'une demande arrive. Pour en recevoir plus, élargissez vos codes postaux dans vos paramètres."
      />
    );
  }

  return (
    <ul className="space-y-4">
      {quotes.map((quote) => {
        const draft = draftOf(quote.id);
        const price = Number.parseInt(draft.price, 10);
        const isOpen = open === quote.id;
        const hasRange = quote.price_min != null && quote.price_max != null;
        return (
          <li key={quote.id} className="rounded-3xl border border-border bg-card">
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[19px] font-extrabold leading-tight text-brand-ink">
                      {quoteTitle(quote)}
                    </h3>
                    {quote.ai_analysis != null && (
                      <StatusPill tone="green">
                        <Sparkles className="size-3" aria-hidden="true" /> Volume estimé par l'IA
                      </StatusPill>
                    )}
                  </div>
                  <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4 text-primary" aria-hidden="true" />
                      {quote.postal_code} {quote.city ?? ""}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                      {formatDate(quote.desired_date)}
                    </span>
                    <span>
                      {accessLabel(quote.floor, quote.has_elevator)}
                      {quote.surface_m2 ? ` · ${quote.surface_m2} m²` : ""}
                    </span>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-semibold text-muted-foreground">Repère de prix</p>
                  <p className="text-[19px] font-extrabold text-brand-ink tabular-nums">
                    {hasRange
                      ? `${euro(quote.price_min!)} – ${euro(quote.price_max!)}`
                      : "Sur devis"}
                  </p>
                </div>
              </div>

              {quote.notes && (
                <p className="mt-3 rounded-2xl bg-brand-soft/60 px-4 py-3 text-sm leading-relaxed text-brand-ink">
                  « {quote.notes} »
                </p>
              )}

              <QuotePhotos quoteId={quote.id} />

              {!isOpen && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <SectorResponse postal={quote.postal_code} />
                  <button type="button" className={sBtnPrimary} onClick={() => setOpen(quote.id)}>
                    Chiffrer cette demande
                    <ChevronDown className="size-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {isOpen && (
              <form
                className="border-t border-border bg-brand-soft/40 p-5 sm:p-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  void send(quote);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-[10rem_12rem_minmax(0,1fr)]">
                  <div className="grid gap-1.5">
                    <Label htmlFor={`price-${quote.id}`}>Mon prix TTC (€)</Label>
                    <Input
                      id={`price-${quote.id}`}
                      inputMode="numeric"
                      autoFocus
                      placeholder={hasRange ? String(quote.price_min) : "450"}
                      className={`${fieldClass} bg-white`}
                      value={draft.price}
                      onChange={(e) => patch(quote.id, { price: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor={`date-${quote.id}`}>Date proposée</Label>
                    <Input
                      id={`date-${quote.id}`}
                      type="date"
                      className={`${fieldClass} bg-white`}
                      value={draft.date}
                      onChange={(e) => patch(quote.id, { date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor={`msg-${quote.id}`}>Message au client (facultatif)</Label>
                    <Textarea
                      id={`msg-${quote.id}`}
                      rows={1}
                      className="min-h-11 rounded-xl bg-white"
                      placeholder="Équipe de 2, camion 20 m³, évacuation en déchèterie agréée."
                      value={draft.message}
                      onChange={(e) => patch(quote.id, { message: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-brand-ink" aria-live="polite">
                    {Number.isFinite(price) && price > 0
                      ? freeMission
                        ? `Offre fondateur : 0 € de commission, vous percevez ${euro(price)}.`
                        : `Commission ${euro(commissionOf(price))}, vous percevez ${euro(netOf(price))}.`
                      : "Commission de 12 % uniquement si le client vous choisit."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={sBtnGhost} onClick={() => setOpen(null)}>
                      Annuler
                    </button>
                    <button type="submit" className={sBtnPrimary} disabled={sending === quote.id}>
                      {sending === quote.id ? "Envoi…" : "Envoyer ma proposition"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </li>
        );
      })}
    </ul>
  );
}
