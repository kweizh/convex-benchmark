import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new document.
 * @param title - The title of the document.
 * @returns The ID of the created document.
 */
export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("documents", {
      title: args.title,
      isDeleted: false,
    });
    return id;
  },
});

/**
 * Soft delete a document by setting isDeleted to true.
 * @param id - The ID of the document to soft delete.
 */
export const softDelete = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isDeleted: true,
    });
  },
});

/**
 * List all active (non-deleted) documents.
 * Uses the by_deleted index for efficiency.
 */
export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_deleted", (q) => q.eq("isDeleted", false))
      .collect();
  },
});
