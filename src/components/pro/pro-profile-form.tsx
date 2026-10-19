import { useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Building2, Check, FileText, MapPin, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { parsePostalCodes, PRO_SERVICES as SERVICES } from "@/lib/pro-dashboard";
import { ZonesMapPanel } from "@/components/pro/zones-map-panel";
import { verifiedBadge } from "@/lib/public-profiles";

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

  const postalCodes = parsePostalCodes(zones);

  const save = async () => {
    if (postalCodes.length === 0) {
      toast.error("Ajoutez au moins une zone", {
        description: "Exemple : 75 pour tout Paris, ou 92100 pour une commune.",
      });
      return;
    }
    setSaving(true);
    if (!hasProRole) {
      await supabase.from("user_roles").insert({ user_id: userId, role: "pro" });
    }
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
    setSaving(false);
    if (error) {
      toast.error("Enregistrement impossible", { description: error.message });
      return;
    }
    toast.success("Fiche entreprise enregistrée", {
      description: `Vous recevez les demandes des zones ${postalCodes.join(", ")}.`,
    });
    void queryClient.invalidateQueries({ queryKey: ["pro-profile"] });
    void queryClient.invalidateQueries({ queryKey: ["pro-missions"] });
  };

  const allServices = [...SERVICES, "Diogène", "Caves / garages"];

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      <header className="flex flex-col gap-3 border-b border-border bg-secondary/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold">Ma fiche entreprise</h2>
            <p className="text-sm text-muted-foreground">Ce que les clients voient de vous.</p>
          </div>
        </div>
        {profile && verifiedBadge(profile) && (
          <Badge className="w-fit gap-1">
            <BadgeCheck className="size-3.5" /> SIRET et assurance vérifiés
          </Badge>
        )}
      </header>

      <div className="divide-y divide-border">
        <FormBlock icon={<Building2 className="size-4" />} step="1" title="Identité" hint="Informations légales et contact.">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="company">Nom de la société *</Label>
              <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="siret">SIRET</Label>
              <Input id="siret" inputMode="numeric" value={siret} onChange={(e) => setSiret(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pro-phone">Téléphone</Label>
              <Input id="pro-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
        </FormBlock>

        <FormBlock icon={<MapPin className="size-4" />} step="2" title="Zones d'intervention" hint="« 75 » couvre tout Paris, « 92100 » une seule commune.">
          <div className="grid gap-2">
            <Label htmlFor="zones">Codes postaux ou départements</Label>
            <Input id="zones" placeholder="75, 92100, 93" value={zones} onChange={(e) => setZones(e.target.value)} />
            {postalCodes.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {postalCodes.map((code) => (
                  <span key={code} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {code}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-destructive">Renseignez au moins un code postal pour recevoir des demandes.</p>
            )}
          </div>
          <div className="mt-4">
            <ZonesMapPanel zones={postalCodes} />
          </div>
        </FormBlock>

        <FormBlock icon={<Wrench className="size-4" />} step="3" title="Prestations proposées" hint={`${services.length} sélectionnée${services.length > 1 ? "s" : ""}`}>
          <div className="flex flex-wrap gap-2">
            {allServices.map((service) => {
              const active = services.includes(service);
              return (
                <Button
                  key={service}
                  type="button"
                  variant={active ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleService(service)}
                  className="rounded-full"
                >
                  {active && <Check className="size-3.5" />}
                  {service}
                </Button>
              );
            })}
          </div>
        </FormBlock>

        <FormBlock icon={<FileText className="size-4" />} step="4" title="Présentation" hint="Quelques phrases sur votre équipe et votre savoir-faire.">
          <Textarea id="desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          <p className="mt-1 text-right text-xs text-muted-foreground">{description.length} caractères</p>
        </FormBlock>
      </div>

      <footer className="flex flex-col gap-3 border-t border-border bg-secondary/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Vos modifications sont visibles par les clients après enregistrement.</p>
        <Button onClick={save} disabled={saving || !companyName} className="sm:w-auto">
          {saving ? "Enregistrement..." : "Enregistrer ma fiche"}
        </Button>
      </footer>
    </section>
  );
}

function FormBlock({
  icon,
  step,
  title,
  hint,
  children,
}: {
  icon: React.ReactNode;
  step: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 px-6 py-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
      <div className="flex items-start gap-3">
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Étape {step}</p>
          <h3 className="font-semibold">{title}</h3>
          {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
