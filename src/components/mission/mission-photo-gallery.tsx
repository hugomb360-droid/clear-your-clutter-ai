import { useQuery } from "@tanstack/react-query";
import { loadMissionPhotos, type MissionPhotoKind } from "@/lib/mission";

export function MissionPhotoGallery({
  bidId,
  kind,
  label,
}: {
  bidId: string;
  kind: MissionPhotoKind;
  label: string;
}) {
  const { data } = useQuery({
    queryKey: ["mission-photos", bidId, kind],
    queryFn: () => loadMissionPhotos(bidId, kind),
    staleTime: 30 * 60 * 1000,
  });

  const photos = data ?? [];
  if (photos.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-muted-foreground">
        {label} ({photos.length})
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
              alt={label}
              loading="lazy"
              className="size-24 object-cover"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
