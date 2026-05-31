import { mutation, query } from "./_generated/server.js";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    age: v.number(),
    role: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("users", {
      name: args.name,
      age: args.age,
      role: args.role,
    });
  },
});

export const getUsersByRole = query({
  args: {
    role: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), args.role))
      .collect();
  },
});
