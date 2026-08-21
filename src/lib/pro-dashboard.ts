import type { Tables } from "@/integrations/supabase/types";

export type Quote = Tables<"quotes">;
export type Bid = Tables<"bids">;
export type QuoteContact = Tables<"quote_contacts">;
export type BidWithQuote = Bid & { quotes: Quote | null };

/** Commission Clearo prélevée sur chaque mission réalisée. */
export const CLEARO_COMMISSION_RATE = 0.12;

export const commissionOf = (price: number) => Math.round(price * CLEARO_COMMISSION_RATE);
export const netOf = (price: number) => price - commissionOf(price);

/** Normalise une saisie libre de codes postaux : « 75, 92100 » -> ["75", "92100"]. */
export function parsePostalCodes(input: string) {
  const seen = new Set<string>();
  for (const raw of input.split(/[,;\s]+/)) {
    const zone = raw.replace(/\D/g, "");
    if (zone.length >= 2 && zone.length <= 5) seen.add(zone);
  }
  return [...seen];
}

/** Un pro couvre un code postal si l'une de ses zones en est le préfixe (75 -> 75011). */
export const coversPostal = (zones: string[] | null | undefined, postal: string | null) =>
  Boolean(postal) && (zones ?? []).some((zone) => postal!.startsWith(zone));

export const BID_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  completed: "Terminée",
  withdrawn: "Retirée",
  refused: "Refusée",
};

export const BID_STATUS_TONE: Record<string, "default" | "secondary" | "outline" | "destructive"> =
  {
    pending: "secondary",
    accepted: "default",
    completed: "outline",
    withdrawn: "outline",
    refused: "destructive",
  };

export const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(
        new Date(value),
      )
    : "Date à définir";

export const formatMonth = (value: string) =>
  new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date(value));

export const isUpcoming = (value?: string | null) => {
  if (!value) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(value).getTime() >= today.getTime();
};

export const quoteTitle = (quote: Quote | null) => {
  if (!quote) return "Mission";
  const type = quote.property_type && quote.property_type !== "Non précisé" ? quote.property_type : "Débarras";
  return quote.volume_m3 ? `${type} · ${quote.volume_m3} m³` : type;
};

export function monthlyRevenue(bids: BidWithQuote[]) {
  const map = new Map<string, { key: string; label: string; gross: number; count: number }>();
  for (const bid of bids) {
    const ref = bid.quotes?.desired_date ?? bid.available_date ?? bid.created_at;
    const date = new Date(ref);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const entry = map.get(key) ?? {
      key,
      label: formatMonth(`${key}-01`),
      gross: 0,
      count: 0,
    };
    entry.gross += bid.price;
    entry.count += 1;
    map.set(key, entry);
  }
  return [...map.values()].sort((a, b) => b.key.localeCompare(a.key));
}

/** Prestations proposables par un professionnel (inscription + fiche entreprise). */
export const PRO_SERVICES = [
  "Débarras maison",
  "Débarras appartement",
  "Cave / grenier",
  "Succession",
  "Local pro",
  "Encombrants lourds",
];
