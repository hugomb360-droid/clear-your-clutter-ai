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

type Part = {
  /** position en mètres, z = hauteur depuis le sol */
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  /** variable CSS de matériau */
  color: string;
  radius?: number;
};

type Item = {
  label: string;
  hint: string;
  color: string;
  /** emprise au sol en m² */
  footprint: number;
  parts: Part[];
};

const M = {
  cardboard: "var(--sim-cardboard)",
  fabric: "var(--sim-fabric)",
  wood: "var(--sim-wood)",
  appliance: "var(--sim-appliance)",
  mattress: "var(--sim-mattress)",
  metal: "var(--sim-metal)",
  bag: "var(--sim-bag)",
  plant: "var(--sim-plant)",
};

const box = (
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
  color: string,
  radius = 2,
): Part => ({ x, y, z, w, d, h, color, radius });

/** Ordre d'apparition = ordre du curseur. */
const ITEMS: Item[] = [
  {
    label: "Cartons empilés",
    hint: "3 cartons · 0,5 m³",
    color: M.cardboard,
    footprint: 0.36,
    parts: [
      box(0.2, 0.25, 0, 0.6, 0.6, 0.42, M.cardboard),
      box(0.24, 0.3, 0.42, 0.52, 0.5, 0.36, M.cardboard),
      box(0.3, 0.36, 0.78, 0.4, 0.4, 0.3, M.cardboard),
    ],
  },
  {
    label: "Canapé 3 places",
    hint: "1,90 m · 1,3 m³",
    color: M.fabric,
    footprint: 1.62,
    parts: [
      box(1.15, 0.2, 0.1, 1.9, 0.85, 0.3, M.fabric, 4), // assise
      box(1.15, 0.2, 0, 1.9, 0.85, 0.1, M.wood, 2), // socle
      box(1.15, 0.2, 0.4, 1.9, 0.18, 0.45, M.fabric, 4), // dossier
      box(1.15, 0.38, 0.4, 0.22, 0.67, 0.25, M.fabric, 4), // accoudoir gauche
      box(2.83, 0.38, 0.4, 0.22, 0.67, 0.25, M.fabric, 4), // accoudoir droit
    ],
  },
  {
    label: "Matelas + sommier",
    hint: "140 × 190 · 0,8 m³",
    color: M.mattress,
    footprint: 1.14,
    parts: [
      box(3.25, 0.25, 0, 0.6, 1.9, 0.22, M.wood, 2),
      box(3.23, 0.23, 0.22, 0.64, 1.94, 0.24, M.mattress, 5),
    ],
  },
  {
    label: "Armoire 2 portes",
    hint: "1,90 m de haut · 1,7 m³",
    color: M.wood,
    footprint: 0.9,
    parts: [
      box(0.15, 1.1, 0, 0.5, 1.8, 1.9, M.wood, 3),
      box(0.65, 1.14, 0.05, 0.02, 0.84, 1.8, M.appliance, 1), // porte gauche
      box(0.65, 2.02, 0.05, 0.02, 0.84, 1.8, M.appliance, 1), // porte droite
      box(0.67, 1.9, 0.85, 0.05, 0.06, 0.22, M.metal, 2), // poignées
      box(0.67, 2.06, 0.85, 0.05, 0.06, 0.22, M.metal, 2),
    ],
  },
  {
    label: "Réfrigérateur",
    hint: "Électroménager · 0,7 m³",
    color: M.appliance,
    footprint: 0.42,
    parts: [
      box(1.05, 1.3, 0, 0.65, 0.65, 1.72, M.appliance, 3),
      box(1.05, 1.95, 0.05, 0.6, 0.02, 1.15, M.metal, 1), // porte frigo
      box(1.05, 1.95, 1.24, 0.6, 0.02, 0.42, M.metal, 1), // porte congélateur
      box(1.55, 1.97, 0.75, 0.06, 0.05, 0.3, M.metal, 2), // poignée
    ],
  },
  {
    label: "Table + 4 chaises",
    hint: "Salle à manger · 0,9 m³",
    color: M.wood,
    footprint: 1.4,
    parts: [
      box(1.95, 1.15, 0.7, 1.2, 0.85, 0.06, M.wood, 3), // plateau
      box(2.0, 1.2, 0, 0.07, 0.07, 0.7, M.wood, 1),
      box(3.05, 1.2, 0, 0.07, 0.07, 0.7, M.wood, 1),
      box(2.0, 1.93, 0, 0.07, 0.07, 0.7, M.wood, 1),
      box(3.05, 1.93, 0, 0.07, 0.07, 0.7, M.wood, 1),
      // chaise 1
      box(2.1, 0.95, 0.42, 0.42, 0.42, 0.05, M.wood, 2),
      box(2.1, 0.95, 0.47, 0.42, 0.05, 0.45, M.wood, 2),
      // chaise 2
      box(2.6, 0.95, 0.42, 0.42, 0.42, 0.05, M.wood, 2),
      box(2.6, 0.95, 0.47, 0.42, 0.05, 0.45, M.wood, 2),
      // chaise 3
      box(2.1, 2.05, 0.42, 0.42, 0.42, 0.05, M.wood, 2),
      box(2.1, 2.42, 0.47, 0.42, 0.05, 0.45, M.wood, 2),
      // chaise 4
      box(2.6, 2.05, 0.42, 0.42, 0.42, 0.05, M.wood, 2),
      box(2.6, 2.42, 0.47, 0.42, 0.05, 0.45, M.wood, 2),
    ],
  },
  {
    label: "Lave-linge + cartons",
    hint: "Buanderie · 0,9 m³",
    color: M.appliance,
    footprint: 0.75,
    parts: [
      box(3.25, 2.25, 0, 0.6, 0.6, 0.85, M.appliance, 3),
      box(3.35, 2.85, 0.3, 0.32, 0.02, 0.32, M.metal, 16), // hublot
      box(3.28, 2.28, 0.85, 0.5, 0.5, 0.4, M.cardboard),
      box(3.32, 2.34, 1.25, 0.42, 0.4, 0.34, M.cardboard),
    ],
  },
  {
    label: "Sacs de gravats",
    hint: "Déchets lourds · 0,5 m³",
    color: M.bag,
    footprint: 0.72,
    parts: [
      box(0.3, 3.1, 0, 0.42, 0.42, 0.55, M.bag, 8),
      box(0.78, 3.2, 0, 0.4, 0.4, 0.48, M.bag, 8),
      box(0.42, 3.55, 0, 0.38, 0.36, 0.4, M.bag, 8),
    ],
  },
  {
    label: "Vélos & outils",
    hint: "Garage · 0,6 m³",
    color: M.metal,
    footprint: 0.66,
    parts: [
      box(1.5, 2.5, 0.1, 0.06, 0.62, 0.62, M.metal, 30), // roue arrière
      box(2.4, 2.5, 0.1, 0.06, 0.62, 0.62, M.metal, 30), // roue avant
      box(1.55, 2.72, 0.55, 0.9, 0.05, 0.12, M.metal, 3), // cadre
      box(1.62, 2.7, 0.28, 0.7, 0.05, 0.1, M.metal, 3),
      box(2.3, 2.6, 0.72, 0.05, 0.4, 0.05, M.metal, 3), // guidon
      box(1.6, 2.6, 0.68, 0.24, 0.14, 0.06, M.bag, 3), // selle
    ],
  },
  {
    label: "Bibliothèque",
    hint: "1,80 m · 1,4 m³",
    color: M.wood,
    footprint: 0.77,
    parts: [
      box(1.6, 3.3, 0, 1.7, 0.45, 1.8, M.wood, 3),
      box(1.65, 3.28, 0.15, 1.6, 0.02, 0.35, M.cardboard, 1),
      box(1.65, 3.28, 0.6, 1.6, 0.02, 0.35, M.cardboard, 1),
      box(1.65, 3.28, 1.05, 1.6, 0.02, 0.35, M.cardboard, 1),
      box(1.65, 3.28, 1.5, 1.6, 0.02, 0.25, M.cardboard, 1),
    ],
  },
];

function itemVolume(item: Item) {
  return item.parts.reduce((sum, p) => sum + p.w * p.d * p.h, 0);
}

function Box3D({ part, dim }: { part: Part; dim: boolean }) {
  const w = part.w * SCALE;
  const d = part.d * SCALE;
  const h = part.h * SCALE;
  const top = `color-mix(in oklab, ${part.color}, white 16%)`;
  const front = `color-mix(in oklab, ${part.color}, black 8%)`;
  const side = `color-mix(in oklab, ${part.color}, black 26%)`;

  return (
    <div
      className="absolute left-0 top-0 transition-opacity duration-300"
      style={{
        transformStyle: "preserve-3d",
        transform: `translate3d(${part.x * SCALE}px, ${part.y * SCALE}px, ${part.z * SCALE}px)`,
        opacity: dim ? 0.25 : 1,
      }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: w,
          height: d,
          background: top,
          borderRadius: part.radius,
          transform: `translateZ(${h}px)`,
        }}
      />
      <div
        className="absolute left-0 top-0"
        style={{
          width: w,
          height: h,
          background: front,
          borderRadius: part.radius,
          transformOrigin: "0 0",
          transform: `translateY(${d}px) rotateX(90deg)`,
        }}
      />
      <div
        className="absolute left-0 top-0"
        style={{
          width: h,
          height: d,
          background: side,
          borderRadius: part.radius,
          transformOrigin: "0 0",
          transform: `translateX(${w}px) rotateY(-90deg)`,
        }}
      />
    </div>
  );
}

function Shadow({ item }: { item: Item }) {
  const xs = item.parts.map((p) => p.x);
  const ys = item.parts.map((p) => p.y);
  const x2 = Math.max(...item.parts.map((p) => p.x + p.w));
  const y2 = Math.max(...item.parts.map((p) => p.y + p.d));
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return (
    <div
      className="absolute left-0 top-0 rounded-full bg-foreground/12 blur-[6px]"
      style={{
        width: (x2 - x) * SCALE,
        height: (y2 - y) * SCALE,
        transform: `translate3d(${x * SCALE}px, ${y * SCALE}px, 1px)`,
      }}
    />
  );
}

export function RoomVolume3D() {
  const [count, setCount] = useState(3);
  const [focus, setFocus] = useState<string | null>(null);

  const visible = ITEMS.slice(0, count);
  const volume = useMemo(() => visible.reduce((sum, i) => sum + itemVolume(i), 0), [visible]);
  const floorUsed = useMemo(() => visible.reduce((sum, i) => sum + i.footprint, 0), [visible]);
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
            Déplacez le curseur pour meubler la pièce : canapé, armoire, frigo, cartons… vous voyez
            en direct la place occupée, le volume en m³ et l'estimation de prix.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-border bg-secondary/40 p-4 sm:p-8">
            <div
              className="mx-auto flex h-[380px] w-full max-w-[560px] items-center justify-center sm:h-[480px]"
              style={{ perspective: 1400 }}
              aria-hidden="true"
            >
              <div
                className="relative"
                style={{
                  width: ROOM_W * SCALE,
                  height: ROOM_D * SCALE,
                  transformStyle: "preserve-3d",
                  transform: "scale(1) rotateX(56deg) rotateZ(-42deg) translateZ(-30px)",
                }}
              >
                {/* sol parquet */}
                <div
                  className="absolute left-0 top-0"
                  style={{
                    width: ROOM_W * SCALE,
                    height: ROOM_D * SCALE,
                    background: "var(--sim-floor)",
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${
                      SCALE * 0.28
                    }px, var(--sim-floor-line) ${SCALE * 0.28}px ${SCALE * 0.28 + 1}px)`,
                    boxShadow: "inset 0 0 0 1px var(--sim-floor-line)",
                  }}
                />
                {/* mur gauche */}
                <div
                  className="absolute left-0 top-0"
                  style={{
                    width: ROOM_H * SCALE,
                    height: ROOM_D * SCALE,
                    background: `linear-gradient(to right, color-mix(in oklab, var(--sim-wall), black 8%), var(--sim-wall))`,
                    transformOrigin: "0 0",
                    transform: "rotateY(-90deg)",
                  }}
                />
                {/* mur du fond */}
                <div
                  className="absolute left-0 top-0"
                  style={{
                    width: ROOM_W * SCALE,
                    height: ROOM_H * SCALE,
                    background: `linear-gradient(to top, color-mix(in oklab, var(--sim-wall), black 6%), var(--sim-wall))`,
                    transformOrigin: "0 0",
                    transform: "rotateX(90deg)",
                  }}
                />
                {visible.map((item) => (
                  <div key={item.label} style={{ transformStyle: "preserve-3d" }}>
                    <Shadow item={item} />
                    {item.parts.map((part, i) => (
                      <Box3D
                        key={i}
                        part={part}
                        dim={focus !== null && focus !== item.label}
                      />
                    ))}
                  </div>
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
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {count === 0 ? (
                  <p className="text-sm text-muted-foreground">Pièce de 4 × 4 m, entièrement vide.</p>
                ) : (
                  visible.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onMouseEnter={() => setFocus(item.label)}
                      onMouseLeave={() => setFocus(null)}
                      onFocus={() => setFocus(item.label)}
                      onBlur={() => setFocus(null)}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand"
                    >
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: item.color }}
                      />
                      {item.label}
                      <span className="text-muted-foreground">{item.hint}</span>
                    </button>
                  ))
                )}
              </div>
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
