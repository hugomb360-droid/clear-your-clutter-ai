import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

type ZoneShape = { zone: string; label: string; lat: number; lng: number; radiusKm: number };

type Commune = { nom: string; centre?: { coordinates: [number, number] } };

const cache = new Map<string, ZoneShape | null>();

async function fetchZone(zone: string): Promise<ZoneShape | null> {
  if (cache.has(zone)) return cache.get(zone) ?? null;
  const url =
    zone.length === 5
      ? `https://geo.api.gouv.fr/communes?codePostal=${zone}&fields=nom,centre`
      : `https://geo.api.gouv.fr/departements/${zone}/communes?fields=nom,centre`;
  let shape: ZoneShape | null = null;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const communes = (await res.json()) as Commune[];
      const points = communes
        .map((c) => c.centre?.coordinates)
        .filter((c): c is [number, number] => Array.isArray(c));
      if (points.length) {
        const lng = points.reduce((s, p) => s + p[0], 0) / points.length;
        const lat = points.reduce((s, p) => s + p[1], 0) / points.length;
        const spread = Math.max(
          ...points.map(
            (p) => Math.hypot((p[0] - lng) * Math.cos((lat * Math.PI) / 180), p[1] - lat) * 111,
          ),
        );
        shape = {
          zone,
          label: zone.length === 5 ? `${communes[0]?.nom ?? zone} (${zone})` : `Département ${zone}`,
          lat,
          lng,
          radiusKm: Math.min(Math.max(spread || 8, 6), 60),
        };
      }
    }
  } catch {
    shape = null;
  }
  cache.set(zone, shape);
  return shape;
}

export default function ZonesMap({ zones }: { zones: string[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const [shapes, setShapes] = useState<ZoneShape[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all(zones.map(fetchZone)).then((results) => {
      if (!active) return;
      setShapes(results.filter((r): r is ZoneShape => Boolean(r)));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [zones.join(",")]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;
      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
          center: [46.6, 2.4],
          zoom: 5,
          scrollWheelZoom: false,
          attributionControl: true,
        });
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "© OpenStreetMap",
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }
      const map = mapRef.current;
      const layer = layerRef.current!;
      layer.clearLayers();
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim();
      const color = accent ? `oklch(${accent.replace(/^oklch\(|\)$/g, "")})` : "#16a34a";
      let bounds: import("leaflet").LatLngBounds | null = null;
      for (const shape of shapes) {
        const circle = L.circle([shape.lat, shape.lng], {
          radius: shape.radiusKm * 1000,
          color,
          weight: 2,
          fillColor: color,
          fillOpacity: 0.18,
        })
          .bindTooltip(shape.label, { direction: "top" })
          .addTo(layer);
        bounds = bounds ? bounds.extend(circle.getBounds()) : circle.getBounds();
      }
      map.invalidateSize();
      if (bounds) {
        map.fitBounds(bounds.pad(0.25), { maxZoom: 11 });
      } else {
        map.setView([46.6, 2.4], 5);
      }
      setTimeout(() => map.invalidateSize(), 50);
    })();
    return () => {
      cancelled = true;
    };
  }, [shapes]);

  useEffect(
    () => () => {
      mapRef.current?.remove();
      mapRef.current = null;
    },
    [],
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border">
      <div ref={containerRef} className="h-72 w-full bg-secondary" />
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-card/90 px-3 py-1 text-xs text-muted-foreground shadow-[var(--shadow-soft)]">
        {loading
          ? "Chargement des zones..."
          : shapes.length
            ? `${shapes.length} zone${shapes.length > 1 ? "s" : ""} couverte${shapes.length > 1 ? "s" : ""}`
            : "Aucune zone valide"}
      </div>
    </div>
  );
}
