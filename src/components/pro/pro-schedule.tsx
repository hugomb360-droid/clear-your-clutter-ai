import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CalendarDays, Clock, Mail, MapPin, Phone, User } from "lucide-react";
import { MissionPhotoGallery } from "@/components/mission/mission-photo-gallery";
import { ProCompleteMission } from "@/components/pro/pro-complete-mission";
import { QuotePhotos } from "@/components/pro/quote-photos";
import { EmptyState, Notice, StatusPill } from "@/components/space/space-kit";
import { bidTone } from "@/components/space/tones";
import type { BidWithQuote, QuoteContact } from "@/lib/pro-dashboard";
import { MISSION_STATUS_LABELS } from "@/lib/mission";
import { formatDate, isUpcoming, netOf, quoteTitle } from "@/lib/pro-dashboard";
import { euro } from "@/lib/pricing";
import { useFoundingStatus } from "@/hooks/useFoundingStatus";
import { supabase } from "@/integrations/supabase/client";
import { SuccessionDetails, MissionReportDownload } from "@/components/succession/mission-report";

const contactLink =
  "font-semibold text-brand-ink underline-offset-4 hover:text-primary hover:underline";

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

  const freeMission = useFoundingStatus().freeRemaining > 0;

  const mapsUrl = contact?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`
    : null;

  return (
    <article className="rounded-3xl border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 sm:p-6">
        <div className="min-w-0">
          <StatusPill tone={bidTone(bid.status)}>
            {MISSION_STATUS_LABELS[bid.status] ?? bid.status}
          </StatusPill>
          <h3 className="mt-2.5 text-[19px] font-extrabold leading-tight text-brand-ink">
            {quoteTitle(bid.quotes)}
          </h3>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4 text-primary" aria-hidden="true" />
              {formatDate(bid.available_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              {bid.quotes?.postal_code ?? "—"} {bid.quotes?.city ?? ""}
            </span>
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[26px] font-black leading-none tracking-[-0.02em] text-brand-ink tabular-nums">
            {euro(bid.price)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Net : {euro(netOf(bid.price, freeMission))}
          </p>
        </div>
      </div>

      <div className="border-t border-border p-5 sm:p-6">
        <div className="rounded-2xl bg-brand-soft/60 p-4">
          <p className="text-sm font-extrabold text-brand-ink">Coordonnées du client</p>
          {contact ? (
            <ul className="mt-3 grid gap-2.5 text-sm sm:grid-cols-2">
              <li className="flex items-center gap-2 text-brand-ink">
                <User className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {contact.full_name ?? "—"}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {contact.phone ? (
                  <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className={contactLink}>
                    {contact.phone}
                  </a>
                ) : (
                  "—"
                )}
              </li>
              <li className="flex min-w-0 items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className={`${contactLink} truncate`}>
                    {contact.email}
                  </a>
                ) : (
                  "—"
                )}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {mapsUrl ? (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={contactLink}
                  >
                    {contact.address}
                  </a>
                ) : (
                  "—"
                )}
              </li>
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Coordonnées disponibles dès que le client a complété sa fiche.
            </p>
          )}
        </div>

        <QuotePhotos quoteId={bid.quote_id} />
        <SuccessionDetails quoteId={bid.quote_id} />
        <MissionReportDownload bidId={bid.id} quoteId={bid.quote_id} status={bid.status} />

        <MissionPhotoGallery
          bidId={bid.id}
          kind="completion"
          label="Vos photos de fin de chantier"
        />

        {dispute && (
          <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p className="flex items-center gap-1.5 font-bold text-destructive">
              <AlertTriangle className="size-4" aria-hidden="true" /> Litige déclaré par le client
            </p>
            <p className="mt-1 text-foreground">{dispute.reason}</p>
            <MissionPhotoGallery bidId={bid.id} kind="dispute" label="Photos du client" />
          </div>
        )}

        {bid.status === "accepted" && (
          <ProCompleteMission bidId={bid.id} quoteId={bid.quote_id} proId={bid.pro_id} />
        )}

        {bid.status === "awaiting_confirmation" && (
          <div className="mt-4">
            <Notice tone="info" icon={Clock}>
              Fin de chantier envoyée. En attente de la validation du client.
            </Notice>
          </div>
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
    return <EmptyState icon={CalendarDays} title="Aucune mission planifiée pour l'instant" />;
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
