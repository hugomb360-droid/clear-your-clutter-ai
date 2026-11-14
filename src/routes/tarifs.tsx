import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { useState } from "react";
import {
  Breadcrumb,
  CheckList,
  CtaBand,
  btnPrimary,
  btnSoft,
  btnWhite,
  wrap,
} from "@/components/site/page-kit";
import { PRICING, computePrice, euro } from "@/lib/pricing";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs débarras — Débarras France" },
      {
        name: "description",
        content:
          "Prix au m³, majorations d'étage et d'accès : la grille tarifaire Débarras France est transparente et sans frais cachés.",
      },
      { property: "og:title", content: "Tarifs débarras — Débarras France" },
      {
        property: "og:description",
        content: "Une grille claire, un devis gratuit, aucune commission pour le particulier.",
      },
      { property: "og:url", content: "https://debarrasfrance.fr/tarifs" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://debarrasfrance.fr/tarifs" }],
  }),
  component: Pricing,
});

const pct = (rate: number) => `${Math.round(rate * 100)} %`;

const PRESETS = [
  { label: "Cave ou box", volume: 6 },
  { label: "Studio / T2", volume: 16 },
  { label: "T3 / T4", volume: 25 },
  { label: "Maison", volume: 38 },
];

function Pricing() {
  const [volume, setVolume] = useState(16);
  const [floor, setFloor] = useState(0);
  const [elevator, setElevator] = useState(true);
  const [bulky, setBulky] = useState(false);
  const [hard, setHard] = useState(false);
  const result = computePrice({
    volumeM3: volume,
    floor,
    hasElevator: elevator,
    bulkyItems: bulky,
    hardAccess: hard,
  });

  const chip = (on: boolean) =>
    `min-h-11 rounded-full border-2 px-4 text-[15px] font-bold transition-colors ${
      on
        ? "border-brand-ink bg-brand-ink text-white"
        : "border-border bg-white text-brand-ink hover:border-brand-ink"
    }`;

  return (
    <main>
      {/* Page calculateur : le ticket de prix à droite, les réglages à gauche */}
      <section className="bg-[#F2FAF4] pb-16 pt-8 sm:pb-24">
        <div className={wrap}>
          <Breadcrumb items={[{ label: "Tarifs" }]} />
          <h1 className="mt-6 text-[36px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[52px]">
            Des tarifs lisibles
          </h1>
          <p className="mt-4 max-w-[40em] text-lg leading-relaxed text-[#34433A]">
            Le prix d'un débarras dépend surtout du volume. Voici la base utilisée par l'estimation
            Débarras France, avant les propositions des pros de votre secteur. Réglez les curseurs
            pour voir le prix bouger.
          </p>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div className="rounded-[28px] bg-white p-6 sm:p-8">
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor="volume" className="text-lg font-extrabold text-brand-ink">
                    Volume à évacuer
                  </label>
                  <span className="text-2xl font-black tabular-nums text-primary">{volume} m³</span>
                </div>
                <input
                  id="volume"
                  type="range"
                  min={1}
                  max={80}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="mt-3 w-full accent-primary"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setVolume(preset.volume)}
                      aria-pressed={volume === preset.volume}
                      className={chip(volume === preset.volume)}
                    >
                      {preset.label} · {preset.volume} m³
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-lg font-extrabold text-brand-ink">Étage</p>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Étage">
                  {[0, 1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFloor(level)}
                      aria-pressed={floor === level}
                      className={`${chip(floor === level)} min-w-[52px]`}
                    >
                      {level === 0 ? "RDC" : `${level}e`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Ascenseur", elevator, setElevator, "tarif-elevator"],
                  ["Objets lourds", bulky, setBulky, "tarif-bulky"],
                  ["Accès difficile", hard, setHard, "tarif-hard"],
                ].map(([label, value, set, id]) => (
                  <label
                    key={id as string}
                    htmlFor={id as string}
                    className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-border px-4 text-base font-semibold text-brand-ink"
                  >
                    <input
                      id={id as string}
                      type="checkbox"
                      checked={value as boolean}
                      onChange={(e) => (set as (v: boolean) => void)(e.target.checked)}
                      className="size-5 accent-primary"
                    />
                    {label as string}
                  </label>
                ))}
              </div>
            </div>

            <aside className="rounded-[28px] bg-brand-ink p-6 text-white sm:p-8" aria-live="polite">
              <p className="text-sm font-bold text-[#BFD8C8]">Fourchette estimée</p>
              <p className="mt-2 text-[40px] font-black leading-none tabular-nums text-[#6EDC97] sm:text-[48px]">
                {euro(result.priceMin)} – {euro(result.priceMax)}
              </p>
              <dl className="mt-7 divide-y divide-white/15 text-[15px]">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[#BFD8C8]">
                    {volume} m³ × {euro(PRICING.pricePerM3)}
                    {result.base === PRICING.minimumPrice &&
                    volume * PRICING.pricePerM3 < PRICING.minimumPrice
                      ? " (minimum appliqué)"
                      : ""}
                  </dt>
                  <dd className="font-bold tabular-nums">{euro(result.base)}</dd>
                </div>
                {result.surcharges.map((s) => (
                  <div key={s.label} className="flex justify-between gap-4 py-3">
                    <dt className="text-[#BFD8C8]">{s.label}</dt>
                    <dd className="font-bold tabular-nums">+ {euro(s.amount)}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[#BFD8C8]">Fourchette ± {pct(PRICING.spreadRate)}</dt>
                  <dd className="font-bold tabular-nums">
                    {euro(result.priceMin)} – {euro(result.priceMax)}
                  </dd>
                </div>
              </dl>
              <p className="mt-5 text-sm leading-relaxed text-[#BFD8C8]">
                Repère indicatif. Avec vos photos, l'IA mesure le volume réel et chaque pro reste
                libre de son prix.
              </p>
              <Link
                to="/estimation"
                search={{ type: "photo" }}
                className={`${btnPrimary} mt-6 w-full`}
              >
                <Camera className="size-5" aria-hidden="true" />
                Obtenir mon vrai prix
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* La grille, en lecture simple */}
      <section className="py-16 sm:py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-2`}>
          <div>
            <h2 className="text-[30px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[38px]">
              La grille de calcul
            </h2>
            <dl className="mt-8 divide-y divide-border border-y border-border">
              {[
                ["Prix de base", `${euro(PRICING.pricePerM3)} par m³`],
                ["Minimum d'intervention", euro(PRICING.minimumPrice)],
                [
                  "Par étage sans ascenseur",
                  `+${pct(PRICING.floorSurchargeRate)}, plafonné à ${pct(PRICING.maxFloorSurcharge)}`,
                ],
                ["Objets lourds ou volumineux", `+${pct(PRICING.bulkySurchargeRate)}`],
                ["Accès difficile", `+${pct(PRICING.hardAccessSurchargeRate)}`],
                ["Commission pour le particulier", "0 €"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-base text-[#34433A]">{label}</dt>
                  <dd className="text-right text-lg font-extrabold tabular-nums text-brand-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-[30px] font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[38px]">
              Ce qui est inclus
            </h2>
            <CheckList
              className="mt-8"
              items={[
                "Estimation et devis 100 % gratuits",
                "Aucun engagement tant que vous n'acceptez pas une proposition",
                "Objets réutilisables donnés ou revendus, déduction possible",
                "Tri et dépôt en déchetterie inclus par les pros partenaires",
                "Paiement bloqué jusqu'à votre validation de fin de chantier",
              ]}
            />
            <Link
              to="/prix-debarras"
              className="mt-8 inline-block font-bold text-primary hover:underline"
            >
              Lire le guide complet des prix
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="Combien pour votre débarras ?"
        text="Envoyez vos photos : volume en m³ et fourchette de prix en 2 minutes."
      >
        <Link to="/estimation" search={{ type: "photo" }} className={btnSoft}>
          <Camera className="size-5" aria-hidden="true" />
          Obtenir mon prix
        </Link>
        <Link to="/comment-ca-marche" className={btnWhite}>
          Comment ça marche
        </Link>
      </CtaBand>
    </main>
  );
}
