import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";
import type { Database } from "@/integrations/supabase/types";

let _supabase: ReturnType<typeof createClient<Database>> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient<Database>(
      process.env['SUPABASE_URL']!,
      process.env['SUPABASE_SERVICE_ROLE_KEY']!,
    );
  }
  return _supabase;
}

async function fulfill(session: any, env: StripeEnv) {
  const bidId = session.metadata?.bidId;
  const quoteId = session.metadata?.quoteId;
  if (!bidId) return;

  const supabase = getSupabase();
  await supabase
    .from("payments")
    .update({
      status: "held",
      paid_at: new Date().toISOString(),
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
      stripe_session_id: session.id,
      environment: env,
    })
    .eq("bid_id", bidId);

  await supabase.from("bids").update({ status: "accepted" }).eq("id", bidId);
  if (quoteId) await supabase.from("quotes").update({ status: "matched" }).eq("id", quoteId);
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.payment_status !== "unpaid") await fulfill(session, env);
      break;
    }
    case "checkout.session.async_payment_succeeded":
      await fulfill(event.data.object, env);
      break;
    case "checkout.session.async_payment_failed": {
      const bidId = event.data.object?.metadata?.bidId;
      if (bidId) {
        await getSupabase().from("payments").update({ status: "failed" }).eq("bid_id", bidId);
      }
      break;
    }
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
