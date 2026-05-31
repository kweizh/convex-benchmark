import { mutation } from "./_generated/server";

export const backfillPriority = mutation({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks_zr_a4tdkud").collect();
    for (const task of tasks) {
      if ((task as any).priority === undefined) {
        await ctx.db.patch(task._id, { priority: "medium" });
      }
    }
  },
});
