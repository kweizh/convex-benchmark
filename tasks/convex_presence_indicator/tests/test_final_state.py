import pytest
import subprocess
import os
import socket
from xprocess import ProcessStarter
from pochi_verifier import PochiVerifier

PROJECT_DIR = "/home/user/presence-app"

@pytest.fixture(scope="session")
def browser_verifier():
    yield PochiVerifier()

@pytest.fixture(scope="session")
def setup_convex():
    # Run npm install and npx convex deploy before starting the dev server
    subprocess.run(["npm", "install"], cwd=PROJECT_DIR, check=True)
    subprocess.run(["npx", "convex", "deploy"], cwd=PROJECT_DIR, check=True)

@pytest.fixture(scope="session")
def start_app(setup_convex, xprocess):
    class Starter(ProcessStarter):
        name = "start_app"
        args = ["npm", "run", "dev"]
        env = os.environ.copy()
        env["VITE_CONVEX_URL"] = env.get("CONVEX_URL", "")
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

def test_presence_indicator_sync(start_app, browser_verifier):
    run_id = os.environ.get("ZEALT_RUN_ID", "default")
    reason = "The application should sync presence status in real-time across multiple users."
    truth = f"""
    1. Navigate to http://localhost:5173.
    2. Find the User ID input field and enter 'user-A-{run_id}'.
    3. Click the 'Go Online' button.
    4. Open a NEW browser tab/page and navigate to http://localhost:5173.
    5. In the new tab, find the User ID input field and enter 'user-B-{run_id}'.
    6. Click the 'Go Online' button in the new tab.
    7. Wait for 3 seconds.
    8. Verify that BOTH 'user-A-{run_id}' and 'user-B-{run_id}' are visible on the new tab.
    9. Switch back to the first tab and verify that BOTH users are visible there as well.
    """
    
    result = browser_verifier.verify(
        reason=reason,
        truth=truth,
        use_browser_agent=True,
        trajectory_dir="/logs/verifier/pochi/test_presence_indicator_sync"
    )
    assert result.status == "pass", f"Browser verification failed: {result.reason}"