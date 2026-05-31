const { ConvexHttpClient } = require("convex/browser");

const convexUrl = process.env.CONVEX_URL;
if (!convexUrl) {
  console.error("CONVEX_URL environment variable is required");
  process.exit(1);
}

const client = new ConvexHttpClient(convexUrl);

// Parse --id argument
const args = process.argv.slice(2);
let sessionId = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--id" && i + 1 < args.length) {
    sessionId = args[i + 1];
  }
}

if (!sessionId) {
  console.error("--id argument is required");
  process.exit(1);
}

async function main() {
  const session = await client.query("sessions:getSession", { id: sessionId });

  if (!session) {
    console.error("Session not found");
    process.exit(1);
  }

  console.log(`Is Active: ${session.isActive}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});