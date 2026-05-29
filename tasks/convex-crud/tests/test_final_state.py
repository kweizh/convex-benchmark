import os
import pytest
from convex import ConvexClient

PROJECT_DIR = "/home/user/myproject"
LOG_FILE = os.path.join(PROJECT_DIR, "deploy.log")

def test_deploy_log_exists():
    assert os.path.isfile(LOG_FILE), f"Deployment log {LOG_FILE} not found."
    with open(LOG_FILE, "r") as f:
        content = f.read()
    # We just ensure it's not empty and maybe has some typical deploy output.
    # But since Convex CLI output can vary, just checking it exists and has content is a good start.
    assert len(content.strip()) > 0, f"Deployment log {LOG_FILE} is empty."

def test_convex_api_mutations_and_queries():
    run_id = os.environ.get("ZEALT_RUN_ID")
    assert run_id, "ZEALT_RUN_ID environment variable is missing."

    convex_url = os.environ.get("CONVEX_URL")
    assert convex_url, "CONVEX_URL environment variable is missing."

    client = ConvexClient(convex_url)
    
    test_text = f"Test task for {run_id}"

    try:
        # Call the mutation
        task_id = client.mutation("tasks:create", {"text": test_text})
        assert task_id is not None, "Mutation returned no ID."
    except Exception as e:
        pytest.fail(f"Failed to call tasks:create mutation: {e}")

    try:
        # Call the query
        tasks = client.query("tasks:get", {"status": "todo"})
        assert isinstance(tasks, list), f"Expected query to return a list, got {type(tasks)}"
        
        # Verify the inserted task is in the list
        found = any(t.get("text") == test_text for t in tasks)
        assert found, f"Task with text '{test_text}' not found in query results."
    except Exception as e:
        pytest.fail(f"Failed to call tasks:get query: {e}")
