import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MissionCard } from "@/components/pro/pro-schedule";
import type { BidWithQuote, QuoteContact } from "@/lib/pro-dashboard";
import { formatMonth } from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

const dayKey = (value: string | Date) => {
  const d = typeof value === "string" ? new Date(value) : value;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function ProCalendar({
  bids,
  contacts,
}: {
  bids: BidWithQuote[];
  contacts: QuoteContact[];
}) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<string | null>(dayKey(today));

  const byDay = useMemo(() => {
    const map = new Map<string, BidWithQuote[]>();
    for (const bid of bids) {
      if (!bid.available_date) continue;
      const key = dayKey(bid.available_date);
      map.set(key, [...(map.get(key) ?? []), bid]);
    }
    return map;
  }, [bids]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedBids = selected ? (byDay.get(selected) ?? []) : [];
  const contactOf = (quoteId: string) => contacts.find((c) => c.quote_id === quoteId);

  const monthTotal = [...byDay.entries()]
    .filter(([key]) => key.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`))
    .flatMap(([, list]) => list);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="font-bold capitalize">{formatMonth(`${year}-${String(month + 1).padStart(2, "0")}-01`)}</p>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="size-8"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              aria-label="Mois précédent"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-8"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              aria-label="Mois suivant"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
          {WEEKDAYS.map((d, i) => (
            <span key={`${d}-${i}`}>{d}</span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day, index) => {
            if (day === null) return <span key={`empty-${index}`} />;
            const key = dayKey(new Date(year, month, day));
            const dayBids = byDay.get(key) ?? [];
            const isToday = key === dayKey(today);
            const isSelected = key === selected;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                className={[
                  "relative aspect-square rounded-xl text-sm font-semibold transition",
                  dayBids.length > 0
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "text-foreground hover:bg-secondary",
                  isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : "",
                  isToday && dayBids.length === 0 ? "border border-primary/40" : "",
                ].join(" ")}
              >
                {day}
                {dayBids.length > 1 && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold">
                    ×{dayBids.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-3 rounded-md bg-primary" /> Jour avec chantier
        </div>
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          {monthTotal.length} chantier(s) ce mois — {euro(monthTotal.reduce((s, b) => s + b.price, 0))} brut
        </p>
      </div>

      <div className="space-y-4">
        {selectedBids.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border p-8 text-sm text-muted-foreground">
            Aucun chantier ce jour-là. Sélectionnez une date en vert pour voir les coordonnées du
            client et les détails de la mission.
          </p>
        ) : (
          selectedBids.map((bid) => (
            <MissionCard
              key={bid.id}
              bid={bid}
              contact={bid.quote_id ? contactOf(bid.quote_id) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
