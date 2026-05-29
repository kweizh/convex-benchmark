import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/python-sdk-task"

@pytest.fixture(scope="session", autouse=True)
def setup_environment():
    """Install dependencies required for verification."""
    # Run npm install
    subprocess.run(["npm", "install"], cwd=PROJECT_DIR, check=False)
    
    # Run pip install
    req_path = os.path.join(PROJECT_DIR, "requirements.txt")
    if os.path.exists(req_path):
        subprocess.run(["pip", "install", "-r", "requirements.txt"], cwd=PROJECT_DIR, check=False)
    else:
        subprocess.run(["pip", "install", "convex"], cwd=PROJECT_DIR, check=False)

def test_run_with_first_id():
    """Test running main.py with the first run-id."""
    run_id = os.environ.get("ZEALT_RUN_ID", "test_run_id")
    result = subprocess.run(
        ["python3", "main.py", "--run-id", run_id],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'python3 main.py' failed: {result.stderr}"
    assert "Hello from Python" in result.stdout, f"Expected 'Hello from Python' in stdout, got: {result.stdout}"
    assert run_id in result.stdout, f"Expected '{run_id}' in stdout, got: {result.stdout}"

def test_run_with_second_id():
    """Test running main.py with a second run-id to ensure it's dynamic."""
    run_id = os.environ.get("ZEALT_RUN_ID", "test_run_id") + "_second"
    result = subprocess.run(
        ["python3", "main.py", "--run-id", run_id],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'python3 main.py' failed: {result.stderr}"
    assert "Hello from Python" in result.stdout, f"Expected 'Hello from Python' in stdout, got: {result.stdout}"
    assert run_id in result.stdout, f"Expected '{run_id}' in stdout, got: {result.stdout}"