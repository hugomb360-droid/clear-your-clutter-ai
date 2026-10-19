import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/api/public/notifications/new-request")({
  server: { handlers: { POST: async ({ request }) => {
    if (Number(request.headers.get("content-length") ?? 0) > 1024) return new Response(null, { status: 413 });
    const text = await request.text();
    if (text.length > 1024) return new Response(null, { status: 413 });
    let input;
    try { input = z.object({ eventId: z.string().uuid(), deliveryToken: z.string().uuid() }).parse(JSON.parse(text)); }
    catch { return new Response(null, { status: 400 }); }
    try {
      const { deliverProPush } = await import("@/lib/pro-notifications.server");
      const result = await deliverProPush(input.eventId, input.deliveryToken);
      return Response.json(result, { status: result.status === "forbidden" ? 403 : 200 });
    } catch { return Response.json({ error: "Notification unavailable" }, { status: 503 }); }
  } } },
});