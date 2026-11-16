import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createClientOnlyFn, useServerFn } from "@tanstack/react-start";
import { Check, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { SectionHead, SpaceCard, sBtnSoft } from "@/components/space/space-kit";
import {
  notificationSummarySchema,
  notificationText,
  responseDelay,
} from "@/lib/pro-notifications";
import { getSectorResponse, retryMyPush } from "@/lib/pro-notifications.functions";

const registerPushInBrowser = createClientOnlyFn(async () => {
  const { registerProPush } = await import("@/lib/pro-push.client");
  return registerProPush();
});

export function ProNotificationInbox({ proId }: { proId: string }) {
  const queryClient = useQueryClient();
  const retry = useServerFn(retryMyPush);
  const query = useQuery({
    queryKey: ["pro-notifications", proId],
    queryFn: async () => {
      const result = await supabase
        .from("pro_notifications")
        .select("id,quote_id,summary,created_at,read_at")
        .eq("pro_id", proId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (result.error) throw result.error;
      return result.data;
    },
  });
  useEffect(() => {
    void retry().catch(() => {
      /* l'état de livraison reste disponible pour une nouvelle tentative */
    });
    const channel = supabase
      .channel(`pro-alerts-${proId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "pro_notifications",
          filter: `pro_id=eq.${proId}`,
        },
        () => {
          toast.info("Nouvelle demande dans vos zones");
          void queryClient.invalidateQueries({ queryKey: ["pro-notifications", proId] });
          void queryClient.invalidateQueries({ queryKey: ["pro-missions"] });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [proId, queryClient, retry]);

  const unread = (query.data ?? []).filter((n) => !n.read_at).length;

  const markRead = async (id: string) => {
    const result = await supabase
      .from("pro_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);
    if (result.error) toast.error("Impossible de marquer l'alerte comme lue.");
    else void queryClient.invalidateQueries({ queryKey: ["pro-notifications", proId] });
  };

  return (
    <section>
      <SectionHead
        title="Dernières alertes"
        count={unread > 0 ? unread : undefined}
        action={
          <Link to="/pro/parametres" hash="alertes" className={sBtnSoft}>
            Régler mes alertes
          </Link>
        }
      />
      <SpaceCard as="div" className="py-2 sm:py-2">
        {query.isError ? (
          <p className="py-4 text-sm text-destructive">Impossible de charger vos alertes.</p>
        ) : query.isPending ? (
          <p className="py-4 text-sm text-muted-foreground">Chargement des alertes…</p>
        ) : !query.data?.length ? (
          <p className="py-4 text-sm text-muted-foreground">
            Aucune alerte pour le moment. Les nouvelles demandes de vos zones s'afficheront ici.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {query.data.slice(0, 5).map((n) => {
              const summary = notificationSummarySchema.safeParse(n.summary);
              return (
                <li key={n.id} className="flex items-center justify-between gap-3 py-3.5">
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={`mt-1.5 size-2.5 shrink-0 rounded-full ${n.read_at ? "bg-border" : "bg-primary"}`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p
                        className={
                          n.read_at
                            ? "text-sm text-muted-foreground"
                            : "text-sm font-bold text-brand-ink"
                        }
                      >
                        {summary.success
                          ? notificationText(summary.data)
                          : "Nouvelle demande de débarras"}
                      </p>
                      <time className="mt-0.5 block text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(n.created_at))}
                      </time>
                    </div>
                  </div>
                  {!n.read_at && (
                    <button
                      type="button"
                      aria-label="Marquer comme lue"
                      onClick={() => void markRead(n.id)}
                      className="flex size-10 shrink-0 items-center justify-center rounded-full text-brand-ink transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-bright"
                    >
                      <Check className="size-4" aria-hidden="true" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </SpaceCard>
    </section>
  );
}

const PUSH_MESSAGES = {
  "not-configured": "Les alertes mobiles ne sont pas encore configurées.",
  unsupported:
    "Ce navigateur ne prend pas en charge les alertes. Sur iPhone, ajoutez d'abord le site à l'écran d'accueil (iOS 16.4 ou plus récent).",
  "open-in-new-tab": "Ouvrez le site dans un nouvel onglet pour autoriser les notifications.",
  denied: "Notifications refusées : autorisez-les dans les réglages du navigateur pour ce site.",
};

export function ProNotificationSettings({ proId }: { proId: string }) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const query = useQuery({
    queryKey: ["pro-alert-preferences", proId],
    queryFn: async () => {
      const result = await supabase
        .from("pro_notification_preferences")
        .select("push_enabled,email_enabled")
        .eq("pro_id", proId)
        .maybeSingle();
      if (result.error) throw result.error;
      return result.data;
    },
  });

  async function togglePush(enable: boolean) {
    setBusy(true);
    setNotice("");
    try {
      if (enable) {
        const result = await registerPushInBrowser();
        if (!result) return;
        if (result.status !== "registered") {
          setNotice(PUSH_MESSAGES[result.status]);
          return;
        }
        const existing = await supabase
          .from("pro_push_devices")
          .select("id")
          .eq("token", result.token)
          .eq("pro_id", proId)
          .maybeSingle();
        if (existing.error) throw existing.error;
        if (!existing.data) {
          const stored = await supabase
            .from("pro_push_devices")
            .insert({ pro_id: proId, token: result.token });
          if (stored.error) throw stored.error;
        }
      }
      const saved = await supabase.from("pro_notification_preferences").upsert({
        pro_id: proId,
        push_enabled: enable,
        updated_at: new Date().toISOString(),
      });
      if (saved.error) throw saved.error;
      await queryClient.invalidateQueries({ queryKey: ["pro-alert-preferences", proId] });
      toast.success(
        enable ? "Notifications mobiles activées" : "Notifications mobiles désactivées",
      );
    } catch {
      setNotice(
        "Impossible d'activer les notifications. Réessayez ou vérifiez les autorisations du navigateur.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggleEmail(enable: boolean) {
    setBusy(true);
    const saved = await supabase.from("pro_notification_preferences").upsert({
      pro_id: proId,
      email_enabled: enable,
      updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (saved.error) {
      toast.error("Impossible d'enregistrer la préférence.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["pro-alert-preferences", proId] });
    toast.success(enable ? "Alertes email activées" : "Alertes email désactivées");
  }

  const disabled = busy || query.isPending || query.isError;

  return (
    <SpaceCard className="scroll-mt-24">
      <h2 id="alertes" className="scroll-mt-24 text-[19px] font-extrabold text-brand-ink">
        Alertes de nouvelles demandes
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Chaque alerte indique la ville, le volume, l'estimation et l'accès.
      </p>
      <div className="mt-3 divide-y divide-border">
        <div className="flex items-center justify-between gap-4 py-4">
          <div>
            <p className="font-bold text-brand-ink">Notifications sur cet appareil</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Envoyées sur le dernier appareil enregistré.
            </p>
          </div>
          <Switch
            aria-label="Notifications sur cet appareil"
            checked={query.data?.push_enabled ?? false}
            disabled={disabled}
            onCheckedChange={togglePush}
          />
        </div>
        {notice && (
          <p role="status" className="py-3 text-sm text-muted-foreground">
            {notice}
            {notice.includes("nouvel onglet") && (
              <a
                href="https://debarrasfrance.fr/pro/parametres"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 font-semibold text-primary underline"
              >
                Ouvrir Débarras France
              </a>
            )}
          </p>
        )}
        {query.isError && (
          <p className="py-3 text-sm text-destructive">Impossible de charger vos préférences.</p>
        )}
        <div className="flex items-center justify-between gap-4 py-4">
          <div>
            <p className="font-bold text-brand-ink">E-mail</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Envoyé sur l'adresse de votre compte.
            </p>
          </div>
          <Switch
            aria-label="Alertes par e-mail"
            checked={query.data?.email_enabled ?? false}
            disabled={disabled}
            onCheckedChange={toggleEmail}
          />
        </div>
      </div>
      <div className="mt-2 flex items-start gap-3 rounded-2xl bg-brand-soft/60 p-4">
        <Smartphone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h3 className="font-bold text-brand-ink">Débarras France sur votre écran d'accueil</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Sur iPhone : Safari, Partager, puis « Sur l'écran d'accueil ». Sur Android : menu du
            navigateur, puis « Installer l'application ». Ouvrez ensuite l'application pour activer
            les notifications.
          </p>
        </div>
      </div>
    </SpaceCard>
  );
}

export function SectorResponse({ postal }: { postal: string | null }) {
  const fetch = useServerFn(getSectorResponse);
  const query = useQuery({
    queryKey: ["sector-response", postal],
    enabled: Boolean(postal && /^\d{5}$/.test(postal)),
    queryFn: () => fetch({ data: { postal: postal ?? "" } }),
  });
  const delay = responseDelay(query.data?.averageMinutes ?? null, query.data?.sampleCount ?? 0);
  if (query.isError || !delay) return <span />;
  return (
    <p className="text-sm text-muted-foreground">
      Autres pros du département : première réponse en{" "}
      <strong className="text-brand-ink">{delay}</strong> en moyenne.
    </p>
  );
}
