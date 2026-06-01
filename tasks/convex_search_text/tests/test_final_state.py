import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/convex-search-task"

@pytest.fixture(scope="session", autouse=True)
def setup_convex_data():
    """Install deps, write test mutation, deploy, and insert test data."""
    # 2. npm install
    subprocess.run(["npm", "install"], cwd=PROJECT_DIR, check=True)

    # 3. Create test_setup.ts
    test_setup_content = """import { mutation } from "./_generated/server";
export default mutation(async (ctx) => {
  await ctx.db.insert("messages", { body: "hello world", channel: "general" });
  await ctx.db.insert("messages", { body: "hello convex", channel: "random" });
});
"""
    test_setup_path = os.path.join(PROJECT_DIR, "convex", "test_setup.ts")
    with open(test_setup_path, "w") as f:
        f.write(test_setup_content)

    # 4. npx convex deploy
    deploy_result = subprocess.run(["npx", "convex", "deploy"], cwd=PROJECT_DIR, capture_output=True, text=True)
    assert deploy_result.returncode == 0, f"npx convex deploy failed:\nSTDOUT:\n{deploy_result.stdout}\nSTDERR:\n{deploy_result.stderr}"

    # 5. npx convex run test_setup
    run_result = subprocess.run(["npx", "convex", "run", "test_setup"], cwd=PROJECT_DIR, capture_output=True, text=True)
    assert run_result.returncode == 0, f"npx convex run test_setup failed:\nSTDOUT:\n{run_result.stdout}\nSTDERR:\n{run_result.stderr}"

def test_search_without_channel_filter():
    """Verify search without channel filter returns both messages."""
    result = subprocess.run(
        ["npx", "convex", "run", "messages:search", '{"query": "hello", "paginationOpts": {"numItems": 5}}'],
        cwd=PROJECT_DIR, capture_output=True, text=True
    )
    assert result.returncode == 0, f"Search query failed:\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
    
    assert "hello world" in result.stdout, f"Expected 'hello world' in output, got: {result.stdout}"
    assert "hello convex" in result.stdout, f"Expected 'hello convex' in output, got: {result.stdout}"
    assert "page" in result.stdout, f"Expected 'page' array in output, got: {result.stdout}"

def test_search_with_channel_filter():
    """Verify search with channel filter returns only the matching message."""
    result = subprocess.run(
        ["npx", "convex", "run", "messages:search", '{"query": "hello", "channel": "general", "paginationOpts": {"numItems": 5}}'],
        cwd=PROJECT_DIR, capture_output=True, text=True
    )
    assert result.returncode == 0, f"Search query failed:\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
    
    assert "hello world" in result.stdout, f"Expected 'hello world' in output, got: {result.stdout}"
    assert "hello convex" not in result.stdout, f"Expected 'hello convex' NOT in output, got: {result.stdout}"
    assert "page" in result.stdout, f"Expected 'page' array in output, got: {result.stdout}"
