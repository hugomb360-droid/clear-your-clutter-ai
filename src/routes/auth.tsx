import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { BadgeCheck, Building2, Camera, ShieldCheck, Sparkles, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ZonesMapPanel } from "@/components/pro/zones-map-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { parsePostalCodes, PRO_SERVICES } from "@/lib/pro-dashboard";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).default("signin"),
  role: z.enum(["client", "pro"]).default("client"),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Connexion & inscription — Clearo" },
      {
        name: "description",
        content:
          "Connectez-vous à Clearo pour suivre vos devis de débarras ou rejoindre le réseau de professionnels vérifiés.",
      },
      { property: "og:title", content: "Votre espace Clearo" },
      { property: "og:description", content: "Suivez vos devis et vos missions de débarras." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://clearo.fr/auth" }],
  }),
  component: AuthPage,
});

function safePath(value: string | undefined) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

const HIGHLIGHTS = [
  { icon: Camera, title: "Devis en photo", text: "Une estimation IA en moins de 2 minutes." },
  { icon: ShieldCheck, title: "Pros vérifiés", text: "SIRET contrôlé, avis clients publics." },
  { icon: Sparkles, title: "Sans engagement", text: "Comparez les offres, choisissez librement." },
];

const PRO_STEPS = [
  {
    label: "Société",
    question: "Quel est le nom de votre société ?",
    hint: "Il apparaîtra sur vos propositions envoyées aux clients.",
  },
  {
    label: "SIRET",
    question: "Quel est votre numéro SIRET ?",
    hint: "14 chiffres. Il nous sert à vérifier votre entreprise.",
  },
  {
    label: "Téléphone",
    question: "Sur quel numéro peut-on vous joindre ?",
    hint: "Communiqué au client uniquement quand il accepte votre offre.",
  },
  {
    label: "Secteurs",
    question: "Où intervenez-vous ?",
    hint: "Codes postaux séparés par des virgules. Vous ne recevrez que ces missions.",
  },
  {
    label: "Prestations",
    question: "Quelles prestations proposez-vous ?",
    hint: "Sélectionnez tout ce que vous savez faire (facultatif).",
  },
  {
    label: "Présentation",
    question: "Présentez votre entreprise",
    hint: "Quelques lignes pour rassurer les clients (facultatif).",
  },
];


function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"client" | "pro">(search.role);

  // Champs professionnels
  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [phone, setPhone] = useState("");
  const [zones, setZones] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const postalCodes = parsePostalCodes(zones);
  const target = safePath(search.redirect);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: target ?? "/compte" });
    });
  }, [navigate, target]);

  const finish = () => navigate({ to: target ?? (role === "pro" ? "/pro/dashboard" : "/compte") });

  const toggleService = (service: string) =>
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
    );

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Connexion impossible", { description: error.message });
      return;
    }
    finish();
  };

  const saveProProfile = async (userId: string) => {
    await supabase.from("user_roles").insert({ user_id: userId, role: "pro" });
    await supabase.from("pro_profiles").upsert(
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
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (role === "pro") {
      if (!companyName.trim()) {
        toast.error("Nom de société requis");
        return;
      }
      if (siret.replace(/\D/g, "").length !== 14) {
        toast.error("SIRET invalide", { description: "Le SIRET contient 14 chiffres." });
        return;
      }
      if (postalCodes.length === 0) {
        toast.error("Ajoutez au moins une zone", {
          description: "Exemple : 75 pour tout Paris, ou 92100 pour une commune.",
        });
        return;
      }
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${target ?? "/compte"}`,
        data: { full_name: fullName, role },
      },
    });
    if (error) {
      setLoading(false);
      toast.error("Inscription impossible", { description: error.message });
      return;
    }
    if (data.session && data.user && role === "pro") {
      await saveProProfile(data.user.id);
    }
    setLoading(false);
    if (!data.session) {
      toast.success("Compte créé", {
        description: "Confirmez votre e-mail, puis connectez-vous pour accéder à votre espace.",
      });
      return;
    }
    toast.success("Compte créé", { description: "Bienvenue chez Clearo !" });
    finish();
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Connexion Google impossible");
      return;
    }
    if (result.redirected) return;
    finish();
  };

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(60%_100%_at_50%_100%,var(--brand-soft),transparent)]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_minmax(0,560px)] lg:py-20">
        <aside className="hidden flex-col justify-center lg:flex">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <BadgeCheck className="size-3.5 text-primary" /> +850 débarrasseurs partout en France
          </span>
          <h2 className="mt-5 max-w-md pb-1 text-4xl font-extrabold leading-[1.15] tracking-tight [text-wrap:balance]">
            Le débarras, <span className="text-primary">simple et transparent.</span>
          </h2>
          <p className="mt-4 max-w-md text-pretty text-muted-foreground">
            Créez votre compte pour suivre vos devis, comparer les propositions et gérer vos
            missions au même endroit.
          </p>

          <ul className="mt-8 grid gap-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur"
              >
                <span className="rounded-xl bg-brand-soft p-2 text-brand-ink">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="mx-auto w-full max-w-xl">
          <h1 className="text-3xl font-extrabold tracking-tight">Votre espace Clearo</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connexion en un clic, inscription en une minute.
          </p>

          <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <Tabs defaultValue={search.mode}>
              <TabsList className="grid w-full grid-cols-2 rounded-2xl p-1.5">
                <TabsTrigger value="signin" className="rounded-xl">
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl">
                  Inscription
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form className="mt-6 grid gap-4" onSubmit={handleSignIn}>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="vous@exemple.fr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="lg" className="rounded-xl" disabled={loading}>
                    {loading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form className="mt-6 grid gap-5" onSubmit={handleSignUp}>
                  {step === 0 && (
                    <>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {(["client", "pro"] as const).map((option) => {
                          const active = role === option;
                          const Icon = option === "client" ? User2 : Building2;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setRole(option)}
                              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                                active
                                  ? "border-primary bg-brand-soft text-brand-ink"
                                  : "border-border hover:bg-secondary"
                              }`}
                            >
                              <Icon className="mt-0.5 size-4 shrink-0" />
                              <span>
                                <span className="block text-sm font-semibold">
                                  {option === "client"
                                    ? "Je débarrasse un bien"
                                    : "Je suis débarrasseur"}
                                </span>
                                <span className="block text-xs opacity-80">
                                  {option === "client"
                                    ? "Devis IA gratuit en 2 min"
                                    : "Recevez des missions près de chez vous"}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nom complet *</Label>
                          <Input
                            id="name"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email-up">E-mail *</Label>
                          <Input
                            id="email-up"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2 sm:col-span-2">
                          <Label htmlFor="password-up">Mot de passe *</Label>
                          <Input
                            id="password-up"
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {isPro && step > 0 && (
                    <div className="grid gap-4 rounded-2xl border border-border bg-secondary/50 p-5">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                          <span>
                            Étape {step} sur {PRO_STEPS.length}
                          </span>
                          <span>{PRO_STEPS[step - 1]?.label}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-border">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${(step / PRO_STEPS.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-base font-bold">{PRO_STEPS[step - 1]?.question}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {PRO_STEPS[step - 1]?.hint}
                        </p>
                      </div>

                      {step === 1 && (
                        <Input
                          autoFocus
                          id="company"
                          placeholder="Débarras Express SARL"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      )}

                      {step === 2 && (
                        <Input
                          autoFocus
                          id="siret"
                          inputMode="numeric"
                          maxLength={17}
                          placeholder="123 456 789 00012"
                          value={siret}
                          onChange={(e) => setSiret(e.target.value)}
                        />
                      )}

                      {step === 3 && (
                        <Input
                          autoFocus
                          id="pro-phone"
                          type="tel"
                          placeholder="06 12 34 56 78"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      )}

                      {step === 4 && (
                        <div className="grid gap-3">
                          <Input
                            autoFocus
                            id="zones"
                            placeholder="75, 92100, 93"
                            value={zones}
                            onChange={(e) => setZones(e.target.value)}
                          />
                          <ZonesMapPanel
                            zones={postalCodes}
                            title="Votre secteur d'intervention"
                            description="Saisissez « 75 » pour tout Paris ou « 92100 » pour une commune : la carte se met à jour."
                          />
                        </div>
                      )}

                      {step === 5 && (
                        <div className="flex flex-wrap gap-2">
                          {PRO_SERVICES.map((service) => {
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
                      )}

                      {step === 6 && (
                        <Textarea
                          autoFocus
                          id="pro-desc"
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Équipe, véhicules, spécialités, délais d'intervention..."
                        />
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {step > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="rounded-xl"
                        onClick={() => setStep((s) => s - 1)}
                      >
                        Retour
                      </Button>
                    )}
                    {isPro && step < PRO_STEPS.length ? (
                      <Button
                        type="button"
                        size="lg"
                        className="flex-1 rounded-xl"
                        onClick={goNext}
                      >
                        Continuer
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        size="lg"
                        className="flex-1 rounded-xl"
                        disabled={loading}
                      >
                        {loading
                          ? "Création..."
                          : isPro
                            ? "Créer mon compte pro"
                            : "Créer mon compte"}
                      </Button>
                    )}
                  </div>
                </form>
              </TabsContent>

            </Tabs>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              ou
              <span className="h-px flex-1 bg-border" />
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-xl"
              onClick={handleGoogle}
            >
              Continuer avec Google
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            En continuant, vous acceptez les{" "}
            <Link to="/mentions-legales" className="underline">
              mentions légales
            </Link>{" "}
            de Clearo.
          </p>
        </div>
      </div>
    </div>
  );
}
