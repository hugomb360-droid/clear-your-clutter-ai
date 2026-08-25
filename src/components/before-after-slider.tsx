import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      updateFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [updateFromClientX]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl shadow-2xl sm:rounded-[2rem] ${className ?? ""}`}
      onPointerDown={(e) => {
        draggingRef.current = true;
        updateFromClientX(e.clientX);
      }}
    >
      <img
        src={beforeSrc}
        alt={beforeAlt}
        width={1792}
        height={1024}
        className="block w-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <img
          src={afterSrc}
          alt={afterAlt}
          width={1792}
          height={1024}
          className="block h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
        Avant
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
        Après
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.35)]"
        style={{ left: `${position}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Comparer avant et après"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 4));
          if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 4));
        }}
        className="absolute top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-brand"
        style={{ left: `${position}%` }}
        onPointerDown={(e) => {
          e.stopPropagation();
          draggingRef.current = true;
        }}
      >
        <ChevronLeft className="size-4" />
        <ChevronRight className="size-4" />
      </div>
    </div>
  );
}
