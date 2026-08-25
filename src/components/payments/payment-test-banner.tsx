const clientToken = import.meta.env['VITE_PAYMENTS_CLIENT_TOKEN'] as string | undefined;

export function PaymentTestModeBanner() {
  if (!clientToken) {
    return (
      <div className="w-full border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
        Le paiement en ligne n'est pas encore activé en production.
      </div>
    );
  }
  if (clientToken.startsWith("pk_test_")) {
    return (
      <div className="w-full border-b border-proposal-gold/40 bg-proposal-gold/15 px-4 py-2 text-center text-xs font-medium text-proposal-emerald">
        Mode test : aucun paiement réel n'est encaissé (carte de test 4242 4242 4242 4242).
      </div>
    );
  }
  return null;
}
