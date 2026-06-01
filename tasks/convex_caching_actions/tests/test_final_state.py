import os
import subprocess
import socket
import pytest
import zipfile
import json
from xprocess import ProcessStarter
from pochi_verifier import PochiVerifier

PROJECT_DIR = "/home/user/myproject"

@pytest.fixture(scope="session", autouse=True)
def deploy_convex():
    """Install dependencies and deploy Convex functions."""
    # Install dependencies
    subprocess.run(["npm", "install"], cwd=PROJECT_DIR, check=True)
    # Deploy Convex backend
    subprocess.run(["npx", "convex", "deploy", "--yes"], cwd=PROJECT_DIR, check=True)

@pytest.fixture(scope="session")
def start_app(xprocess, deploy_convex):
    """Start the Vite dev server and wait for port 5173."""
    class Starter(ProcessStarter):
        name = "start_app"
        args = ["npm", "run", "dev"]
        env = os.environ.copy()
        # Ensure the run ID is passed to Vite
        env["VITE_ZEALT_RUN_ID"] = os.environ.get("ZEALT_RUN_ID", "test-run-id")
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

def test_browser_and_database_cache(start_app):
    """Verify that the React app fetches data and the backend caches it in Convex."""
    run_id = os.environ.get("ZEALT_RUN_ID", "test-run-id")
    
    # 1. Browser verification
    reason = "The application must allow users to input a Pokemon name, fetch its data, and display the name and weight."
    truth = "Navigate to http://localhost:5173. Locate the input field and enter 'pikachu'. Click the fetch button. Wait for the result display area to show the text containing 'pikachu' and its weight (e.g., '60' or '600' depending on API formatting)."
    
    verifier = PochiVerifier()
    result = verifier.verify(
        reason=reason,
        truth=truth,
        use_browser_agent=True,
        trajectory_dir="/logs/verifier/pochi/test_browser_caching_actions"
    )
    assert result.status == "pass", f"Browser verification failed: {result.reason}"

    # 2. Database verification
    export_path = os.path.join(PROJECT_DIR, "export.zip")
    
    # Export the database
    export_result = subprocess.run(
        ["npx", "convex", "export", "--path", export_path],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert export_result.returncode == 0, f"'npx convex export' failed: {export_result.stderr}"
    assert os.path.exists(export_path), "Export zip file was not created."
    
    # Check the contents of the zip file
    found_cache = False
    with zipfile.ZipFile(export_path, 'r') as z:
        # Look for pokemon_cache.jsonl
        jsonl_files = [f for f in z.namelist() if f.endswith("pokemon_cache.jsonl")]
        assert jsonl_files, "pokemon_cache.jsonl not found in the exported data. Did the action save to the 'pokemon_cache' table?"
        
        for jsonl_file in jsonl_files:
            with z.open(jsonl_file) as f:
                for line in f:
                    line_str = line.decode('utf-8').lower()
                    if "pikachu" in line_str and run_id.lower() in line_str:
                        found_cache = True
                        break
            if found_cache:
                break
                
    assert found_cache, f"Could not find a cache entry for 'pikachu' with runId '{run_id}' in the pokemon_cache table."
