/**
 * Liens de navigation partagés entre l'en-tête, le pied de page et l'accueil.
 * Chaque `to` correspond à une route existante dans src/routes.
 */
export const SERVICE_LINKS = [
  { to: "/debarras-appartement", label: "Débarras d'appartement" },
  { to: "/debarras-maison", label: "Débarras de maison" },
  { to: "/debarras-cave-garage", label: "Cave et garage" },
  { to: "/debarras-succession", label: "Débarras après succession" },
  { to: "/vide-maison", label: "Vide-maison" },
  { to: "/debarras-diogene", label: "Syndrome de Diogène" },
] as const;

export const PRACTICAL_LINKS = [
  { to: "/estimation", label: "Estimer mon débarras" },
  { to: "/comment-ca-marche", label: "Comment ça marche" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/prix-debarras", label: "Prix d'un débarras" },
  { to: "/debarras", label: "Débarras par ville" },
] as const;

export const PRO_LINKS = [
  { to: "/pros", label: "Devenir débarrasseur partenaire" },
  { to: "/professionnels", label: "Les pros par région" },
  { to: "/partenaires-prescripteurs", label: "Notaires, agences, EHPAD" },
  { to: "/pro/dashboard", label: "Espace pro" },
] as const;

export const CONTACT_EMAIL = "clientclearo@gmail.com";
