import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Send, Settings, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { ProBids } from "@/components/pro/pro-bids";
import { ProCalendar } from "@/components/pro/pro-calendar";
import { ProOpportunities } from "@/components/pro/pro-opportunities";
import { ProWallet } from "@/components/pro/pro-wallet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { coversPostal, isUpcoming, netOf } from "@/lib/pro-dashboard";
import type { BidWithQuote, QuoteContact } from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";

export const Route = createFileRoute("/pro/dashboard")({
  head: () => ({
    meta: [
      { title: "Espace pro — propositions et planning des chantiers Clearo" },
      {
        name: "description",
        content:
          "Chiffrez les demandes de vos zones, suivez vos propositions et retrouvez vos chantiers dans un agenda clair avec les coordonnées client.",
      },
      { property: "og:title", content: "Espace professionnel Clearo" },
      {
        property: "og:description",
        content: "Propositions à chiffrer et agenda des chantiers dans un seul tableau de bord.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProDashboard,
});

function ProDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/pro/dashboard" } });
  }, [loading, user, navigate]);

  const profileQuery = useQuery({
    queryKey: ["pro-profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pro_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const missionsQuery = useQuery({
    queryKey: ["pro-missions", user?.id],
    enabled: Boolean(user?.id) && Boolean(profileQuery.data),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .in("status", ["published", "matched"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const bidsQuery = useQuery({
    queryKey: ["pro-bids", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bids")
        .select("*, quotes(*)")
        .eq("pro_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as BidWithQuote[];
    },
  });

  const contactsQuery = useQuery({
    queryKey: ["pro-contacts", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from("quote_contacts").select("*");
      if (error) throw error;
      return (data ?? []) as QuoteContact[];
    },
  });

  if (loading || !user) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-muted-foreground">Chargement...</div>;
  }

  const profile = profileQuery.data ?? null;
  const bids = bidsQuery.data ?? [];
  const activeBids = bids.filter((bid) => bid.status !== "withdrawn");
  const quoteIdsWithBid = new Set(activeBids.map((bid) => bid.quote_id));
  const opportunities = (missionsQuery.data ?? []).filter(
    (quote) =>
      !quoteIdsWithBid.has(quote.id) &&
      quote.status === "published" &&
      coversPostal(profile?.postal_codes, quote.postal_code),
  );
  const proposals = bids.filter((bid) => bid.status === "pending" || bid.status === "withdrawn");
  const missions = bids.filter(
    (bid) =>
      bid.status === "accepted" ||
      bid.status === "awaiting_confirmation" ||
      bid.status === "completed" ||
      bid.status === "disputed",
  );
  const upcoming = missions.filter(
    (b) =>
      (b.status === "accepted" || b.status === "awaiting_confirmation") &&
      isUpcoming(b.available_date),
  );
  const netRevenue = missions.reduce((sum, b) => sum + netOf(b.price), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Mes missions</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile?.company_name
              ? `${profile.company_name} — ${opportunities.length} demande(s) à chiffrer, ${upcoming.length} chantier(s) à venir.`
              : "Complétez votre fiche entreprise dans les paramètres pour recevoir les demandes de votre secteur."}
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/pro/parametres">
            <Settings className="size-4" /> Paramètres
          </Link>
        </Button>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Sparkles className="size-3.5" /> À chiffrer
          </p>
          <p className="mt-1 text-2xl font-extrabold">{opportunities.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Send className="size-3.5" /> Propositions envoyées
          </p>
          <p className="mt-1 text-2xl font-extrabold">
            {proposals.filter((b) => b.status === "pending").length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <CalendarDays className="size-3.5" /> Chantiers à venir
          </p>
          <p className="mt-1 text-2xl font-extrabold">{upcoming.length}</p>
          <p className="text-xs text-muted-foreground">{euro(netRevenue)} nets cumulés</p>
        </div>
      </div>

      <Tabs defaultValue="demandes" className="mt-8">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl p-1.5">
          <TabsTrigger value="demandes" className="rounded-xl">
            À chiffrer ({opportunities.length})
          </TabsTrigger>
          <TabsTrigger value="propositions" className="rounded-xl">
            Mes propositions ({proposals.length})
          </TabsTrigger>
          <TabsTrigger value="agenda" className="rounded-xl">
            Agenda ({missions.length})
          </TabsTrigger>
          <TabsTrigger value="portefeuille" className="rounded-xl">
            Portefeuille
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demandes" className="mt-6">
          {!profile ? (
            <div className="rounded-3xl border border-dashed border-border p-8 text-sm text-muted-foreground">
              Enregistrez d'abord votre fiche entreprise et vos zones d'intervention.
              <div className="mt-4">
                <Button asChild className="rounded-xl">
                  <Link to="/pro/parametres">Aller aux paramètres</Link>
                </Button>
              </div>
            </div>
          ) : (
            <ProOpportunities quotes={opportunities} proId={user.id} />
          )}
        </TabsContent>

        <TabsContent value="propositions" className="mt-6">
          <ProBids bids={proposals} />
        </TabsContent>

        <TabsContent value="agenda" className="mt-6">
          <ProCalendar bids={missions} contacts={contactsQuery.data ?? []} />
        </TabsContent>

        <TabsContent value="portefeuille" className="mt-6">
          <ProWallet bids={bids} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
