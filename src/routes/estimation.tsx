import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Loader2, PencilLine, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { estimateClearance } from "@/lib/estimate.functions";
import { dataUrlToBlob, fileToDataUrl } from "@/lib/image";
import { PROPERTY_LABELS, euro, type EstimationResult, type PropertyType } from "@/lib/pricing";

export const Route = createFileRoute("/estimation")({
  head: () => ({
    meta: [
      { title: "Estimation de débarras en photo — Clearo" },
      {
        name: "description",
        content:
          "Déposez vos photos, notre IA estime le volume et le prix de votre débarras en quelques secondes. Devis gratuit et sans engagement.",
      },
      { property: "og:title", content: "Estimez votre débarras en 2 minutes" },
      {
        property: "og:description",
        content: "Photos, volume estimé, prix immédiat et mise en relation avec un pro local.",
      },
    ],
  }),
  component: EstimationPage,
});

const DRAFT_KEY = "clearo-draft";

type Mode = "photo" | "manuel";

type Draft = {
  mode: Mode;
  photos: string[];
  propertyType: PropertyType;
  surface: string;
  floor: string;
  hasElevator: boolean;
  notes: string;
  postalCode: string;
  city: string;
  address: string;
  phone: string;
  fullName: string;
  desiredDate: string;
  result: EstimationResult | null;
};

function EstimationPage() {
  const navigate = useNavigate();
  const estimate = useServerFn(estimateClearance);
  const fileInput = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<Mode | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState<PropertyType>("appartement");
  const [surface, setSurface] = useState("");
  const [floor, setFloor] = useState("0");
  const [hasElevator, setHasElevator] = useState(false);
  const [notes, setNotes] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as Draft;
      setMode(draft.mode ?? null);
      setPhotos(draft.photos ?? []);
      setPropertyType(draft.propertyType ?? "appartement");
      setSurface(draft.surface ?? "");
      setFloor(draft.floor ?? "0");
      setHasElevator(Boolean(draft.hasElevator));
      setNotes(draft.notes ?? "");
      setPostalCode(draft.postalCode ?? "");
      setCity(draft.city ?? "");
      setAddress(draft.address ?? "");
      setPhone(draft.phone ?? "");
      setFullName(draft.fullName ?? "");
      setDesiredDate(draft.desiredDate ?? "");
      setResult(draft.result ?? null);
    } catch {
      sessionStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  const currentDraft = (): Draft => ({
    mode: mode ?? "photo",
    photos,
    propertyType,
    surface,
    floor,
    hasElevator,
    notes,
    postalCode,
    city,
    address,
    phone,
    fullName,
    desiredDate,
    result,
  });

  const chooseMode = (next: Mode) => {
    setMode(next);
    setResult(null);
    if (next === "manuel") setPhotos([]);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const remaining = 8 - photos.length;
    const selected = Array.from(files).slice(0, Math.max(0, remaining));
    try {
      const urls = await Promise.all(selected.map((file) => fileToDataUrl(file)));
      setPhotos((prev) => [...prev, ...urls]);
    } catch {
      toast.error("Une photo n'a pas pu être lue");
    }
  };

  const runEstimate = async () => {
    if (photos.length === 0) {
      toast.error("Ajoutez au moins une photo", {
        description: "L'estimation IA se base sur vos photos.",
      });
      return;
    }
    setAnalyzing(true);
    try {
      const estimation = await estimate({
        data: isPhoto
          ? { images: photos }
          : {
              propertyType: PROPERTY_LABELS[propertyType],
              ...(Number.isFinite(Number.parseInt(surface, 10)) && Number.parseInt(surface, 10) > 0
                ? { surfaceM2: Number.parseInt(surface, 10) }
                : {}),
              floor: Number.parseInt(floor, 10) || 0,
              hasElevator,
              notes,
              images: photos,
            },
      });
      setResult(estimation);
      toast.success("Estimation prête");
    } catch (error) {
      toast.error("Estimation impossible", {
        description: error instanceof Error ? error.message : "Réessayez dans un instant.",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const publish = async () => {
    if (mode === "photo" && !result) return;
    if (mode === "manuel" && notes.trim().length < 15) {
      toast.error("Décrivez ce qu'il y a à débarrasser", {
        description: "Quelques mots suffisent pour que les pros puissent chiffrer.",
      });
      return;
    }
    if (!postalCode.trim()) {
      toast.error("Indiquez votre code postal");
      return;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(currentDraft()));
      toast.info("Créez votre compte pour envoyer la demande aux pros de votre secteur.");
      navigate({ to: "/auth", search: { mode: "signup", role: "client", redirect: "/estimation" } });
      return;
    }

    setPublishing(true);
    try {
      const surfaceValue = Number.parseInt(surface, 10);
      const { data: quote, error } = await supabase
        .from("quotes")
        .insert({
          client_id: session.user.id,
          property_type: isPhoto ? "Non précisé" : PROPERTY_LABELS[propertyType],
          surface_m2:
            !isPhoto && Number.isFinite(surfaceValue) && surfaceValue > 0 ? surfaceValue : null,
          floor: isPhoto ? 0 : Number.parseInt(floor, 10) || 0,
          has_elevator: isPhoto ? false : hasElevator,
          postal_code: postalCode.trim(),
          city: city.trim() || null,
          desired_date: desiredDate || null,
          notes: isPhoto ? null : notes || null,
          volume_m3: result?.analysis.volumeM3 ?? null,
          price_min: result?.price.priceMin ?? null,
          price_max: result?.price.priceMax ?? null,
          ai_analysis: result ? JSON.parse(JSON.stringify(result)) : null,
          status: "published",
        })
        .select("id")
        .single();
      if (error || !quote) throw error ?? new Error("Création impossible");

      await supabase.from("quote_contacts").insert({
        quote_id: quote.id,
        full_name: fullName || null,
        phone: phone || null,
        email: session.user.email ?? null,
        address: address || null,
      });

      for (const [index, dataUrl] of photos.entries()) {
        const path = `${session.user.id}/${quote.id}/${index}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("quote-photos")
          .upload(path, dataUrlToBlob(dataUrl), { contentType: "image/jpeg", upsert: true });
        if (!uploadError) {
          await supabase.from("quote_photos").insert({ quote_id: quote.id, storage_path: path });
        }
      }

      sessionStorage.removeItem(DRAFT_KEY);
      toast.success("Demande envoyée aux pros de votre secteur !");
      navigate({ to: "/compte" });
    } catch (error) {
      toast.error("Envoi impossible", {
        description: error instanceof Error ? error.message : "Réessayez dans un instant.",
      });
    } finally {
      setPublishing(false);
    }
  };

  if (!mode) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Comment voulez-vous votre devis ?
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Deux façons d'obtenir un prix : l'estimation instantanée par photos grâce à notre IA, ou
          la demande de devis classique en décrivant vous-même le débarras.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <button
            type="button"
            onClick={() => chooseMode("photo")}
            className="group relative rounded-3xl border-2 border-primary bg-brand-soft/40 p-8 text-left shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1"
          >
            <Badge className="absolute right-6 top-6">Recommandé</Badge>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Sparkles className="size-6" />
            </div>
            <h2 className="mt-5 text-2xl font-bold">Estimation IA par photos</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Prenez vos pièces en photo, notre IA calcule le volume, la nature des objets et vous
              donne une fourchette de prix immédiate.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              <li>• Résultat en quelques secondes</li>
              <li>• Prix chiffré avant même de parler à un pro</li>
              <li>• Les pros voient vos photos et répondent plus vite</li>
            </ul>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brand">
              Démarrer avec mes photos →
            </span>
          </button>

          <button
            type="button"
            onClick={() => chooseMode("manuel")}
            className="rounded-3xl border border-border bg-card p-8 text-left shadow-[var(--shadow-soft)] transition-colors hover:border-primary/40"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
              <PencilLine className="size-6" />
            </div>
            <h2 className="mt-5 text-2xl font-bold">Devis classique</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pas de photos sous la main ? Décrivez la surface et ce qu'il y a à débarrasser, les
              pros de votre secteur vous envoient leurs propositions.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li>• Sans photo</li>
              <li>• Prix communiqué par les professionnels</li>
              <li>• Réponses sous 24 à 48 h</li>
            </ul>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold">
              Décrire mon débarras →
            </span>
          </button>
        </div>
      </div>
    );
  }

  const isPhoto = mode === "photo";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={isPhoto ? "default" : "secondary"}>
          {isPhoto ? "Estimation IA par photos" : "Devis classique"}
        </Badge>
        <button
          type="button"
          onClick={() => chooseMode(isPhoto ? "manuel" : "photo")}
          className="text-sm font-medium text-brand underline-offset-4 hover:underline"
        >
          {isPhoto ? "Passer au devis classique" : "Passer à l'estimation IA par photos"}
        </button>
      </div>

      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
        {isPhoto ? "Estimez votre débarras en photos" : "Décrivez votre débarras"}
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {isPhoto
          ? "Ajoutez vos photos, notre IA calcule le volume et le prix. Gratuit et sans engagement."
          : "Renseignez la surface et le contenu à évacuer : les pros de votre secteur vous répondent avec leur prix."}
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          {isPhoto && (
            <section className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
              <h2 className="text-lg font-bold">1. Vos photos</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Jusqu'à 8 photos. Cadrez large pour montrer l'ensemble de la pièce.
              </p>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  void handleFiles(event.target.files);
                  event.target.value = "";
                }}
              />
              <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {photos.map((photo, index) => (
                  <div key={photo.slice(-40) + index} className="group relative">
                    <img
                      src={photo}
                      alt={`Photo du débarras ${index + 1}`}
                      className="aspect-square w-full rounded-2xl object-cover"
                    />
                    <button
                      type="button"
                      aria-label="Supprimer la photo"
                      onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== index))}
                      className="absolute right-1.5 top-1.5 rounded-full bg-background/90 p-1.5 text-destructive shadow"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
                {photos.length < 8 && (
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-xs text-muted-foreground transition-colors hover:border-primary hover:text-brand"
                  >
                    <Camera className="size-5" />
                    Ajouter
                  </button>
                )}
              </div>
            </section>
          )}

          {!isPhoto && (
            <section className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
              <h2 className="text-lg font-bold">1. Le bien à débarrasser</h2>
              <div className="mt-5 grid gap-5">
                <div className="grid gap-2">
                  <Label>Type de bien</Label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(PROPERTY_LABELS) as PropertyType[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPropertyType(key)}
                        className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                          propertyType === key
                            ? "border-primary bg-brand-soft text-brand-ink"
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        {PROPERTY_LABELS[key]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="surface">Surface (m²) *</Label>
                    <Input
                      id="surface"
                      inputMode="numeric"
                      placeholder="45"
                      value={surface}
                      onChange={(e) => setSurface(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="floor">Étage</Label>
                    <Input
                      id="floor"
                      inputMode="numeric"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="elevator">Ascenseur</Label>
                    <div className="flex h-9 items-center gap-3">
                      <Switch id="elevator" checked={hasElevator} onCheckedChange={setHasElevator} />
                      <span className="text-sm text-muted-foreground">
                        {hasElevator ? "Oui" : "Non"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Ce qu'il y a à débarrasser *</Label>
                  <Textarea
                    id="notes"
                    rows={6}
                    placeholder="Ex : cave pleine de cartons, un canapé et un vieux frigo, accès par une cour."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </section>
          )}

          {isPhoto && (
            <section className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
              <h2 className="text-lg font-bold">2. Lancer l'estimation IA</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Notre IA analyse vos photos et calcule le volume + la fourchette de prix.
              </p>
              <Button size="lg" className="mt-5 w-full" onClick={runEstimate} disabled={analyzing}>
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" /> Estimer mon débarras
                  </>
                )}
              </Button>
            </section>
          )}

          <section className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-bold">{isPhoto ? "3." : "2."} Où et quand ?</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="postal">Code postal *</Label>
                <Input
                  id="postal"
                  required
                  placeholder="75011"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="address">Adresse (visible seulement du pro retenu)</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullname">Nom</Label>
                <Input
                  id="fullname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="date">Date souhaitée</Label>
                <Input
                  id="date"
                  type="date"
                  value={desiredDate}
                  onChange={(e) => setDesiredDate(e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-bold">
              {isPhoto ? "Votre devis Clearo" : "Votre demande de devis"}
            </h2>
            {!isPhoto ? (
              <div className="mt-5 space-y-5">
                <p className="text-sm text-muted-foreground">
                  Sans photo, le prix est fixé directement par les professionnels de votre secteur.
                  Vous recevez leurs propositions dans votre espace client.
                </p>
                <div className="rounded-2xl bg-brand-soft/50 p-4 text-sm">
                  <p className="font-semibold text-brand-ink">Envie d'un prix tout de suite ?</p>
                  <p className="mt-1 text-muted-foreground">
                    L'estimation IA par photos vous donne une fourchette en quelques secondes.
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-3 w-full"
                    onClick={() => chooseMode("photo")}
                  >
                    <Sparkles className="mr-2 size-4" /> Essayer l'estimation IA
                  </Button>
                </div>
                <Button size="lg" className="w-full" onClick={publish} disabled={publishing}>
                  {publishing ? "Envoi..." : "Envoyer ma demande aux pros"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Vos coordonnées ne sont transmises qu'au professionnel dont vous acceptez la
                  proposition.
                </p>
              </div>
            ) : !result ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Lancez l'estimation pour découvrir le volume estimé et la fourchette de prix. Aucune
                carte bancaire, aucun engagement.
              </p>
            ) : (
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground">Fourchette estimée</p>
                  <p className="text-3xl font-extrabold text-brand">
                    {euro(result.price.priceMin)} – {euro(result.price.priceMax)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Volume estimé : {result.analysis.volumeM3} m³ · Confiance{" "}
                    {result.analysis.confidence}
                  </p>
                </div>
                {result.analysis.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="rounded-2xl bg-secondary/60 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base volume</span>
                    <span>{euro(result.price.base)}</span>
                  </div>
                  {result.price.surcharges.map((surcharge) => (
                    <div key={surcharge.label} className="mt-2 flex justify-between">
                      <span className="text-muted-foreground">{surcharge.label}</span>
                      <span>+{euro(surcharge.amount)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{result.analysis.summary}</p>
                <Button size="lg" className="w-full" onClick={publish} disabled={publishing}>
                  {publishing ? "Envoi..." : "Envoyer aux pros de mon secteur"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Vos coordonnées ne sont transmises qu'au professionnel dont vous acceptez la
                  proposition.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
