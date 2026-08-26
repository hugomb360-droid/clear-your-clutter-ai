import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { ProPayoutAccount } from "@/components/pro/pro-payout-account";
import { ProProfileForm } from "@/components/pro/pro-profile-form";

import { RoleGuard } from "@/components/role-guard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pro/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres pro — fiche entreprise et zones | Clearo" },
      {
        name: "description",
        content:
          "Modifiez votre fiche entreprise Clearo : nom, SIRET, téléphone, prestations et zones d'intervention.",
      },
      { property: "og:title", content: "Paramètres professionnels Clearo" },
      {
        property: "og:description",
        content: "Gérez vos informations d'entreprise et vos secteurs de débarras.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProSettingsPage,
});

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
      const { data, error } = await supabase
        .from("pro_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (loading || !user) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-muted-foreground">Chargement...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        to="/pro/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Retour à mes missions
      </Link>
      <header className="mt-4">
        <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight">Paramètres</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fiche entreprise, SIRET, prestations et zones d'intervention.
        </p>
      </header>

      <div className="mt-8 space-y-8">
        <ProProfileForm
          profile={profileQuery.data ?? null}
          userId={user.id}
          hasProRole={roles.includes("pro")}
        />
        <ProPayoutAccount />
      </div>

    </div>
  );
}

function ProSettingsPage() {
  return (
    <RoleGuard role="pro" redirect="/pro/parametres">
      <ProSettings />
    </RoleGuard>
  );
}
