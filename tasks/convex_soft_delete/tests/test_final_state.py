import os
import subprocess
import pytest
import time

PROJECT_DIR = "/home/user/project"

@pytest.fixture(scope="session")
def sync_convex():
    # We can just run `npx convex deploy` to ensure it's synced, or `npx convex dev` in background.
    # The agent might have already synced it, but to be sure, we deploy it.
    print("Deploying to Convex...")
    result = subprocess.run(
        ["npx", "convex", "deploy"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        print("Deploy failed:", result.stderr)
    yield

def test_soft_delete_flow(sync_convex):
    run_id = os.environ.get("ZEALT_RUN_ID", "default_run_id")
    converted_run_id = run_id.replace("-", "_")

    # We will write a Node.js script to verify the Convex backend
    verify_script = f"""
const {{ ConvexClient }} = require("convex/browser");
const {{ anyApi }} = require("convex/server");

async function run() {{
  const url = process.env.CONVEX_URL;
  if (!url) throw new Error("CONVEX_URL is not set");
  
  const client = new ConvexClient(url);
  
  try {{
    // 1. Test Send
    console.log("Testing send...");
    const msgId = await client.mutation("messages:send", {{ text: "Hello World" }});
    if (!msgId) throw new Error("Send mutation did not return an ID");
    console.log("Inserted message ID:", msgId);
    
    // 2. Test List (Before Delete)
    console.log("Testing list before delete...");
    let list = await client.query("messages:list");
    let found = list.find(m => m._id === msgId);
    if (!found) throw new Error("Message not found in list before delete");
    if (found.text !== "Hello World") throw new Error("Message text mismatch");
    if (found.isDeleted !== false) throw new Error("Message isDeleted should be false");
    
    // 3. Test Remove
    console.log("Testing remove...");
    await client.mutation("messages:remove", {{ id: msgId }});
    
    // 4. Test List (After Delete)
    console.log("Testing list after delete...");
    list = await client.query("messages:list");
    found = list.find(m => m._id === msgId);
    if (found) throw new Error("Message still found in list after delete");
    
    console.log("SUCCESS");
  }} finally {{
    await client.close();
  }}
}}

run().catch(err => {{
  console.error(err);
  process.exit(1);
}});
"""
    script_path = os.path.join(PROJECT_DIR, "verify.js")
    with open(script_path, "w") as f:
        f.write(verify_script)

    # Make sure convex is installed locally so we can require("convex/browser")
    subprocess.run(["npm", "install", "convex"], cwd=PROJECT_DIR, check=True)

    result = subprocess.run(
        ["node", "verify.js"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    
    assert result.returncode == 0, f"Verification script failed: {result.stderr}\nSTDOUT:\n{result.stdout}"
    assert "SUCCESS" in result.stdout, "Verification script did not complete successfully."
