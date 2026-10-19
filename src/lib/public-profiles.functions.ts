import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { PublicPro } from "./public-profiles";

const publicProSchema = z.object({
  slug: z.string(), company_name: z.string(), description: z.string().nullable(), postal_codes: z.array(z.string()),
  service_types: z.array(z.string()), logo_path: z.string().nullable(), portfolio_paths: z.array(z.string()),
  siret_verified: z.boolean(), insurance_verified: z.boolean(), completed_count: z.number(),
  reviews: z.array(z.object({ rating: z.number(), comment: z.string().nullable(), created_at: z.string() })),
});
export const getPublicProfessionals = createServerFn({ method: "GET" }).handler(async (): Promise<PublicPro[]> => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error("Annuaire temporairement indisponible.");
  const s = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await s.rpc("list_public_professionals");
  if (error) throw new Error("Impossible de charger les professionnels.");
  const profiles = z.array(publicProSchema).parse(data);
  return Promise.all(profiles.map(async pro => {
    const paths = [pro.logo_path, ...pro.portfolio_paths].filter((p): p is string => Boolean(p));
    if (!paths.length) return pro;
    const { data: signed, error: signError } = await s.storage.from("pro-public-media").createSignedUrls(paths, 3600);
    if (signError) return pro;
    const browserOrigin = import.meta.env['VITE_SUPABASE_URL'];
    const urls = new Map((signed ?? []).map(row => [row.path, row.signedUrl?.replace(url, browserOrigin) ?? ""]));
    return { ...pro, logo_url: (pro.logo_path ? urls.get(pro.logo_path) : "") ?? "", portfolio_urls: pro.portfolio_paths.map(p => urls.get(p) ?? "").filter(Boolean) };
  }));
});