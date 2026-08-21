import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CalendarDays, Mail, MapPin, Phone, User } from "lucide-react";
import { MissionPhotoGallery } from "@/components/mission/mission-photo-gallery";
import { ProCompleteMission } from "@/components/pro/pro-complete-mission";
import { QuotePhotos } from "@/components/pro/quote-photos";
import type { BidWithQuote, QuoteContact } from "@/lib/pro-dashboard";
import { MISSION_STATUS_LABELS } from "@/lib/mission";
import { formatDate, isUpcoming, netOf, quoteTitle } from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";

export function MissionCard({
  bid,
  contact,
}: {
  bid: BidWithQuote;
  contact?: QuoteContact | undefined;
}) {
  const { data: dispute } = useQuery({
    queryKey: ["mission-dispute", bid.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("disputes")
        .select("*")
        .eq("bid_id", bid.id)
        .maybeSingle();
      return data;
    },
  });

  return (
    <article className="overflow-hidden rounded-[2rem] bg-white shadow-[var(--shadow-proposal)] ring-1 ring-proposal-emerald/10">
      <div className="flex flex-wrap items-start justify-between gap-3 bg-proposal-emerald p-6 text-proposal-cream">
        <div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
              bid.status === "disputed"
                ? "bg-destructive/20 text-destructive-foreground"
                : "bg-proposal-emerald-light/60 text-proposal-gold"
            }`}
          >
            {MISSION_STATUS_LABELS[bid.status] ?? bid.status}
          </span>
          <h3 className="font-display mt-3 text-xl font-bold">{quoteTitle(bid.quotes)}</h3>
          <p className="mt-2 flex flex-wrap items-center gap-4 font-body text-sm text-proposal-cream/80">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-proposal-gold" />{" "}
              {formatDate(bid.available_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-proposal-gold" /> {bid.quotes?.postal_code ?? "—"}{" "}
              {bid.quotes?.city ?? ""}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-extrabold">{euro(bid.price)}</p>
          <p className="text-[11px] text-proposal-cream/60">Net : {euro(netOf(bid.price))}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-2xl bg-proposal-cream/40 p-5">
          <p className="font-display text-sm font-bold text-proposal-emerald">
            Coordonnées du client
          </p>
          {contact ? (
            <div className="mt-3 grid gap-2 font-body text-sm text-muted-foreground sm:grid-cols-2">
              <span className="flex items-center gap-2">
                <User className="size-3.5 text-proposal-gold" /> {contact.full_name ?? "—"}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="size-3.5 text-proposal-gold" /> {contact.phone ?? "—"}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="size-3.5 text-proposal-gold" /> {contact.email ?? "—"}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-3.5 text-proposal-gold" /> {contact.address ?? "—"}
              </span>
            </div>
          ) : (
            <p className="mt-2 font-body text-sm text-muted-foreground">
              Coordonnées disponibles dès que le client a complété sa fiche.
            </p>
          )}
        </div>

        <QuotePhotos quoteId={bid.quote_id} />

        <MissionPhotoGallery bidId={bid.id} kind="completion" label="Vos photos de fin de chantier" />

        {dispute && (
          <div className="mt-4 rounded-2xl bg-destructive/10 p-4 text-sm">
            <p className="flex items-center gap-1.5 font-semibold text-destructive">
              <AlertTriangle className="size-4" /> Litige déclaré par le client
            </p>
            <p className="mt-1 text-muted-foreground">{dispute.reason}</p>
            <MissionPhotoGallery bidId={bid.id} kind="dispute" label="Photos du client" />
          </div>
        )}

        {bid.status === "accepted" && (
          <ProCompleteMission bidId={bid.id} quoteId={bid.quote_id} proId={bid.pro_id} />
        )}

        {bid.status === "awaiting_confirmation" && (
          <p className="mt-4 rounded-2xl bg-proposal-cream/40 p-4 font-body text-sm text-muted-foreground">
            En attente de la validation du client.
          </p>
        )}
      </div>
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
  const contactOf = (quoteId: string) => contacts.find((c) => c.quote_id === quoteId);

  const upcoming = bids
    .filter(
      (b) =>
        (b.status === "accepted" || b.status === "awaiting_confirmation") &&
        isUpcoming(b.available_date),
    )
    .sort((a, b) => (a.available_date ?? "9999").localeCompare(b.available_date ?? "9999"));

  if (upcoming.length === 0) {
    return (
      <p className="rounded-[2rem] border border-dashed border-proposal-emerald/20 bg-proposal-cream/30 p-10 text-center font-body text-sm text-muted-foreground">
        Aucune mission planifiée pour l'instant.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {upcoming.map((bid) => (
        <MissionCard
          key={bid.id}
          bid={bid}
          contact={bid.quote_id ? contactOf(bid.quote_id) : undefined}
        />
      ))}
    </div>
  );
}
