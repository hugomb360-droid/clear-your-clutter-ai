export type PropertyType =
  | "appartement"
  | "maison"
  | "cave"
  | "garage"
  | "grenier"
  | "local";

export const PROPERTY_LABELS: Record<PropertyType, string> = {
  appartement: "Appartement",
  maison: "Maison",
  cave: "Cave",
  garage: "Garage / box",
  grenier: "Grenier / combles",
  local: "Local professionnel",
};

/** Grille tarifaire Clearo — ajustable sans toucher au modèle IA. */
export const PRICING = {
  pricePerM3: 38,
  minimumPrice: 149,
  floorSurchargeRate: 0.07, // par étage sans ascenseur
  maxFloorSurcharge: 0.35,
  bulkySurchargeRate: 0.12,
  hardAccessSurchargeRate: 0.1,
  spreadRate: 0.15, // fourchette +/-
};

export type PriceInputs = {
  volumeM3: number;
  floor: number;
  hasElevator: boolean;
  bulkyItems: boolean;
  hardAccess: boolean;
};

export type PriceResult = {
  base: number;
  priceMin: number;
  priceMax: number;
  surcharges: { label: string; amount: number }[];
};

export function computePrice(input: PriceInputs): PriceResult {
  const volume = Math.max(0.5, input.volumeM3 || 0);
  const base = Math.max(PRICING.minimumPrice, Math.round(volume * PRICING.pricePerM3));
  const surcharges: { label: string; amount: number }[] = [];

  if (!input.hasElevator && input.floor > 0) {
    const rate = Math.min(input.floor * PRICING.floorSurchargeRate, PRICING.maxFloorSurcharge);
    surcharges.push({
      label: `Étage ${input.floor} sans ascenseur`,
      amount: Math.round(base * rate),
    });
  }
  if (input.bulkyItems) {
    surcharges.push({
      label: "Objets encombrants / lourds",
      amount: Math.round(base * PRICING.bulkySurchargeRate),
    });
  }
  if (input.hardAccess) {
    surcharges.push({
      label: "Accès difficile",
      amount: Math.round(base * PRICING.hardAccessSurchargeRate),
    });
  }

  const total = base + surcharges.reduce((sum, s) => sum + s.amount, 0);
  return {
    base,
    surcharges,
    priceMin: Math.round((total * (1 - PRICING.spreadRate)) / 10) * 10,
    priceMax: Math.round((total * (1 + PRICING.spreadRate)) / 10) * 10,
  };
}

export type AiAnalysis = {
  volumeM3: number;
  categories: string[];
  bulkyItems: boolean;
  hardAccess: boolean;
  confidence: "faible" | "moyenne" | "élevée";
  summary: string;
};

export type EstimationResult = {
  analysis: AiAnalysis;
  price: PriceResult;
};

export const euro = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
