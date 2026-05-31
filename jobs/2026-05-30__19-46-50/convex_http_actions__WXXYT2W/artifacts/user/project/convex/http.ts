import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      return new Response("Invalid JSON", { status: 400 });
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("payload" in body) ||
      !("runId" in body) ||
      typeof (body as { payload: unknown }).payload !== "string" ||
      typeof (body as { runId: unknown }).runId !== "string"
    ) {
      return new Response("Invalid payload", { status: 400 });
    }

    const { payload, runId } = body as { payload: string; runId: string };

    await ctx.runMutation(internal.webhooksInternal.insertWebhook, {
      payload,
      runId,
    });

    return new Response("OK", { status: 200 });
  }),
});

export default http;
