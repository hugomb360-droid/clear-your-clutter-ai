import "leaflet/dist/leaflet.css";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { CITIES } from "@/lib/cities";
import { CITY_COORDS } from "@/lib/city-coords";

/**
 * Carte de France avec un repère par ville couverte. Chargée uniquement côté navigateur
 * (import paresseux depuis la page), comme la carte des zones des pros.
 */
export default function CitiesMap({
  activeSlug,
  height = 520,
}: {
  activeSlug?: string;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current || mapRef.current) return;
      const center = activeSlug && CITY_COORDS[activeSlug] ? CITY_COORDS[activeSlug] : [46.6, 2.4];
      const map = L.map(containerRef.current, {
        center: center as [number, number],
        zoom: activeSlug ? 9 : 5.5,
        zoomSnap: 0.5,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap",
      }).addTo(map);
      for (const city of CITIES) {
        const coords = CITY_COORDS[city.slug];
        if (!coords) continue;
        const active = city.slug === activeSlug;
        const marker = L.circleMarker(coords, {
          radius: active ? 11 : 7,
          color: "#0C3D22",
          weight: 2,
          fillColor: active ? "#16A356" : "#007F3D",
          fillOpacity: 1,
        })
          .bindTooltip(`Débarras ${city.preposition}`, { direction: "top", offset: [0, -8] })
          .addTo(map);
        marker.on("click", () => {
          void navigate({ to: "/debarras/$ville", params: { ville: city.slug } });
        });
      }
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [activeSlug, navigate]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Carte des villes couvertes"
      className="w-full overflow-hidden rounded-[24px] border border-border"
      style={{ height }}
    />
  );
}
