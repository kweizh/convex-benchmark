import { mutation } from "./_generated/server";

const runId = process.env.ZEALT_RUN_ID || "";
const safeRunId = runId.replace(/-/g, "_");

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const adminId = await ctx.db.insert(`users_${safeRunId}`, {
      name: "Admin",
      role: "admin",
    });
    const editorId = await ctx.db.insert(`users_${safeRunId}`, {
      name: "Editor",
      role: "editor",
    });
    const viewerId = await ctx.db.insert(`users_${safeRunId}`, {
      name: "Viewer",
      role: "viewer",
    });
    return { adminId, editorId, viewerId };
  },
});
