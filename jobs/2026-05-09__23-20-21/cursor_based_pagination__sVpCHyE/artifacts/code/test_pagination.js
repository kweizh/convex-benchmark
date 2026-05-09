const { ConvexHttpClient } = require("convex/browser");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const url = process.env.CONVEX_URL;
  if (!url) throw new Error("CONVEX_URL not set");
  const client = new ConvexHttpClient(url);

  console.log("Sending messages...");
  for (let i = 1; i <= 5; i++) {
    await client.mutation("messages:send", {
      text: `Message ${i}`,
      author: "Tester",
    });
  }

  console.log("Fetching page 1...");
  const page1Result = await client.query("messages:list", {
    paginationOpts: { numItems: 2, cursor: null },
  });

  console.log("Fetching page 2...");
  const page2Result = await client.query("messages:list", {
    paginationOpts: {
      numItems: 2,
      cursor: page1Result.continueCursor,
    },
  });

  const output = {
    page1: page1Result.page,
    page2: page2Result.page,
  };

  fs.writeFileSync("/home/user/project/output.json", JSON.stringify(output, null, 2));
  console.log("Results saved to /home/user/project/output.json");
}

main().catch(console.error);
