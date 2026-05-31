"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import crypto from "crypto";

export const generate = action({
  args: {
    text: v.string(),
  },
  handler: async (ctx, { text }) => {
    return crypto.createHash("sha256").update(text).digest("hex");
  },
});
