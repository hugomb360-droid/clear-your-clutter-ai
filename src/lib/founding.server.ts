import { FOUNDING_FREE_MISSIONS, FOUNDING_PRO_LIMIT } from "@/lib/pro-dashboard";

export type FoundingStatus = {
  /** Le pro fait partie des 20 premiers inscrits. */
  isFounding: boolean;
  /** Nombre de chantiers déjà payés (commission offerte ou non). */
  paidMissions: number;
  /** Chantiers restants sans commission Clearo. */
  freeRemaining: number;
};

/**
 * Offre de lancement : les 20 premiers pros inscrits ne paient aucune commission
 * Clearo sur leurs 5 premiers chantiers encaissés.
 */
export async function getFoundingStatus(proId: string): Promise<FoundingStatus> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: profile } = await supabaseAdmin
    .from("pro_profiles")
    .select("created_at")
    .eq("user_id", proId)
    .maybeSingle();

  let isFounding = false;
  if (profile?.created_at) {
    const { count } = await supabaseAdmin
      .from("pro_profiles")
      .select("user_id", { count: "exact", head: true })
      .lt("created_at", profile.created_at);
    isFounding = (count ?? 0) < FOUNDING_PRO_LIMIT;
  }

  const { count: paid } = await supabaseAdmin
    .from("payments")
    .select("id", { count: "exact", head: true })
    .eq("pro_id", proId)
    .in("status", ["held", "released"]);

  const paidMissions = paid ?? 0;
  const freeRemaining = isFounding ? Math.max(0, FOUNDING_FREE_MISSIONS - paidMissions) : 0;

  return { isFounding, paidMissions, freeRemaining };
}
