import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createClientOnlyFn, useServerFn } from "@tanstack/react-start";
import { Bell, Check, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { notificationSummarySchema, notificationText, responseDelay } from "@/lib/pro-notifications";
import { getSectorResponse, retryMyPush } from "@/lib/pro-notifications.functions";

const registerPushInBrowser = createClientOnlyFn(async () => {
  const { registerProPush } = await import("@/lib/pro-push.client");
  return registerProPush();
});

export function ProNotificationInbox({ proId }: { proId: string }) {
  const queryClient = useQueryClient();
  const retry = useServerFn(retryMyPush);
  const query = useQuery({ queryKey: ["pro-notifications", proId], queryFn: async () => {
    const result = await supabase.from("pro_notifications").select("id,quote_id,summary,created_at,read_at").eq("pro_id", proId).order("created_at", { ascending: false }).limit(20);
    if (result.error) throw result.error;
    return result.data;
  } });
  useEffect(() => {
    void retry().catch(() => { /* delivery state remains available for retry */ });
    const channel = supabase.channel(`pro-alerts-${proId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "pro_notifications", filter: `pro_id=eq.${proId}` }, () => {
      toast.info("Nouvelle demande dans vos zones");
      void queryClient.invalidateQueries({ queryKey: ["pro-notifications", proId] });
      void queryClient.invalidateQueries({ queryKey: ["pro-missions"] });
    }).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [proId, queryClient, retry]);
  const unread = (query.data ?? []).filter(n => !n.read_at).length;
  return <section className="mt-8 border-y border-border py-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-bold"><Bell className="size-5 text-primary" /> Alertes locales {unread > 0 && <span className="text-sm text-primary">({unread})</span>}</h2><Button asChild variant="outline" size="sm"><Link to="/pro/parametres">Configurer les alertes</Link></Button></div>
    {query.isError ? <p className="mt-4 text-sm text-destructive">Impossible de charger vos alertes.</p> : query.isPending ? <p className="mt-4 text-sm text-muted-foreground">Chargement des alertes…</p> : !query.data?.length ? <p className="mt-4 text-sm text-muted-foreground">Aucune nouvelle alerte dans vos zones.</p> : <ul className="mt-4 divide-y divide-border">
      {query.data.slice(0, 5).map(n => {
        const summary = notificationSummarySchema.safeParse(n.summary);
        return <li key={n.id} className="flex items-start justify-between gap-3 py-4"><div className="min-w-0"><p className={n.read_at ? "text-sm text-muted-foreground" : "text-sm font-semibold"}>{summary.success ? notificationText(summary.data) : "Nouvelle demande de débarras"}</p><time className="mt-1 block text-xs text-muted-foreground">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(n.created_at))}</time></div>{!n.read_at && <Button variant="ghost" size="icon" aria-label="Marquer comme lue" onClick={async () => {
          const result = await supabase.from("pro_notifications").update({ read_at: new Date().toISOString() }).eq("id", n.id);
          if (result.error) toast.error("Impossible de marquer l'alerte comme lue.");
          else void queryClient.invalidateQueries({ queryKey: ["pro-notifications", proId] });
        }}><Check className="size-4" /></Button>}</li>;
      })}</ul>}
  </section>;
}

export function ProNotificationSettings({ proId }: { proId: string }) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const query = useQuery({ queryKey: ["pro-alert-preferences", proId], queryFn: async () => {
    const result = await supabase.from("pro_notification_preferences").select("push_enabled,email_enabled").eq("pro_id", proId).maybeSingle();
    if (result.error) throw result.error;
    return result.data;
  } });
  async function togglePush(enable: boolean) {
    setBusy(true); setNotice("");
    try {
      if (enable) {
        const result = await registerPushInBrowser();
        if (!result) return;
        if (result.status !== "registered") {
          const messages = { "not-configured": "Les alertes mobiles ne sont pas encore configurées.", "unsupported": "Ce navigateur ne prend pas en charge les alertes. Sur iPhone, ajoutez d'abord le site à l'écran d'accueil (iOS 16.4 ou plus récent).", "open-in-new-tab": "Ouvrez le site dans un nouvel onglet pour autoriser les notifications.", "denied": "Notifications refusées : autorisez-les dans les réglages du navigateur pour ce site." };
          setNotice(messages[result.status]); return;
        }
        const existing = await supabase.from("pro_push_devices").select("id").eq("token", result.token).eq("pro_id", proId).maybeSingle();
        if (existing.error) throw existing.error;
        if (!existing.data) {
          const stored = await supabase.from("pro_push_devices").insert({ pro_id: proId, token: result.token });
          if (stored.error) throw stored.error;
        }
      }
      const saved = await supabase.from("pro_notification_preferences").upsert({ pro_id: proId, push_enabled: enable, updated_at: new Date().toISOString() });
      if (saved.error) throw saved.error;
      await queryClient.invalidateQueries({ queryKey: ["pro-alert-preferences", proId] });
      toast.success(enable ? "Notifications mobiles activées" : "Notifications mobiles désactivées");
    } catch { setNotice("Impossible d'activer les notifications. Réessayez ou vérifiez les autorisations du navigateur."); }
    finally { setBusy(false); }
  }
  return <section className="border-t border-border pt-8"><h2 className="flex items-center gap-2 text-xl font-bold"><Bell className="size-5 text-primary" /> Notifications de nouvelles demandes</h2>
    <div className="mt-5 divide-y divide-border">
      <div className="flex items-center justify-between gap-4 py-4"><div><p className="font-semibold">Notifications push</p><p className="mt-1 text-sm text-muted-foreground">Ville, volume, estimation et accès · sur le dernier appareil enregistré.</p></div><Switch aria-label="Notifications push" checked={query.data?.push_enabled ?? false} disabled={busy || query.isPending || query.isError} onCheckedChange={togglePush} /></div>
      {notice && <p role="status" className="py-3 text-sm text-muted-foreground">{notice}{notice.includes("nouvel onglet") && <a href="https://debarrasfrance.fr/pro/parametres" target="_blank" rel="noopener noreferrer" className="ml-2 text-primary underline">Ouvrir Débarras France</a>}</p>}
      {query.isError && <p className="py-3 text-sm text-destructive">Impossible de charger vos préférences.</p>}
      <div className="flex items-center justify-between gap-4 py-4"><div><p className="font-semibold">Email</p><p className="mt-1 text-sm text-muted-foreground">Ville, volume, estimation et accès · sur l'adresse de votre compte.</p></div><Switch aria-label="Notifications email" checked={query.data?.email_enabled ?? false} disabled={busy || query.isPending || query.isError} onCheckedChange={async (enable) => {
        setBusy(true);
        const saved = await supabase.from("pro_notification_preferences").upsert({ pro_id: proId, email_enabled: enable, updated_at: new Date().toISOString() });
        setBusy(false);
        if (saved.error) { toast.error("Impossible d'enregistrer la préférence."); return; }
        await queryClient.invalidateQueries({ queryKey: ["pro-alert-preferences", proId] });
        toast.success(enable ? "Alertes email activées" : "Alertes email désactivées");
      }} /></div>
      <div className="py-4"><p className="font-semibold">SMS / WhatsApp</p><p className="mt-1 text-sm text-muted-foreground">Non activés : nécessitent un numéro professionnel, votre accord et un service d'envoi. Des frais peuvent s'appliquer.</p></div>
    </div>
    <div className="mt-4 flex items-start gap-3 bg-secondary/40 p-4"><Smartphone className="mt-1 size-5 shrink-0 text-primary" /><div><h3 className="font-semibold">Débarras France sur votre écran d'accueil</h3><p className="mt-2 text-sm text-muted-foreground">Sur iPhone : Safari → Partager → Sur l'écran d'accueil. Sur Android : menu du navigateur → Installer l'application ou Ajouter à l'écran d'accueil. Ouvrez ensuite l'application pour activer les notifications.</p><p className="mt-2 text-xs text-muted-foreground">Connexion internet nécessaire. Les alertes dépendent des autorisations du navigateur.</p></div></div>
  </section>;
}

export function SectorResponse({ postal }: { postal: string | null }) {
  const fetch = useServerFn(getSectorResponse);
  const query = useQuery({ queryKey: ["sector-response", postal], enabled: Boolean(postal && /^\d{5}$/.test(postal)), queryFn: () => fetch({ data: { postal: postal ?? "" } }) });
  const delay = responseDelay(query.data?.averageMinutes ?? null, query.data?.sampleCount ?? 0);
  return <p className="mt-4 text-sm text-muted-foreground">{query.isError ? "Délai de réponse du secteur indisponible." : delay ? <>Autres pros du département : première réponse en <strong className="text-primary">{delay}</strong> en moyenne · {query.data?.sampleCount} demande(s) sur 90 jours.</> : "Délai des autres pros du secteur : pas encore assez de réponses mesurées."}</p>;
}