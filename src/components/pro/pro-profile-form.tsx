import { useQueryClient } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const SERVICES = [
  "Débarras maison",
  "Débarras appartement",
  "Cave / grenier",
  "Succession",
  "Local pro",
  "Encombrants lourds",
];

export function ProProfileForm({
  profile,
  userId,
  hasProRole,
}: {
  profile: Tables<"pro_profiles"> | null;
  userId: string;
  hasProRole: boolean;
}) {
  const queryClient = useQueryClient();
  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [zones, setZones] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setCompanyName(profile.company_name ?? "");
    setSiret(profile.siret ?? "");
    setPhone(profile.phone ?? "");
    setDescription(profile.description ?? "");
    setZones((profile.postal_codes ?? []).join(", "));
    setServices(profile.service_types ?? []);
  }, [profile]);

  const toggleService = (service: string) =>
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
    );

  const save = async () => {
    setSaving(true);
    const postalCodes = zones
      .split(",")
      .map((zone) => zone.trim())
      .filter(Boolean);
    const { error } = await supabase.from("pro_profiles").upsert(
      {
        user_id: userId,
        company_name: companyName,
        siret: siret || null,
        phone: phone || null,
        description: description || null,
        postal_codes: postalCodes,
        service_types: services,
      },
      { onConflict: "user_id" },
    );
    if (!hasProRole) {
      await supabase.from("user_roles").insert({ user_id: userId, role: "pro" });
    }
    setSaving(false);
    if (error) {
      toast.error("Enregistrement impossible", { description: error.message });
      return;
    }
    toast.success("Fiche entreprise enregistrée");
    void queryClient.invalidateQueries({ queryKey: ["pro-profile"] });
    void queryClient.invalidateQueries({ queryKey: ["pro-missions"] });
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
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
          <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
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
          <Label htmlFor="zones">Zones d'intervention (codes postaux)</Label>
          <Input
            id="zones"
            placeholder="75, 92100, 93"
            value={zones}
            onChange={(e) => setZones(e.target.value)}
          />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label>Prestations proposées</Label>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((service) => {
              const active = services.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {service}
                </button>
              );
            })}
          </div>
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

      <Button className="mt-5" onClick={save} disabled={saving || !companyName}>
        {saving ? "Enregistrement..." : "Enregistrer ma fiche"}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        Astuce : saisissez « 75 » pour couvrir tout Paris, ou « 92100 » pour une seule commune.
      </p>
    </section>
  );
}
