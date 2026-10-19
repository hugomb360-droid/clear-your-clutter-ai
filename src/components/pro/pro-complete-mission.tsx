import { useQueryClient } from "@tanstack/react-query";
import { Camera, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { uploadMissionPhotos } from "@/lib/mission";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { saveMissionReport } from "@/lib/succession.functions";
import { reportSchema } from "@/lib/succession.schemas";

export function ProCompleteMission({
  bidId,
  quoteId,
  proId,
}: {
  bidId: string;
  quoteId: string;
  proId: string;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [volume, setVolume] = useState("");
  const [recycling, setRecycling] = useState("");
  const saveReport = useServerFn(saveMissionReport);
  const successionQuery = useQuery({ queryKey: ["succession", quoteId], queryFn: async () => {
    const { data, error } = await supabase.from("succession_details").select("*").eq("quote_id", quoteId).maybeSingle();
    if (error) throw error; return data;
  } });

  const submit = async () => {
    if (files.length === 0) {
      toast.error("Ajoutez au moins une photo de fin de chantier");
      return;
    }
    setSaving(true);
    try {
      if (successionQuery.isPending || successionQuery.isError) throw new Error("Impossible de vérifier le dossier succession. Réessayez.");
      if (successionQuery.data) {
        const parsed = reportSchema.parse({ bidId, volumeM3: Number(volume), recycling });
        await saveReport({ data: parsed });
      }
      await uploadMissionPhotos({ files, bidId, quoteId, userId: proId, kind: "completion" });
      const { error } = await supabase
        .from("bids")
        .update(
          note.trim()
            ? { status: "awaiting_confirmation", message: note.trim() }
            : { status: "awaiting_confirmation" },
        )
        .eq("id", bidId);
      if (error) throw error;
      toast.success("Fin de chantier envoyée au client pour validation");
      setOpen(false);
      setFiles([]);
      setNote("");
      void queryClient.invalidateQueries({ queryKey: ["pro-bids"] });
      void queryClient.invalidateQueries({ queryKey: ["mission-photos", bidId, "completion"] });
    } catch (error) {
      toast.error("Envoi impossible", {
        description: error instanceof Error ? error.message : "Réessayez dans un instant.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 gap-2" variant="outline">
          <Camera className="size-4" /> Confirmer la fin de chantier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Fin de chantier</DialogTitle>
          <DialogDescription>
            Photographiez les lieux débarrassés. Le client validera la mission à partir de ces
            photos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="completion-photos">Photos après débarras (obligatoire)</Label>
            <input
              id="completion-photos"
              type="file"
              accept="image/*"
              multiple
              className="mt-2 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 8))}
            />
            {files.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {files.length} photo(s) sélectionnée(s)
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="completion-note">Commentaire (optionnel)</Label>
            <Textarea
              id="completion-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Précisions sur le déroulé du chantier..."
              className="mt-2"
            />
          </div>
          {successionQuery.data && <>
            <div className="grid gap-2"><Label htmlFor="report-volume">Volume réellement évacué (m³)</Label><Input id="report-volume" type="number" min="0.1" max="2000" step="0.1" value={volume} onChange={e => setVolume(e.target.value)} /></div>
            <div className="grid gap-2"><Label htmlFor="report-recycling">Filières de recyclage et destinations</Label><Textarea id="report-recycling" maxLength={3000} value={recycling} onChange={e => setRecycling(e.target.value)} placeholder="Bois : centre de tri et commune ; mobilier donné : association ; métaux, DEEE : filières et lieux…" /><p className="text-xs text-muted-foreground">Indiquez uniquement les dépôts, dons et reventes réellement effectués. Ces données figureront dans le rapport pour le notaire.</p></div>
          </>}
          <Button className="w-full gap-2" onClick={submit} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
            Envoyer au client
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
