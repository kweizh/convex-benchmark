import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { payload, runId } = await request.json();

    if (typeof payload !== "string" || typeof runId !== "string") {
      return new Response("Invalid payload or runId", { status: 400 });
    }

    await ctx.runMutation(internal.webhooks.insert_webhook, {
      payload,
      runId,
    });

    return new Response(null, { status: 200 });
  }),
});

export default http;
