import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { author, body } = await request.json();

    await ctx.runMutation(api.messages.sendMessage, {
      author,
      body,
    });

    return new Response(null, {
      status: 200,
    });
  }),
});

export default http;
