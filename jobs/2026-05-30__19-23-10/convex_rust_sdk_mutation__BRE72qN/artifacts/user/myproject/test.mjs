import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
const client = new ConvexHttpClient(process.env.CONVEX_URL);
client.mutation(api.tasks.create, { text: "hello from node", runId: "123" }).then(console.log).catch(e => console.error(e.message));
