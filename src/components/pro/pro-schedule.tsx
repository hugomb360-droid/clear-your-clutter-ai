import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, Mail, MapPin, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { BidWithQuote, QuoteContact } from "@/lib/pro-dashboard";
import { formatDate, isUpcoming, netOf, quoteTitle } from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";

function MissionCard({
  bid,
  contact,
  onComplete,
}: {
  bid: BidWithQuote;
  contact?: QuoteContact | undefined;
  onComplete: (id: string) => void;
}) {
  return (
    <article className="rounded-3xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{quoteTitle(bid.quotes)}</h3>
            <Badge variant={bid.status === "completed" ? "outline" : "default"}>
              {bid.status === "completed" ? "Terminée" : "Confirmée"}
            </Badge>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" /> {formatDate(bid.available_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {bid.quotes?.postal_code ?? "—"}{" "}
              {bid.quotes?.city ?? ""}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-extrabold">{euro(bid.price)}</p>
          <p className="text-xs text-muted-foreground">Net : {euro(netOf(bid.price))}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-secondary/60 p-4 text-sm">
        <p className="font-semibold">Coordonnées du client</p>
        {contact ? (
          <div className="mt-2 grid gap-1.5 text-muted-foreground sm:grid-cols-2">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5" /> {contact.full_name ?? "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5" /> {contact.phone ?? "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5" /> {contact.email ?? "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {contact.address ?? "—"}
            </span>
          </div>
        ) : (
          <p className="mt-1 text-muted-foreground">
            Coordonnées disponibles dès que le client a complété sa fiche.
          </p>
        )}
      </div>

      {bid.status === "accepted" && (
        <Button className="mt-4 gap-2" variant="outline" onClick={() => onComplete(bid.id)}>
          <CheckCircle2 className="size-4" /> Marquer la mission comme terminée
        </Button>
      )}
    </article>
  );
}

export function ProSchedule({
  bids,
  contacts,
}: {
  bids: BidWithQuote[];
  contacts: QuoteContact[];
}) {
  const queryClient = useQueryClient();
  const contactOf = (quoteId: string) => contacts.find((c) => c.quote_id === quoteId);

  const complete = async (bidId: string) => {
    const { error } = await supabase.from("bids").update({ status: "completed" }).eq("id", bidId);
    if (error) {
      toast.error("Mise à jour impossible", { description: error.message });
      return;
    }
    toast.success("Mission marquée comme terminée");
    void queryClient.invalidateQueries({ queryKey: ["pro-bids"] });
  };

  const upcoming = bids
    .filter((b) => b.status === "accepted" && isUpcoming(b.available_date))
    .sort((a, b) => (a.available_date ?? "9999").localeCompare(b.available_date ?? "9999"));
  const past = bids
    .filter((b) => b.status === "completed" || (b.status === "accepted" && !isUpcoming(b.available_date)))
    .sort((a, b) => (b.available_date ?? "").localeCompare(a.available_date ?? ""));

  if (bids.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-border p-8 text-sm text-muted-foreground">
        Votre planning est vide. Dès qu'un client accepte une proposition, la mission et ses
        coordonnées apparaissent ici.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          À venir ({upcoming.length})
        </h3>
        <div className="mt-4 space-y-4">
          {upcoming.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune mission planifiée.</p>
          )}
          {upcoming.map((bid) => (
            <MissionCard
              key={bid.id}
              bid={bid}
              contact={bid.quote_id ? contactOf(bid.quote_id) : undefined}
              onComplete={complete}
            />
          ))}
        </div>
      </section>

      {past.length > 0 && (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Historique ({past.length})
          </h3>
          <div className="mt-4 space-y-4">
            {past.map((bid) => (
              <MissionCard
                key={bid.id}
                bid={bid}
                contact={bid.quote_id ? contactOf(bid.quote_id) : undefined}
                onComplete={complete}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
