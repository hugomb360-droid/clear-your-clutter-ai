/**
 * Briques de mise en page partagées par les pages publiques.
 * Elles reprennent la direction artistique de l'accueil : vert du site, police Figtree,
 * grands titres serrés, photos arrondies, sections alternées blanc / vert pâle / vert foncé.
 */
import { Link } from "@tanstack/react-router";
import { Check, Lock, Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { CITIES, type CityPage } from "@/lib/cities";

/* ---------- Classes réutilisables ---------- */

export const wrap = "mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10";

const btnBase =
  "inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-[26px] text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-bright focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";
export const btn = btnBase;
export const btnPrimary = `${btnBase} bg-primary text-primary-foreground hover:bg-primary/90`;
export const btnOutline = `${btnBase} border-2 border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-white`;
export const btnSoft = `${btnBase} bg-brand-soft text-brand-ink shadow-[inset_0_0_0_2px_var(--brand-bright)] hover:bg-brand-soft/70`;
export const btnDark = `${btnBase} bg-brand-ink text-white hover:bg-brand-ink/90`;
export const btnWhite = `${btnBase} bg-white text-brand-ink hover:bg-brand-soft`;
export const btnOnDark = `${btnBase} border-2 border-white text-white hover:bg-white hover:text-brand-ink`;
export const btnSm = "min-h-11 px-5 text-[15px]";

export const h2Class =
  "text-[30px] font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-[42px]";
export const leadClass = "mt-4 max-w-[40em] text-lg leading-relaxed";

/** Couleurs de texte sur fond vert foncé. */
export const onDarkMuted = "text-[#BFD8C8]";
export const onDarkAccent = "text-[#6EDC97]";

/* ---------- Fil d'Ariane ---------- */

export type Crumb = { label: string; to?: string };

export function Breadcrumb({ items, dark = false }: { items: Crumb[]; dark?: boolean }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-[15px]">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link to="/" className={dark ? `${onDarkAccent} hover:underline` : "text-primary hover:underline"}>
            Accueil
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden="true" className={dark ? onDarkMuted : "text-muted-foreground"}>
              /
            </span>
            {item.to ? (
              <Link to={item.to} className={dark ? `${onDarkAccent} hover:underline` : "text-primary hover:underline"}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={dark ? onDarkMuted : "text-muted-foreground"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- En-tête de page ---------- */

export function PageHero({
  crumbs,
  title,
  subtitle,
  intro,
  actions,
  note,
  image,
  imageAlt = "",
  trustCard = true,
  floating,
}: {
  crumbs: Crumb[];
  title: ReactNode;
  /** Ligne verte sous le titre, comme sur l'accueil. */
  subtitle?: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  note?: ReactNode;
  image?: string | undefined;
  imageAlt?: string | undefined;
  /** Affiche la carte « Paiement bloqué via Stripe Connect » sur la photo. */
  trustCard?: boolean | undefined;
  /** Carte personnalisée posée en bas à droite de la photo. */
  floating?: ReactNode;
}) {
  return (
    <section className={image ? "pb-14 pt-8 sm:pb-20" : "bg-[#F2FAF4] pb-14 pt-8 sm:pb-16"}>
      <div className={`${wrap} ${image ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-14" : ""}`}>
        <div>
          <Breadcrumb items={crumbs} />
          <h1 className="mt-6 max-w-[18ch] text-[36px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[48px] lg:text-[54px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg font-extrabold leading-snug text-primary sm:text-xl">{subtitle}</p>
          )}
          {intro && (
            <div className="mt-5 max-w-[36em] text-lg leading-relaxed text-[#34433A]">{intro}</div>
          )}
          {actions && <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">{actions}</div>}
          {note && <p className="mt-4 text-[15px] text-muted-foreground">{note}</p>}
        </div>
        {image && (
          <div className="relative h-[300px] sm:h-[460px]">
            <img
              src={image}
              alt={imageAlt}
              className="absolute right-0 top-0 h-[92%] w-full rounded-[28px] object-cover sm:w-[90%]"
            />
            {trustCard && (
              <div className="absolute left-0 top-[120px] hidden max-w-[290px] items-center gap-3.5 rounded-[18px] bg-white p-4 shadow-[0_12px_32px_rgba(12,61,34,0.16)] sm:flex">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-brand-soft text-brand-ink">
                  <Lock className="size-6" aria-hidden="true" />
                </span>
                <span className="text-[15px] leading-snug">
                  <strong>Paiement bloqué</strong>
                  <br />
                  <span className="text-muted-foreground">via Stripe Connect, jusqu'à la fin du chantier</span>
                </span>
              </div>
            )}
            {floating && (
              <div className="absolute bottom-0 left-3 right-3 sm:left-auto sm:right-[18px] sm:w-[290px]">
                {floating}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Sections ---------- */

type Tone = "white" | "tint" | "dark" | "soft";

const toneClass: Record<Tone, string> = {
  white: "bg-background",
  tint: "bg-[#F2FAF4]",
  dark: "bg-brand-ink text-white",
  soft: "bg-brand-soft",
};

export function Section({
  id,
  tone = "white",
  className = "",
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-20 py-16 sm:py-24 ${toneClass[tone]} ${className}`}>
      <div className={wrap}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  lead,
  dark = false,
  action,
}: {
  title: ReactNode;
  lead?: ReactNode;
  dark?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <h2 className={`${h2Class} ${dark ? "text-white" : "text-brand-ink"}`}>{title}</h2>
        {lead && <p className={`${leadClass} ${dark ? onDarkMuted : "text-muted-foreground"}`}>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------- Étapes numérotées (vraie séquence) ---------- */

const stripNumber = (title: string) => title.replace(/^\s*\d+\.\s*/, "");

export function NumberedSteps({
  steps,
  columns = 4,
}: {
  steps: { title: string; text: ReactNode }[];
  columns?: 3 | 4;
}) {
  return (
    <ol
      className={`mt-12 grid gap-6 sm:grid-cols-2 ${columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
    >
      {steps.map((step, index) => (
        <li key={step.title} className="rounded-[20px] bg-white p-7 text-brand-ink">
          <span
            className={`flex size-11 items-center justify-center rounded-full text-lg font-extrabold ${
              index === steps.length - 1 ? "bg-brand-soft text-brand-ink" : "bg-primary text-primary-foreground"
            }`}
          >
            {index + 1}
          </span>
          <h3 className="mt-[18px] text-xl font-extrabold">{stripNumber(step.title)}</h3>
          <p className="mt-2.5 text-base leading-relaxed text-muted-foreground">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Grille d'informations ---------- */

export function InfoGrid({
  items,
  columns = 2,
  dark = false,
}: {
  items: { title: ReactNode; text: ReactNode; icon?: ReactNode; footer?: ReactNode }[];
  columns?: 2 | 3 | 4;
  dark?: boolean;
}) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <div className={`mt-10 grid gap-5 ${cols}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col rounded-[20px] p-6 sm:p-7 ${
            dark ? "bg-[#134A2B] text-white" : "border border-border bg-card text-brand-ink"
          }`}
        >
          {item.icon && (
            <span
              className={`mb-5 flex size-12 items-center justify-center rounded-[14px] ${
                dark ? `bg-white/10 ${onDarkAccent}` : "bg-brand-soft text-brand-ink"
              }`}
            >
              {item.icon}
            </span>
          )}
          <h3 className="text-[19px] font-extrabold">{item.title}</h3>
          <p className={`mt-2 text-base leading-relaxed ${dark ? onDarkMuted : "text-muted-foreground"}`}>
            {item.text}
          </p>
          {item.footer && <div className="mt-auto pt-4">{item.footer}</div>}
        </div>
      ))}
    </div>
  );
}

/* ---------- Liste à coches ---------- */

export function CheckList({
  items,
  dark = false,
  className = "",
}: {
  items: ReactNode[];
  dark?: boolean;
  className?: string;
}) {
  return (
    <ul className={`flex flex-col gap-3.5 ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 text-[17px] leading-snug">
          <Check
            className={`mt-0.5 size-[22px] shrink-0 ${dark ? onDarkAccent : "text-primary"}`}
            strokeWidth={2.6}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Tableau de prix ---------- */

export function PriceTable({
  caption,
  rows,
  columns = ["Situation", "Volume estimé", "Budget indicatif"],
  note,
}: {
  caption?: ReactNode;
  rows: { label: ReactNode; volume: ReactNode; price: ReactNode }[];
  columns?: [string, string, string];
  note?: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-[20px] bg-white px-6 pb-6 pt-3 sm:px-7">
      <table className="w-full min-w-[440px] border-collapse">
        {caption && (
          <caption className="pb-3 pt-4 text-left text-xl font-extrabold text-brand-ink">{caption}</caption>
        )}
        <thead>
          <tr className="text-sm text-muted-foreground">
            <th scope="col" className="pb-2.5 text-left font-bold">
              {columns[0]}
            </th>
            <th scope="col" className="pb-2.5 text-right font-bold">
              {columns[1]}
            </th>
            <th scope="col" className="pb-2.5 text-right font-bold">
              {columns[2]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-border">
              <td className="py-[15px] pr-4">{row.label}</td>
              <td className="py-[15px] pr-4 text-right tabular-nums text-muted-foreground">{row.volume}</td>
              <td className="py-[15px] text-right font-bold tabular-nums text-brand-ink">{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {note && <p className="mt-4 text-sm leading-normal text-muted-foreground">{note}</p>}
    </div>
  );
}

/* ---------- Avant / après ---------- */

export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      <figure className="relative">
        <img src={before} alt={beforeAlt} loading="lazy" className="aspect-[3/4] w-full rounded-[22px] object-cover" />
        <figcaption className="absolute bottom-3.5 left-3.5 rounded-full bg-white px-3.5 py-2 text-[15px] font-extrabold text-brand-ink">
          Avant
        </figcaption>
      </figure>
      <figure className="relative">
        <img src={after} alt={afterAlt} loading="lazy" className="aspect-[3/4] w-full rounded-[22px] object-cover" />
        <figcaption className="absolute bottom-3.5 left-3.5 rounded-full bg-brand-soft px-3.5 py-2 text-[15px] font-extrabold text-brand-ink">
          Après
        </figcaption>
      </figure>
    </div>
  );
}

/* ---------- FAQ ---------- */

export function FaqList({ items, twoColumns = true }: { items: { q: string; a: ReactNode }[]; twoColumns?: boolean }) {
  const half = Math.ceil(items.length / 2);
  const columns = twoColumns && items.length > 3 ? [items.slice(0, half), items.slice(half)] : [items];
  return (
    <div className={`mt-9 grid items-start gap-3.5 ${columns.length > 1 ? "md:grid-cols-2" : ""}`}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-3.5">
          {column.map((item, index) => (
            <details
              key={item.q}
              open={columnIndex === 0 && index === 0}
              className="group rounded-2xl border border-border bg-card px-[22px] open:border-primary"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[17px] font-bold text-brand-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus className="size-[22px] shrink-0 text-primary group-open:hidden" aria-hidden="true" />
                <Minus className="hidden size-[22px] shrink-0 text-primary group-open:block" aria-hidden="true" />
              </summary>
              <div className="pb-5 text-base leading-relaxed text-muted-foreground">{item.a}</div>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- Bandeau d'appel à l'action ---------- */

export function CtaBand({ title, text, children }: { title: ReactNode; text?: ReactNode; children: ReactNode }) {
  return (
    <section className="py-16 sm:py-24">
      <div className={wrap}>
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-[28px] bg-primary px-7 py-12 text-primary-foreground sm:px-14 sm:py-14">
          <div className="max-w-[34em]">
            <h2 className={`${h2Class} text-white`}>{title}</h2>
            {text && <p className="mt-3.5 text-lg leading-relaxed text-white/85">{text}</p>}
          </div>
          <div className="flex flex-wrap gap-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Liens vers les villes ---------- */

export function CityLinks({
  title,
  cities = CITIES.slice(0, 15),
}: {
  title: ReactNode;
  cities?: CityPage[];
}) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-brand-ink">{title}</h2>
      <ul className="mt-5 grid grid-cols-2 gap-x-6 border-t border-border pt-4 sm:grid-cols-3 lg:grid-cols-5">
        {cities.map((city) => (
          <li key={city.slug}>
            <Link
              to="/debarras/$ville"
              params={{ ville: city.slug }}
              className="block py-1.5 text-[15px] text-brand-ink hover:text-primary hover:underline"
            >
              Débarras {city.preposition}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/debarras" className="mt-5 inline-block font-bold text-primary hover:underline">
        Voir les {CITIES.length} villes
      </Link>
    </div>
  );
}

/* ---------- Bandeau de garanties ---------- */

export function ProofBand({ items }: { items: { icon: ReactNode; title: string; text: string }[] }) {
  return (
    <section className="bg-brand-ink py-9 text-white">
      <ul className={`${wrap} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
        {items.map((item) => (
          <li key={item.title} className="flex items-center gap-3.5">
            <span className={`shrink-0 ${onDarkAccent} [&_svg]:size-[30px]`} aria-hidden="true">
              {item.icon}
            </span>
            <span className="text-base leading-snug">
              <strong className="text-lg">{item.title}</strong>
              <br />
              <span className={onDarkMuted}>{item.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
