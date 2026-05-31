const { ConvexHttpClient } = require("convex/browser");

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) {
    return null;
  }
  return process.argv[index + 1];
}

async function main() {
  const sessionId = getArgValue("--id");
  if (!sessionId) {
    throw new Error("Missing --id argument.");
  }

  const convexUrl = process.env.CONVEX_URL;
  if (!convexUrl) {
    throw new Error("CONVEX_URL environment variable is required.");
  }

  const client = new ConvexHttpClient(convexUrl);
  const deployKey = process.env.CONVEX_DEPLOY_KEY;
  if (deployKey) {
    client.setAdminAuth(deployKey);
  }

  const session = await client.query("sessions:getSession", { id: sessionId });
  if (!session) {
    throw new Error(`Session not found for id ${sessionId}`);
  }

  console.log(`Is Active: ${session.isActive}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
