import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

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
          "Connectez-vous à Clearo pour suivre vos devis de débarras ou rejoindre le réseau de professionnels.",
      },
      { property: "og:title", content: "Votre espace Clearo" },
      { property: "og:description", content: "Suivez vos devis et vos missions de débarras." },
    ],
  }),
  component: AuthPage,
});

function safePath(value: string | undefined) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"client" | "pro">(search.role);

  const target = safePath(search.redirect);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: target ?? "/compte" });
    });
  }, [navigate, target]);

  const finish = () => navigate({ to: target ?? (role === "pro" ? "/pro/dashboard" : "/compte") });

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

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${target ?? "/compte"}`,
        data: { full_name: fullName, role },
      },
    });
    setLoading(false);
    if (error) {
      toast.error("Inscription impossible", { description: error.message });
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
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Votre espace Clearo</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Suivez vos devis, comparez les propositions et gérez vos missions.
      </p>

      <div className="mt-8 rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
        <Tabs defaultValue={search.mode}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form className="mt-6 grid gap-4" onSubmit={handleSignIn}>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
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
              <Button type="submit" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form className="mt-6 grid gap-4" onSubmit={handleSignUp}>
              <div className="grid grid-cols-2 gap-2">
                {(["client", "pro"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRole(option)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                      role === option
                        ? "border-primary bg-brand-soft text-brand-ink"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    {option === "client" ? "Je débarrasse un bien" : "Je suis débarrasseur"}
                  </button>
                ))}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email-up">E-mail</Label>
                <Input
                  id="email-up"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password-up">Mot de passe</Label>
                <Input
                  id="password-up"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer mon compte"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          ou
          <span className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogle}>
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
  );
}
