import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/project"

def test_convex_project_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} not found."
    assert os.path.isdir(os.path.join(PROJECT_DIR, "convex")), "convex directory not found."

def test_convex_deploy_and_vector_search():
    # 1. Deploy the project
    deploy_result = subprocess.run(
        ["npx", "convex", "deploy", "--yes"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert deploy_result.returncode == 0, f"Convex deploy failed: {deploy_result.stderr}\n{deploy_result.stdout}"

    # 2. Create a setup mutation to insert test data
    setup_code = """
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const insertTestData = mutation({
  handler: async (ctx) => {
    // Clear existing
    const existing = await ctx.db.query("foods").collect();
    for (const doc of existing) {
      await ctx.db.delete(doc._id);
    }
    
    // Insert new
    await ctx.db.insert("foods", { description: "Croissant", cuisine: "French", embedding: [0.1, 0.1, 0.1, 0.1] });
    await ctx.db.insert("foods", { description: "Baguette", cuisine: "French", embedding: [0.2, 0.2, 0.2, 0.2] });
    await ctx.db.insert("foods", { description: "Sushi", cuisine: "Japanese", embedding: [0.1, 0.1, 0.1, 0.1] });
  }
});
"""
    setup_file = os.path.join(PROJECT_DIR, "convex", "setup_test.ts")
    with open(setup_file, "w") as f:
        f.write(setup_code)

    # 3. Deploy again to include the setup mutation
    deploy_result2 = subprocess.run(
        ["npx", "convex", "deploy", "--yes"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert deploy_result2.returncode == 0, f"Convex deploy (with setup) failed: {deploy_result2.stderr}"

    # 4. Run the setup mutation
    setup_run = subprocess.run(
        ["npx", "convex", "run", "setup_test:insertTestData"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert setup_run.returncode == 0, f"Setup mutation failed: {setup_run.stderr}"

    # 5. Run the similarFoods action
    # We pass the vector and cuisine as JSON arguments
    args_json = json.dumps({"vector": [0.1, 0.1, 0.1, 0.1], "cuisine": "French"})
    action_run = subprocess.run(
        ["npx", "convex", "run", "foods:similarFoods", args_json],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert action_run.returncode == 0, f"Action run failed: {action_run.stderr}"

    # 6. Verify the output
    # The output should be a JSON array of documents
    try:
        # npx convex run outputs the result as JSON on the last line or similar, we can parse it
        # Actually, convex run outputs the return value. Let's just check if it contains French foods and NOT Japanese foods.
        output = action_run.stdout
        assert "Croissant" in output, "Expected 'Croissant' in the results."
        assert "Sushi" not in output, "Did not expect 'Sushi' in the results because of the cuisine filter."
    except Exception as e:
        pytest.fail(f"Failed to parse or verify output: {e}\nOutput was: {action_run.stdout}")
