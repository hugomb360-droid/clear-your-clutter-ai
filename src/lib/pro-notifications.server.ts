import { notificationSummarySchema, notificationText } from "./pro-notifications";

/** Each invocation handles one recipient event, never a recipient list. */
export async function deliverProPush(eventId: string, deliveryToken: string) {
  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
  const { data: event, error } = await db.from("pro_notifications").select("*").eq("id", eventId).eq("delivery_token", deliveryToken).maybeSingle();
  if (error) throw error;
  if (!event) return { status: "forbidden" as const };
  if (["accepted", "skipped"].includes(event.push_state)) return { status: event.push_state };
  if (event.push_state === "sending" && event.attempted_at && Date.now() - Date.parse(event.attempted_at) < 120_000) return { status: "sending" };
  if (event.attempts >= 3) return { status: "failed" };
  const [pref, device, quote, role] = await Promise.all([
    db.from("pro_notification_preferences").select("push_enabled").eq("pro_id", event.pro_id).maybeSingle(),
    db.from("pro_push_devices").select("id,token").eq("pro_id", event.pro_id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    db.from("quotes").select("status,postal_code").eq("id", event.quote_id).maybeSingle(),
    db.rpc("has_role", { _user_id: event.pro_id, _role: "pro" }),
  ]);
  for (const result of [pref, device, quote, role]) if (result.error) throw result.error;
  const coverage = await db.rpc("pro_covers_postal", { _user_id: event.pro_id, _postal: quote.data?.postal_code ?? "" });
  if (coverage.error) throw coverage.error;
  const enabled = pref.data?.push_enabled && device.data && quote.data?.status === "published" && role.data && coverage.data;
  if (!enabled) {
    const skipped = await db.from("pro_notifications").update({ push_state: "skipped" }).eq("id", eventId).eq("attempts", event.attempts);
    if (skipped.error) throw skipped.error;
    return { status: "skipped" };
  }
  const apiKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["FIREBASE_MESSAGING_API_KEY"];
  if (!apiKey || !connectionKey) throw new Error("Push configuration unavailable");
  const claim = await db.from("pro_notifications").update({ push_state: "sending", attempts: event.attempts + 1, attempted_at: new Date().toISOString() }).eq("id", eventId).eq("push_state", event.push_state).eq("attempts", event.attempts).select("id").maybeSingle();
  if (claim.error) throw claim.error;
  if (!claim.data) return { status: "sending" };
  try {
    const summary = notificationSummarySchema.parse(event.summary);
    const response = await fetch("https://connector-gateway.lovable.dev/firebase_messaging/v1/projects/_/messages:send", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "X-Connection-Api-Key": connectionKey, "Content-Type": "application/json" },
      body: JSON.stringify({ message: { token: device.data.token,
        notification: { title: "Nouvelle demande de débarras", body: notificationText(summary) },
        data: { quoteId: event.quote_id, path: "/pro/dashboard" },
        webpush: { notification: { tag: event.id, icon: "/icons/app-192.png" }, fcm_options: { link: "https://debarrasfrance.fr/pro/dashboard" } },
      } }), signal: AbortSignal.timeout(4000),
    });
    const body = await response.text();
    if (!response.ok) {
      // Do not log the raw body: FCM may echo the private device token.
      let providerError = `FCM ${response.status}`;
      try { const parsed = JSON.parse(body); providerError += ` ${parsed.error?.status ?? ""} ${parsed.error?.message ?? ""}`; } catch { /* non-JSON response */ }
      providerError = providerError.replaceAll(device.data.token, "[device]");
      if (body.includes("UNREGISTERED")) {
        const removed = await db.from("pro_push_devices").delete().eq("id", device.data.id);
        if (removed.error) throw removed.error;
      }
      throw new Error(providerError);
    }
    const saved = await db.from("pro_notifications").update({ push_state: "accepted", push_error: null }).eq("id", eventId);
    if (saved.error) throw saved.error;
    return { status: "accepted" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Push failed";
    const failed = await db.from("pro_notifications").update({ push_state: "failed", push_error: message }).eq("id", eventId);
    if (failed.error) throw failed.error;
    throw new Error(message);
  }
}