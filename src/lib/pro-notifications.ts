import { z } from "zod";

export const notificationSummarySchema = z.object({
  city: z.string().nullable(), postalCode: z.string().nullable(),
  volumeM3: z.number().nullable(), priceMin: z.number().nullable(), priceMax: z.number().nullable(),
  isAi: z.boolean(), floor: z.number().nullable(), hasElevator: z.boolean().nullable(), access: z.string().nullable(),
});
export type NotificationSummary = z.infer<typeof notificationSummarySchema>;
export function notificationText(s: NotificationSummary) {
  const euro = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  return [
    `${s.city || "Ville non renseignée"}${s.postalCode ? ` (${s.postalCode})` : ""}`,
    s.volumeM3 == null ? "Volume non estimé" : `${s.volumeM3} m³`,
    s.priceMin == null || s.priceMax == null ? "Sur devis" : `${s.isAi ? "IA" : "Estimation"} : ${euro(s.priceMin)} – ${euro(s.priceMax)}`,
    s.access || (s.floor == null ? "Accès non renseigné" : ""),
    s.floor == null ? "" : `Étage ${s.floor}${s.hasElevator == null ? "" : s.hasElevator ? " avec ascenseur" : " sans ascenseur"}`,
  ].filter(Boolean).join(" · ");
}
export function responseDelay(minutes: number | null, sampleCount: number) {
  if (minutes == null || sampleCount === 0 || !Number.isFinite(minutes)) return null;
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))} min`;
  if (minutes < 1440) return `${Math.round(minutes / 60 * 10) / 10} h`;
  return `${Math.round(minutes / 1440 * 10) / 10} j`;
}