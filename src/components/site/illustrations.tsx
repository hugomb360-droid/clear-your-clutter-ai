/**
 * Illustrations vectorielles propres au métier, dessinées dans les verts du site.
 * Elles remplacent les photos sur les pages où une photo n'apporterait rien de précis.
 */

const INK = "#0C3D22";
const GREEN = "#007F3D";
const BRIGHT = "#16A356";
const SOFT = "#DFFAE5";
const LINE = "#BFD8C8";

/** Coupe d'immeuble : chaque étage indique sa majoration sans ascenseur. */
export function BuildingSection({
  floors = 5,
  activeFloor,
}: {
  floors?: number;
  activeFloor?: number;
}) {
  const h = 56;
  const top = 40;
  const totalH = top + floors * h + 60;
  return (
    <svg
      viewBox={`0 0 470 ${totalH}`}
      role="img"
      aria-label={`Coupe d'un immeuble de ${floors} étages avec la majoration par étage sans ascenseur`}
      className="h-auto w-full max-w-[470px]"
    >
      <rect x="20" y={totalH - 60} width="430" height="60" fill={SOFT} />
      <rect
        x="70"
        y={top - 16}
        width="220"
        height={floors * h + 16}
        rx="6"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth="2"
      />
      <rect x="70" y={top - 30} width="220" height="16" fill={INK} />
      {Array.from({ length: floors + 1 }).map((_, i) => {
        const level = floors - i;
        const y = top + i * h;
        const active = activeFloor === level;
        const pct = Math.min(level * 7, 35);
        return (
          <g key={level}>
            {i > 0 && <line x1="70" x2="290" y1={y} y2={y} stroke={LINE} strokeWidth="2" />}
            <rect
              x="92"
              y={y + 14}
              width="40"
              height="28"
              rx="3"
              fill={active ? BRIGHT : SOFT}
              stroke={INK}
              strokeWidth="1.5"
            />
            <rect
              x="150"
              y={y + 14}
              width="40"
              height="28"
              rx="3"
              fill={active ? BRIGHT : SOFT}
              stroke={INK}
              strokeWidth="1.5"
            />
            <rect
              x="208"
              y={y + 14}
              width="40"
              height="28"
              rx="3"
              fill={active ? BRIGHT : SOFT}
              stroke={INK}
              strokeWidth="1.5"
            />
            <text x="310" y={y + 26} fontSize="15" fontWeight="700" fill={INK}>
              {level === 0 ? "RDC" : `${level}e`}
            </text>
            <text x="310" y={y + 45} fontSize="13" fill={level === 0 ? GREEN : "#56635A"}>
              {level === 0 ? "pas de majoration" : `+${pct} % sans asc.`}
            </text>
          </g>
        );
      })}
      <rect x="160" y={top + floors * h - 44} width="40" height="44" fill={INK} />
    </svg>
  );
}

/** Coupe de maison : combles, étage, rez-de-chaussée, cave, garage, jardin. */
export function HouseSection({ active }: { active?: string }) {
  const zone = (id: string, x: number, y: number, w: number, h: number, label: string) => (
    <g key={id}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={active === id ? BRIGHT : "#FFFFFF"}
        stroke={INK}
        strokeWidth="2"
      />
      <text
        x={x + 12}
        y={y + 24}
        fontSize="15"
        fontWeight="700"
        fill={active === id ? "#FFFFFF" : INK}
      >
        {label}
      </text>
    </g>
  );
  return (
    <svg
      viewBox="0 0 560 360"
      role="img"
      aria-label="Coupe d'une maison : combles, étage, rez-de-chaussée, cave, garage et jardin"
      className="h-auto w-full max-w-[560px]"
    >
      <rect x="0" y="300" width="560" height="60" fill={SOFT} />
      <polygon points="80,120 240,30 400,120" fill={INK} />
      {zone("combles", 100, 120, 280, 50, "Combles")}
      {zone("etage", 100, 170, 280, 60, "Étage")}
      {zone("rdc", 100, 230, 280, 70, "Rez-de-chaussée")}
      {zone("cave", 100, 300, 280, 50, "Cave")}
      {zone("garage", 400, 210, 140, 90, "Garage")}
      <g>
        <circle cx="40" cy="250" r="26" fill={BRIGHT} />
        <rect x="36" y="270" width="8" height="30" fill={INK} />
        <text x="12" y="330" fontSize="14" fontWeight="700" fill={INK}>
          Jardin
        </text>
      </g>
    </svg>
  );
}

/** Empilement de cubes d'un mètre cube : visualise un volume. */
export function VolumeCubes({ count = 8, label }: { count?: number; label?: string }) {
  const perRow = 4;
  const size = 44;
  const rows = Math.ceil(count / perRow);
  const w = perRow * size + 40;
  const h = rows * size + 60;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label ?? `${count} mètres cubes`}
      className="h-auto w-full max-w-[260px]"
    >
      {Array.from({ length: count }).map((_, i) => {
        const col = i % perRow;
        const row = rows - 1 - Math.floor(i / perRow);
        const x = 20 + col * size;
        const y = 20 + row * size;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={size - 4}
              height={size - 4}
              rx="4"
              fill={i % 3 === 0 ? BRIGHT : SOFT}
              stroke={INK}
              strokeWidth="1.5"
            />
          </g>
        );
      })}
      <text x={w / 2} y={h - 12} textAnchor="middle" fontSize="15" fontWeight="800" fill={INK}>
        {label ?? `${count} m³`}
      </text>
    </svg>
  );
}

/** Pile de dossiers : la page succession. */
export function FolderStack() {
  return (
    <svg
      viewBox="0 0 420 300"
      role="img"
      aria-label="Dossier de succession avec ses pièces"
      className="h-auto w-full max-w-[420px]"
    >
      <rect
        x="40"
        y="90"
        width="300"
        height="190"
        rx="12"
        fill={SOFT}
        stroke={INK}
        strokeWidth="2"
      />
      <rect
        x="60"
        y="70"
        width="300"
        height="190"
        rx="12"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth="2"
      />
      <path
        d="M80 50h90l18 20h172a12 12 0 0 1 12 12v158a12 12 0 0 1-12 12H80a12 12 0 0 1-12-12V62a12 12 0 0 1 12-12z"
        fill={BRIGHT}
        stroke={INK}
        strokeWidth="2"
      />
      {["Photos avant", "Objets à conserver", "Clés et accès", "Date limite"].map((t, i) => (
        <g key={t}>
          <rect
            x="100"
            y={100 + i * 36}
            width="20"
            height="20"
            rx="4"
            fill="#FFFFFF"
            stroke={INK}
            strokeWidth="1.5"
          />
          <path
            d={`M104 ${110 + i * 36}l5 5 8-9`}
            fill="none"
            stroke={GREEN}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="132" y={115 + i * 36} fontSize="15" fontWeight="700" fill="#FFFFFF">
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Repère de carte stylisé. */
export function Pin({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
