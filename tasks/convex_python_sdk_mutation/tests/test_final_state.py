import os
import subprocess
import pytest
from convex import ConvexClient

PROJECT_DIR = "/home/user/myproject"

def test_mutation_via_python_sdk():
    """Verify that the Python script successfully calls the mutation and data is saved."""
    run_id = os.environ.get("ZEALT_RUN_ID", "default-run-id")
    text_to_insert = f"Verify Python SDK {run_id}"

    # Step 1: Run the user's script
    result = subprocess.run(
        ["python3", "run.py", "--text", text_to_insert],
        capture_output=True,
        text=True,
        cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'python3 run.py' failed: {result.stderr}\nStdout: {result.stdout}"

    # Step 2: Extract task ID from stdout
    stdout = result.stdout
    assert "Inserted task ID: " in stdout, f"Expected 'Inserted task ID: <task_id>' in stdout, got: {stdout}"
    
    task_id = None
    for line in stdout.splitlines():
        if "Inserted task ID: " in line:
            task_id = line.split("Inserted task ID: ")[1].strip()
            break
            
    assert task_id is not None and len(task_id) > 0, "Failed to extract task ID from stdout"

    # Step 3: Verify the data in Convex backend using ConvexClient
    convex_url = os.environ.get("CONVEX_URL")
    assert convex_url, "CONVEX_URL environment variable is not set"
    
    client = ConvexClient(convex_url)
    try:
        task = client.query("tasks:get", {"id": task_id})
    except Exception as e:
        pytest.fail(f"Failed to query the inserted task using tasks:get: {e}")
        
    assert task is not None, "Query returned None, expected a task document"
    assert task.get("text") == text_to_insert, f"Expected task text to be '{text_to_insert}', got {task.get('text')}"
    assert task.get("isCompleted") is False, f"Expected task isCompleted to be False, got {task.get('isCompleted')}"
