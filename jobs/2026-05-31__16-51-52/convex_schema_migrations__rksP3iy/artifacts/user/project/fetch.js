const { ConvexHttpClient } = require("convex/browser");
const fs = require("fs");

async function main() {
  const client = new ConvexHttpClient("REDACTED");
  const tasks = await client.query("queries:getAll");
  fs.writeFileSync("/home/user/project/output.log", JSON.stringify(tasks, null, 2));
}

main().catch(console.error);
