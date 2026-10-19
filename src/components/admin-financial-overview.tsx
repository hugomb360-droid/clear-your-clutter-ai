import { ArrowDown, ArrowRight, Banknote, CircleCheck, FileClock, LockKeyhole, TrendingUp } from 'lucide-react';
import type { adminFinance } from '@/lib/admin-finance';
import { euro } from '@/lib/pricing';

export function AdminFinancialOverview({ finance }: { finance: ReturnType<typeof adminFinance> }) {
  const steps = [
    { icon: FileClock, label: 'Estimations en attente', value: euro(finance.estimatedValue), detail: `${finance.waitingCount} demande(s) sans proposition`, note: `Fourchette : ${euro(finance.estimatedMin)} – ${euro(finance.estimatedMax)}${finance.unestimatedCount ? ` · ${finance.unestimatedCount} sans prix` : ''}`, tone: 'bg-admin-pipeline/10 text-admin-pipeline', tag: 'Potentiel estimé' },
    { icon: LockKeyhole, label: 'Fonds bloqués', value: euro(finance.heldTotal), detail: `${finance.heldCount} paiement(s) en attente de libération`, note: 'Montant intégral payé par les clients', tone: 'bg-admin-hold/10 text-admin-hold', tag: 'En attente de fin de chantier' },
    { icon: CircleCheck, label: 'Versé aux professionnels', value: euro(finance.paidTotal), detail: `${finance.paidCount} transfert(s) confirmé(s)`, note: 'Net de commission · versé au compte Stripe pro', tone: 'bg-primary/10 text-brand-ink', tag: 'Transferts effectués' },
  ];
  return <section aria-label="Circuit financier" className="mt-8">
    <div className="mb-4 flex items-center gap-2"><Banknote className="size-5 text-brand-ink" /><h2 className="font-display text-xl font-bold">Le circuit de votre activité</h2></div>
    <div className="grid items-center gap-3 lg:grid-cols-[1fr_32px_1fr_32px_1fr]">
      {steps.map((step, i) => <div key={step.label} className="contents">
        {i > 0 && <div className="flex justify-center text-muted-foreground"><ArrowRight className="hidden size-6 lg:block" /><ArrowDown className="size-5 lg:hidden" /></div>}
        <article className="flex min-h-64 flex-col rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between"><span className={`flex size-11 items-center justify-center rounded-lg ${step.tone}`}><step.icon className="size-5" /></span><span className="font-display text-sm font-bold text-muted-foreground">0{i + 1}</span></div>
          <p className="mt-5 text-sm font-semibold text-muted-foreground">{step.label}</p>
          <p className="mt-1 break-words font-display text-3xl font-extrabold tabular-nums">{step.value}</p>
          <p className="mt-2 text-sm font-medium">{step.detail}</p>
          <div className="mt-auto pt-5"><p className={`w-fit rounded-md px-2 py-1 text-[11px] font-semibold ${step.tone}`}>{step.tag}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.note}</p></div>
        </article>
      </div>)}
    </div>
    <p className="mt-3 text-xs text-muted-foreground">Estimations : moyenne des fourchettes disponibles, pas un encaissement. Versements Stripe confirmés, pas une confirmation d’arrivée sur l’IBAN.</p>
    <div className="mt-8 grid gap-6 border-y border-border py-6 sm:grid-cols-[1.3fr_1fr_1fr]">
      <div><div className="flex items-center gap-2 text-brand-ink"><TrendingUp className="size-5" /><h2 className="font-semibold">Chiffre d’affaires du site</h2></div><p className="mt-2 font-display text-4xl font-extrabold tabular-nums">{euro(finance.commission)}</p><p className="mt-2 text-xs text-muted-foreground">Commissions des paiements libérés, hors remboursements.<br />Avant frais Stripe, charges et taxes.</p></div>
      <div className="sm:border-l sm:border-border sm:pl-6"><p className="text-sm text-muted-foreground">Commissions en attente</p><p className="mt-2 font-display text-2xl font-bold tabular-nums">{euro(finance.pendingCommission)}</p><p className="mt-2 text-xs text-muted-foreground">Sur les fonds encore bloqués · non comptées dans le CA.</p></div>
      <div className="sm:border-l sm:border-border sm:pl-6"><p className="text-sm text-muted-foreground">Paiements clients cumulés</p><p className="mt-2 font-display text-2xl font-bold tabular-nums">{euro(finance.collectedTotal)}</p><p className="mt-2 text-xs text-muted-foreground">Bloqués + libérés, hors remboursements.</p></div>
    </div>
  </section>;
}