import os
import subprocess
import pytest
import json

PROJECT_DIR = "/home/user/project"

@pytest.fixture(scope="session", autouse=True)
def setup_environment():
    # Setup step 1: npm install
    result = subprocess.run(
        ["npm", "install"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"npm install failed: {result.stderr}"

    # Setup step 2: npx convex deploy
    # The CONVEX_DEPLOY_KEY environment variable should be automatically picked up
    # by the convex CLI.
    result = subprocess.run(
        ["npx", "convex", "deploy"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"npx convex deploy failed: {result.stderr}\nStdout: {result.stdout}"

def test_add_and_get_tasks():
    # We will write a temporary Node.js script to interact with Convex client
    # to call the mutation and query.
    script_content = """
const { ConvexHttpClient } = require("convex/browser");
const { api } = require("./convex/_generated/api.js");
require("dotenv").config({ path: ".env.local" });

async function main() {
    const url = process.env.CONVEX_URL;
    if (!url) {
        console.error("CONVEX_URL is not set");
        process.exit(1);
    }
    const client = new ConvexHttpClient(url);
    
    try {
        // 1. Add task
        await client.mutation(api.tasks.add, { text: "Test task" });
        
        // 2. Get tasks
        const tasks = await client.query(api.tasks.get);
        console.log(JSON.stringify(tasks));
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

main();
    """
    
    script_path = os.path.join(PROJECT_DIR, "verify.js")
    with open(script_path, "w") as f:
        f.write(script_content)
        
    result = subprocess.run(
        ["node", "verify.js"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    
    assert result.returncode == 0, f"Node verification script failed: {result.stderr}"
    
    try:
        tasks = json.loads(result.stdout.strip())
    except json.JSONDecodeError:
        pytest.fail(f"Failed to parse JSON output from verification script: {result.stdout}")
        
    # Verify the task was added and returned
    found = any(task.get("text") == "Test task" for task in tasks)
    assert found, f"Expected task with text 'Test task' in output, got: {tasks}"
