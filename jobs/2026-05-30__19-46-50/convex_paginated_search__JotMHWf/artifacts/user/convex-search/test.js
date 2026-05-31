const { ConvexHttpClient } = require("convex/browser");
const { api } = require("./convex/_generated/api");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseRunId = () => {
  const runIdIndex = process.argv.indexOf("--run-id");
  if (runIdIndex === -1 || runIdIndex === process.argv.length - 1) {
    throw new Error("Usage: node test.js --run-id <run-id>");
  }
  return process.argv[runIdIndex + 1];
};

const main = async () => {
  const runId = parseRunId();
  const convexUrl = process.env.CONVEX_URL;

  if (!convexUrl) {
    throw new Error("CONVEX_URL environment variable is required");
  }

  const client = new ConvexHttpClient(convexUrl);

  const messages = [
    { body: "Hello world", author: "Alice", channelId: runId },
    { body: "Hello Convex", author: "Bob", channelId: runId },
    { body: "Hello search", author: "Charlie", channelId: runId },
  ];

  for (const message of messages) {
    await client.mutation(api.messages.insert, message);
  }

  let result = null;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    result = await client.query(api.messages.search, {
      query: "Hello",
      channelId: runId,
      paginationOpts: { numItems: 2, cursor: null },
    });

    if (result.page.length > 0) {
      break;
    }

    await sleep(500);
  }

  if (!result || result.page.length === 0) {
    throw new Error("Search index did not return results in time");
  }

  process.stdout.write(`${JSON.stringify(result.page)}\n`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
