import { useMemo, useState } from "react";
import { Boxes, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { computePrice, euro } from "@/lib/pricing";

/** Échelle : 1 mètre = 58 px au sol. Pièce de 4 x 4 m sur 2,5 m de haut. */
const SCALE = 58;
const ROOM_W = 4;
const ROOM_D = 4;
const ROOM_H = 2.5;

type Item = {
  label: string;
  /** position au sol, en mètres */
  x: number;
  y: number;
  /** dimensions en mètres */
  w: number;
  d: number;
  h: number;
};

/** Ordre d'apparition = ordre du curseur. */
const ITEMS: Item[] = [
  { label: "Cartons", x: 0.2, y: 0.2, w: 0.6, d: 0.6, h: 0.5 },
  { label: "Vieux canapé", x: 1.1, y: 0.15, w: 1.9, d: 0.85, h: 0.8 },
  { label: "Matelas", x: 3.15, y: 0.2, w: 0.6, d: 1.9, h: 0.35 },
  { label: "Armoire démontée", x: 0.15, y: 1.1, w: 0.5, d: 1.8, h: 1.9 },
  { label: "Électroménager", x: 1.0, y: 1.25, w: 0.65, d: 0.65, h: 1.7 },
  { label: "Table + chaises", x: 1.95, y: 1.2, w: 1.1, d: 0.9, h: 0.75 },
  { label: "Piles de cartons", x: 3.2, y: 2.3, w: 0.7, d: 0.7, h: 1.4 },
  { label: "Gravats / sacs", x: 0.3, y: 3.1, w: 0.9, d: 0.7, h: 0.6 },
  { label: "Vélos & outils", x: 1.5, y: 2.4, w: 1.0, d: 0.6, h: 1.1 },
  { label: "Bibliothèque", x: 1.6, y: 3.25, w: 1.7, d: 0.45, h: 1.8 },
];

function volumeOf(item: Item) {
  return item.w * item.d * item.h;
}

function Cube({ item, index }: { item: Item; index: number }) {
  const w = item.w * SCALE;
  const d = item.d * SCALE;
  const h = item.h * SCALE;

  return (
    <div
      className="absolute left-0 top-0 animate-in fade-in zoom-in-95 duration-500"
      style={{
        transformStyle: "preserve-3d",
        transform: `translate3d(${item.x * SCALE}px, ${item.y * SCALE}px, 0)`,
        animationDelay: `${index * 40}ms`,
      }}
    >
      {/* dessus */}
      <div
        className="absolute left-0 top-0 rounded-[2px] bg-brand"
        style={{ width: w, height: d, transform: `translateZ(${h}px)` }}
      />
      {/* face avant (y = d) */}
      <div
        className="absolute left-0 top-0 bg-brand-ink/80"
        style={{
          width: w,
          height: h,
          transformOrigin: "0 0",
          transform: `translateY(${d}px) rotateX(90deg)`,
        }}
      />
      {/* face latérale (x = w) */}
      <div
        className="absolute left-0 top-0 bg-brand-ink"
        style={{
          width: h,
          height: d,
          transformOrigin: "0 0",
          transform: `translateX(${w}px) rotateY(-90deg)`,
        }}
      />
    </div>
  );
}

export function RoomVolume3D() {
  const [count, setCount] = useState(3);

  const visible = ITEMS.slice(0, count);
  const volume = useMemo(
    () => visible.reduce((sum, item) => sum + volumeOf(item), 0),
    [visible],
  );
  const floorUsed = useMemo(
    () => visible.reduce((sum, item) => sum + item.w * item.d, 0),
    [visible],
  );
  const fillRate = Math.min(100, Math.round((floorUsed / (ROOM_W * ROOM_D)) * 100));

  const price = computePrice({
    volumeM3: volume,
    floor: 0,
    hasElevator: true,
    bulkyItems: count >= 4,
    hardAccess: false,
  });

  return (
    <section className="border-t border-border py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand-ink">
            <Boxes className="size-4" /> Simulateur de volume
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight">
            Visualisez la place que prennent vos encombrants
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Déplacez le curseur pour remplir la pièce : vous voyez en direct le volume en m³ à
            évacuer et l'estimation de prix correspondante.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-border bg-secondary/40 p-4 sm:p-8">
            <div
              className="mx-auto flex h-[340px] w-full max-w-[520px] items-center justify-center sm:h-[420px]"
              style={{ perspective: "1400px" }}
              aria-hidden="true"
            >
              <div
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(60deg) rotateZ(-45deg) translate3d(-116px, -116px, 0)",
                }}
              >
                {/* sol */}
                <div
                  className="absolute left-0 top-0 rounded-[2px] border border-border bg-card"
                  style={{
                    width: ROOM_W * SCALE,
                    height: ROOM_D * SCALE,
                    backgroundImage:
                      "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                    backgroundSize: `${SCALE}px ${SCALE}px`,
                  }}
                />
                {/* mur gauche (x = 0) */}
                <div
                  className="absolute left-0 top-0 bg-muted/70"
                  style={{
                    width: ROOM_H * SCALE,
                    height: ROOM_D * SCALE,
                    transformOrigin: "0 0",
                    transform: "rotateY(-90deg)",
                  }}
                />
                {/* mur du fond (y = 0) */}
                <div
                  className="absolute left-0 top-0 bg-muted"
                  style={{
                    width: ROOM_W * SCALE,
                    height: ROOM_H * SCALE,
                    transformOrigin: "0 0",
                    transform: "rotateX(90deg)",
                  }}
                />
                {visible.map((item, index) => (
                  <Cube key={item.label} item={item} index={index} />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-muted-foreground">Pièce vide</span>
                <span className="text-muted-foreground">Pièce pleine</span>
              </div>
              <Slider
                className="mt-3"
                value={[count]}
                onValueChange={(v) => setCount(v[0] ?? 0)}
                min={0}
                max={ITEMS.length}
                step={1}
                aria-label="Quantité d'encombrants dans la pièce"
              />
              <p className="mt-3 text-center text-sm text-muted-foreground">
                {count === 0
                  ? "Pièce de 4 × 4 m, vide."
                  : `${count} lot${count > 1 ? "s" : ""} d'encombrants — dernier ajouté : ${
                      visible[visible.length - 1]?.label
                    }`}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold text-muted-foreground">Volume à évacuer</p>
            <p className="mt-1 text-5xl font-extrabold tracking-tight text-brand">
              {volume.toFixed(1).replace(".", ",")} m³
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Soit environ {fillRate} % de la surface au sol occupée.
            </p>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${fillRate}%` }}
              />
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Camion nécessaire</dt>
                <dd className="font-semibold">
                  {volume === 0 ? "—" : `${Math.max(1, Math.ceil(volume / 12))} voyage(s) 12 m³`}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Estimation indicative</dt>
                <dd className="font-semibold">
                  {volume === 0 ? "—" : `${euro(price.priceMin)} – ${euro(price.priceMax)}`}
                </dd>
              </div>
            </dl>

            <Button asChild size="lg" className="mt-7 w-full rounded-full">
              <Link to="/estimation">
                <Sparkles className="size-4" /> Estimer avec mes photos
              </Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Simulation indicative — l'IA affine le prix à partir de vos photos réelles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
