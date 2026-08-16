import { Wallet } from "lucide-react";
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

export function ProWallet({ bids }: { bids: BidWithQuote[] }) {
  const earning = bids.filter((b) => b.status === "accepted" || b.status === "completed");
  const done = earning.filter((b) => b.status === "completed");
  const pending = earning.filter((b) => b.status === "accepted");

  const gross = earning.reduce((sum, b) => sum + b.price, 0);
  const commission = earning.reduce((sum, b) => sum + commissionOf(b.price), 0);
  const paid = done.reduce((sum, b) => sum + netOf(b.price), 0);
  const upcoming = pending.reduce((sum, b) => sum + netOf(b.price), 0);
  const months = monthlyRevenue(earning);
  const best = Math.max(1, ...months.map((m) => m.gross));

  return (
    <div className="space-y-8">
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
                      {euro(month.gross - commissionOf(month.gross))} net
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
                      −{euro(commissionOf(bid.price))}
                    </td>
                    <td className="py-2.5 text-right font-semibold">{euro(netOf(bid.price))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Les paiements sont réglés directement par le client à la fin de la mission. La commission
          Clearo est facturée mensuellement.
        </p>
      </section>
    </div>
  );
}
