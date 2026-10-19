import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ReferralInbox() {
  const query = useQuery({ queryKey: ["referral-contacts"], refetchInterval: 30000, queryFn: async () => {
    const { data, error } = await supabase.from("referral_contacts").select("*").order("created_at", { ascending: false });
    if (error) throw error; return data ?? [];
  } });
  if (query.isPending) return <p>Chargement des demandes…</p>;
  if (query.isError) return <p role="alert">Impossible de charger les demandes partenaires.</p>;
  return <div className="space-y-4">{query.data.length === 0 && <p className="text-muted-foreground">Aucune demande de partenariat.</p>}{query.data.map(row => <article key={row.id} className="rounded-lg border border-border p-5"><h3 className="font-bold">{row.organization} · {row.profession}</h3><p className="mt-1 text-sm">{row.name} · <a className="text-primary underline" href={`mailto:${row.email}`}>{row.email}</a> · {row.phone}</p><p className="mt-3 whitespace-pre-wrap break-words text-sm text-muted-foreground">{row.message}</p><p className="mt-3 text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString("fr-FR")}</p></article>)}</div>;
}