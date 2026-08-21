import { ClientOnly } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { lazy, Suspense } from "react";

const ZonesMap = lazy(() => import("@/components/pro/zones-map"));

function MapSkeleton() {
  return (
    <div className="flex h-72 w-full items-center justify-center rounded-2xl border border-border bg-secondary text-sm text-muted-foreground">
      Chargement de la carte...
    </div>
  );
}

export function ZonesMapPanel({
  zones,
  title = "Ma zone d'intervention",
  description = "Chaque cercle représente un secteur où vous recevez les demandes de débarras.",
}: {
  zones: string[];
  title?: string;
  description?: string;
}) {
  return (
    <div className="grid gap-3">
      <div className="flex items-start gap-2">
        <MapPin className="mt-0.5 size-4 text-primary" />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <ClientOnly fallback={<MapSkeleton />}>
        <Suspense fallback={<MapSkeleton />}>
          <ZonesMap zones={zones} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
