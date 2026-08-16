import type { LucideIcon } from "lucide-react";
import { CalendarCheck, Send, Sparkles, Wallet } from "lucide-react";
import type { BidWithQuote } from "@/lib/pro-dashboard";
import { isUpcoming, netOf } from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="size-4.5" />
      </span>
      <p className="mt-3 text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function ProStats({
  opportunities,
  bids,
}: {
  opportunities: number;
  bids: BidWithQuote[];
}) {
  const pending = bids.filter((b) => b.status === "pending");
  const accepted = bids.filter((b) => b.status === "accepted");
  const done = bids.filter((b) => b.status === "completed");
  const upcoming = accepted.filter((b) => isUpcoming(b.available_date));
  const net = [...accepted, ...done].reduce((sum, b) => sum + netOf(b.price), 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Sparkles}
        label="Nouvelles demandes"
        value={String(opportunities)}
        hint="Dans vos zones, sans proposition de votre part"
      />
      <StatCard
        icon={Send}
        label="Propositions en attente"
        value={String(pending.length)}
        hint="En cours d'examen par les clients"
      />
      <StatCard
        icon={CalendarCheck}
        label="Missions à venir"
        value={String(upcoming.length)}
        hint={`${done.length} mission(s) déjà terminée(s)`}
      />
      <StatCard
        icon={Wallet}
        label="Revenus nets"
        value={euro(net)}
        hint="Missions acceptées et terminées, commission déduite"
      />
    </div>
  );
}
