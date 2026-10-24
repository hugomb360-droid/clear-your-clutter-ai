import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import clearoLogo from "@/assets/clearo-logo-black.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { SERVICE_LINKS } from "@/lib/site-nav";

const NAV = [
  { to: "/tarifs", label: "Tarifs" },
  { to: "/debarras-succession", label: "Succession" },
  { to: "/professionnels", label: "Nos pros" },
] as const;

const navLinkClass =
  "whitespace-nowrap border-b-2 border-transparent px-0.5 py-2 text-[15px] font-medium text-foreground transition-colors hover:border-brand-bright";
const navActiveClass = "border-primary text-primary";

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex shrink-0 items-center gap-2 text-brand-ink">
      <img src={clearoLogo} alt="" className="size-8 object-contain" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-black tracking-tight">Débarras</span>
        <span className="mt-0.5 text-[11px] font-bold tracking-[0.08em] text-primary">FRANCE</span>
      </span>
      <span className="sr-only">Débarras France, accueil</span>
    </Link>
  );
}

export function SiteHeader() {
  const { user, isPro, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const accountLink = isAdmin ? "/admin" : isPro ? "/pro/dashboard" : "/compte";
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center gap-6 px-4 sm:px-6 lg:px-10">
        <Logo />

        <nav
          aria-label="Navigation principale"
          className="hidden min-w-0 flex-1 items-center gap-4 lg:flex xl:gap-6"
        >
          <Link
            to="/"
            className={navLinkClass}
            activeOptions={{ exact: true }}
            activeProps={{ className: navActiveClass }}
          >
            Accueil
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`${navLinkClass} inline-flex items-center gap-1 outline-none`}
            >
              Nos services <ChevronDown className="size-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {SERVICE_LINKS.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/debarras">Débarras par ville</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/comment-ca-marche">Comment ça marche</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={navLinkClass}
              activeProps={{ className: navActiveClass }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/pros"
            className={`${navLinkClass} font-bold text-primary`}
            activeProps={{ className: navActiveClass }}
          >
            Devenir débarrasseur
          </Link>
          <Link to="/contact" className={navLinkClass} activeProps={{ className: navActiveClass }}>
            Contact
          </Link>
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-2.5 lg:flex">
          {user ? (
            <>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-2 border-brand-ink px-5 font-bold text-brand-ink"
              >
                <Link to={accountLink}>{isAdmin ? "Administration" : "Mon espace"}</Link>
              </Button>
              <Button onClick={handleSignOut} className="h-11 rounded-full px-5 font-bold">
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-2 border-brand-ink px-5 font-bold text-brand-ink"
              >
                <Link to="/auth" search={{ mode: "signin" }}>
                  Se connecter
                </Link>
              </Button>
              <Button asChild className="h-11 rounded-full px-5 font-bold">
                <Link to="/auth" search={{ mode: "signup" }}>
                  S'inscrire
                </Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="ml-auto lg:hidden">
            <Button
              variant="outline"
              size="icon"
              className="size-11 rounded-xl"
              aria-label="Ouvrir le menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] overflow-y-auto">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="mt-2">
              <Logo onClick={close} />
            </div>
            <nav aria-label="Navigation mobile" className="mt-6 flex flex-col">
              <Link
                to="/"
                onClick={close}
                className="rounded-lg px-3 py-2.5 font-medium hover:bg-secondary"
              >
                Accueil
              </Link>
              <Link
                to="/estimation"
                search={{ type: "photo" }}
                onClick={close}
                className="rounded-lg px-3 py-2.5 font-bold text-primary hover:bg-secondary"
              >
                Lancer mon devis IA
              </Link>
              <p className="mt-4 px-3 text-sm font-bold text-muted-foreground">Nos services</p>
              {SERVICE_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={close}
                  className="rounded-lg px-3 py-2 text-[15px] hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-3 border-t border-border" />
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={close}
                  className="rounded-lg px-3 py-2.5 font-medium hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/comment-ca-marche"
                onClick={close}
                className="rounded-lg px-3 py-2.5 font-medium hover:bg-secondary"
              >
                Comment ça marche
              </Link>
              <Link
                to="/pros"
                onClick={close}
                className="rounded-lg px-3 py-2.5 font-bold text-primary hover:bg-secondary"
              >
                Devenir débarrasseur
              </Link>
              <Link
                to="/contact"
                onClick={close}
                className="rounded-lg px-3 py-2.5 font-medium hover:bg-secondary"
              >
                Contact
              </Link>
            </nav>
            <div className="mt-6 flex flex-col gap-2">
              {user ? (
                <>
                  <Button asChild variant="outline" className="h-11 rounded-full" onClick={close}>
                    <Link to={accountLink}>{isAdmin ? "Administration" : "Mon espace"}</Link>
                  </Button>
                  <Button
                    className="h-11 rounded-full"
                    onClick={() => {
                      close();
                      void handleSignOut();
                    }}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="h-11 rounded-full" onClick={close}>
                    <Link to="/auth" search={{ mode: "signin" }}>
                      Se connecter
                    </Link>
                  </Button>
                  <Button asChild className="h-11 rounded-full" onClick={close}>
                    <Link to="/auth" search={{ mode: "signup" }}>
                      S'inscrire
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
