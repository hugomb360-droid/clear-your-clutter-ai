import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, BadgeCheck, Building2, Camera, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { ProBids } from "@/components/pro/pro-bids";
import { ProCalendar } from "@/components/pro/pro-calendar";
import { ProNotificationInbox } from "@/components/pro/pro-notifications";
import { ProOpportunities } from "@/components/pro/pro-opportunities";
import { MissionCard } from "@/components/pro/pro-schedule";
import { PRO_TABS, ProShell, type ProTab } from "@/components/pro/pro-shell";
import { ProWallet } from "@/components/pro/pro-wallet";
import { ProfileCompletion } from "@/components/pro/profile-completion";
import { RoleGuard } from "@/components/role-guard";
import {
  EmptyState,
  Notice,
  SectionHead,
  SpaceLoading,
  StatusPill,
  sBtnPrimary,
  sBtnSoft,
} from "@/components/space/space-kit";
import { useAuth } from "@/hooks/useAuth";
import { useFoundingStatus } from "@/hooks/useFoundingStatus";
import { supabase } from "@/integrations/supabase/client";
import { coversPostal, formatDate, isUpcoming, netOf } from "@/lib/pro-dashboard";
import type { BidWithQuote, QuoteContact } from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";
import { verifiedBadge } from "@/lib/public-profiles";

const searchSchema = z.object({ tab: z.enum(PRO_TABS).optional() });

export const Route = createFileRoute("/pro/dashboard")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Espace pro — propositions et planning des chantiers Débarras France" },
      {
        name: "description",
        content:
          "Chiffrez les demandes de vos zones, suivez vos propositions et retrouvez vos chantiers dans un agenda clair avec les coordonnées client.",
      },
      { property: "og:title", content: "Espace professionnel Débarras France" },
      {
        property: "og:description",
        content: "Propositions à chiffrer et agenda des chantiers dans un seul tableau de bord.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ProDashboardPage,
});

function Kpi({
  tab,
  label,
  value,
  hint,
}: {
  tab: ProTab;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Link
      to="/pro/dashboard"
      search={{ tab }}
      className="group rounded-3xl border border-border bg-card p-5 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-bright"
    >
      <p className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
        {label}
        <ChevronRight
          className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden="true"
        />
      </p>
      <p className="mt-1.5 text-[30px] font-black leading-none tracking-[-0.03em] text-brand-ink tabular-nums">
        {value}
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
    </Link>
  );
}

function ProDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { tab = "apercu" } = Route.useSearch();
  const freeMission = useFoundingStatus().freeRemaining > 0;

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

  if (loading || !user) return <SpaceLoading />;

  const profile = profileQuery.data ?? null;
  const bids = bidsQuery.data ?? [];
  const contacts = contactsQuery.data ?? [];
  const activeBids = bids.filter((bid) => bid.status !== "withdrawn");
  const quoteIdsWithBid = new Set(activeBids.map((bid) => bid.quote_id));
  const opportunities = (missionsQuery.data ?? []).filter(
    (quote) =>
      !quoteIdsWithBid.has(quote.id) &&
      quote.status === "published" &&
      coversPostal(profile?.postal_codes, quote.postal_code),
  );
  const proposals = bids.filter((bid) => bid.status === "pending" || bid.status === "withdrawn");
  const pendingProposals = proposals.filter((b) => b.status === "pending");
  const missions = bids.filter(
    (bid) =>
      bid.status === "accepted" ||
      bid.status === "awaiting_confirmation" ||
      bid.status === "completed" ||
      bid.status === "disputed",
  );
  const upcoming = missions
    .filter(
      (b) =>
        (b.status === "accepted" || b.status === "awaiting_confirmation") &&
        isUpcoming(b.available_date),
    )
    .sort((a, b) => (a.available_date ?? "9999").localeCompare(b.available_date ?? "9999"));
  /** Chantiers acceptés dont la date est passée : la fin de chantier reste à déclarer. */
  const toDeclare = missions.filter(
    (b) => b.status === "accepted" && b.available_date && !isUpcoming(b.available_date),
  );
  const disputed = missions.filter((b) => b.status === "disputed");
  const netRevenue = missions.reduce((sum, b) => sum + netOf(b.price, freeMission), 0);
  const nextMission = upcoming[0];
  const contactOf = (quoteId: string) => contacts.find((c) => c.quote_id === quoteId);

  const dataError =
    profileQuery.isError || bidsQuery.isError || missionsQuery.isError || contactsQuery.isError;

  const needProfile = (
    <EmptyState
      icon={Building2}
      title="Votre fiche entreprise n'est pas encore enregistrée"
      text="Renseignez votre société et vos zones d'intervention pour recevoir les demandes de votre secteur."
      action={
        <Link to="/pro/parametres" className={sBtnPrimary}>
          Compléter ma fiche
        </Link>
      }
    />
  );

  return (
    <ProShell
      active={tab}
      publicSlug={profile?.public_enabled ? profile.public_slug : null}
      counts={{
        demandes: opportunities.length,
        propositions: pendingProposals.length,
        chantiers: upcoming.length,
      }}
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[26px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[32px]">
            {profile?.company_name ?? "Bienvenue sur Débarras France"}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile && verifiedBadge(profile) && (
              <StatusPill tone="green">
                <BadgeCheck className="size-3.5" aria-hidden="true" /> SIRET et assurance vérifiés
              </StatusPill>
            )}
            {profile?.postal_codes && profile.postal_codes.length > 0 && (
              <StatusPill>Zones : {profile.postal_codes.slice(0, 6).join(", ")}</StatusPill>
            )}
          </div>
        </div>
        {tab !== "demandes" && opportunities.length > 0 && (
          <Link to="/pro/dashboard" search={{ tab: "demandes" }} className={sBtnPrimary}>
            Chiffrer {opportunities.length} demande{opportunities.length > 1 ? "s" : ""}
          </Link>
        )}
      </header>

      {dataError && (
        <div className="mt-5">
          <Notice tone="danger" icon={AlertTriangle}>
            Certaines données n'ont pas pu être chargées. Vérifiez votre connexion puis rechargez la
            page.
          </Notice>
        </div>
      )}

      {tab === "apercu" && (
        <div className="mt-6 space-y-8">
          {(toDeclare.length > 0 || disputed.length > 0) && (
            <div className="space-y-3">
              {toDeclare.length > 0 && (
                <Notice
                  tone="warn"
                  icon={Camera}
                  action={
                    <Link to="/pro/dashboard" search={{ tab: "chantiers" }} className={sBtnPrimary}>
                      Déclarer la fin du chantier
                    </Link>
                  }
                >
                  <strong>
                    {toDeclare.length} fin{toDeclare.length > 1 ? "s" : ""} de chantier à déclarer.
                  </strong>{" "}
                  Envoyez vos photos pour que le client puisse valider.
                </Notice>
              )}
              {disputed.length > 0 && (
                <Notice
                  tone="danger"
                  icon={AlertTriangle}
                  action={
                    <Link to="/pro/dashboard" search={{ tab: "chantiers" }} className={sBtnSoft}>
                      Voir le litige
                    </Link>
                  }
                >
                  <strong>
                    {disputed.length} litige{disputed.length > 1 ? "s" : ""} en cours.
                  </strong>{" "}
                  Notre équipe examine le dossier.
                </Notice>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Kpi
              tab="demandes"
              label="À chiffrer"
              value={String(opportunities.length)}
              hint="dans vos zones"
            />
            <Kpi
              tab="propositions"
              label="Propositions"
              value={String(pendingProposals.length)}
              hint="en attente du client"
            />
            <Kpi
              tab="chantiers"
              label="Chantiers à venir"
              value={String(upcoming.length)}
              hint={
                nextMission?.available_date
                  ? `prochain : ${formatDate(nextMission.available_date)}`
                  : `${missions.length} mission(s) au total`
              }
            />
            <Kpi
              tab="portefeuille"
              label="Revenus nets"
              value={euro(netRevenue)}
              hint="commission déduite"
            />
          </div>

          <ProfileCompletion profile={profile} />

          <section>
            <SectionHead
              title="Demandes à chiffrer"
              count={opportunities.length}
              action={
                opportunities.length > 3 ? (
                  <Link to="/pro/dashboard" search={{ tab: "demandes" }} className={sBtnSoft}>
                    Tout voir
                  </Link>
                ) : undefined
              }
            />
            {!profile ? (
              needProfile
            ) : (
              <ProOpportunities quotes={opportunities.slice(0, 3)} proId={user.id} />
            )}
          </section>

          {nextMission && (
            <section>
              <SectionHead
                title="Prochain chantier"
                action={
                  <Link to="/pro/dashboard" search={{ tab: "chantiers" }} className={sBtnSoft}>
                    Voir l'agenda
                  </Link>
                }
              />
              <MissionCard bid={nextMission} contact={contactOf(nextMission.quote_id)} />
            </section>
          )}

          <ProNotificationInbox proId={user.id} />
        </div>
      )}

      {tab === "demandes" && (
        <section className="mt-6">
          <SectionHead
            title="Demandes à chiffrer"
            count={opportunities.length}
            hint="Les demandes publiées dans vos zones, sans proposition de votre part."
          />
          {!profile ? needProfile : <ProOpportunities quotes={opportunities} proId={user.id} />}
        </section>
      )}

      {tab === "propositions" && (
        <section className="mt-6">
          <SectionHead
            title="Mes propositions"
            count={proposals.length}
            hint="Tant que le client n'a pas choisi, vous pouvez modifier votre prix ou retirer la proposition."
          />
          <ProBids bids={proposals} />
        </section>
      )}

      {tab === "chantiers" && (
        <section className="mt-6">
          <SectionHead
            title="Mes chantiers"
            count={missions.length}
            hint="Coordonnées du client, photos et fin de chantier, jour par jour."
          />
          <ProCalendar bids={missions} contacts={contacts} />
        </section>
      )}

      {tab === "portefeuille" && (
        <section className="mt-6">
          <SectionHead
            title="Portefeuille"
            hint="Vos revenus, la commission et l'état des versements."
          />
          <ProWallet bids={bids} />
        </section>
      )}
    </ProShell>
  );
}

function ProDashboardPage() {
  return (
    <RoleGuard role="pro" redirect="/pro/dashboard">
      <ProDashboard />
    </RoleGuard>
  );
}
