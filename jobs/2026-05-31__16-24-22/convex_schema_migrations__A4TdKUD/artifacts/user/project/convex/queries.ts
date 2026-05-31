import { query } from "./_generated/server";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("tasks_zr_a4tdkud").collect();
  },
});
