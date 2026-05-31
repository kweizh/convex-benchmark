const { ConvexHttpClient } = require("convex/browser");
const { api } = require("./convex/_generated/api");

async function main() {
  // Parse --run-id argument
  const args = process.argv.slice(2);
  let runId = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--run-id" && i + 1 < args.length) {
      runId = args[i + 1];
      break;
    }
  }
  if (!runId) {
    console.error("Usage: node test.js --run-id <run-id>");
    process.exit(1);
  }

  // Initialize client from CONVEX_URL environment variable
  const convexUrl = process.env.CONVEX_URL;
  if (!convexUrl) {
    console.error("CONVEX_URL environment variable is required");
    process.exit(1);
  }
  const client = new ConvexHttpClient(convexUrl);

  // Insert 3 messages with the run-id as channelId
  await client.mutation(api.messages.insert, {
    body: "Hello world",
    author: "Alice",
    channelId: runId,
  });
  await client.mutation(api.messages.insert, {
    body: "Hello Convex",
    author: "Bob",
    channelId: runId,
  });
  await client.mutation(api.messages.insert, {
    body: "Hello search",
    author: "Charlie",
    channelId: runId,
  });

  // Poll until search results are found (search indexing is async)
  let results = null;
  const maxAttempts = 30;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    results = await client.query(api.messages.search, {
      query: "Hello",
      channelId: runId,
      paginationOpts: { numItems: 2, cursor: null },
    });
    if (results.page.length > 0) {
      break;
    }
    // Wait 1 second before retrying
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Print the page array from the pagination result
  console.log(JSON.stringify(results.page));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});