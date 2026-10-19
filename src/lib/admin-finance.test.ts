import { describe, expect, it } from 'vitest';
import { adminFinance } from './admin-finance';
const payment = (changes = {}) => ({ status: 'held', environment: 'live', amount_total: 100000, commission_amount: 12000, pro_amount: 88000, stripe_transfer_id: null, transfer_error: null, ...changes });
describe('administrator financial rules', () => {
  it('values unanswered published estimates at their midpoint, excluding answered and matched quotes', () => {
    const result = adminFinance([{ status: 'published', price_min: 900, price_max: 1500, bids: [] }, { status: 'published', price_min: 100, price_max: 200, bids: [{ status: 'pending' }] }, { status: 'matched', price_min: 900, price_max: 1500 }, { status: 'published', price_min: null, price_max: null }], [], 'live');
    expect(result.estimatedValue).toBe(1200); expect(result.waitingCount).toBe(2); expect(result.unestimatedCount).toBe(1);
  });
  it('counts only held payments as blocked money and converts cents into euros', () => {
    expect(adminFinance([], [payment(), payment({ status: 'pending' }), payment({ status: 'refunded' })], 'live').heldTotal).toBe(1000);
  });
  it('counts money received by pros only with a recorded Stripe transfer', () => {
    const result = adminFinance([], [payment({ status: 'released' }), payment({ status: 'released', stripe_transfer_id: 'tr_123' })], 'live');
    expect(result.paidTotal).toBe(880); expect(result.transferPending).toBe(1);
  });
  it('uses actual commission amounts, including zero commission launch missions', () => {
    const result = adminFinance([], [payment({ status: 'released' }), payment({ status: 'released', commission_amount: 0 }), payment()], 'live');
    expect(result.commission).toBe(120); expect(result.pendingCommission).toBe(120);
  });
  it('never mixes real and sandbox payments or refunded commissions', () => {
    expect(adminFinance([], [payment({ status: 'released', environment: 'sandbox' }), payment({ status: 'refunded' })], 'live').commission).toBe(0);
  });
});