import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/exportProducts",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const records = await ctx.runQuery(internal.products.getAllProducts, {});
    return new Response(JSON.stringify(records), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
});

export default http;