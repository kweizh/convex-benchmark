import { mutation } from "./_generated/server";

export const backfillTasks = mutation({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    const updates = tasks.map((task) => {
      if (task.isCompleted !== undefined) {
        return null;
      }
      return ctx.db.patch(task._id, { isCompleted: false });
    });
    await Promise.all(updates.filter(Boolean));
  },
});
