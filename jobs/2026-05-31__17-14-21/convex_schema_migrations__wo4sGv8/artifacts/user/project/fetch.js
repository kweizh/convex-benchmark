const { ConvexHttpClient } = require("convex/browser");
const fs = require("fs");
const path = require("path");

async function main() {
  const client = new ConvexHttpClient(process.env.CONVEX_URL);
  const result = await client.query("queries:getAll");
  fs.writeFileSync(
    path.join("/home/user/project/output.log"),
    JSON.stringify(result)
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});