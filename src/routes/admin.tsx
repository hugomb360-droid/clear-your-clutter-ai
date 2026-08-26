import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Building2, FileText, Hammer, Lock, Star, Users } from "lucide-react";
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
import { getStripeEnvironment } from "@/lib/stripe";
import { refundEscrow, releaseEscrow } from "@/lib/payments.functions";

export const Route = createFileRoute("/admin")({
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
    <div className="rounded-3xl border border-border bg-card p-5">
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
    <article className="rounded-3xl border border-border bg-card p-6">
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
  const isAdmin = roles.includes("admin");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/admin" } });
  }, [loading, user, navigate]);

  const quotesQuery = useQuery({
    queryKey: ["admin-quotes"],
    enabled: isAdmin,
    refetchInterval: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*, bids(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const disputesQuery = useQuery({
    queryKey: ["admin-disputes"],
    enabled: isAdmin,
    refetchInterval: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("disputes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const prosQuery = useQuery({
    queryKey: ["admin-pros"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pro_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const paymentsQuery = useQuery({
    queryKey: ["admin-payments"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
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
    const res = await refundEscrow({ data: { bidId, environment: getStripeEnvironment() } });
    if ("error" in res) toast.error(res.error);
    else {
      toast.success("Client remboursé");
      void queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
    }
  };

  const reviewsQuery = useQuery({
    queryKey: ["admin-reviews"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
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
  const grossVolume = completed.reduce((sum: number, b: any) => sum + b.price, 0);
  const commission = completed.reduce((sum: number, b: any) => sum + commissionOf(b.price), 0);
  const openDisputes = disputes.filter((d: any) => d.status === "open" || d.status === "in_review");
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header>
        <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight">Console d'administration</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Toute l'activité Débarras France en direct — actualisée automatiquement.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={FileText} label="Demandes" value={String(quotes.length)} hint={`${quotes.filter((q: any) => q.status === "published").length} en attente de pro`} />
        <Stat icon={Hammer} label="Chantiers" value={String(missions.length)} hint={`${completed.length} terminés`} />
        <Stat icon={AlertTriangle} label="Litiges ouverts" value={String(openDisputes.length)} hint={`${disputes.length} au total`} />
        <Stat icon={Building2} label="Volume validé" value={euro(grossVolume)} hint={`Commission : ${euro(commission)}`} />
      </div>

      <Tabs defaultValue="chantiers" className="mt-10">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl p-1.5">
          <TabsTrigger value="chantiers" className="rounded-xl">
            Chantiers ({missions.length})
          </TabsTrigger>
          <TabsTrigger value="litiges" className="rounded-xl">
            Litiges ({disputes.length})
          </TabsTrigger>
          <TabsTrigger value="demandes" className="rounded-xl">
            Demandes ({quotes.length})
          </TabsTrigger>
          <TabsTrigger value="pros" className="rounded-xl">
            Pros ({pros.length})
          </TabsTrigger>
          <TabsTrigger value="paiements" className="rounded-xl">
            <Lock className="mr-1.5 size-4" /> Paiements
          </TabsTrigger>
          <TabsTrigger value="avis" className="rounded-xl">
            Avis ({reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chantiers" className="mt-6 space-y-4">
          {missions.length === 0 && (
            <p className="rounded-3xl border border-dashed border-border p-8 text-sm text-muted-foreground">
              Aucun chantier en cours.
            </p>
          )}
          {missions.map((bid: any) => (
            <article key={bid.id} className="rounded-3xl border border-border bg-card p-6">
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
            <p className="rounded-3xl border border-dashed border-border p-8 text-sm text-muted-foreground">
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
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-sm"
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
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-sm"
            >
              <div>
                <p className="font-semibold">{pro.company_name}</p>
                <p className="text-muted-foreground">
                  {pro.siret ? `SIRET ${pro.siret} · ` : ""}Zones : {pro.postal_codes.join(", ") || "—"}
                </p>
              </div>
              <Badge variant={pro.verified ? "default" : "secondary"}>
                {pro.verified ? "Vérifié" : "À vérifier"}
              </Badge>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="paiements" className="mt-6 space-y-3">
          {(paymentsQuery.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun paiement pour le moment.</p>
          )}
          {(paymentsQuery.data ?? []).map((payment: any) => (
            <div
              key={payment.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-sm"
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
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={payment.status === "held" ? "default" : "secondary"}>
                  {payment.status}
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
            <div key={review.id} className="rounded-2xl border border-border bg-card p-4 text-sm">
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
