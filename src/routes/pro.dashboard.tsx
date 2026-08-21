import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Send, Settings, Sparkles, Wallet } from "lucide-react";
import { useEffect } from "react";
import { ProBids } from "@/components/pro/pro-bids";
import { ProCalendar } from "@/components/pro/pro-calendar";
import { ProOpportunities } from "@/components/pro/pro-opportunities";
import { ProWallet } from "@/components/pro/pro-wallet";
import { Button } from "@/components/ui/button";
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

function SectionTitle({
  eyebrow,
  title,
  count,
}: {
  eyebrow: string;
  title: string;
  count?: number;
}) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-proposal-gold">
        {eyebrow}
      </p>
      <h2 className="font-display mt-1 text-2xl font-bold text-proposal-emerald">
        {title}
        {count != null && <span className="text-proposal-gold"> ({count})</span>}
      </h2>
    </div>
  );
}

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

  const stats = [
    {
      icon: Sparkles,
      label: "Demandes à chiffrer",
      value: String(opportunities.length),
      hint: "Dans vos zones",
    },
    {
      icon: Send,
      label: "Propositions envoyées",
      value: String(proposals.filter((b) => b.status === "pending").length),
      hint: "En attente du client",
    },
    {
      icon: CalendarDays,
      label: "Chantiers à venir",
      value: String(upcoming.length),
      hint: `${missions.length} mission(s) au total`,
    },
    {
      icon: Wallet,
      label: "Revenus nets",
      value: euro(netRevenue),
      hint: "Commission déduite",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="overflow-hidden rounded-[2rem] bg-proposal-emerald p-6 text-proposal-cream shadow-[var(--shadow-proposal)] sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-proposal-gold">
              Espace professionnel
            </p>
            <h1 className="font-display mt-2 text-2xl font-extrabold sm:text-3xl tracking-tight lg:text-4xl">
              {profile?.company_name ?? "Bienvenue sur Clearo"}
            </h1>
            <p className="mt-3 max-w-xl font-body text-sm text-proposal-cream/70">
              {profile
                ? `${opportunities.length} demande(s) à chiffrer et ${upcoming.length} chantier(s) planifié(s).`
                : "Complétez votre fiche entreprise dans vos paramètres pour recevoir les demandes de votre secteur."}
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="rounded-xl bg-proposal-emerald-light/50 text-proposal-cream hover:bg-proposal-emerald-light hover:text-proposal-cream"
          >
            <Link to="/pro/parametres">
              <Settings className="size-4" /> Paramètres
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-proposal-emerald-light/30 p-4 ring-1 ring-proposal-cream/10"
            >
              <stat.icon className="size-4 text-proposal-gold" />
              <p className="font-display mt-2 text-2xl font-extrabold">{stat.value}</p>
              <p className="font-body text-xs font-medium">{stat.label}</p>
              <p className="mt-0.5 font-body text-[11px] text-proposal-cream/50">{stat.hint}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="mt-12">
        <SectionTitle
          eyebrow="Priorité 1"
          title="Demandes à chiffrer"
          count={opportunities.length}
        />
        {!profile ? (
          <div className="rounded-[2rem] border border-dashed border-proposal-emerald/20 bg-proposal-cream/30 p-6 sm:p-10 text-center">
            <p className="font-body text-sm text-muted-foreground">
              Enregistrez votre fiche entreprise et vos zones d'intervention pour recevoir des
              demandes.
            </p>
            <Button
              asChild
              className="mt-5 rounded-xl bg-proposal-gold text-proposal-emerald hover:bg-proposal-gold/90"
            >
              <Link to="/pro/parametres">Compléter mes paramètres</Link>
            </Button>
          </div>
        ) : (
          <ProOpportunities quotes={opportunities} proId={user.id} />
        )}
      </section>

      <section className="mt-14">
        <SectionTitle eyebrow="Priorité 2" title="Mes propositions" count={proposals.length} />
        <ProBids bids={proposals} />
      </section>

      <section className="mt-14">
        <SectionTitle eyebrow="Agenda" title="Mes chantiers" count={missions.length} />
        <ProCalendar bids={missions} contacts={contactsQuery.data ?? []} />
      </section>

      <section className="mt-14">
        <SectionTitle eyebrow="Finances" title="Mon portefeuille" />
        <ProWallet bids={bids} />
      </section>
    </div>
  );
}
