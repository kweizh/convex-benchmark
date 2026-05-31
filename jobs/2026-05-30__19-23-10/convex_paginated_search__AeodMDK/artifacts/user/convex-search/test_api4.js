const { anyApi } = require("convex/server");
const { ConvexHttpClient } = require("convex/browser");
const client = new ConvexHttpClient("https://happy-animal-123.convex.cloud");
console.log(client.query(anyApi.messages.search, {}).catch(e => e.message));
