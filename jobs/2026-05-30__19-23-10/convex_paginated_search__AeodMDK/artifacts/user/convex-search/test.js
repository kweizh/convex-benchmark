const { ConvexHttpClient } = require("convex/browser");
const { anyApi } = require("convex/server");

const args = process.argv.slice(2);
const runIdIndex = args.indexOf("--run-id");
if (runIdIndex === -1 || !args[runIdIndex + 1]) {
  console.error("Missing --run-id argument");
  process.exit(1);
}
const runId = args[runIdIndex + 1];

const client = new ConvexHttpClient(process.env.CONVEX_URL);

async function main() {
  await client.mutation(anyApi.messages.insert, { body: "Hello world", author: "Alice", channelId: runId });
  await client.mutation(anyApi.messages.insert, { body: "Hello Convex", author: "Bob", channelId: runId });
  await client.mutation(anyApi.messages.insert, { body: "Hello search", author: "Charlie", channelId: runId });

  let results;
  while (true) {
    results = await client.query(anyApi.messages.search, {
      query: "Hello",
      channelId: runId,
      paginationOpts: { numItems: 2, cursor: null },
    });
    
    if (results.page && results.page.length >= 2) {
      break;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(JSON.stringify(results.page));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
