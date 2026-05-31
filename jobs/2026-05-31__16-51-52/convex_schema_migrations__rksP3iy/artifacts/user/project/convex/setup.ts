import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert("tasks_zr_rksp3iy", { text: "Buy groceries", isCompleted: true });
    await ctx.db.insert("tasks_zr_rksp3iy", { text: "Go for a swim", isCompleted: true });
    await ctx.db.insert("tasks_zr_rksp3iy", { text: "Integrate Convex", isCompleted: false });
  },
});
