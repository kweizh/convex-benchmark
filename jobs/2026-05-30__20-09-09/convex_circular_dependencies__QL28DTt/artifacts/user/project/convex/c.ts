import { query, anyApi } from "./_generated/server";

export const funcC = query({
  args: {},
  handler: async (ctx: any) => {
    return ctx.runQuery(anyApi.a.funcA);
  },
});
