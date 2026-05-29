import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createAccount = mutation({
  args: {
    name: v.string(),
    initialBalance: v.number(),
  },
  handler: async (ctx, args) => {
    const accountId = await ctx.db.insert("accounts", {
      name: args.name,
      balance: args.initialBalance,
    });
    return accountId;
  },
});

export const getAccount = query({
  args: {
    accountId: v.id("accounts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.accountId);
  },
});

export const transfer = mutation({
  args: {
    from: v.id("accounts"),
    to: v.id("accounts"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const fromAccount = await ctx.db.get(args.from);
    if (!fromAccount) {
      throw new Error("Source account not found");
    }
    const toAccount = await ctx.db.get(args.to);
    if (!toAccount) {
      throw new Error("Destination account not found");
    }

    if (fromAccount.balance < args.amount) {
      throw new Error("Insufficient funds");
    }

    await ctx.db.patch(args.from, {
      balance: fromAccount.balance - args.amount,
    });
    await ctx.db.patch(args.to, {
      balance: toAccount.balance + args.amount,
    });
  },
});
