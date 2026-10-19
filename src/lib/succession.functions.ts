import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { successionSchema, reportSchema, referralSchema, reportAvailable } from "./succession.schemas";

const idSchema = z.object({ bidId: z.string().uuid() });

export const createSuccession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ details: successionSchema, photos: z.array(z.string().max(2_000_000).regex(/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/)).min(1).max(8) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: pro, error: roleError } = await supabase.rpc("has_role", { _user_id: userId, _role: "pro" });
    if (roleError || pro) throw new Error("Cette demande est réservée aux comptes clients.");
    const { data: user } = await supabase.auth.getUser();
    const { data: quoteId, error } = await supabase.rpc("create_succession_request", { payload: { ...data.details, email: user.user?.email ?? "" } });
    if (error || !quoteId) throw new Error("Impossible d'enregistrer le dossier.");
    const paths: string[] = [];
    try {
      for (const [index, photo] of data.photos.entries()) {
        const base64 = photo.split(",")[1];
        if (!base64) throw new Error("Photo invalide");
        const bytes = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
        const path = `${userId}/${quoteId}/${index}.jpg`;
        const upload = await supabase.storage.from("quote-photos").upload(path, bytes, { contentType: "image/jpeg" });
        if (upload.error) throw new Error("Une photo n'a pas pu être enregistrée.");
        paths.push(path);
        const row = await supabase.from("quote_photos").insert({ quote_id: quoteId, storage_path: path });
        if (row.error) throw new Error("Impossible de joindre les photos.");
      }
      const published = await supabase.from("quotes").update({ status: "published" }).eq("id", quoteId);
      if (published.error) throw new Error("Impossible d'envoyer le dossier aux professionnels.");
      return { quoteId };
    } catch (error) {
      if (paths.length) await supabase.storage.from("quote-photos").remove(paths);
      await supabase.from("quotes").delete().eq("id", quoteId);
      throw error;
    }
  });

export const saveMissionReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => reportSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: bid, error: bidError } = await context.supabase.from("bids").select("pro_id,status").eq("id", data.bidId).single();
    if (bidError || !bid || bid.pro_id !== context.userId || bid.status !== "accepted") throw new Error("Cette mission ne peut pas être modifiée.");
    const { error } = await context.supabase.from("mission_reports").upsert({ bid_id: data.bidId, volume_m3: data.volumeM3, recycling: data.recycling });
    if (error) throw new Error("Le rapport n'a pas pu être enregistré.");
    return { saved: true };
  });

export const getMissionReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => idSchema.parse(input))
  .handler(async ({ data, context }) => {
    const s = context.supabase;
    const { data: bid, error } = await s.from("bids").select("id,quote_id,pro_id,status").eq("id", data.bidId).single();
    if (error || !bid || !reportAvailable(bid.status)) throw new Error("Le rapport sera disponible après la fin du chantier, hors litige.");
    const [{ data: quote }, { data: report }, { data: contact }, { data: before, error: beforeError }, { data: after, error: afterError }] = await Promise.all([
      s.from("quotes").select("client_id,property_type,city,postal_code").eq("id", bid.quote_id).single(),
      s.from("mission_reports").select("volume_m3,recycling,created_at").eq("bid_id", bid.id).single(),
      s.from("quote_contacts").select("address").eq("quote_id", bid.quote_id).maybeSingle(),
      s.from("quote_photos").select("storage_path").eq("quote_id", bid.quote_id).order("created_at"),
      s.from("mission_photos").select("storage_path").eq("bid_id", bid.id).eq("kind", "completion").order("created_at"),
    ]);
    if (!quote || (quote.client_id !== context.userId && bid.pro_id !== context.userId)) throw new Error("Accès au rapport refusé.");
    if (!report) throw new Error("Le professionnel doit renseigner les volumes et filières avant de générer ce rapport.");
    if (beforeError || afterError || !before?.length || !after?.length) throw new Error("Les photos avant et après sont nécessaires au rapport.");
    const sign = async (bucket: string, rows: { storage_path: string }[]) => {
      const result = await s.storage.from(bucket).createSignedUrls(rows.map(r => r.storage_path), 300);
      if (result.error || result.data?.some(r => !r.signedUrl)) throw new Error("Impossible de charger les photos du rapport.");
      return result.data?.map(r => r.signedUrl).filter((url): url is string => typeof url === "string") ?? [];
    };
    return { bidId: bid.id, quoteId: bid.quote_id, status: bid.status, address: contact?.address ?? "Adresse non renseignée", city: quote.city ?? "", postalCode: quote.postal_code, propertyType: quote.property_type, volumeM3: Number(report.volume_m3), recycling: report.recycling, date: report.created_at, before: await sign("quote-photos", before), after: await sign("mission-photos", after) };
  });

export const contactReferral = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => referralSchema.parse(input))
  .handler(async ({ data }) => {
    // Public submission only: privileged write after validation; no private reads.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("referral_contacts").insert({ organization: data.organization, profession: data.profession, name: data.name, email: data.email, phone: data.phone, message: data.message });
    if (error) throw new Error("Demande non enregistrée. Réessayez plus tard ou écrivez à clientclearo@gmail.com.");
    return { sent: true };
  });