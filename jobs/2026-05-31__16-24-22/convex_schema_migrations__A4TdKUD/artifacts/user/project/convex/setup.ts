import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert("tasks_zr_a4tdkud", { text: "Buy groceries", isCompleted: true });
    await ctx.db.insert("tasks_zr_a4tdkud", { text: "Go for a swim", isCompleted: true });
    await ctx.db.insert("tasks_zr_a4tdkud", { text: "Integrate Convex", isCompleted: false });
  },
});
