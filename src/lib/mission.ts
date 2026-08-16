import { supabase } from "@/integrations/supabase/client";
import { dataUrlToBlob, fileToDataUrl } from "@/lib/image";

export type MissionPhotoKind = "completion" | "dispute";

export const MISSION_BUCKET = "mission-photos";

/** Compresse puis envoie les photos de chantier (fin de chantier ou litige). */
export async function uploadMissionPhotos(params: {
  files: File[];
  bidId: string;
  quoteId: string;
  userId: string;
  kind: MissionPhotoKind;
}) {
  const { files, bidId, quoteId, userId, kind } = params;
  let uploaded = 0;
  for (const [index, file] of files.entries()) {
    const dataUrl = await fileToDataUrl(file, 1400, 0.78);
    const path = `${userId}/${quoteId}/${kind}-${Date.now()}-${index}.jpg`;
    const { error } = await supabase.storage
      .from(MISSION_BUCKET)
      .upload(path, dataUrlToBlob(dataUrl), { contentType: "image/jpeg", upsert: true });
    if (error) continue;
    const { error: rowError } = await supabase.from("mission_photos").insert({
      bid_id: bidId,
      quote_id: quoteId,
      kind,
      uploaded_by: userId,
      storage_path: path,
    });
    if (!rowError) uploaded += 1;
  }
  if (uploaded === 0) throw new Error("Aucune photo n'a pu être envoyée");
  return uploaded;
}

export async function loadMissionPhotos(bidId: string, kind: MissionPhotoKind) {
  const { data, error } = await supabase
    .from("mission_photos")
    .select("id, storage_path")
    .eq("bid_id", bidId)
    .eq("kind", kind)
    .order("created_at", { ascending: true });
  if (error) throw error;
  const rows = data ?? [];
  if (rows.length === 0) return [] as { id: string; url: string }[];
  const { data: signed } = await supabase.storage
    .from(MISSION_BUCKET)
    .createSignedUrls(rows.map((r) => r.storage_path), 60 * 60);
  return rows
    .map((row, i) => ({ id: row.id, url: signed?.[i]?.signedUrl ?? "" }))
    .filter((p) => p.url.length > 0);
}

export const MISSION_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  accepted: "Mission confirmée",
  awaiting_confirmation: "Fin de chantier à valider",
  completed: "Terminée",
  disputed: "Litige en cours",
  withdrawn: "Retirée",
  refused: "Refusée",
};

export const DISPUTE_STATUS_LABELS: Record<string, string> = {
  open: "Ouvert",
  in_review: "En cours d'examen",
  resolved: "Résolu",
  rejected: "Rejeté",
};
