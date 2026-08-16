import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { euro } from "@/lib/pricing";

export const Route = createFileRoute("/pro/dashboard")({
  head: () => ({
    meta: [
      { title: "Espace pro — missions de débarras Clearo" },
      {
        name: "description",
        content:
          "Consultez les demandes de débarras de vos zones, envoyez vos propositions et suivez vos missions acceptées.",
      },
      { property: "og:title", content: "Espace professionnel Clearo" },
      {
        property: "og:description",
        content: "Missions qualifiées, volume estimé et photos avant de répondre.",
      },
    ],
  }),
  component: ProDashboard,
});

function ProDashboard() {
  const { user, loading, roles } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [zones, setZones] = useState("");
  const [saving, setSaving] = useState(false);
  const [bidDrafts, setBidDrafts] = useState<Record<string, { price: string; date: string }>>({});

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

  useEffect(() => {
    const profile = profileQuery.data;
    if (!profile) return;
    setCompanyName(profile.company_name ?? "");
    setSiret(profile.siret ?? "");
    setPhone(profile.phone ?? "");
    setDescription(profile.description ?? "");
    setZones((profile.postal_codes ?? []).join(", "));
  }, [profileQuery.data]);

  const missionsQuery = useQuery({
    queryKey: ["pro-missions", user?.id],
    enabled: Boolean(user?.id) && Boolean(profileQuery.data),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*, bids(*)")
        .in("status", ["published", "matched"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const postalCodes = zones
      .split(",")
      .map((zone) => zone.trim())
      .filter(Boolean);
    const { error } = await supabase.from("pro_profiles").upsert(
      {
        user_id: user.id,
        company_name: companyName,
        siret: siret || null,
        phone: phone || null,
        description: description || null,
        postal_codes: postalCodes,
      },
      { onConflict: "user_id" },
    );
    if (!roles.includes("pro")) {
      await supabase.from("user_roles").insert({ user_id: user.id, role: "pro" });
    }
    setSaving(false);
    if (error) {
      toast.error("Enregistrement impossible", { description: error.message });
      return;
    }
    toast.success("Profil pro enregistré");
    void queryClient.invalidateQueries({ queryKey: ["pro-profile"] });
    void queryClient.invalidateQueries({ queryKey: ["pro-missions"] });
  };

  const sendBid = async (quoteId: string) => {
    if (!user) return;
    const draft = bidDrafts[quoteId];
    const price = Number.parseInt(draft?.price ?? "", 10);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Indiquez un prix");
      return;
    }
    const { error } = await supabase.from("bids").insert({
      quote_id: quoteId,
      pro_id: user.id,
      price,
      available_date: draft?.date || null,
    });
    if (error) {
      toast.error("Proposition refusée", { description: error.message });
      return;
    }
    toast.success("Proposition envoyée");
    void queryClient.invalidateQueries({ queryKey: ["pro-missions"] });
  };

  if (loading || !user) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-muted-foreground">Chargement...</div>;
  }

  const profile = profileQuery.data;
  const missions = missionsQuery.data ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-3xl font-extrabold tracking-tight">Espace professionnel</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Renseignez vos zones d'intervention pour recevoir les demandes de votre secteur.
      </p>

      <section className="mt-8 rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Ma fiche entreprise</h2>
          {profile?.verified && (
            <Badge className="gap-1">
              <BadgeCheck className="size-3.5" /> Pro vérifié
            </Badge>
          )}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="company">Nom de la société *</Label>
            <Input
              id="company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="siret">SIRET</Label>
            <Input id="siret" value={siret} onChange={(e) => setSiret(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pro-phone">Téléphone</Label>
            <Input id="pro-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zones">Zones (codes postaux, séparés par des virgules)</Label>
            <Input
              id="zones"
              placeholder="75, 92100, 93"
              value={zones}
              onChange={(e) => setZones(e.target.value)}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="desc">Présentation</Label>
            <Textarea
              id="desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <Button className="mt-5" onClick={saveProfile} disabled={saving || !companyName}>
          {saving ? "Enregistrement..." : "Enregistrer ma fiche"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Astuce : saisissez « 75 » pour couvrir tout Paris, ou « 92100 » pour une seule commune.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold">Demandes dans mes zones ({missions.length})</h2>
        {!profile && (
          <p className="mt-3 text-sm text-muted-foreground">
            Enregistrez d'abord votre fiche entreprise pour voir les demandes.
          </p>
        )}
        <div className="mt-5 space-y-5">
          {missions.map((quote) => {
            const myBid = (quote.bids ?? []).find((bid) => bid.pro_id === user.id);
            return (
              <article key={quote.id} className="rounded-3xl border border-border bg-card p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">
                      {quote.property_type} · {quote.volume_m3 ?? "?"} m³
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" /> {quote.postal_code} {quote.city ?? ""} ·
                      Étage {quote.floor}
                      {quote.has_elevator ? " avec ascenseur" : " sans ascenseur"}
                    </p>
                  </div>
                  {quote.price_min != null && quote.price_max != null && (
                    <p className="text-sm text-muted-foreground">
                      Estimation Clearo : {euro(quote.price_min)} – {euro(quote.price_max)}
                    </p>
                  )}
                </div>
                {quote.notes && <p className="mt-3 text-sm text-muted-foreground">{quote.notes}</p>}

                {myBid ? (
                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-secondary/60 p-4 text-sm">
                    <Badge variant={myBid.status === "accepted" ? "default" : "secondary"}>
                      {myBid.status === "accepted" ? "Mission acceptée" : "Proposition envoyée"}
                    </Badge>
                    <span>{euro(myBid.price)}</span>
                  </div>
                ) : (
                  <div className="mt-5 flex flex-wrap items-end gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor={`price-${quote.id}`}>Mon prix (€)</Label>
                      <Input
                        id={`price-${quote.id}`}
                        inputMode="numeric"
                        className="w-32"
                        value={bidDrafts[quote.id]?.price ?? ""}
                        onChange={(e) =>
                          setBidDrafts((prev) => ({
                            ...prev,
                            [quote.id]: {
                              price: e.target.value,
                              date: prev[quote.id]?.date ?? "",
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`date-${quote.id}`}>Disponibilité</Label>
                      <Input
                        id={`date-${quote.id}`}
                        type="date"
                        value={bidDrafts[quote.id]?.date ?? ""}
                        onChange={(e) =>
                          setBidDrafts((prev) => ({
                            ...prev,
                            [quote.id]: {
                              price: prev[quote.id]?.price ?? "",
                              date: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <Button onClick={() => sendBid(quote.id)}>Envoyer ma proposition</Button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
