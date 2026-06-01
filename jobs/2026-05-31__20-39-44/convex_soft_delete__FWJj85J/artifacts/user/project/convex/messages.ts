import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages_zr_fwjj85j", {
      text: args.text,
      isDeleted: false,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("messages_zr_fwjj85j") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isDeleted: true });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("messages_zr_fwjj85j")
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .collect();
  },
});