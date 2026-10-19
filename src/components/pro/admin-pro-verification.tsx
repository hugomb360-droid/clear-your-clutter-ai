import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
export function AdminProVerification({ pro }: { pro: Tables<"pro_profiles"> }) {
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();
  async function view(path: string) {
    const { data, error } = await supabase.storage.from("pro-verification-documents").createSignedUrl(path, 300);
    if (error || !data) return void toast.error("Document indisponible");
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }
  async function verify(field: "siret_verified" | "insurance_verified", value: boolean) {
    setBusy(true);
    const { error } = await supabase.from("pro_profiles").update({ [field]: value }).eq("user_id", pro.user_id);
    setBusy(false);
    if (error) return void toast.error("Vérification impossible", { description: error.message });
    await queryClient.invalidateQueries({ queryKey: ["admin-pros"] });
    await queryClient.invalidateQueries({ queryKey: ["public-professionals"] });
    toast.success("Vérification mise à jour");
  }
  return <div className="flex flex-wrap gap-2">{(['siret', 'insurance'] as const).map(kind => {
    const path = kind === 'siret' ? pro.siret_document_path : pro.insurance_document_path;
    const verified = kind === 'siret' ? pro.siret_verified : pro.insurance_verified;
    const label = kind === 'siret' ? 'SIRET' : 'Assurance';
    return <div key={kind} className="flex flex-wrap items-center gap-2">{path ? <><Button size="sm" variant="outline" onClick={() => void view(path)}>Consulter {label}</Button><Button size="sm" disabled={busy || (kind === 'siret' && !pro.siret)} variant={verified ? "secondary" : "default"} onClick={() => void verify(kind === 'siret' ? 'siret_verified' : 'insurance_verified', !verified)}>{verified ? `Retirer validation ${label}` : `Valider ${label}`}</Button></> : <span className="text-xs text-muted-foreground">{label} : aucune pièce déposée</span>}</div>;
  })}</div>;
}