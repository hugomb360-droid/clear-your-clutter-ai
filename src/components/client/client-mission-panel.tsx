import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Loader2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MissionPhotoGallery } from "@/components/mission/mission-photo-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { DISPUTE_STATUS_LABELS, uploadMissionPhotos } from "@/lib/mission";
import { releaseEscrow } from "@/lib/payments.functions";

type Props = {
  bidId: string;
  quoteId: string;
  clientId: string;
  proId: string;
  status: string;
};

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Noter ${n} sur 5`}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`size-7 ${n <= value ? "fill-primary text-primary" : "text-muted-foreground"}`}
          />
        </button>
      ))}
    </div>
  );
}

export function ClientMissionPanel({ bidId, quoteId, clientId, proId, status }: Props) {
  const queryClient = useQueryClient();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const reviewQuery = useQuery({
    queryKey: ["mission-review", bidId],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*").eq("bid_id", bidId).maybeSingle();
      return data;
    },
  });

  const disputeQuery = useQuery({
    queryKey: ["mission-dispute", bidId],
    queryFn: async () => {
      const { data } = await supabase.from("disputes").select("*").eq("bid_id", bidId).maybeSingle();
      return data;
    },
  });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["my-quotes"] });
    void queryClient.invalidateQueries({ queryKey: ["mission-review", bidId] });
    void queryClient.invalidateQueries({ queryKey: ["mission-dispute", bidId] });
  };

  const confirmMission = async () => {
    if (rating < 1) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("bids").update({ status: "completed" }).eq("id", bidId);
      if (error) throw error;
      const { error: reviewError } = await supabase.from("reviews").insert({
        bid_id: bidId,
        quote_id: quoteId,
        client_id: clientId,
        pro_id: proId,
        rating,
        comment: comment.trim() || null,
      });
      if (reviewError) throw reviewError;
      const release = await releaseEscrow({ data: { bidId } });
      if ("error" in release) {
        toast.warning("Chantier confirmé, libération du paiement en cours", {
          description: release.error,
        });
      } else {
        toast.success("Chantier confirmé — le paiement est libéré vers le professionnel.");
      }
      setReviewOpen(false);
      refresh();
    } catch (error) {
      toast.error("Confirmation impossible", {
        description: error instanceof Error ? error.message : "Réessayez dans un instant.",
      });
    } finally {
      setSaving(false);
    }
  };

  const openDispute = async () => {
    if (reason.trim().length < 10) {
      toast.error("Décrivez le problème en quelques mots");
      return;
    }
    if (files.length === 0) {
      toast.error("Ajoutez au moins une photo justifiant le litige");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("disputes").insert({
        bid_id: bidId,
        quote_id: quoteId,
        client_id: clientId,
        pro_id: proId,
        reason: reason.trim(),
      });
      if (error) throw error;
      await uploadMissionPhotos({ files, bidId, quoteId, userId: clientId, kind: "dispute" });
      await supabase.from("bids").update({ status: "disputed" }).eq("id", bidId);
      toast.success("Litige déclaré, notre équipe vous recontacte rapidement");
      setDisputeOpen(false);
      setFiles([]);
      setReason("");
      refresh();
    } catch (error) {
      toast.error("Déclaration impossible", {
        description: error instanceof Error ? error.message : "Réessayez dans un instant.",
      });
    } finally {
      setSaving(false);
    }
  };

  const review = reviewQuery.data;
  const dispute = disputeQuery.data;

  return (
    <div className="mt-4 rounded-2xl border border-border p-4">
      {status === "accepted" && (
        <p className="text-sm text-muted-foreground">
          Mission planifiée. Le pro confirmera la fin de chantier avec des photos.
        </p>
      )}

      {(status === "awaiting_confirmation" || status === "completed" || status === "disputed") && (
        <MissionPhotoGallery bidId={bidId} kind="completion" label="Photos de fin de chantier" />
      )}

      {status === "awaiting_confirmation" && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button className="gap-2" onClick={() => setReviewOpen(true)}>
            <CheckCircle2 className="size-4" /> Confirmer et noter le pro
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setDisputeOpen(true)}>
            <AlertTriangle className="size-4" /> Déclarer un litige
          </Button>
        </div>
      )}

      {status === "completed" && review && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Badge>Chantier validé</Badge>
          <span className="flex items-center gap-1 font-semibold">
            <Star className="size-4 fill-primary text-primary" /> {review.rating}/5
          </span>
          {review.comment && <span className="text-muted-foreground">« {review.comment} »</span>}
        </div>
      )}

      {dispute && (
        <div className="mt-4 rounded-2xl bg-destructive/10 p-4 text-sm">
          <p className="font-semibold text-destructive">
            Litige · {DISPUTE_STATUS_LABELS[dispute.status] ?? dispute.status}
          </p>
          <p className="mt-1 text-muted-foreground">{dispute.reason}</p>
          {dispute.admin_note && (
            <p className="mt-2 text-muted-foreground">Réponse Clearo : {dispute.admin_note}</p>
          )}
          <MissionPhotoGallery bidId={bidId} kind="dispute" label="Photos du litige" />
        </div>
      )}

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer le chantier</DialogTitle>
            <DialogDescription>
              Validez la mission et laissez une note au professionnel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Stars value={rating} onChange={setRating} />
            <div>
              <Label htmlFor="review-comment">Votre avis (optionnel)</Label>
              <Textarea
                id="review-comment"
                className="mt-2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ponctualité, soin, propreté..."
              />
            </div>
            <Button className="w-full gap-2" onClick={confirmMission} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              Valider le chantier
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Déclarer un litige</DialogTitle>
            <DialogDescription>
              Expliquez le problème et ajoutez des photos. Notre équipe arbitre sous 48 h.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dispute-reason">Motif du litige</Label>
              <Textarea
                id="dispute-reason"
                className="mt-2"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Objets non enlevés, dégâts, retard..."
              />
            </div>
            <div>
              <Label htmlFor="dispute-photos">Photos justificatives (obligatoire)</Label>
              <input
                id="dispute-photos"
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
            <Button
              className="w-full gap-2"
              variant="destructive"
              onClick={openDispute}
              disabled={saving}
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <AlertTriangle className="size-4" />}
              Envoyer le litige
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
