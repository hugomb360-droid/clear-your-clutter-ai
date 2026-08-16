import { Link, useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import clearoLogo from "@/assets/clearo-logo.png.asset.json";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { to: "/estimation", label: "Estimer mon débarras" },
  { to: "/comment-ca-marche", label: "Comment ça marche" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/pros", label: "Devenir partenaire" },
] as const;

export function SiteHeader() {
  const { user, isPro, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const accountLink = isPro ? "/pro/dashboard" : "/compte";

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={clearoLogo.url} alt="Logo Clearo" className="size-9 object-contain" />
          <span className="text-xl font-extrabold tracking-tight">clearo</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to={accountLink}>Mon espace</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Connexion</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/estimation">Devis gratuit</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="mt-10 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Button asChild variant="outline" onClick={() => setOpen(false)}>
                      <Link to={accountLink}>Mon espace</Link>
                    </Button>
                    <Button
                      onClick={() => {
                        setOpen(false);
                        void handleSignOut();
                      }}
                    >
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" onClick={() => setOpen(false)}>
                      <Link to="/auth">Connexion</Link>
                    </Button>
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link to="/estimation">Devis gratuit</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
