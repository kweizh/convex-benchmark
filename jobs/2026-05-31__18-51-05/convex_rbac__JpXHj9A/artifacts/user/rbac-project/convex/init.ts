import { mutation } from "./_generated/server";

const runId = (process.env.ZEALT_RUN_ID || "default").replace(/-/g, "_");
const usersTable = `users_${runId}` as any;

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const adminId = await ctx.db.insert(usersTable, {
      name: "Admin",
      role: "admin",
    });
    const editorId = await ctx.db.insert(usersTable, {
      name: "Editor",
      role: "editor",
    });
    const viewerId = await ctx.db.insert(usersTable, {
      name: "Viewer",
      role: "viewer",
    });
    return { adminId, editorId, viewerId };
  },
});
