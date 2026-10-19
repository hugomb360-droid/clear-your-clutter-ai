import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Camera, FileCheck2, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fileToDataUrl } from "@/lib/image";
import { successionSchema } from "@/lib/succession.schemas";
import { createSuccession } from "@/lib/succession.functions";

const key = "succession-draft";
export function SuccessionForm() {
  const { user, isPro } = useAuth();
  const navigate = useNavigate();
  const create = useServerFn(createSuccession);
  const [photos, setPhotos] = useState<string[]>([]);
  const [remoteKeys, setRemoteKeys] = useState(false);
  const [sending, setSending] = useState(false);
  const [reading, setReading] = useState(false);
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return;
      const draft = JSON.parse(raw);
      setPhotos(draft.photos ?? []); setValues(draft.values ?? {}); setRemoteKeys(draft.values?.remoteKeys === "oui");
    } catch { sessionStorage.removeItem(key); }
  }, []);
  const field = (name: string) => ({ name, value: values[name] ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setValues(prev => ({ ...prev, [name]: e.target.value })) });
  const selectClass = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";
  return <section id="dossier-succession" className="mx-auto max-w-3xl px-4 py-12 scroll-mt-20">
    <div className="flex items-center gap-3 text-primary"><FileCheck2 className="size-6" /><p className="text-sm font-semibold">Dossier succession · {step}/2</p></div>
    <h2 className="mt-3 text-2xl font-bold">Organiser le débarras du bien</h2>
    {isPro ? <p className="mt-6 text-muted-foreground">Ce parcours est réservé aux clients et héritiers. <Link to="/pro/dashboard" className="text-primary underline">Accéder à mon espace pro</Link></p> : <form className="mt-8 space-y-6" onSubmit={async e => {
      e.preventDefault();
      const parsed = successionSchema.safeParse({ ...values, propertyType: values.propertyType || "Maison", heirPresent: values.heirPresent !== "non", remoteKeys, keyInstructions: values.keyInstructions ?? "", valuables: values.valuables ?? "", furnitureChoice: values.furnitureChoice || "don_revente", deadlineReason: values.deadlineReason || "vente", heirsAgreement: values.heirsAgreement === "oui" });
      if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Vérifiez les champs du dossier"); return; }
      if (!photos.length) { toast.error("Ajoutez au moins une photo avant débarras"); return; }
      if (!user) {
        try { sessionStorage.setItem(key, JSON.stringify({ values, photos })); }
        catch { toast.error("Vos photos sont trop volumineuses pour conserver le dossier avant connexion."); return; }
        toast.info("Connectez-vous pour envoyer votre dossier.");
        await navigate({ to: "/auth", search: { mode: "signup", role: "client", redirect: "/debarras-succession" } }); return;
      }
      setSending(true);
      try { await create({ data: { details: parsed.data, photos } }); sessionStorage.removeItem(key); toast.success("Dossier succession envoyé aux professionnels de votre secteur"); await navigate({ to: "/compte" }); }
      catch (error) { toast.error(error instanceof Error ? error.message : "Envoi impossible"); }
      finally { setSending(false); }
    }}>
      <div className={step === 1 ? "space-y-6" : "hidden"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2"><Label htmlFor="s-address">Adresse du bien</Label><Input id="s-address" {...field("address")} required maxLength={300} autoComplete="street-address" /></div>
          <div className="grid gap-2"><Label htmlFor="s-postalCode">Code postal</Label><Input id="s-postalCode" {...field("postalCode")} required pattern="[0-9]{5}" maxLength={5} inputMode="numeric" /></div>
          <div className="grid gap-2"><Label htmlFor="s-city">Ville</Label><Input id="s-city" {...field("city")} required maxLength={100} /></div>
          <div className="grid gap-2"><Label htmlFor="s-property">Type de bien</Label><select id="s-property" {...field("propertyType")} className={selectClass}><option value="Maison">Maison</option><option>Appartement</option><option>Autre logement</option></select></div>
          <div className="grid gap-2"><Label htmlFor="s-heir">Un héritier sera-t-il sur place ?</Label><select id="s-heir" {...field("heirPresent")} className={selectClass}><option value="oui">Oui</option><option value="non">Non</option></select></div>
        </div>
        <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={remoteKeys} onChange={e => { setRemoteKeys(e.target.checked); setValues(prev => ({ ...prev, remoteKeys: e.target.checked ? "oui" : "non" })); }} className="size-4 accent-primary" />Remise des clés à distance</label>
        {remoteKeys && <div className="grid gap-2"><Label htmlFor="s-keys">Modalités de remise des clés</Label><Textarea id="s-keys" {...field("keyInstructions")} maxLength={1500} required placeholder="Clés remises par l'agence, un voisin ou le notaire… Ne saisissez aucun code d'accès." /></div>}
        <div className="grid gap-2"><Label htmlFor="s-valuables">Objets de valeur et souvenirs à mettre de côté</Label><Textarea id="s-valuables" {...field("valuables")} maxLength={2000} placeholder="Documents, bijoux, photos de famille, meubles à conserver…" /></div>
        <div className="grid gap-2"><Label htmlFor="s-furniture">Souhait pour le mobilier</Label><select id="s-furniture" {...field("furnitureChoice")} className={selectClass}><option value="don_revente">Don et revente selon les objets</option><option value="don">Privilégier le don</option><option value="revente">Privilégier la revente</option><option value="evacuation">Évacuation et recyclage</option></select></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2"><Label htmlFor="s-deadline">Date limite d'intervention</Label><Input id="s-deadline" {...field("deadline")} required type="date" /></div>
          <div className="grid gap-2"><Label htmlFor="s-reason">Motif de l'échéance</Label><select id="s-reason" {...field("deadlineReason")} className={selectClass}><option value="vente">Vente du bien</option><option value="bail">Fin de bail</option><option value="autre">Autre échéance</option></select></div>
        </div>
        <Button type="button" className="w-full sm:w-auto" onClick={e => { const form = e.currentTarget.form; if (form?.reportValidity()) setStep(2); }}>Continuer</Button>
      </div>
      <div className={step === 2 ? "space-y-6" : "hidden"}>
        <div><Label htmlFor="s-photos" className="flex items-center gap-2"><Camera className="size-4" />Photos avant débarras (1 à 8)</Label><Input id="s-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={reading || photos.length >= 8} className="mt-3" onChange={async e => {
          const files = Array.from(e.target.files ?? []).slice(0, 8 - photos.length);
          if (files.some(f => !["image/jpeg", "image/png", "image/webp"].includes(f.type) || f.size > 15 * 1024 * 1024)) { toast.error("Photos JPG, PNG ou WebP uniquement, 15 Mo maximum par photo."); return; }
          setReading(true);
          try { const urls = await Promise.all(files.map(f => fileToDataUrl(f))); setPhotos(prev => [...prev, ...urls]); } catch { toast.error("Photo illisible"); } finally { setReading(false); }
        }} />
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">{photos.map((photo, i) => <div key={i} className="relative"><img src={photo} alt={`Bien avant débarras ${i + 1}`} className="aspect-square w-full rounded-lg object-cover" /><Button type="button" variant="secondary" size="icon" className="absolute right-1 top-1 size-7" aria-label={`Retirer la photo ${i + 1}`} onClick={() => setPhotos(prev => prev.filter((_, j) => i !== j))}><Trash2 className="size-3" /></Button></div>)}</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="grid gap-2"><Label htmlFor="s-name">Votre nom</Label><Input id="s-name" {...field("fullName")} required={step === 2} maxLength={100} /></div><div className="grid gap-2"><Label htmlFor="s-phone">Téléphone</Label><Input id="s-phone" {...field("phone")} required={step === 2} type="tel" maxLength={30} /></div></div>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={values.heirsAgreement === "oui"} onChange={e => setValues(prev => ({ ...prev, heirsAgreement: e.target.checked ? "oui" : "non" }))} className="mt-0.5 size-4 shrink-0 accent-primary" />Je confirme avoir l'accord des héritiers pour organiser le débarras et j'accepte d'être contacté pour ce dossier.</label>
        <p className="text-xs text-muted-foreground">Votre adresse et vos consignes privées ne seront visibles que par le professionnel retenu. Votre demande est sans engagement ; le prix sera confirmé dans sa proposition.</p>
        <div className="flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={() => setStep(1)}>Retour</Button><Button type="submit" disabled={sending || reading}>{sending && <Loader2 className="mr-2 size-4 animate-spin" />}Envoyer mon dossier succession</Button></div>
      </div>
    </form>}
  </section>;
}