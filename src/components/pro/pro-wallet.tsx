import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, BadgeCheck, Gift, Lock } from "lucide-react";
import { Notice, SpaceCard, StatusPill, sBtnPrimary } from "@/components/space/space-kit";
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

const PAYMENT_TONES: Record<string, "neutral" | "green" | "amber" | "red" | "dark"> = {
  pending: "neutral",
  held: "amber",
  released: "green",
  refunded: "red",
  failed: "red",
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

  const tiles = [
    { label: "Chiffre d'affaires", value: euro(gross), hint: `${earning.length} mission(s)` },
    {
      label: "Commission",
      value: euro(commission),
      hint: `${Math.round(CLEARO_COMMISSION_RATE * 100)} % par mission`,
    },
    { label: "Encaissé", value: euro(paid), hint: `${done.length} mission(s) terminée(s)` },
    { label: "À venir", value: euro(upcoming), hint: `${pending.length} mission(s) à réaliser` },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {founding.isFounding && (
          <Notice tone="success" icon={Gift}>
            <strong>Offre fondateur.</strong>{" "}
            {founding.freeRemaining > 0 ? (
              <>
                Il vous reste{" "}
                <strong>
                  {founding.freeRemaining} chantier{founding.freeRemaining > 1 ? "s" : ""} sans
                  commission
                </strong>{" "}
                ({founding.paidMissions}/5 utilisés). Vous encaissez 100 % du montant.
              </>
            ) : (
              <>Vos 5 chantiers offerts sont utilisés, la commission est maintenant de 12 %.</>
            )}
          </Notice>
        )}

        {paymentsConfigured() &&
          (payoutsReady ? (
            <Notice tone="success" icon={BadgeCheck}>
              Coordonnées bancaires validées
              {payoutQuery.data?.bankLast4 ? ` (IBAN •••• ${payoutQuery.data.bankLast4})` : ""}. Vos
              virements partent à chaque fin de chantier validée.
            </Notice>
          ) : (
            <Notice
              tone="danger"
              icon={AlertTriangle}
              action={
                <Link to="/pro/parametres" hash="versements" className={sBtnPrimary}>
                  Configurer mon IBAN
                </Link>
              }
            >
              <strong>Vous ne pouvez pas encore recevoir vos paiements.</strong> Renseignez votre
              IBAN pour débloquer les virements.
            </Notice>
          ))}

        {transferIssue?.transfer_error && (
          <Notice tone="danger" icon={AlertTriangle}>
            Un virement n'a pas pu être effectué : {transferIssue.transfer_error} Corrigez vos
            informations bancaires, le virement sera relancé automatiquement.
          </Notice>
        )}

        <Notice tone="info" icon={Lock}>
          <strong>{euro(secured)} bloqués</strong> pour vos missions en cours. Le client paie à
          l'acceptation ; le montant net vous est viré dès qu'il valide la fin du chantier.
        </Notice>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {tiles.map((item) => (
          <div key={item.label} className="rounded-3xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
            <p className="mt-1.5 text-[26px] font-black leading-none tracking-[-0.02em] text-brand-ink tabular-nums">
              {item.value}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">{item.hint}</p>
          </div>
        ))}
      </div>

      <SpaceCard>
        <h3 className="text-[17px] font-extrabold text-brand-ink">Revenus par mois</h3>
        {months.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Aucun revenu pour l'instant. Vos missions acceptées apparaîtront ici.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {months.map((month) => (
              <li key={month.key}>
                <div className="flex flex-wrap items-center justify-between gap-x-4 text-sm">
                  <span className="font-bold capitalize text-brand-ink">{month.label}</span>
                  <span className="text-muted-foreground">
                    {month.count} mission(s) · {euro(month.gross)} brut ·{" "}
                    <span className="font-bold text-brand-ink">
                      {euro(month.gross - commissionOf(month.gross, freeMission))} net
                    </span>
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 rounded-full bg-brand-soft">
                  <div
                    className="h-2.5 rounded-full bg-primary"
                    style={{ width: `${Math.round((month.gross / best) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </SpaceCard>

      <SpaceCard>
        <h3 className="text-[17px] font-extrabold text-brand-ink">Détail des transactions</h3>
        {earning.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Aucune transaction.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[38rem] text-sm">
              <thead className="text-left text-xs font-bold text-muted-foreground">
                <tr>
                  <th scope="col" className="pb-2 font-bold">
                    Mission
                  </th>
                  <th scope="col" className="pb-2 font-bold">
                    Date
                  </th>
                  <th scope="col" className="pb-2 text-right font-bold">
                    Montant
                  </th>
                  <th scope="col" className="pb-2 text-right font-bold">
                    Commission
                  </th>
                  <th scope="col" className="pb-2 text-right font-bold">
                    Net
                  </th>
                  <th scope="col" className="pb-2 text-right font-bold">
                    Paiement
                  </th>
                </tr>
              </thead>
              <tbody>
                {earning.map((bid) => {
                  const status = payments[bid.id]?.status ?? "";
                  return (
                    <tr key={bid.id} className="border-t border-border">
                      <td className="py-3 pr-3 font-semibold text-brand-ink">
                        {quoteTitle(bid.quotes)}
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground">
                        {formatDate(bid.available_date)}
                      </td>
                      <td className="py-3 text-right tabular-nums">{euro(bid.price)}</td>
                      <td className="py-3 text-right tabular-nums text-muted-foreground">
                        −{euro(rowCommission(bid.id, bid.price))}
                      </td>
                      <td className="py-3 text-right font-bold tabular-nums text-brand-ink">
                        {euro(bid.price - rowCommission(bid.id, bid.price))}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        {PAYMENT_LABELS[status] ? (
                          <StatusPill tone={PAYMENT_TONES[status] ?? "neutral"}>
                            {PAYMENT_LABELS[status]}
                          </StatusPill>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SpaceCard>
    </div>
  );
}
