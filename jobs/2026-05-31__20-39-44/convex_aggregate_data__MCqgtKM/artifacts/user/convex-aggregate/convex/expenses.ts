import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { TableAggregate } from "@convex-dev/aggregate";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

const expenseAggregate = new TableAggregate<{
  Namespace: string;
  Key: number;
  DataModel: DataModel;
  TableName: "expenses";
}>(components.aggregate, {
  namespace: (doc) => doc.category,
  sortKey: (doc) => doc._creationTime,
  sumValue: (doc) => doc.amount,
});

export const addExpense = mutation({
  args: {
    category: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, { category, amount }) => {
    const id = await ctx.db.insert("expenses", { category, amount });
    const doc = await ctx.db.get(id);
    await expenseAggregate.insert(ctx, doc!);
    return id;
  },
});

export const getCategoryStats = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, { category }) => {
    const count = await expenseAggregate.count(ctx, { namespace: category });
    const totalAmount = await expenseAggregate.sum(ctx, { namespace: category });
    return { count, totalAmount };
  },
});