import { query, anyApi } from "./_generated/server";

export const funcA = query({
  args: {},
  handler: async (ctx: any) => {
    return ctx.runQuery(anyApi.b.funcB);
  },
});
