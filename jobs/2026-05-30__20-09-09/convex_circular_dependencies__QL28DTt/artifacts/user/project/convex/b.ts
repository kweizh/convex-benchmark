import { query, anyApi } from "./_generated/server";

export const funcB = query({
  args: {},
  handler: async (ctx: any) => {
    return ctx.runQuery(anyApi.c.funcC);
  },
});
