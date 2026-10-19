import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, FileText, Hammer, Lock, Star, Users, RefreshCw, ArrowUpRight, CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MissionPhotoGallery } from "@/components/mission/mission-photo-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RoleGuard } from "@/components/role-guard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { DISPUTE_STATUS_LABELS, MISSION_STATUS_LABELS } from "@/lib/mission";
import { commissionOf, formatDate } from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";
import { refundEscrow, releaseEscrow } from "@/lib/payments.functions";
import { ReferralInbox } from "@/components/succession/referral-inbox";
import { AdminProVerification } from "@/components/pro/admin-pro-verification";
import { AdminFinancialOverview } from "@/components/admin-financial-overview";
import { adminFinance } from "@/lib/admin-finance";
import { readAdminPages } from "@/lib/admin-data";

export const Route = createFileRoute("/admin")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: typeof search['tab'] === 'string' && ['chantiers', 'litiges', 'demandes', 'pros', 'paiements', 'avis', 'prescripteurs'].includes(search['tab']) ? search['tab'] : 'chantiers',
    environment: search['environment'] === 'sandbox' ? 'sandbox' : 'live',
  }),
  head: () => ({
    meta: [
      { title: "Administration Débarras France — pilotage de la plateforme" },
      {
        name: "description",
        content:
          "Console interne Débarras France : suivi en direct des demandes, chantiers, litiges, avis clients et professionnels partenaires.",
      },
      { property: "og:title", content: "Administration Débarras France" },
      { property: "og:description", content: "Pilotage en direct de la plateforme Débarras France." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminConsolePage,
});

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <Icon className="size-5 text-brand" />
      <p className="mt-3 text-2xl font-extrabold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function DisputeCard({ dispute }: { dispute: Tables<"disputes"> }) {
  const queryClient = useQueryClient();
  const [note, setNote] = useState(dispute.admin_note ?? "");
  const [saving, setSaving] = useState(false);

  const update = async (status: string) => {
    setSaving(true);
    const { error } = await supabase
      .from("disputes")
      .update({
        status,
        admin_note: note.trim() || null,
        resolved_at: status === "resolved" || status === "rejected" ? new Date().toISOString() : null,
      })
      .eq("id", dispute.id);
    setSaving(false);
    if (error) {
      toast.error("Mise à jour impossible", { description: error.message });
      return;
    }
    toast.success("Litige mis à jour");
    void queryClient.invalidateQueries({ queryKey: ["admin-disputes"] });
  };

  return (
    <article className="rounded-lg border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">Litige · {formatDate(dispute.created_at)}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{dispute.reason}</p>
        </div>
        <Badge variant={dispute.status === "resolved" ? "outline" : "destructive"}>
          {DISPUTE_STATUS_LABELS[dispute.status] ?? dispute.status}
        </Badge>
      </div>

      <MissionPhotoGallery bidId={dispute.bid_id} kind="dispute" label="Photos du client" />
      <MissionPhotoGallery bidId={dispute.bid_id} kind="completion" label="Photos du pro" />

      <Textarea
        className="mt-4"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note d'arbitrage visible par le client..."
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={saving} onClick={() => update("in_review")}>
          En cours d'examen
        </Button>
        <Button size="sm" disabled={saving} onClick={() => update("resolved")}>
          Marquer résolu
        </Button>
        <Button size="sm" variant="destructive" disabled={saving} onClick={() => update("rejected")}>
          Rejeter
        </Button>
      </div>
    </article>
  );
}

function AdminConsole() {
  const { user, loading, roles } = useAuth();
  const navigate = useNavigate();
  const { tab, environment } = Route.useSearch();
  const openTab = (next: string) => void navigate({ to: '/admin', search: { tab: next, environment } });
  const isAdmin = roles.includes("admin");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/admin" } });
  }, [loading, user, navigate]);

  const quotesQuery = useQuery({
    queryKey: ["admin-quotes"],
    enabled: isAdmin,
    refetchInterval: 15_000,
    queryFn: () => readAdminPages((from, to) => supabase.from("quotes").select("*, bids(*)")
      .order("created_at", { ascending: false }).order("id").range(from, to)),
  });

  const disputesQuery = useQuery({
    queryKey: ["admin-disputes"],
    enabled: isAdmin,
    refetchInterval: 15_000,
    queryFn: () => readAdminPages((from, to) => supabase.from("disputes").select("*")
      .order("created_at", { ascending: false }).order("id").range(from, to)),
  });

  const prosQuery = useQuery({
    queryKey: ["admin-pros"],
    enabled: isAdmin,
    refetchInterval: 15_000,
    queryFn: () => readAdminPages((from, to) => supabase.from("pro_profiles").select("*")
      .order("created_at", { ascending: false }).order("user_id").range(from, to)),
  });

  const paymentsQuery = useQuery({
    queryKey: ["admin-payments"],
    enabled: isAdmin,
    refetchInterval: 15_000,
    queryFn: () => readAdminPages((from, to) => supabase.from("payments").select("*")
      .order("created_at", { ascending: false }).order("id").range(from, to)),
  });

  const handleRelease = async (bidId: string) => {
    const res = await releaseEscrow({ data: { bidId } });
    if ("error" in res) toast.error(res.error);
    else {
      toast.success("Fonds libérés vers le pro");
      void queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
    }
  };

  const handleRefund = async (bidId: string) => {
    const res = await refundEscrow({ data: { bidId, environment: environment === 'sandbox' ? 'sandbox' : 'live' } });
    if ("error" in res) toast.error(res.error);
    else {
      toast.success("Client remboursé");
      void queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
    }
  };

  const reviewsQuery = useQuery({
    queryKey: ["admin-reviews"],
    enabled: isAdmin,
    refetchInterval: 15_000,
    queryFn: () => readAdminPages((from, to) => supabase.from("reviews").select("*")
      .order("created_at", { ascending: false }).order("id").range(from, to)),
  });

  if (loading || !user) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-muted-foreground">Chargement...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold">Accès réservé</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cet espace est réservé à l'équipe Débarras France.
        </p>
      </div>
    );
  }

  const quotes = quotesQuery.data ?? [];
  const disputes = disputesQuery.data ?? [];
  const pros = prosQuery.data ?? [];
  const reviews = reviewsQuery.data ?? [];

  const allBids = quotes.flatMap((q: any) => (q.bids ?? []).map((b: any) => ({ ...b, quote: q })));
  const missions = allBids.filter((b: any) =>
    ["accepted", "awaiting_confirmation", "completed", "disputed"].includes(b.status),
  );
  const completed = allBids.filter((b: any) => b.status === "completed");
  const payments = (paymentsQuery.data ?? []).filter(p => p.environment === environment);
  const finance = adminFinance(quotes, payments, environment);
  const queries = [quotesQuery, paymentsQuery, disputesQuery, prosQuery, reviewsQuery];
  const fetching = queries.some(q => q.isFetching);
  const unavailable = queries.some(q => q.isError);
  const pending = queries.some(q => q.isPending);
  const updatedAt = Math.min(...queries.map(q => q.dataUpdatedAt));
  const refresh = () => void Promise.all(['admin-quotes', 'admin-payments', 'admin-disputes', 'admin-pros', 'admin-reviews'].map(key => queryClient.invalidateQueries({ queryKey: [key] })));
  const openDisputes = disputes.filter((d: any) => d.status === "open" || d.status === "in_review");
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  const missingBank = pros.filter(p => !p.payouts_enabled);
  const verificationPending = pros.filter(p => (p.siret_document_path && !p.siret_verified) || (p.insurance_document_path && !p.insurance_verified));
  const alerts = [
    { title: 'Litiges à traiter', count: openDisputes.length, detail: 'Dossiers ouverts ou en cours d’examen', tab: 'litiges' },
    { title: 'Transferts en erreur', count: finance.transferErrors, detail: 'Versements non effectués : vérifier les comptes pros', tab: 'paiements' },
    { title: 'Libérations sans transfert confirmé', count: finance.transferPending, detail: 'Paiements libérés sans justificatif de transfert Stripe', tab: 'paiements' },
    { title: 'Paiements échoués', count: payments.filter(p => p.status === 'failed').length, detail: 'Échecs enregistrés par Stripe', tab: 'paiements' },
    { title: 'Comptes de versement à compléter', count: missingBank.length, detail: 'Professionnels dont les versements ne sont pas activés', tab: 'pros' },
    { title: 'Documents à vérifier', count: verificationPending.length, detail: 'Justificatifs reçus, contrôle administrateur attendu', tab: 'pros' },
  ].filter(a => a.count > 0);
  const activity = [
    ...quotes.slice(0, 8).map(q => ({ id: `q-${q.id}`, date: q.created_at, title: 'Demande de débarras', detail: `${q.city ?? q.postal_code} · ${q.status}`, tab: 'demandes' })),
    ...payments.slice(0, 8).map(p => ({ id: `p-${p.id}`, date: p.updated_at, title: `Paiement · ${euro(p.amount_total / 100)}`, detail: p.status, tab: 'paiements' })),
    ...disputes.slice(0, 8).map(d => ({ id: `d-${d.id}`, date: d.updated_at, title: 'Litige', detail: DISPUTE_STATUS_LABELS[d.status] ?? d.status, tab: 'litiges' })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
        <div><p className="mb-2 text-xs font-semibold uppercase text-brand-ink">Débarras France / Administration</p><h1 className="font-display text-3xl font-extrabold">Vue d’ensemble</h1><p className="mt-2 text-sm text-muted-foreground">Activité, argent et dossiers à suivre.</p></div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-border p-1" aria-label="Environnement des paiements">
            {['live', 'sandbox'].map(env => <Button key={env} size="sm" variant={environment === env ? 'secondary' : 'ghost'} onClick={() => void navigate({ to: '/admin', search: { tab, environment: env } })}>{env === 'live' ? 'Paiements réels' : 'Tests'}</Button>)}
          </div>
          <Button size="icon" variant="outline" aria-label="Actualiser les chiffres" title="Actualiser les chiffres" onClick={refresh} disabled={fetching}><RefreshCw className={`size-4 ${fetching ? 'motion-safe:animate-spin' : ''}`} /></Button>
        </div>
      </header>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"><span className={`flex items-center gap-2 ${unavailable ? 'text-destructive' : ''}`}><span className={`size-2 rounded-full ${unavailable ? 'bg-destructive' : 'bg-primary'}`} />{unavailable ? 'Actualisation interrompue · données potentiellement anciennes' : pending ? 'Chargement des chiffres…' : 'Actualisation automatique toutes les 15 secondes'}</span><span>{updatedAt ? `Dernière synchronisation : ${new Date(updatedAt).toLocaleTimeString('fr-FR')}` : 'Synchronisation en cours'}</span></div>
      {unavailable && <div role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">Certaines données n’ont pas pu être chargées. Les chiffres ne sont pas tous à jour.<Button className="ml-3" variant="outline" size="sm" onClick={refresh}>Réessayer</Button></div>}
      {pending || unavailable ? <div className="mt-8 py-12 text-center text-muted-foreground">{unavailable ? 'Circuit financier indisponible : actualisez pour réessayer.' : 'Chargement du circuit financier…'}</div> : <AdminFinancialOverview finance={finance} />}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={FileText} label="Demandes" value={String(quotes.length)} hint={`${quotes.filter((q: any) => q.status === "published").length} en attente de pro`} />
        <Stat icon={Hammer} label="Chantiers" value={String(missions.length)} hint={`${completed.length} terminés`} />
        <Stat icon={AlertTriangle} label="Litiges ouverts" value={String(openDisputes.length)} hint={`${disputes.length} au total`} />
        <Stat icon={Users} label="Professionnels inscrits" value={String(pros.length)} hint={`${pros.filter(p => p.payouts_enabled).length} prêts à recevoir leurs versements`} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section><div className="mb-4 flex items-center gap-2"><AlertTriangle className="size-5 text-admin-hold" /><h2 className="font-display text-xl font-bold">Points d’attention</h2><Badge variant="secondary">{alerts.reduce((sum, a) => sum + a.count, 0)}</Badge></div>
          {pending || unavailable ? <p className="py-5 text-sm text-muted-foreground">En attente de synchronisation.</p> : alerts.length === 0 ? <p className="flex items-center gap-2 py-5 text-sm text-muted-foreground"><CircleCheck className="size-4 text-primary" />Aucun problème signalé dans les données chargées.</p> : alerts.map(a => <div key={a.title} className="flex items-center gap-3 border-b border-border py-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-admin-hold/10 font-bold text-admin-hold">{a.count}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{a.title}</p><p className="text-xs text-muted-foreground">{a.detail}</p></div><Button variant="ghost" size="icon" title={a.title} aria-label={`Voir : ${a.title}`} onClick={() => openTab(a.tab)}><ArrowUpRight className="size-4" /></Button></div>)}
        </section>
        <section><h2 className="mb-4 font-display text-xl font-bold">Derniers mouvements</h2>{activity.length === 0 && <p className="py-5 text-sm text-muted-foreground">Aucune activité enregistrée.</p>}{activity.map(a => <div key={a.id} className="flex items-center justify-between gap-3 border-b border-border py-3"><div className="min-w-0"><p className="text-sm font-semibold">{a.title}</p><p className="text-xs text-muted-foreground">{a.detail} · {formatDate(a.date)}</p></div><Button variant="ghost" size="icon" aria-label={`Ouvrir ${a.title}`} onClick={() => openTab(a.tab)}><ArrowUpRight className="size-4" /></Button></div>)}</section>
      </div>
      <Tabs value={tab} onValueChange={openTab} className="mt-10">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-lg p-1.5">
          <TabsTrigger value="chantiers" className="rounded-md">
            Chantiers ({missions.length})
          </TabsTrigger>
          <TabsTrigger value="litiges" className="rounded-md">
            Litiges ({disputes.length})
          </TabsTrigger>
          <TabsTrigger value="demandes" className="rounded-md">
            Demandes ({quotes.length})
          </TabsTrigger>
          <TabsTrigger value="pros" className="rounded-md">
            Pros ({pros.length})
          </TabsTrigger>
          <TabsTrigger value="paiements" className="rounded-md">
            <Lock className="mr-1.5 size-4" /> Paiements
          </TabsTrigger>
          <TabsTrigger value="avis" className="rounded-md">
            Avis ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="prescripteurs" className="rounded-md">Prescripteurs</TabsTrigger>
        </TabsList>
        <TabsContent value="prescripteurs" className="mt-6"><ReferralInbox /></TabsContent>

        <TabsContent value="chantiers" className="mt-6 space-y-4">
          {missions.length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-8 text-sm text-muted-foreground">
              Aucun chantier en cours.
            </p>
          )}
          {missions.map((bid: any) => (
            <article key={bid.id} className="rounded-lg border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">
                    {bid.quote.property_type} · {bid.quote.postal_code} {bid.quote.city ?? ""}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Date : {formatDate(bid.available_date)} · {euro(bid.price)} · commission{" "}
                    {euro(commissionOf(bid.price))}
                  </p>
                </div>
                <Badge variant={bid.status === "disputed" ? "destructive" : "default"}>
                  {MISSION_STATUS_LABELS[bid.status] ?? bid.status}
                </Badge>
              </div>
              <MissionPhotoGallery bidId={bid.id} kind="completion" label="Fin de chantier" />
            </article>
          ))}
        </TabsContent>

        <TabsContent value="litiges" className="mt-6 space-y-4">
          {disputes.length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-8 text-sm text-muted-foreground">
              Aucun litige déclaré. 🎉
            </p>
          )}
          {disputes.map((dispute: any) => (
            <DisputeCard key={dispute.id} dispute={dispute} />
          ))}
        </TabsContent>

        <TabsContent value="demandes" className="mt-6 space-y-3">
          {quotes.map((quote: any) => (
            <div
              key={quote.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 text-sm"
            >
              <div>
                <p className="font-semibold">
                  {quote.property_type} · {quote.volume_m3 ?? "?"} m³ · {quote.postal_code}
                </p>
                <p className="text-muted-foreground">
                  {formatDate(quote.created_at)} · {(quote.bids ?? []).length} proposition(s)
                  {quote.price_min != null ? ` · ${euro(quote.price_min)}–${euro(quote.price_max)}` : ""}
                </p>
              </div>
              <Badge variant="secondary">{quote.status}</Badge>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="pros" className="mt-6 space-y-3">
          {pros.map((pro: any) => (
            <div
              key={pro.user_id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 text-sm"
            >
              <div>
                <p className="font-semibold">{pro.company_name}</p>
                <p className="text-muted-foreground">
                  {pro.siret ? `SIRET ${pro.siret} · ` : ""}Zones : {pro.postal_codes.join(", ") || "—"}
                </p>
              </div>
              <AdminProVerification pro={pro} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="paiements" className="mt-6 space-y-3">
          {payments.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun paiement pour le moment.</p>
          )}
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 text-sm"
            >
              <div>
                <p className="font-semibold">
                  {euro(payment.amount_total / 100)}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (commission {euro(payment.commission_amount / 100)} · pro{" "}
                    {euro(payment.pro_amount / 100)})
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(payment.created_at)} · {payment.environment}
                </p>
                {payment.transfer_error && !payment.stripe_transfer_id && <p className="mt-2 text-sm text-destructive">Versement non effectué · erreur enregistrée. Vérifier le compte de versement du professionnel.</p>}
                {payment.status === 'released' && !payment.stripe_transfer_id && <p className="mt-2 text-sm text-destructive">Aucun transfert Stripe confirmé pour ce paiement.</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={payment.status === "held" ? "default" : "secondary"}>
                  {({ held: 'Fonds bloqués', released: 'Libéré', pending: 'Paiement en attente', failed: 'Échec', refunded: 'Remboursé' } as Record<string, string>)[payment.status] ?? payment.status}
                </Badge>
                {payment.status === "held" && (
                  <>
                    <Button size="sm" onClick={() => handleRelease(payment.bid_id)}>
                      Libérer au pro
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRefund(payment.bid_id)}
                    >
                      Rembourser
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="avis" className="mt-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Note moyenne : <strong>{avgRating}</strong> / 5
          </p>
          {reviews.map((review: any) => (
            <div key={review.id} className="rounded-lg border border-border bg-card p-4 text-sm">
              <p className="flex items-center gap-1 font-semibold">
                <Star className="size-4 fill-primary text-primary" /> {review.rating}/5
              </p>
              {review.comment && <p className="mt-1 text-muted-foreground">« {review.comment} »</p>}
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AdminConsolePage() {
  return (
    <RoleGuard role="admin" redirect="/admin">
      <AdminConsole />
    </RoleGuard>
  );
}
