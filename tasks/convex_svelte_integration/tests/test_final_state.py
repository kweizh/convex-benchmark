import os
import subprocess
import json
import pytest
import socket
import zipfile
from xprocess import ProcessStarter
from pochi_verifier import PochiVerifier

PROJECT_DIR = "/home/user/myproject"

@pytest.fixture(scope="session")
def browser_verifier():
    yield PochiVerifier()

@pytest.fixture(scope="session")
def start_app(xprocess):
    """
    Starts the SvelteKit app using xprocess. Confirms readiness via port 5173.
    """
    class Starter(ProcessStarter):
        name = "start_app"
        args = ["npm", "run", "dev"]
        env = os.environ.copy()
        popen_kwargs = {
            "cwd": PROJECT_DIR,
            "text": True,
        }
        timeout = 180
        terminate_on_interrupt = True

        def startup_check(self):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                return s.connect_ex(("localhost", 5173)) == 0

    xprocess.ensure(Starter.name, Starter)
    yield
    info = xprocess.getinfo(Starter.name)
    info.terminate()

def test_svelte_convex_crud(start_app, browser_verifier):
    run_id = os.environ.get("ZEALT_RUN_ID", "default-run-id")
    task_text = f"Test Task {run_id}"

    reason = "The application should feature a fully functional to-do list connecting to Convex."
    truth = f"Navigate to http://localhost:5173. Verify the page loads successfully. Find the input field, enter '{task_text}', and click the add button. Verify that '{task_text}' appears in the task list on the page. Find the toggle/checkbox for '{task_text}' and click it to change its completion status. Verify the UI updates to reflect the new status. Find the delete button for '{task_text}' and click it. Verify that '{task_text}' is removed from the task list on the page."

    result = browser_verifier.verify(
        reason=reason,
        truth=truth,
        use_browser_agent=True,
        trajectory_dir="/logs/verifier/pochi/test_svelte_convex_crud"
    )
    assert result.status == "pass", f"Browser verification failed: {result.reason}"

def test_convex_database_export():
    """Use Convex CLI to export the database and verify the task was deleted."""
    run_id = os.environ.get("ZEALT_RUN_ID", "default-run-id")
    task_text = f"Test Task {run_id}"

    # Run npx convex export
    export_zip = "/tmp/convex_export.zip"
    if os.path.exists(export_zip):
        os.remove(export_zip)

    result = subprocess.run(
        ["npx", "convex", "export", "--path", export_zip],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npx convex export' failed: {result.stderr}"

    # Unzip
    export_dir = "/tmp/convex_export"
    with zipfile.ZipFile(export_zip, 'r') as zip_ref:
        zip_ref.extractall(export_dir)

    # Check tasks.jsonl
    tasks_file = os.path.join(export_dir, "tasks.jsonl")
    if os.path.exists(tasks_file):
        with open(tasks_file, "r") as f:
            content = f.read()
            assert task_text not in content, f"Expected '{task_text}' to be deleted, but it was found in the database export."
    else:
        # If tasks.jsonl doesn't exist, it means the table is either empty or not exported, which is fine since we deleted the task.
        pass
