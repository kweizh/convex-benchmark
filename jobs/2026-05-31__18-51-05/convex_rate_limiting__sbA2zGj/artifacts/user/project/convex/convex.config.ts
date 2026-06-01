import { defineApp } from "convex/server";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";

export default defineApp({
  modules: {
    rateLimiter: rateLimiter,
  },
});
