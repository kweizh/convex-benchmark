import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/exportProducts",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const records = await ctx.runQuery(api.products.list);
    return new Response(JSON.stringify(records), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
});

export default http;
