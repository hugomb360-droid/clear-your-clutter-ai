import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, type AppRole } from "@/hooks/useAuth";

type Props = {
  /** Rôle requis pour accéder à l'espace. */
  role: AppRole;
  /** Chemin de redirection après connexion. */
  redirect: string;
  children: React.ReactNode;
};

const SPACE_LABEL: Record<AppRole, string> = {
  client: "espace client",
  pro: "espace professionnel",
  admin: "espace administration",
};

/**
 * Sépare strictement les espaces : un compte client ne peut pas ouvrir l'espace
 * pro, et un compte pro ne peut pas ouvrir l'espace client.
 */
export function RoleGuard({ role, redirect, children }: Props) {
  const { user, loading, rolesLoading, roles, isPro, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect } });
  }, [loading, user, navigate, redirect]);

  if (loading || !user || rolesLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-20 text-muted-foreground">Chargement...</div>;
  }

  const allowed =
    role === "admin"
      ? isAdmin
      : role === "pro"
        ? isPro || isAdmin
        : roles.includes("client") && !isPro;

  if (!allowed) {
    const ownSpace = isAdmin ? "/admin" : isPro ? "/pro/dashboard" : "/compte";
    const ownLabel = isAdmin
      ? "Administration"
      : isPro
        ? "Mon espace professionnel"
        : "Mon espace client";

    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight">Accès réservé</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Cet {SPACE_LABEL[role]} n'est pas accessible avec votre compte
          {isPro ? " professionnel" : " client"}. Les espaces client et professionnel sont
          totalement séparés sur Débarras France.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to={ownSpace}>{ownLabel}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
