/**
 * Estimation immédiate pour le devis classique (sans IA).
 * Grille calée sur les prix pratiqués sur le marché français du débarras
 * (tarifs au m³ dégressifs, majorations encombrement / salubrité / accès).
 */

export type ClutterKey = "normal" | "encombre" | "compulsif";
export type SanitationKey = "normal" | "poussiereux" | "insalubre" | "diogene";
export type ManualAccessKey = "facile" | "moyen" | "complique" | "tres_complique";

/** m³ de biens à évacuer par m² de surface habitable. */
const CLUTTER_VOLUME_PER_M2: Record<ClutterKey, number> = {
  normal: 0.22,
  encombre: 0.42,
  compulsif: 0.75,
};

/** Les annexes (cave, garage…) sont en général plus densément remplies. */
const ANNEX_FACTOR = 1.35;

const SANITATION_SURCHARGE: Record<SanitationKey, { rate: number; label: string }> = {
  normal: { rate: 0, label: "Salubrité normale" },
  poussiereux: { rate: 0.06, label: "Logement poussiéreux (balayage)" },
  insalubre: { rate: 0.22, label: "Logement insalubre (lessivage, nettoyage)" },
  diogene: { rate: 0.48, label: "Syndrome de Diogène (désinfection complète)" },
};

const ACCESS_SURCHARGE: Record<ManualAccessKey, { rate: number; label: string }> = {
  facile: { rate: 0, label: "Accès facile" },
  moyen: { rate: 0.05, label: "Étage avec ascenseur" },
  complique: { rate: 0.14, label: "Étage sans ascenseur" },
  tres_complique: { rate: 0.24, label: "Accès très contraint" },
};

/** Tarif au m³ dégressif, comme sur le marché : plus le volume est gros, moins le m³ coûte cher. */
export function pricePerM3(volumeM3: number) {
  if (volumeM3 <= 5) return 174;
  if (volumeM3 <= 12) return 144;
  if (volumeM3 <= 25) return 120;
  if (volumeM3 <= 45) return 102;
  if (volumeM3 <= 80) return 87;
  return 75;
}

export const MANUAL_MINIMUM_PRICE = 570;

export type ManualEstimateInput = {
  surfaceM2: number;
  annexSurfaceM2?: number;
  clutter: ClutterKey;
  sanitation: SanitationKey;
  access: ManualAccessKey;
};

export type ManualEstimateResult = {
  volumeM3: number;
  base: number;
  surcharges: { label: string; amount: number }[];
  total: number;
  priceMin: number;
  priceMax: number;
  pricePerM3: number;
};

export function estimateManualPrice(input: ManualEstimateInput): ManualEstimateResult {
  const surface = Math.max(0, input.surfaceM2 || 0);
  const annex = Math.max(0, input.annexSurfaceM2 || 0);
  const perM2 = CLUTTER_VOLUME_PER_M2[input.clutter];

  const volumeRaw = surface * perM2 + annex * perM2 * ANNEX_FACTOR;
  const volumeM3 = Math.max(1, Math.round(volumeRaw * 10) / 10);

  const rate = pricePerM3(volumeM3);
  const base = Math.max(MANUAL_MINIMUM_PRICE, Math.round(volumeM3 * rate));

  const surcharges: { label: string; amount: number }[] = [];
  const sanitation = SANITATION_SURCHARGE[input.sanitation];
  if (sanitation.rate > 0) {
    surcharges.push({ label: sanitation.label, amount: Math.round(base * sanitation.rate) });
  }
  const access = ACCESS_SURCHARGE[input.access];
  if (access.rate > 0) {
    surcharges.push({ label: access.label, amount: Math.round(base * access.rate) });
  }

  const total = base + surcharges.reduce((sum, s) => sum + s.amount, 0);
  return {
    volumeM3,
    base,
    surcharges,
    total,
    pricePerM3: rate,
    priceMin: Math.round((total * 0.88) / 10) * 10,
    priceMax: Math.round((total * 1.14) / 10) * 10,
  };
}
