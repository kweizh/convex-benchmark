import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

const runId = process.env.ZEALT_RUN_ID || "";
const safeRunId = runId.replace(/-/g, "_");

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query(`documents_${safeRunId}`).collect();
  },
});

export const create = mutation({
  args: { userId: v.string(), title: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(ctx.db.normalizeId(`users_${safeRunId}`, args.userId) as any);
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      throw new ConvexError("Unauthorized");
    }
    
    const documentId = await ctx.db.insert(`documents_${safeRunId}`, {
      title: args.title,
      content: args.content,
      authorId: user._id,
    });
    return documentId;
  },
});

const deleteMutation = mutation({
  args: { userId: v.string(), documentId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(ctx.db.normalizeId(`users_${safeRunId}`, args.userId) as any);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Unauthorized");
    }
    
    await ctx.db.delete(ctx.db.normalizeId(`documents_${safeRunId}`, args.documentId) as any);
  },
});

export { deleteMutation as delete };
