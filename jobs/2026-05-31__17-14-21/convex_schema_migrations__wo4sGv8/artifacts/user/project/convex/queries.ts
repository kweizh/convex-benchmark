import { query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks_zr_wo4sgv8").collect();
  },
});