import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const retryMyPush = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const role = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "pro" });
  if (role.error || !role.data) throw new Error("Accès réservé aux professionnels.");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const rows = await supabaseAdmin.from("pro_notifications").select("id,delivery_token").eq("pro_id", context.userId).in("push_state", ["pending", "failed"]).lt("attempts", 3).order("created_at", { ascending: false }).limit(3);
  if (rows.error) throw rows.error;
  const { deliverProPush } = await import("./pro-notifications.server");
  for (const row of rows.data ?? []) await deliverProPush(row.id, row.delivery_token);
  return { checked: rows.data?.length ?? 0 };
});

export const getSectorResponse = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ postal: z.string().regex(/^\d{5}$/) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: result, error } = await context.supabase.rpc("sector_response_stats", { _postal: data.postal });
    if (error) throw new Error("Statistiques du secteur indisponibles.");
    return z.object({ sampleCount: z.number(), averageMinutes: z.number().nullable(), periodDays: z.number() }).parse(result);
  });