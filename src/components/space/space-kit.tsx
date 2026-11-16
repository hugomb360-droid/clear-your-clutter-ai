/**
 * Briques partagées par l'espace pro et l'espace client.
 * Même direction artistique que les pages publiques (vert du site, Figtree, coins arrondis),
 * en plus compact : ce sont des écrans de travail, pas des pages de présentation.
 */
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export const spaceWrap = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8";

const sBtnBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-bright focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";
export const sBtnPrimary = `${sBtnBase} bg-primary text-primary-foreground hover:bg-primary/90`;
export const sBtnOutline = `${sBtnBase} border-2 border-brand-ink/80 text-brand-ink hover:bg-brand-ink hover:text-white`;
export const sBtnSoft = `${sBtnBase} bg-brand-soft text-brand-ink hover:bg-brand-soft/70`;
export const sBtnGhost = `${sBtnBase} text-brand-ink hover:bg-brand-soft`;
export const sBtnDanger = `${sBtnBase} border-2 border-destructive/70 text-destructive hover:bg-destructive hover:text-white`;

export const fieldClass = "h-11 rounded-xl";

export function SpaceCard({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "div" | "li";
}) {
  return (
    <Tag className={`rounded-3xl border border-border bg-card p-5 sm:p-6 ${className}`}>
      {children}
    </Tag>
  );
}

export function SectionHead({
  title,
  count,
  hint,
  action,
}: {
  title: string;
  count?: number | undefined;
  hint?: string | undefined;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[20px] font-extrabold leading-tight tracking-[-0.01em] text-brand-ink sm:text-[22px]">
          {title}
          {count != null && <span className="ml-2 text-primary tabular-nums">{count}</span>}
        </h2>
        {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-brand-soft/40 px-6 py-10 text-center">
      <Icon className="mx-auto size-7 text-primary" aria-hidden="true" />
      <p className="mt-3 font-bold text-brand-ink">{title}</p>
      {text && (
        <p className="mx-auto mt-1 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
          {text}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

import type { Tone } from "@/components/space/tones";

const PILL_TONES: Record<Tone, string> = {
  neutral: "bg-secondary text-secondary-foreground",
  green: "bg-brand-soft text-primary",
  amber: "bg-amber-100 text-amber-900",
  red: "bg-destructive/10 text-destructive",
  dark: "bg-brand-ink text-white",
};

export function StatusPill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${PILL_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

const NOTICE_TONES = {
  info: "border-border bg-brand-soft/60 text-brand-ink",
  success: "border-primary/30 bg-brand-soft text-brand-ink",
  warn: "border-amber-300 bg-amber-50 text-amber-950",
  danger: "border-destructive/30 bg-destructive/5 text-foreground",
} as const;

export function Notice({
  tone = "info",
  icon: Icon,
  children,
  action,
}: {
  tone?: keyof typeof NOTICE_TONES;
  icon?: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-4 text-sm leading-relaxed sm:flex-row sm:items-center sm:justify-between ${NOTICE_TONES[tone]}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon && <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
        <div className="min-w-0">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Ligne « libellé : valeur » pour les fiches récapitulatives. */
export function Facts({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-border text-sm">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline justify-between gap-4 py-2.5">
          <dt className="shrink-0 text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 text-right font-semibold text-brand-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SpaceLoading() {
  return (
    <div className={`${spaceWrap} py-16`} role="status" aria-live="polite">
      <div className="h-8 w-56 animate-pulse rounded-full bg-secondary" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-3xl bg-secondary" />
        ))}
      </div>
      <span className="sr-only">Chargement…</span>
    </div>
  );
}
