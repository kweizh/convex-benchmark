const { ConvexHttpClient } = require("convex/browser");
const { api } = require("./convex/_generated/api.js");
const client = new ConvexHttpClient(process.env.CONVEX_URL);
client.mutation(api.tasks.create, { text: "hello from node", runId: "123" }).then(console.log).catch(console.error);
