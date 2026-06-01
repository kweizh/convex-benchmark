import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";

const runId = (process.env.ZEALT_RUN_ID || "default").replace(/-/g, "_");
const usersTable = `users_${runId}` as any;
const documentsTable = `documents_${runId}` as any;

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query(documentsTable).collect();
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId as any);
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      throw new ConvexError("Unauthorized");
    }
    return await ctx.db.insert(documentsTable, {
      title: args.title,
      content: args.content,
      authorId: args.userId as any,
    });
  },
});

const deleteMutation = mutation({
  args: {
    userId: v.string(),
    documentId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId as any);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Unauthorized");
    }
    await ctx.db.delete(args.documentId as any);
  },
});

export { deleteMutation as delete };
