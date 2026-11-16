import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SpaceCard, StatusPill, sBtnSoft } from "@/components/space/space-kit";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { ProfileCompletion } from "./profile-completion";

type UploadField =
  "logo_path" | "portfolio_paths" | "siret_document_path" | "insurance_document_path";

const DOCUMENTS = [
  ["siret_document_path", "Justificatif SIRET"],
  ["insurance_document_path", "Attestation d'assurance professionnelle"],
] as const;

export function ProPublicProfileEditor({ profile }: { profile: Tables<"pro_profiles"> }) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  async function update(values: Partial<Tables<"pro_profiles">>) {
    const { error } = await supabase
      .from("pro_profiles")
      .update(values)
      .eq("user_id", profile.user_id);
    if (error) throw error;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["pro-profile"] }),
      queryClient.invalidateQueries({ queryKey: ["public-professionals"] }),
    ]);
  }

  async function upload(files: FileList | null, field: UploadField) {
    if (!files?.length) return;
    setBusy(true);
    const documents = field.includes("document");
    const bucket = documents ? "pro-verification-documents" : "pro-public-media";
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const allowed = documents
          ? ["application/pdf", "image/jpeg", "image/png"]
          : ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.type) || file.size > (documents ? 10 : 8) * 1024 * 1024)
          throw new Error("Format ou taille du fichier non autorisé.");
        const ext =
          file.type === "application/pdf"
            ? "pdf"
            : file.type === "image/png"
              ? "png"
              : file.type === "image/webp"
                ? "webp"
                : "jpg";
        const path = `${profile.user_id}/${crypto.randomUUID()}.${ext}`;
        const result = await supabase.storage
          .from(bucket)
          .upload(path, file, { contentType: file.type });
        if (result.error) throw result.error;
        uploaded.push(path);
      }
      await update(
        field === "portfolio_paths"
          ? { portfolio_paths: [...profile.portfolio_paths, ...uploaded] }
          : { [field]: uploaded[0] },
      );
      toast.success(documents ? "Justificatif déposé pour vérification" : "Photo enregistrée");
    } catch (e) {
      await supabase.storage.from(bucket).remove(uploaded);
      toast.error(e instanceof Error ? e.message : "Envoi impossible");
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto(path: string) {
    setBusy(true);
    try {
      await update({ portfolio_paths: profile.portfolio_paths.filter((p) => p !== path) });
      await supabase.storage.from("pro-public-media").remove([path]);
    } catch {
      toast.error("Suppression impossible");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublic(enabled: boolean) {
    setBusy(true);
    try {
      await update({ public_enabled: enabled });
      toast.success(enabled ? "Votre entreprise est visible dans l'annuaire" : "Profil masqué");
    } catch {
      toast.error("Modification impossible");
    } finally {
      setBusy(false);
    }
  }

  const fileInput = "mt-2 h-11 cursor-pointer rounded-xl file:mr-3 file:font-semibold";

  return (
    <SpaceCard>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="profil-public" className="scroll-mt-24 text-[19px] font-extrabold text-brand-ink">
            Mon profil public
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            La page que voient les clients quand ils comparent les propositions.
          </p>
        </div>
        {profile.public_slug && profile.public_enabled && (
          <Link to="/pro/$slug" params={{ slug: profile.public_slug }} className={sBtnSoft}>
            Voir ma page <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      <ProfileCompletion profile={profile} bare />

      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-brand-soft/60 p-4">
        <Label htmlFor="public-enabled" className="text-sm font-bold leading-snug text-brand-ink">
          Afficher mon entreprise dans l'annuaire public
        </Label>
        <Switch
          id="public-enabled"
          checked={profile.public_enabled}
          disabled={busy}
          onCheckedChange={togglePublic}
        />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="profile-logo" className="font-bold text-brand-ink">
            Logo de l'entreprise
          </Label>
          <Input
            id="profile-logo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            className={fileInput}
            onChange={(e) => void upload(e.target.files, "logo_path")}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {profile.logo_path
              ? "Logo enregistré. Choisissez un fichier pour le remplacer."
              : "Aucun logo pour l'instant."}
          </p>
        </div>
        <div>
          <Label htmlFor="profile-portfolio" className="font-bold text-brand-ink">
            Photos de chantiers ({profile.portfolio_paths.length})
          </Label>
          <Input
            id="profile-portfolio"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            className={fileInput}
            onChange={(e) => void upload(e.target.files, "portfolio_paths")}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            JPG, PNG ou WebP, 8 Mo maximum. Uniquement des photos autorisées par vos clients, sans
            personne ni information personnelle.
          </p>
        </div>
      </div>

      {profile.portfolio_paths.length > 0 && (
        <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
          {profile.portfolio_paths.map((path, i) => (
            <li key={path} className="flex items-center justify-between gap-3 px-4 py-1.5 text-sm">
              <span className="font-semibold text-brand-ink">Photo de chantier {i + 1}</span>
              <button
                type="button"
                aria-label={`Supprimer la photo ${i + 1}`}
                disabled={busy}
                onClick={() => void removePhoto(path)}
                className="flex size-10 items-center justify-center rounded-full text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-bright disabled:opacity-50"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3 className="mt-8 text-[17px] font-extrabold text-brand-ink">Justificatifs privés</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Seule notre équipe consulte ces pièces. Le badge « vérifié » est accordé après contrôle du
        SIRET et de l'assurance.
      </p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {DOCUMENTS.map(([field, label]) => {
          const verified =
            field === "siret_document_path" ? profile.siret_verified : profile.insurance_verified;
          return (
            <div key={field}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor={field} className="font-bold text-brand-ink">
                  {label}
                </Label>
                {profile[field] ? (
                  verified ? (
                    <StatusPill tone="green">Vérifié</StatusPill>
                  ) : (
                    <StatusPill tone="amber">En attente de contrôle</StatusPill>
                  )
                ) : (
                  <StatusPill>Non déposé</StatusPill>
                )}
              </div>
              <Input
                id={field}
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                disabled={busy}
                className={fileInput}
                onChange={(e) => void upload(e.target.files, field)}
              />
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        PDF, JPG ou PNG, 10 Mo maximum par document.
      </p>
    </SpaceCard>
  );
}
