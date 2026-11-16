import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarDays,
  Gift,
  Inbox,
  LayoutDashboard,
  Send,
  Settings,
  Wallet,
} from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { spaceWrap } from "@/components/space/space-kit";
import { useFoundingStatus } from "@/hooks/useFoundingStatus";
import { FOUNDING_FREE_MISSIONS } from "@/lib/pro-dashboard";

export const PRO_TABS = [
  "apercu",
  "demandes",
  "propositions",
  "chantiers",
  "portefeuille",
] as const;
export type ProTab = (typeof PRO_TABS)[number];

const TAB_ITEMS: { tab: ProTab; label: string; icon: typeof Inbox }[] = [
  { tab: "apercu", label: "Vue d'ensemble", icon: LayoutDashboard },
  { tab: "demandes", label: "Demandes à chiffrer", icon: Inbox },
  { tab: "propositions", label: "Mes propositions", icon: Send },
  { tab: "chantiers", label: "Mes chantiers", icon: CalendarDays },
  { tab: "portefeuille", label: "Portefeuille", icon: Wallet },
];

const itemBase =
  "flex min-h-11 items-center gap-3 whitespace-nowrap rounded-2xl px-3.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-bright";
const itemIdle = "text-brand-ink hover:bg-brand-soft";
const itemActive = "bg-brand-ink text-white";

/**
 * Cadre de l'espace pro : menu à gauche sur ordinateur, ligne d'onglets défilante sur mobile.
 * `active` vaut un onglet du tableau de bord ou "parametres".
 */
export function ProShell({
  active,
  counts = {},
  publicSlug,
  children,
}: {
  active: ProTab | "parametres";
  counts?: Partial<Record<ProTab, number>>;
  publicSlug?: string | null | undefined;
  children: ReactNode;
}) {
  const founding = useFoundingStatus();
  const used = Math.min(FOUNDING_FREE_MISSIONS, founding.paidMissions);
  const navRef = useRef<HTMLElement>(null);

  // Sur mobile, la ligne d'onglets défile : on amène l'onglet actif dans l'écran.
  useEffect(() => {
    const nav = navRef.current;
    const current = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (nav && current) nav.scrollLeft = current.offsetLeft - nav.offsetLeft - 16;
  }, [active]);

  return (
    <div className={`${spaceWrap} py-6 lg:py-10`}>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[236px_minmax(0,1fr)] lg:gap-10">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <p className="hidden px-3.5 text-xs font-bold uppercase tracking-[0.08em] text-primary lg:block">
            Espace pro
          </p>
          <nav
            ref={navRef}
            aria-label="Espace professionnel"
            className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:mt-3 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {TAB_ITEMS.map(({ tab, label, icon: Icon }) => {
              const count = counts[tab];
              const isActive = active === tab;
              return (
                <Link
                  key={tab}
                  to="/pro/dashboard"
                  search={{ tab }}
                  aria-current={isActive ? "page" : undefined}
                  className={`${itemBase} ${isActive ? itemActive : itemIdle}`}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  {count != null && count > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
                        isActive ? "bg-white text-brand-ink" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
            <Link
              to="/pro/parametres"
              aria-current={active === "parametres" ? "page" : undefined}
              className={`${itemBase} ${active === "parametres" ? itemActive : itemIdle} lg:mt-3`}
            >
              <Settings className="size-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">Paramètres</span>
            </Link>
            {publicSlug && (
              <Link
                to="/pro/$slug"
                params={{ slug: publicSlug }}
                className={`${itemBase} ${itemIdle}`}
              >
                <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                <span className="flex-1">Ma page publique</span>
              </Link>
            )}
          </nav>

          {founding.isFounding && (
            <div className="mt-5 hidden rounded-2xl bg-brand-soft p-4 lg:block">
              <p className="flex items-center gap-2 text-sm font-extrabold text-brand-ink">
                <Gift className="size-4 text-primary" aria-hidden="true" /> Offre fondateur
              </p>
              <p className="mt-1.5 text-sm leading-snug text-brand-ink">
                {founding.freeRemaining > 0
                  ? `${founding.freeRemaining} chantier${founding.freeRemaining > 1 ? "s" : ""} sans commission restant${founding.freeRemaining > 1 ? "s" : ""}.`
                  : "Vos chantiers offerts sont utilisés."}
              </p>
              <div
                className="mt-3 h-2 rounded-full bg-white"
                role="img"
                aria-label={`${used} chantier(s) offert(s) utilisé(s) sur ${FOUNDING_FREE_MISSIONS}`}
              >
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${(used / FOUNDING_FREE_MISSIONS) * 100}%` }}
                />
              </div>
            </div>
          )}
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
