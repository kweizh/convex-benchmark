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
def start_app(xprocess):
    """
    Starts the npm service using xprocess. Confirms readiness via port check.
    """

    class Starter(ProcessStarter):
        name = "start_app"
        args = ["npm", "run", "dev"]
        env = os.environ.copy()
        if "CONVEX_URL" in env:
            env["VITE_CONVEX_URL"] = env["CONVEX_URL"]
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


def test_convex_relationships(start_app, browser_verifier):
    reason = "The application should demonstrate Convex 1:N and N:M relationships by allowing users to create users, tags, posts, and assign tags to posts."
    truth = "Navigate to http://localhost:5173. Find the user creation form. Enter 'Alice' into the user name input and submit. Verify that 'Alice' appears in the users list. Find the tag creation form. Enter 'React' into the tag name input and submit. Verify that 'React' appears in the tags list. Find the post creation form. Select 'Alice' as the author, enter 'My First Post' as the title, and submit. Verify that the post appears in the posts list with the author 'Alice'. Find the tag assignment form. Select the post 'My First Post' and the tag 'React', and submit. Verify that the post 'My First Post' in the posts list now displays the tag 'React'."

    result = browser_verifier.verify(
        reason=reason,
        truth=truth,
        use_browser_agent=True,
        trajectory_dir="/logs/verifier/pochi/test_convex_relationships"
    )
    assert result.status == "pass", f"Browser verification failed: {result.reason}"
