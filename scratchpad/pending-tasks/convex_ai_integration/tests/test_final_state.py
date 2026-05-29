import pytest
import subprocess
import os
import socket
from xprocess import ProcessStarter
from pochi_verifier import PochiVerifier

PROJECT_DIR = "/home/user/myproject"

@pytest.fixture(scope="session")
def browser_verifier():
    yield PochiVerifier()

@pytest.fixture(scope="session")
def setup_project():
    """Run npm install and npx convex deploy before starting the dev server."""
    subprocess.run(["npm", "install"], cwd=PROJECT_DIR, check=True)
    subprocess.run(["npx", "convex", "deploy"], cwd=PROJECT_DIR, check=True)
    yield

@pytest.fixture(scope="session")
def start_app(setup_project, xprocess):
    """
    Starts the npm run dev service using xprocess. Confirms readiness via port check.
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

def test_github_repo_pitch_generator(start_app, browser_verifier):
    reason = "The application should allow users to enter a GitHub repository name, fetch data, generate a pitch using OpenAI, and display the result."
    truth = "Navigate to http://localhost:5173. Enter 'octocat/Hello-World' into the input field and click the submit button. Wait up to 10 seconds. Verify that the page now displays 'octocat/Hello-World' along with a generated pitch text."

    result = browser_verifier.verify(
        reason=reason,
        truth=truth,
        use_browser_agent=True,
        trajectory_dir="/logs/verifier/pochi/test_github_repo_pitch_generator"
    )
    assert result.status == "pass", f"Browser verification failed: {result.reason}"
