export type PublicReview = { rating: number; comment: string | null; created_at: string };
export type PublicPro = {
  slug: string; company_name: string; description: string | null; postal_codes: string[];
  service_types: string[]; logo_path: string | null; portfolio_paths: string[];
  siret_verified: boolean; insurance_verified: boolean; completed_count: number;
  reviews: PublicReview[]; logo_url?: string; portfolio_urls?: string[];
};
export const REGIONS = [
  { name: "Auvergne-Rhône-Alpes", departments: "01 03 07 15 26 38 42 43 63 69 73 74" },
  { name: "Bourgogne-Franche-Comté", departments: "21 25 39 58 70 71 89 90" },
  { name: "Bretagne", departments: "22 29 35 56" },
  { name: "Centre-Val de Loire", departments: "18 28 36 37 41 45" },
  { name: "Corse", departments: "20 2A 2B" },
  { name: "Grand Est", departments: "08 10 51 52 54 55 57 67 68 88" },
  { name: "Hauts-de-France", departments: "02 59 60 62 80" },
  { name: "Île-de-France", departments: "75 77 78 91 92 93 94 95" },
  { name: "Normandie", departments: "14 27 50 61 76" },
  { name: "Nouvelle-Aquitaine", departments: "16 17 19 23 24 33 40 47 64 79 86 87" },
  { name: "Occitanie", departments: "09 11 12 30 31 32 34 46 48 65 66 81 82" },
  { name: "Pays de la Loire", departments: "44 49 53 72 85" },
  { name: "Provence-Alpes-Côte d’Azur", departments: "04 05 06 13 83 84" },
  { name: "Guadeloupe", departments: "971" }, { name: "Martinique", departments: "972" },
  { name: "Guyane", departments: "973" }, { name: "La Réunion", departments: "974" },
  { name: "Mayotte", departments: "976" },
];
export function regionsFor(zones: string[]) {
  return REGIONS.filter(r => zones.some(z => r.departments.split(" ").some(d => z.startsWith(d)))).map(r => r.name);
}
export function averageRating(reviews: PublicReview[]) {
  return reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;
}
export function rankProfessionals(pros: PublicPro[]) {
  return [...pros].sort((a, b) => (averageRating(b.reviews) ?? 0) - (averageRating(a.reviews) ?? 0) || b.reviews.length - a.reviews.length || b.completed_count - a.completed_count || a.company_name.localeCompare(b.company_name, "fr"));
}
export function verifiedBadge(pro: { siret_verified: boolean; insurance_verified: boolean }) {
  return pro.siret_verified && pro.insurance_verified;
}
export function profileCompletion(profile: { logo_path?: string | null; portfolio_paths?: string[]; description?: string | null; postal_codes?: string[]; siret_document_path?: string | null; insurance_document_path?: string | null } | null) {
  const items = [
    { label: "Logo", done: Boolean(profile?.logo_path) },
    { label: "3 photos de chantiers", done: (profile?.portfolio_paths?.length ?? 0) >= 3 },
    { label: "Description", done: Boolean(profile?.description?.trim()) },
    { label: "Zones d’intervention", done: Boolean(profile?.postal_codes?.length) },
    { label: "SIRET et assurance déposés", done: Boolean(profile?.siret_document_path && profile?.insurance_document_path) },
  ];
  return { items, percent: items.filter(i => i.done).length * 20 };
}