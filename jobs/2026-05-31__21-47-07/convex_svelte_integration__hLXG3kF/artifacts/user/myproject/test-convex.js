import { ConvexClient } from "convex/browser";
const client = new ConvexClient("REDACTED");
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(client)));
