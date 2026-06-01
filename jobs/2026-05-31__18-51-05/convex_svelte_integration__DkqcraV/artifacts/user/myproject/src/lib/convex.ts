import { ConvexClient } from "convex/browser";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

export const client = new ConvexClient(convexUrl);
