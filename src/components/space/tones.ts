export type Tone = "neutral" | "green" | "amber" | "red" | "dark";

/** Couleur d'un statut de proposition ou de mission. */
export function bidTone(status: string): Tone {
  if (status === "pending") return "amber";
  if (status === "accepted") return "green";
  if (status === "awaiting_confirmation") return "amber";
  if (status === "completed") return "dark";
  if (status === "disputed" || status === "refused") return "red";
  return "neutral";
}
