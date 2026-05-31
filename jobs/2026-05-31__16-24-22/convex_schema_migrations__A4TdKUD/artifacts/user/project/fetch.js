const { ConvexHttpClient } = require("convex/browser");
const fs = require("fs");
const path = require("path");

async function main() {
  const convexUrl = process.env.CONVEX_URL;
  if (!convexUrl) {
    console.error("CONVEX_URL environment variable is not set");
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);
  try {
    const tasks = await client.query("queries:getAll");
    const outputPath = "/home/user/project/output.log";
    fs.writeFileSync(outputPath, JSON.stringify(tasks, null, 2));
    console.log(`Successfully wrote ${tasks.length} tasks to ${outputPath}`);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    process.exit(1);
  }
}

main();
