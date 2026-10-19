import { Link } from "@tanstack/react-router";
import clearoLogo from "@/assets/clearo-logo-black.png";
import { CITIES } from "@/lib/cities";


export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <div className="flex items-center gap-2">
            <img src={clearoLogo} alt="Logo Débarras France" className="size-8 object-contain" />
            <div className="flex flex-col -space-y-1.5 leading-none">
              <span className="text-lg font-extrabold tracking-tight">Débarras</span>
              <span className="text-[10px] font-semibold tracking-wide text-primary">France</span>
            </div>
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
            <li>
              <Link to="/debarras-appartement" className="hover:text-foreground">
                Débarras d'appartement
              </Link>
            </li>
            <li>
              <Link to="/debarras-maison" className="hover:text-foreground">
                Débarras de maison
              </Link>
            </li>
            <li>
              <Link to="/vide-maison" className="hover:text-foreground">
                Vide-maison
              </Link>
            </li>
            <li>
              <Link to="/prix-debarras" className="hover:text-foreground">
                Prix d'un débarras
              </Link>
            </li>
            <li>
              <Link to="/debarras-succession" className="hover:text-foreground">
                Débarras après succession
              </Link>
            </li>
            <li>
              <Link to="/debarras-cave-garage" className="hover:text-foreground">
                Débarras cave et garage
              </Link>
            </li>
            <li>
              <Link to="/debarras-diogene" className="hover:text-foreground">
                Débarras syndrome de Diogène
              </Link>
            </li>
            <li>
              <Link to="/debarras" className="hover:text-foreground">
                Débarras par ville
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Villes</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {CITIES.slice(0, 18).map((city) => (
              <li key={city.slug}>
                <Link
                  to="/debarras/$ville"
                  params={{ ville: city.slug }}
                  className="hover:text-foreground"
                >
                  {city.name}
                </Link>
              </li>
            ))}
            <li className="col-span-2">
              <Link to="/debarras" className="font-medium hover:text-foreground">
                Toutes les villes ({CITIES.length})
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
          <h3 className="text-sm font-semibold">Débarras France</h3>
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
        © {new Date().getFullYear()} Débarras France — Débarras responsable partout en France.
      </div>
    </footer>
  );
}
