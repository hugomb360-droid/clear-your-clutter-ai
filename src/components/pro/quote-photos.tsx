import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

async function loadPhotos(quoteId: string) {
  const { data, error } = await supabase
    .from("quote_photos")
    .select("id, storage_path")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  const rows = data ?? [];
  if (rows.length === 0) return [] as { id: string; url: string }[];

  const { data: signed, error: signError } = await supabase.storage
    .from("quote-photos")
    .createSignedUrls(
      rows.map((row) => row.storage_path),
      60 * 60,
    );
  if (signError) throw signError;

  return rows
    .map((row, index) => ({ id: row.id, url: signed?.[index]?.signedUrl ?? "" }))
    .filter((photo) => photo.url.length > 0);
}

export function QuotePhotos({ quoteId }: { quoteId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["quote-photos", quoteId],
    queryFn: () => loadPhotos(quoteId),
    staleTime: 30 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="mt-4 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="size-24 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  const photos = data ?? [];
  if (photos.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <ImageIcon className="size-3.5" /> Photos du client ({photos.length})
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {photos.map((photo) => (
          <a
            key={photo.id}
            href={photo.url}
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded-2xl border border-border transition hover:opacity-90"
          >
            <img
              src={photo.url}
              alt="Objets à débarrasser envoyés par le client"
              loading="lazy"
              className="size-24 object-cover"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
