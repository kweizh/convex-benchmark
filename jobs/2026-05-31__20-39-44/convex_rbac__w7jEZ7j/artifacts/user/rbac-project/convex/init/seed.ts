import { mutation } from "../_generated/server";
import { v } from "convex/values";

const runId = (process.env.ZEALT_RUN_ID as string).replace(/-/g, "_");

export default mutation({
  args: {},
  handler: async (ctx) => {
    const adminId = await ctx.db.insert(`users_${runId}`, {
      name: "Admin",
      role: "admin",
    });

    const editorId = await ctx.db.insert(`users_${runId}`, {
      name: "Editor",
      role: "editor",
    });

    const viewerId = await ctx.db.insert(`users_${runId}`, {
      name: "Viewer",
      role: "viewer",
    });

    return { adminId, editorId, viewerId };
  },
});