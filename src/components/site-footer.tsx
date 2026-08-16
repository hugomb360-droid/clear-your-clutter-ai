import { Link } from "@tanstack/react-router";
import clearoLogo from "@/assets/clearo-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src={clearoLogo.url} alt="Logo Clearo" className="size-8 object-contain" />
            <span className="text-lg font-extrabold tracking-tight">clearo</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Le débarras simple : estimez en 2 minutes, on trouve le pro près de chez vous.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Particuliers</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/estimation" className="hover:text-foreground">
                Estimer mon débarras
              </Link>
            </li>
            <li>
              <Link to="/comment-ca-marche" className="hover:text-foreground">
                Comment ça marche
              </Link>
            </li>
            <li>
              <Link to="/tarifs" className="hover:text-foreground">
                Tarifs
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Professionnels</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/pros" className="hover:text-foreground">
                Devenir partenaire
              </Link>
            </li>
            <li>
              <Link to="/pro/dashboard" className="hover:text-foreground">
                Espace pro
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Clearo</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/mentions-legales" className="hover:text-foreground">
                Mentions légales
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Clearo — Débarras responsable partout en France.
      </div>
    </footer>
  );
}
