import { internalMutation } from "./_generated/server";

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    const totalValue = events.reduce((sum, event) => sum + event.value, 0);
    await ctx.db.insert("aggregations", { totalValue });
  },
});
