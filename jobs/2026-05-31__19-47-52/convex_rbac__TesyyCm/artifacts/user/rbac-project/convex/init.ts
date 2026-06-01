import { mutation } from "./_generated/server";

import { usersTableName } from "./tableNames";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const adminId = await ctx.db.insert(usersTableName, {
      name: "Admin",
      role: "admin",
    });
    const editorId = await ctx.db.insert(usersTableName, {
      name: "Editor",
      role: "editor",
    });
    const viewerId = await ctx.db.insert(usersTableName, {
      name: "Viewer",
      role: "viewer",
    });

    return { adminId, editorId, viewerId };
  },
});
