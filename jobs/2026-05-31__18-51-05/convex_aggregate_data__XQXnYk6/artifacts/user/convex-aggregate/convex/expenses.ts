import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { TableAggregate } from "@convex-dev/aggregate";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";

const expensesAggregate = new TableAggregate<{
  Namespace: string;
  Key: number;
  DataModel: DataModel;
  TableName: "expenses";
}>(components.expensesAggregate, {
  namespace: (doc) => doc.category,
  sortKey: (doc) => doc._creationTime,
  sumValue: (doc) => doc.amount,
});

export const addExpense = mutation({
  args: {
    category: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("expenses", {
      category: args.category,
      amount: args.amount,
    });
    const doc = (await ctx.db.get(id))!;
    await expensesAggregate.insert(ctx, doc);
    return id;
  },
});

export const getCategoryStats = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const count = await expensesAggregate.count(ctx, args.category);
    const sum = await expensesAggregate.sum(ctx, args.category);
    return {
      count,
      totalAmount: sum,
    };
  },
});
