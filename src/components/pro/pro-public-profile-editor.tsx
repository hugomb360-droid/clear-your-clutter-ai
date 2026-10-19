import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, FileCheck, ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { ProfileCompletion } from "./profile-completion";
export function ProPublicProfileEditor({ profile }: { profile: Tables<"pro_profiles"> }) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  async function update(values: Partial<Tables<"pro_profiles">>) {
    const { error } = await supabase.from("pro_profiles").update(values).eq("user_id", profile.user_id);
    if (error) throw error;
    await Promise.all([queryClient.invalidateQueries({ queryKey: ["pro-profile"] }), queryClient.invalidateQueries({ queryKey: ["public-professionals"] })]);
  }
  async function upload(files: FileList | null, field: "logo_path" | "portfolio_paths" | "siret_document_path" | "insurance_document_path") {
    if (!files?.length) return;
    setBusy(true);
    const documents = field.includes("document");
    const bucket = documents ? "pro-verification-documents" : "pro-public-media";
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!(documents ? ["application/pdf", "image/jpeg", "image/png"] : ["image/jpeg", "image/png", "image/webp"]).includes(file.type) || file.size > (documents ? 10 : 8) * 1024 * 1024) throw new Error("Format ou taille du fichier non autorisé.");
        const ext = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        const path = `${profile.user_id}/${crypto.randomUUID()}.${ext}`;
        const result = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type });
        if (result.error) throw result.error;
        uploaded.push(path);
      }
      await update(field === "portfolio_paths" ? { portfolio_paths: [...profile.portfolio_paths, ...uploaded] } : { [field]: uploaded[0] });
      toast.success(documents ? "Justificatif déposé pour vérification" : "Photo enregistrée");
    } catch (e) { await supabase.storage.from(bucket).remove(uploaded); toast.error(e instanceof Error ? e.message : "Envoi impossible"); }
    finally { setBusy(false); }
  }
  return <section className="border-y border-border py-6"><h2 className="text-xl font-bold">Mon profil public</h2><ProfileCompletion profile={profile} />
    <div className="flex flex-wrap items-center justify-between gap-4"><Label htmlFor="public-enabled">Afficher mon entreprise dans l’annuaire public</Label><Switch id="public-enabled" checked={profile.public_enabled} disabled={busy} onCheckedChange={async enabled => { setBusy(true); try { await update({ public_enabled: enabled }); } catch { toast.error("Modification impossible"); } finally { setBusy(false); } }} /></div>
    {profile.public_slug && profile.public_enabled && <Link to="/pro/$slug" params={{ slug: profile.public_slug }} className="mt-3 inline-block break-all text-sm text-primary">Voir le profil de {profile.company_name}</Link>}
    <div className="mt-6 grid gap-6 sm:grid-cols-2"><div><Label htmlFor="profile-logo" className="flex gap-2"><Upload className="size-4" />Logo de l’entreprise</Label><Input id="profile-logo" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} className="mt-3" onChange={e => void upload(e.target.files, "logo_path")} />{profile.logo_path && <p className="mt-2 text-xs text-primary">Logo enregistré</p>}</div>
      <div><Label htmlFor="profile-portfolio" className="flex gap-2"><ImagePlus className="size-4" />Photos de chantiers ({profile.portfolio_paths.length})</Label><Input id="profile-portfolio" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy} className="mt-3" onChange={e => void upload(e.target.files, "portfolio_paths")} /></div></div>
    <p className="mt-3 text-xs text-muted-foreground">Photos publiques : publiez uniquement des images autorisées par vos clients, sans personnes ni informations personnelles. JPG, PNG ou WebP, 8 Mo maximum.</p>
    {profile.portfolio_paths.length > 0 && <ul className="mt-4 space-y-2">{profile.portfolio_paths.map((path, i) => <li key={path} className="flex items-center justify-between border-b border-border py-1 text-sm">Photo de chantier {i + 1}<Button size="icon" variant="ghost" aria-label={`Supprimer la photo ${i + 1}`} disabled={busy} onClick={async () => { setBusy(true); try { await update({ portfolio_paths: profile.portfolio_paths.filter(p => p !== path) }); await supabase.storage.from("pro-public-media").remove([path]); } catch { toast.error("Suppression impossible"); } finally { setBusy(false); } }}><Trash2 className="size-4" /></Button></li>)}</ul>}
    <h3 className="mt-8 flex items-center gap-2 font-bold"><FileCheck className="size-5 text-primary" />Justificatifs privés</h3><p className="mt-2 text-sm text-muted-foreground">Seule l’administration consulte ces pièces. Le badge est accordé après contrôle du SIRET et de l’assurance.</p>
    <div className="mt-5 grid gap-6 sm:grid-cols-2">{([['siret_document_path', 'Justificatif SIRET'], ['insurance_document_path', 'Attestation d’assurance professionnelle']] as const).map(([field, label]) => <div key={field}><Label htmlFor={field}>{label}</Label><Input id={field} type="file" accept="application/pdf,image/jpeg,image/png" disabled={busy} className="mt-3" onChange={e => void upload(e.target.files, field)} /><p className="mt-2 text-xs text-muted-foreground">{profile[field] ? (field === "siret_document_path" ? profile.siret_verified : profile.insurance_verified) ? "Vérifié" : "Déposé · en attente de contrôle" : "Non déposé"}</p></div>)}</div><p className="mt-3 text-xs text-muted-foreground">PDF, JPG ou PNG · 10 Mo maximum par document.</p>
  </section>;
}