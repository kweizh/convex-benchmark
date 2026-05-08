import os
import subprocess
import time
import socket
import pytest
from pochi_verifier import PochiVerifier

PROJECT_DIR = "/home/user/app"

def wait_for_port(port, timeout=60):
    start_time = time.time()
    while time.time() - start_time < timeout:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            if sock.connect_ex(('localhost', port)) == 0:
                return True
        time.sleep(5)
    return False

@pytest.fixture(scope="module")
def setup_and_start_app():
    # Deploy to Convex
    deploy_process = subprocess.run(
        ["npx", "convex", "deploy"],
        cwd=PROJECT_DIR,
        capture_output=True, text=True
    )
    assert deploy_process.returncode == 0, f"Failed to deploy Convex: {deploy_process.stderr}"

    # Seed database
    seed_process = subprocess.run(
        ["npx", "convex", "run", "seed:seedMessages"],
        cwd=PROJECT_DIR,
        capture_output=True, text=True
    )
    assert seed_process.returncode == 0, f"Failed to seed database: {seed_process.stderr}"

    # Start the app
    process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=PROJECT_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid
    )

    # Wait for the app to be ready
    if not wait_for_port(5173):
        # Kill the process group before failing
        import signal
        os.killpg(os.getpgid(process.pid), signal.SIGTERM)
        pytest.fail("App failed to start and listen on port 5173.")

    yield

    # Shut down the app
    import signal
    os.killpg(os.getpgid(process.pid), signal.SIGTERM)
    process.wait(timeout=30)

def test_paginated_messages(setup_and_start_app):
    reason = "The application should display a paginated list of messages fetched from Convex, initially showing 5 items, and loading 5 more when the 'Load More' button is clicked."
    truth = "Navigate to http://localhost:5173. Wait for elements with the class 'message-item' to appear. Verify that there are exactly 5 elements with the class 'message-item' visible on the page. Verify that a 'Load More' button is visible and not disabled. Click the 'Load More' button. Wait for more elements to load. Verify that there are now exactly 10 elements with the class 'message-item' visible on the page."

    verifier = PochiVerifier()
    result = verifier.verify(
        reason=reason,
        truth=truth,
        use_browser_agent=True,
        trajectory_dir="/logs/verifier/pochi/test_paginated_messages"
    )
    assert result.status == "pass", f"Browser verification failed: {result.reason}"
