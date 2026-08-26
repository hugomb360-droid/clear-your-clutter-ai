import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { AlertTriangle, BadgeCheck, Gift, Lock, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useFoundingStatus } from "@/hooks/useFoundingStatus";
import { getPayoutStatus } from "@/lib/payouts.functions";
import { getStripeEnvironment, paymentsConfigured } from "@/lib/stripe";
import type { BidWithQuote } from "@/lib/pro-dashboard";

import {
  CLEARO_COMMISSION_RATE,
  commissionOf,
  formatDate,
  monthlyRevenue,
  netOf,
  quoteTitle,
} from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";

const PAYMENT_LABELS: Record<string, string> = {
  pending: "Paiement en attente",
  held: "Fonds bloqués",
  released: "Versé",
  refunded: "Remboursé",
  failed: "Échec",
};

export function ProWallet({ bids }: { bids: BidWithQuote[] }) {
  const paymentsQuery = useQuery({
    queryKey: ["pro-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("bid_id, status, pro_amount, commission_amount, transfer_error");
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((p) => [p.bid_id, p]));
    },
  });
  const payoutQuery = useQuery({
    queryKey: ["pro-payout-status"],
    enabled: paymentsConfigured(),
    queryFn: async () => {
      const res = await getPayoutStatus({ data: { environment: getStripeEnvironment() } });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
  });
  const payoutsReady = Boolean(payoutQuery.data?.payoutsEnabled);
  const payments = paymentsQuery.data ?? {};
  const transferIssue = Object.values(payments).find((p) => p.transfer_error);
  const founding = useFoundingStatus();

  const freeMission = founding.freeRemaining > 0;
  const rowCommission = (bidId: string, price: number) =>
    payments[bidId] ? payments[bidId].commission_amount / 100 : commissionOf(price, freeMission);
  const secured = Object.values(payments)
    .filter((p) => p.status === "held")
    .reduce((sum, p) => sum + p.pro_amount / 100, 0);
  const earning = bids.filter((b) => b.status === "accepted" || b.status === "completed");
  const done = earning.filter((b) => b.status === "completed");
  const pending = earning.filter((b) => b.status === "accepted");

  const gross = earning.reduce((sum, b) => sum + b.price, 0);
  const commission = earning.reduce((sum, b) => sum + rowCommission(b.id, b.price), 0);
  const paid = done.reduce((sum, b) => sum + b.price - rowCommission(b.id, b.price), 0);
  const upcoming = pending.reduce((sum, b) => sum + b.price - rowCommission(b.id, b.price), 0);
  const months = monthlyRevenue(earning);
  const best = Math.max(1, ...months.map((m) => m.gross));

  return (
    <div className="space-y-8">
      {founding.isFounding && (
        <div className="flex items-start gap-3 rounded-2xl border border-proposal-emerald/30 bg-proposal-emerald/5 p-4">
          <Gift className="mt-0.5 size-4 shrink-0 text-proposal-emerald" />
          <p className="text-sm leading-relaxed text-proposal-emerald">
            <strong>Offre fondateur</strong> — vous faites partie des 20 premiers pros Clearo :{" "}
            {founding.freeRemaining > 0 ? (
              <>
                <strong>
                  {founding.freeRemaining} chantier{founding.freeRemaining > 1 ? "s" : ""} sans
                  aucune commission
                </strong>{" "}
                ({founding.paidMissions}/5 utilisés). Vous encaissez 100 % du montant.
              </>
            ) : (
              <>vos 5 chantiers offerts ont été utilisés, commission standard de 12 % désormais.</>
            )}
          </p>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-proposal-gold/40 bg-proposal-gold/10 p-4">
        <Lock className="mt-0.5 size-4 shrink-0 text-proposal-emerald" />
        <p className="text-sm leading-relaxed text-proposal-emerald">
          <strong>{euro(secured)} sécurisés</strong> par Clearo pour vos missions en cours. Le
          client paie l'intégralité à l'acceptation du devis : vous êtes certain d'être payé, et les
          fonds sont virés sur votre compte bancaire dès la validation de fin de chantier.{" "}
          <Link to="/pro/parametres" className="font-semibold underline underline-offset-2">
            Renseignez votre IBAN dans vos paramètres
          </Link>{" "}
          pour recevoir vos virements.
        </p>
      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Chiffre d'affaires", value: euro(gross), hint: `${earning.length} mission(s)` },
          {
            label: "Commission Clearo",
            value: euro(commission),
            hint: `${Math.round(CLEARO_COMMISSION_RATE * 100)} % par mission`,
          },
          { label: "Encaissé", value: euro(paid), hint: `${done.length} mission(s) terminée(s)` },
          { label: "À venir", value: euro(upcoming), hint: `${pending.length} mission(s) à réaliser` },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 font-bold">
          <Wallet className="size-4 text-primary" /> Revenus par mois
        </h3>
        {months.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Aucun revenu pour l'instant. Vos missions acceptées apparaîtront ici.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {months.map((month) => (
              <div key={month.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{month.label}</span>
                  <span className="text-muted-foreground">
                    {month.count} mission(s) · {euro(month.gross)} brut ·{" "}
                    <span className="font-semibold text-foreground">
                      {euro(month.gross - commissionOf(month.gross, freeMission))} net
                    </span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.round((month.gross / best) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-border bg-card p-6">
        <h3 className="font-bold">Détail des transactions</h3>
        {earning.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Aucune transaction.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2">Mission</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">Montant</th>
                  <th className="pb-2 text-right">Commission</th>
                  <th className="pb-2 text-right">Net</th>
                  <th className="pb-2 text-right">Paiement</th>
                </tr>
              </thead>
              <tbody>
                {earning.map((bid) => (
                  <tr key={bid.id} className="border-t border-border">
                    <td className="py-2.5 pr-3">{quoteTitle(bid.quotes)}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">
                      {formatDate(bid.available_date)}
                    </td>
                    <td className="py-2.5 text-right">{euro(bid.price)}</td>
                    <td className="py-2.5 text-right text-muted-foreground">
                      −{euro(rowCommission(bid.id, bid.price))}
                    </td>
                    <td className="py-2.5 text-right font-semibold">
                      {euro(bid.price - rowCommission(bid.id, bid.price))}
                    </td>
                    <td className="py-2.5 text-right text-xs text-muted-foreground">
                      {PAYMENT_LABELS[payments[bid.id]?.status ?? ""] ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Les clients règlent 100 % du montant à l'acceptation du devis via le paiement sécurisé
          Clearo. Les fonds sont bloqués puis libérés vers vous dès la validation du chantier,
          commission Clearo déjà déduite.
        </p>
      </section>
    </div>
  );
}
