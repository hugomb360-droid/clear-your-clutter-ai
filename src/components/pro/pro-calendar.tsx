import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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

  const byDay = useMemo(() => {
    const map = new Map<string, BidWithQuote[]>();
    for (const bid of bids) {
      if (!bid.available_date) continue;
      const key = dayKey(bid.available_date);
      map.set(key, [...(map.get(key) ?? []), bid]);
    }
    return map;
  }, [bids]);

  const firstMissionDay =
    [...byDay.keys()].filter((k) => k >= dayKey(today)).sort()[0] ??
    [...byDay.keys()].sort().pop() ??
    dayKey(today);

  const [cursor, setCursor] = useState<Date | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const touched = useRef(false);

  useEffect(() => {
    if (touched.current || byDay.size === 0) return;
    setSelected(firstMissionDay);
    setCursor(
      new Date(Number(firstMissionDay.slice(0, 4)), Number(firstMissionDay.slice(5, 7)) - 1, 1),
    );
  }, [firstMissionDay, byDay]);

  const pick = (key: string) => {
    touched.current = true;
    setSelected(key);
  };

  const view = cursor ?? new Date(today.getFullYear(), today.getMonth(), 1);

  const year = view.getFullYear();
  const month = view.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedBids = selected ? (byDay.get(selected) ?? []) : [];
  const contactOf = (quoteId: string) => contacts.find((c) => c.quote_id === quoteId);

  const monthBids = [...byDay.entries()]
    .filter(([key]) => key.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`))
    .flatMap(([, list]) => list);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <div className="h-fit overflow-hidden rounded-[2rem] bg-proposal-emerald p-6 text-proposal-cream shadow-[var(--shadow-proposal)]">
        <div className="flex items-center justify-between">
          <p className="font-display font-bold capitalize">
            {formatMonth(`${year}-${String(month + 1).padStart(2, "0")}-01`)}
          </p>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Mois précédent"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              className="flex size-8 items-center justify-center rounded-full bg-proposal-emerald-light/50 transition hover:bg-proposal-emerald-light"
            >
              <ChevronLeft className="size-4 text-proposal-gold" />
            </button>
            <button
              type="button"
              aria-label="Mois suivant"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              className="flex size-8 items-center justify-center rounded-full bg-proposal-emerald-light/50 transition hover:bg-proposal-emerald-light"
            >
              <ChevronRight className="size-4 text-proposal-gold" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-proposal-cream/50">
          {WEEKDAYS.map((d, i) => (
            <span key={`${d}-${i}`}>{d}</span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1">
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
                onClick={() => pick(key)}
                className={[
                  "relative aspect-square rounded-xl font-body text-sm font-semibold transition",
                  dayBids.length > 0
                    ? "bg-proposal-gold text-proposal-emerald hover:brightness-105"
                    : "text-proposal-cream/70 hover:bg-proposal-emerald-light/50",
                  isSelected ? "ring-2 ring-proposal-cream ring-offset-2 ring-offset-proposal-emerald" : "",
                  isToday && dayBids.length === 0 ? "border border-proposal-cream/30" : "",
                ].join(" ")}
              >
                {day}
                {dayBids.length > 1 && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] font-bold">
                    ×{dayBids.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-proposal-emerald-light/40 pt-4 font-body text-xs text-proposal-cream/70">
          <span className="size-3 rounded-md bg-proposal-gold" /> Jour de chantier
        </div>
        <p className="mt-2 font-body text-xs text-proposal-cream/70">
          {monthBids.length} chantier(s) ce mois ·{" "}
          <span className="font-semibold text-proposal-gold">
            {euro(monthBids.reduce((s, b) => s + b.price, 0))} brut
          </span>
        </p>
      </div>

      <div className="space-y-4">
        {selectedBids.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-proposal-emerald/20 bg-proposal-cream/30 p-6 sm:p-10 text-center font-body text-sm text-muted-foreground">
            Aucun chantier ce jour-là. Sélectionnez une date dorée pour voir les coordonnées du
            client et le détail de la mission.
          </div>
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
