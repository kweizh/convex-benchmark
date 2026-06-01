import { ConvexClient } from "convex/browser";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is not set");
}

export const convex = new ConvexClient(convexUrl);
