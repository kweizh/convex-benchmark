import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/exportProducts",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const products = await ctx.runQuery(api.products.getProducts);
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
});

export default http;
