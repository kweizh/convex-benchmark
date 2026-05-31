import { mutation } from "./_generated/server";

export const backfillPriority = mutation({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks_zr_wo4sgv8").collect();
    for (const task of tasks) {
      if (task.priority === undefined) {
        await ctx.db.patch(task._id, { priority: "medium" });
      }
    }
  },
});