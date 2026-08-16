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

  const submit = async () => {
    if (files.length === 0) {
      toast.error("Ajoutez au moins une photo de fin de chantier");
      return;
    }
    setSaving(true);
    try {
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
          <Button className="w-full gap-2" onClick={submit} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
            Envoyer au client
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
