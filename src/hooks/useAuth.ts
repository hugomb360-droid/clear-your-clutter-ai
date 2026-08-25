import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "client" | "pro" | "admin";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setRoles([]);
      setRolesLoading(false);
      return;
    }
    let active = true;
    setRolesLoading(true);
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (!active) return;
        setRoles((data ?? []).map((row) => row.role as AppRole));
        setRolesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  const user: User | null = session?.user ?? null;

  return {
    session,
    user,
    roles,
    loading,
    rolesLoading,
    isPro: roles.includes("pro"),
    isAdmin: roles.includes("admin"),
    isClient: roles.includes("client") && !roles.includes("pro"),
    signOut: () => supabase.auth.signOut(),
  };
}
