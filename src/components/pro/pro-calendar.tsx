import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MissionCard } from "@/components/pro/pro-schedule";
import { EmptyState, StatusPill } from "@/components/space/space-kit";
import { bidTone } from "@/components/space/tones";
import type { BidWithQuote, QuoteContact } from "@/lib/pro-dashboard";
import { formatDate, formatMonth, quoteTitle } from "@/lib/pro-dashboard";
import { MISSION_STATUS_LABELS } from "@/lib/mission";
import { euro } from "@/lib/pricing";

const WEEKDAYS = [
  { short: "L", long: "Lundi" },
  { short: "M", long: "Mardi" },
  { short: "M", long: "Mercredi" },
  { short: "J", long: "Jeudi" },
  { short: "V", long: "Vendredi" },
  { short: "S", long: "Samedi" },
  { short: "D", long: "Dimanche" },
];

const dayKey = (value: string | Date) => {
  const d = typeof value === "string" ? new Date(value) : value;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const navBtn =
  "flex size-10 items-center justify-center rounded-full bg-brand-soft text-brand-ink transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-bright";

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

  const undated = useMemo(() => bids.filter((bid) => !bid.available_date), [bids]);
  const dated = useMemo(
    () =>
      bids
        .filter((bid) => bid.available_date)
        .sort((a, b) => a.available_date!.localeCompare(b.available_date!)),
    [bids],
  );

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
    setCursor(new Date(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1, 1));
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

  if (bids.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="Aucun chantier pour l'instant"
        text="Dès qu'un client accepte une de vos propositions, le chantier apparaît ici avec ses coordonnées."
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-3xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-[17px] font-extrabold capitalize text-brand-ink">
              {formatMonth(`${year}-${String(month + 1).padStart(2, "0")}-01`)}
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                aria-label="Mois précédent"
                onClick={() => setCursor(new Date(year, month - 1, 1))}
                className={navBtn}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Mois suivant"
                onClick={() => setCursor(new Date(year, month + 1, 1))}
                className={navBtn}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted-foreground">
            {WEEKDAYS.map((d) => (
              <span key={d.long} aria-hidden="true">
                {d.short}
              </span>
            ))}
          </div>

          <div className="mt-1.5 grid grid-cols-7 gap-1">
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
                  aria-pressed={isSelected}
                  aria-label={`${day} ${formatMonth(key)}${dayBids.length > 0 ? `, ${dayBids.length} chantier(s)` : ""}`}
                  className={[
                    "relative aspect-square rounded-xl text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-bright",
                    dayBids.length > 0
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-brand-ink hover:bg-brand-soft",
                    isSelected ? "ring-[3px] ring-brand-ink ring-offset-2 ring-offset-card" : "",
                    isToday && dayBids.length === 0 ? "bg-brand-soft" : "",
                  ].join(" ")}
                >
                  {day}
                  {dayBids.length > 1 && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[10px] font-bold">
                      ×{dayBids.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-4 border-t border-border pt-3 text-sm text-muted-foreground">
            {monthBids.length} chantier{monthBids.length > 1 ? "s" : ""} ce mois ·{" "}
            <span className="font-bold text-brand-ink">
              {euro(monthBids.reduce((s, b) => s + b.price, 0))} brut
            </span>
          </p>
        </div>

        {dated.length > 0 && (
          <div className="rounded-3xl border border-border bg-card p-4 sm:p-5">
            <p className="text-sm font-extrabold text-brand-ink">Tous mes chantiers</p>
            <ul className="mt-2 max-h-72 divide-y divide-border overflow-y-auto">
              {dated.map((bid) => {
                const key = dayKey(bid.available_date!);
                return (
                  <li key={bid.id}>
                    <button
                      type="button"
                      onClick={() => pick(key)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2.5 text-left text-sm transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-bright ${
                        key === selected ? "bg-brand-soft" : ""
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-bold text-brand-ink">
                          {quoteTitle(bid.quotes)}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {formatDate(bid.available_date)}
                        </span>
                      </span>
                      <StatusPill tone={bidTone(bid.status)}>
                        {MISSION_STATUS_LABELS[bid.status] ?? bid.status}
                      </StatusPill>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-4">
        {selected && (
          <p className="text-sm font-bold text-muted-foreground">
            {formatDate(selected)} · {selectedBids.length} chantier
            {selectedBids.length > 1 ? "s" : ""}
          </p>
        )}
        {selectedBids.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Aucun chantier ce jour-là"
            text="Choisissez un jour en vert dans le calendrier, ou un chantier dans la liste."
          />
        ) : (
          selectedBids.map((bid) => (
            <MissionCard
              key={bid.id}
              bid={bid}
              contact={bid.quote_id ? contactOf(bid.quote_id) : undefined}
            />
          ))
        )}

        {undated.length > 0 && (
          <div className="space-y-4 pt-2">
            <p className="text-sm font-bold text-muted-foreground">
              Sans date fixée · {undated.length} chantier{undated.length > 1 ? "s" : ""}
            </p>
            {undated.map((bid) => (
              <MissionCard
                key={bid.id}
                bid={bid}
                contact={bid.quote_id ? contactOf(bid.quote_id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
