import { Link } from "@tanstack/react-router";
import { CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { sBtnSoft } from "@/components/space/space-kit";
import { profileCompletion } from "@/lib/public-profiles";
import type { Tables } from "@/integrations/supabase/types";

/**
 * Avancement du profil public. Sur le tableau de bord, la carte disparaît une fois le profil
 * complet ; dans les paramètres (`bare`), seule la jauge et la liste sont affichées.
 */
export function ProfileCompletion({
  profile,
  bare = false,
}: {
  profile: Tables<"pro_profiles"> | null;
  bare?: boolean;
}) {
  const { percent, items } = profileCompletion(profile);

  const body = (
    <>
      <Progress
        value={percent}
        className="h-2.5 bg-brand-soft"
        aria-label={`Profil complété à ${percent} %`}
      />
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {items.map((item) => (
          <li
            key={item.label}
            className={`flex items-center gap-1.5 text-sm ${item.done ? "font-semibold text-primary" : "text-muted-foreground"}`}
          >
            {item.done ? (
              <CheckCircle2 className="size-4" aria-hidden="true" />
            ) : (
              <Circle className="size-4" aria-hidden="true" />
            )}
            {item.label}
            <span className="sr-only">{item.done ? " (fait)" : " (à faire)"}</span>
          </li>
        ))}
      </ul>
    </>
  );

  if (bare) return <div className="mt-4">{body}</div>;
  if (percent >= 100) return null;

  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-extrabold text-brand-ink">
            Profil public complété à <span className="text-primary">{percent} %</span>
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Un profil complet rassure les clients qui comparent les propositions.
          </p>
        </div>
        <Link to="/pro/parametres" hash="profil-public" className={sBtnSoft}>
          Compléter mon profil
        </Link>
      </div>
      {body}
    </section>
  );
}
