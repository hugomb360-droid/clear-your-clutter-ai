import { Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { profileCompletion } from "@/lib/public-profiles";
import type { Tables } from "@/integrations/supabase/types";
export function ProfileCompletion({ profile }: { profile: Tables<"pro_profiles"> | null }) {
  const { percent, items } = profileCompletion(profile);
  return <section className="my-6 border-y border-border py-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Mon profil public <span className="ml-2 text-primary">{percent} %</span></h2>
      <div className="flex gap-2"><Button asChild size="sm" variant="outline"><Link to="/pro/parametres">Compléter mon profil</Link></Button>{profile?.public_slug && profile.public_enabled && <Button asChild size="sm" variant="ghost"><Link to="/pro/$slug" params={{ slug: profile.public_slug }}>Voir ma page <ArrowUpRight className="size-4" /></Link></Button>}</div>
    </div><Progress value={percent} className="mt-4 h-2" />
    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">{items.map(item => <li key={item.label} className={`flex items-center gap-2 text-sm ${item.done ? "text-primary" : "text-muted-foreground"}`}>{item.done ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}{item.label}</li>)}</ul>
  </section>;
}