const { ConvexHttpClient } = require("convex/browser");
const { anyApi } = require("convex/server");

const url = process.env.CONVEX_URL;
if (!url) {
  console.error("CONVEX_URL is not set");
  process.exit(1);
}

const client = new ConvexHttpClient(url);

async function main() {
  const idIndex = process.argv.indexOf("--id");
  if (idIndex === -1 || idIndex === process.argv.length - 1) {
    console.error("Usage: node check.js --id <session-id>");
    process.exit(1);
  }
  const id = process.argv[idIndex + 1];

  const session = await client.query(anyApi.sessions.getSession, { id });
  if (!session) {
    console.error("Session not found");
    process.exit(1);
  }

  console.log(`Is Active: ${session.isActive}`);
}

main().catch(console.error);