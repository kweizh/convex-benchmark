"use node";

import crypto from "crypto";
import { action } from "./_generated/server";
import { v } from "convex/values";

export const generate = action({
  args: { text: v.string() },
  handler: async (_ctx, args) => {
    const hash = crypto.createHash("sha256").update(args.text).digest("hex");
    return hash;
  },
});