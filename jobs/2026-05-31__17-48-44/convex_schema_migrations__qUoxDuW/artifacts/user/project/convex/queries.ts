import { query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("tasks_zr_quoxduw").collect(),
});
