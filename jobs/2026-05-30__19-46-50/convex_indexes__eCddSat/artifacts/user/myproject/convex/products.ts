import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const seed = mutation({
  args: { runId: v.string() },
  handler: async (ctx, { runId }) => {
    const products = [
      {
        runId,
        name: "Budget Laptop",
        category: "Electronics",
        price: 500,
        inStock: true,
      },
      {
        runId,
        name: "Premium Laptop",
        category: "Electronics",
        price: 1500,
        inStock: true,
      },
      {
        runId,
        name: "Office Chair",
        category: "Furniture",
        price: 200,
        inStock: false,
      },
    ];

    for (const product of products) {
      await ctx.db.insert("products", product);
    }
  },
});

export const getByCategory = query({
  args: { runId: v.string(), category: v.string() },
  handler: (ctx, { runId, category }) => {
    return ctx.db
      .query("products")
      .withIndex("by_runId_and_category", (q) =>
        q.eq("runId", runId).eq("category", category),
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
  handler: (ctx, { runId, category, maxPrice }) => {
    return ctx.db
      .query("products")
      .withIndex("by_runId_category_price", (q) =>
        q.eq("runId", runId).eq("category", category).lte("price", maxPrice),
      )
      .collect();
  },
});
