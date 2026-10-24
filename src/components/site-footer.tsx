import { Link } from "@tanstack/react-router";
import clearoLogo from "@/assets/clearo-logo-black.png";
import { CITIES } from "@/lib/cities";
import { CONTACT_EMAIL, PRACTICAL_LINKS, PRO_LINKS, SERVICE_LINKS } from "@/lib/site-nav";

const linkClass = "text-[15px] text-[#BFD8C8] hover:text-white hover:underline";

export function SiteFooter() {
  return (
    <footer className="bg-brand-ink text-white">
      <div className="mx-auto max-w-[1240px] px-4 pb-7 pt-16 sm:px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-white">
                <img src={clearoLogo} alt="" className="size-8 object-contain" />
              </span>
              <span className="text-2xl font-black tracking-tight">Débarras France</span>
            </Link>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-[#BFD8C8]">
              Estimez en 2 minutes, comparez les propositions des pros vérifiés de votre secteur,
              payez en toute sécurité.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className={`mt-4 inline-block ${linkClass}`}>
              {CONTACT_EMAIL}
            </a>
          </div>

          <FooterNav title="Services" links={SERVICE_LINKS} />
          <FooterNav title="Infos pratiques" links={PRACTICAL_LINKS} />
          <FooterNav title="Professionnels" links={PRO_LINKS} />
          <nav aria-label="Débarras France" className="flex flex-col gap-2.5">
            <span className="font-extrabold">Débarras France</span>
            <Link to="/contact" className={linkClass}>
              Contact
            </Link>
            <Link to="/compte" className={linkClass}>
              Mon compte
            </Link>
            <Link to="/mentions-legales" className={linkClass}>
              Mentions légales
            </Link>
          </nav>
        </div>

        <nav aria-label="Villes" className="mt-12 border-t border-white/15 pt-8">
          <p className="font-extrabold">Débarras dans votre ville</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {CITIES.map((city) => (
              <li key={city.slug}>
                <Link
                  to="/debarras/$ville"
                  params={{ ville: city.slug }}
                  className="text-sm text-[#BFD8C8] hover:text-white hover:underline"
                >
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-10 border-t border-white/15 pt-6 text-sm text-[#BFD8C8]">
          © {new Date().getFullYear()} Débarras France. Débarras responsable partout en France.
        </p>
      </div>
    </footer>
  );
}

function FooterNav({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ to: string; label: string }>;
}) {
  return (
    <nav aria-label={title} className="flex flex-col gap-2.5">
      <span className="font-extrabold">{title}</span>
      {links.map((item) => (
        <Link key={item.to} to={item.to} className={linkClass}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
