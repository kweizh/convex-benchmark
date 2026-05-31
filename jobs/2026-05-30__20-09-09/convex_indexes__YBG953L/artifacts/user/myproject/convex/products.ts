import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const seed = mutation({
  args: {
    runId: v.string(),
  },
  handler: async (ctx, args) => {
    // Insert sample products
    await ctx.db.insert({
      runId: args.runId,
      name: "Budget Laptop",
      category: "Electronics",
      price: 500,
      inStock: true,
    });

    await ctx.db.insert({
      runId: args.runId,
      name: "Premium Laptop",
      category: "Electronics",
      price: 1500,
      inStock: true,
    });

    await ctx.db.insert({
      runId: args.runId,
      name: "Running Shoes",
      category: "Sports",
      price: 120,
      inStock: true,
    });

    await ctx.db.insert({
      runId: args.runId,
      name: "Coffee Maker",
      category: "Kitchen",
      price: 80,
      inStock: false,
    });
  },
});

export const getByCategory = query({
  args: {
    runId: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_runId_and_category", (q) =>
        q.eq("runId", args.runId).eq("category", args.category)
      )
      .collect();
  },
});

export const getCheapByCategory = query({
  args: {
    runId: v.string(),
    category: v.string(),
    maxPrice: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_runId_category_price", (q) =>
        q
          .eq("runId", args.runId)
          .eq("category", args.category)
          .lte("price", args.maxPrice)
      )
      .collect();
  },
});