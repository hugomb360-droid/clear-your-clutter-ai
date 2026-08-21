import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProBids } from "@/components/pro/pro-bids";
import { ProOpportunities } from "@/components/pro/pro-opportunities";
import { ProProfileForm } from "@/components/pro/pro-profile-form";
import { ZonesMapPanel } from "@/components/pro/zones-map-panel";
import { ProSchedule } from "@/components/pro/pro-schedule";
import { ProStats } from "@/components/pro/pro-stats";
import { ProWallet } from "@/components/pro/pro-wallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { coversPostal } from "@/lib/pro-dashboard";
import type { BidWithQuote, QuoteContact } from "@/lib/pro-dashboard";

export const Route = createFileRoute("/pro/dashboard")({
  head: () => ({
    meta: [
      { title: "Espace pro — missions, planning et revenus Clearo" },
      {
        name: "description",
        content:
          "Pilotez votre activité de débarras : demandes de vos zones, propositions, planning des missions et suivi de vos revenus.",
      },
      { property: "og:title", content: "Espace professionnel Clearo" },
      {
        property: "og:description",
        content: "Missions qualifiées, planning et portefeuille dans un seul tableau de bord.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProDashboard,
});

function ProDashboard() {
  const { user, loading, roles } = useAuth();
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
  const missions = bids.filter((bid) => bid.status === "accepted" || bid.status === "completed");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Espace professionnel</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {profile?.company_name
            ? `Bonjour ${profile.company_name} — voici votre activité du moment.`
            : "Complétez votre fiche entreprise pour recevoir les demandes de votre secteur."}
        </p>
      </header>

      <div className="mt-8">
        <ProStats opportunities={opportunities.length} bids={bids} />
      </div>

      <Tabs defaultValue={profile ? "demandes" : "fiche"} className="mt-10">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl p-1.5">
          <TabsTrigger value="demandes" className="rounded-xl">
            Demandes ({opportunities.length})
          </TabsTrigger>
          <TabsTrigger value="propositions" className="rounded-xl">
            Mes propositions ({proposals.length})
          </TabsTrigger>
          <TabsTrigger value="planning" className="rounded-xl">
            Planning ({missions.length})
          </TabsTrigger>
          <TabsTrigger value="portefeuille" className="rounded-xl">
            Portefeuille
          </TabsTrigger>
          <TabsTrigger value="fiche" className="rounded-xl">
            Ma fiche
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demandes" className="mt-6">
          {!profile ? (
            <p className="rounded-3xl border border-dashed border-border p-8 text-sm text-muted-foreground">
              Enregistrez d'abord votre fiche entreprise et vos zones d'intervention pour voir les
              demandes.
            </p>
          ) : (
            <div className="grid gap-6">
              <ZonesMapPanel
                zones={profile.postal_codes ?? []}
                description="Vous ne recevez que les demandes situées dans ces secteurs."
              />
              <ProOpportunities quotes={opportunities} proId={user.id} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="propositions" className="mt-6">
          <ProBids bids={proposals} />
        </TabsContent>

        <TabsContent value="planning" className="mt-6">
          <ProSchedule bids={missions} contacts={contactsQuery.data ?? []} />
        </TabsContent>

        <TabsContent value="portefeuille" className="mt-6">
          <ProWallet bids={bids} />
        </TabsContent>

        <TabsContent value="fiche" className="mt-6">
          <ProProfileForm profile={profile} userId={user.id} hasProRole={roles.includes("pro")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
