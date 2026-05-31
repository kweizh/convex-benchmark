import { mutation } from "./_generated/server";

export const backfillPriority = mutation({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks_zr_quoxduw").collect();
    for (const task of tasks) {
      if (!task.priority) {
        await ctx.db.patch(task._id, { priority: "medium" });
      }
    }
  },
});
