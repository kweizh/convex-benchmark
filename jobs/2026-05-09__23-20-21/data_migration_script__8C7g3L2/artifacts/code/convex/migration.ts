import { mutation } from "./_generated/server";

export const seedTasks = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert("tasks", { text: "Buy milk", status: "todo" });
    await ctx.db.insert("tasks", { text: "Read book", status: "todo" });
    await ctx.db.insert("tasks", { text: "Write code", status: "done" });
  },
});
