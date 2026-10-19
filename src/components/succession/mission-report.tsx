import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getMissionReport } from "@/lib/succession.functions";
import { reportAvailable } from "@/lib/succession.schemas";

export function SuccessionDetails({ quoteId }: { quoteId: string }) {
  const query = useQuery({ queryKey: ["succession", quoteId], queryFn: async () => {
    const { data, error } = await supabase.from("succession_details").select("*").eq("quote_id", quoteId).maybeSingle();
    if (error) throw error; return data;
  } });
  if (!query.data) return null;
  const d = query.data;
  return <section className="my-4 border-y border-border py-4 text-sm">
    <h4 className="font-semibold">Consignes succession</h4>
    <dl className="mt-3 grid gap-2">
      <div><dt className="inline text-muted-foreground">Héritier sur place : </dt><dd className="inline">{d.heir_present ? "Oui" : "Non"}</dd></div>
      <div><dt className="inline text-muted-foreground">Clés à distance : </dt><dd className="inline">{d.remote_keys ? "Oui" : "Non"} {d.key_instructions}</dd></div>
      <div><dt className="inline text-muted-foreground">À conserver : </dt><dd className="inline whitespace-pre-wrap break-words">{d.valuables || "Aucun objet précisé"}</dd></div>
      <div><dt className="inline text-muted-foreground">Mobilier : </dt><dd className="inline">{{ don: "Don", revente: "Revente", don_revente: "Don et revente", evacuation: "Évacuation et recyclage" }[d.furniture_choice as "don"] ?? d.furniture_choice}</dd></div>
      <div><dt className="inline text-muted-foreground">Date limite : </dt><dd className="inline">{new Date(d.deadline).toLocaleDateString("fr-FR")} · {d.deadline_reason === "bail" ? "Fin de bail" : d.deadline_reason === "vente" ? "Vente" : "Autre"}</dd></div>
    </dl>
  </section>;
}

export function MissionReportDownload({ bidId, quoteId, status }: { bidId: string; quoteId: string; status: string }) {
  const getReport = useServerFn(getMissionReport);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const query = useQuery({ queryKey: ["succession", quoteId], queryFn: async () => {
    const { data, error } = await supabase.from("succession_details").select("quote_id").eq("quote_id", quoteId).maybeSingle();
    if (error) throw error; return data;
  } });
  if (!query.data || !reportAvailable(status)) return null;
  return <div className="mt-5 border-t border-border pt-4">
    <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><FileText className="size-4 text-primary" />Rapport pour le notaire</p>
    <Button variant="outline" disabled={busy} className="max-w-full whitespace-normal" onClick={async () => {
      if (blob) { const { deliverReport } = await import("@/lib/report-pdf"); await deliverReport(blob, `rapport-succession-${quoteId.slice(0, 8)}.pdf`); return; }
      setBusy(true);
      try { const data = await getReport({ data: { bidId } }); const { buildReportPdf } = await import("@/lib/report-pdf"); setBlob(await buildReportPdf(data)); }
      catch (e) { toast.error(e instanceof Error ? e.message : "Rapport indisponible"); }
      finally { setBusy(false); }
    }}>{busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Download className="mr-2 size-4 shrink-0" />}{blob ? "Télécharger le PDF" : "Préparer le rapport PDF"}</Button>
    {status === "awaiting_confirmation" && <p className="mt-2 text-xs text-muted-foreground">Fin de chantier déclarée ; validation client en attente.</p>}
  </div>;
}