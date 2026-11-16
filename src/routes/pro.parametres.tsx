import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProPayoutAccount } from "@/components/pro/pro-payout-account";
import { ProProfileForm } from "@/components/pro/pro-profile-form";
import { ProNotificationSettings } from "@/components/pro/pro-notifications";
import { ProPublicProfileEditor } from "@/components/pro/pro-public-profile-editor";
import { ProShell } from "@/components/pro/pro-shell";
import { RoleGuard } from "@/components/role-guard";
import { SpaceLoading } from "@/components/space/space-kit";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pro/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres pro — fiche entreprise et zones | Débarras France" },
      {
        name: "description",
        content:
          "Modifiez votre fiche entreprise Débarras France : nom, SIRET, téléphone, prestations et zones d'intervention.",
      },
      { property: "og:title", content: "Paramètres professionnels Débarras France" },
      {
        property: "og:description",
        content: "Gérez vos informations d'entreprise et vos secteurs de débarras.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ProSettingsPage,
});

const SECTIONS = [
  { id: "fiche", label: "Fiche entreprise" },
  { id: "versements", label: "Versements" },
  { id: "profil-public", label: "Profil public" },
  { id: "alertes", label: "Alertes" },
];

function ProSettings() {
  const { user, loading, roles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/pro/parametres" } });
  }, [loading, user, navigate]);

  const profileQuery = useQuery({
    queryKey: ["pro-profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("pro_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (loading || !user) return <SpaceLoading />;

  const profile = profileQuery.data ?? null;

  return (
    <ProShell active="parametres" publicSlug={profile?.public_enabled ? profile.public_slug : null}>
      <header>
        <h1 className="text-[26px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[32px]">
          Paramètres
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Votre fiche, vos zones, vos versements et vos alertes.
        </p>
        <nav aria-label="Sections des paramètres" className="mt-4 flex flex-wrap gap-2">
          {SECTIONS.filter((section) => section.id !== "profil-public" || profile).map(
            (section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex min-h-10 items-center rounded-full bg-brand-soft px-4 text-sm font-bold text-brand-ink transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-bright"
              >
                {section.label}
              </a>
            ),
          )}
        </nav>
      </header>

      <div className="mt-6 space-y-6">
        <ProProfileForm profile={profile} userId={user.id} hasProRole={roles.includes("pro")} />
        <ProPayoutAccount />
        {profile && <ProPublicProfileEditor profile={profile} />}
        <ProNotificationSettings proId={user.id} />
      </div>
    </ProShell>
  );
}

function ProSettingsPage() {
  return (
    <RoleGuard role="pro" redirect="/pro/parametres">
      <ProSettings />
    </RoleGuard>
  );
}
