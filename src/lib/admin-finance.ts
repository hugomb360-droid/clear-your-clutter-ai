import type { Tables } from '@/integrations/supabase/types';

type Quote = Pick<Tables<'quotes'>, 'status' | 'price_min' | 'price_max'> & { bids?: { status: string }[] };
type Payment = Pick<Tables<'payments'>, 'status' | 'environment' | 'amount_total' | 'commission_amount' | 'pro_amount' | 'stripe_transfer_id' | 'transfer_error'>;

/** Estimates are euros; payment ledger amounts are cents. Never infer a transfer from completion. */
export function adminFinance(quotes: Quote[], payments: Payment[], environment: string) {
  const waiting = quotes.filter(q => q.status === 'published' && !(q.bids ?? []).some(b => !['withdrawn', 'refused'].includes(b.status)));
  const estimated = waiting.filter(q => q.price_min != null && q.price_max != null);
  const ledger = payments.filter(p => p.environment === environment && p.status !== 'refunded');
  const held = ledger.filter(p => p.status === 'held');
  const released = ledger.filter(p => p.status === 'released');
  const transferred = released.filter(p => Boolean(p.stripe_transfer_id));
  const sum = (rows: Payment[], field: 'amount_total' | 'commission_amount' | 'pro_amount') => rows.reduce((s, p) => s + p[field], 0) / 100;
  return {
    waitingCount: waiting.length,
    unestimatedCount: waiting.length - estimated.length,
    estimatedMin: estimated.reduce((s, q) => s + (q.price_min ?? 0), 0),
    estimatedMax: estimated.reduce((s, q) => s + (q.price_max ?? 0), 0),
    estimatedValue: estimated.reduce((s, q) => s + ((q.price_min ?? 0) + (q.price_max ?? 0)) / 2, 0),
    heldCount: held.length, heldTotal: sum(held, 'amount_total'),
    paidCount: transferred.length, paidTotal: sum(transferred, 'pro_amount'),
    commission: sum(released, 'commission_amount'),
    pendingCommission: sum(held, 'commission_amount'),
    collectedTotal: sum([...held, ...released], 'amount_total'),
    transferPending: released.filter(p => !p.stripe_transfer_id).length,
    transferErrors: ledger.filter(p => Boolean(p.transfer_error) && !p.stripe_transfer_id).length,
  };
}