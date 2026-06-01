import pytest
import os
import socket
from xprocess import ProcessStarter
from pochi_verifier import PochiVerifier

PROJECT_DIR = "/home/user/vue-convex-crud"

@pytest.fixture(scope="session")
def start_app(xprocess):
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

def test_browser_crud(start_app):
    reason = "The application should feature a fully functional to-do list with Convex backend. Users must be able to add, toggle, and delete items."
    truth = (
        "Navigate to http://localhost:5173. "
        "Locate the input field with id `new-task-input`. "
        "Type 'Buy groceries' into the input. "
        "Click the button with id `add-task-btn`. "
        "Wait for the UI to update. "
        "Verify that an element with class `task-item` appears containing the text 'Buy groceries'. "
        "Click the button with class `toggle-btn` inside the 'Buy groceries' task item. "
        "Wait for the UI to update. "
        "Click the button with class `delete-btn` inside the 'Buy groceries' task item. "
        "Wait for the UI to update. "
        "Verify that the 'Buy groceries' task item is removed from the list."
    )

    verifier = PochiVerifier()
    result = verifier.verify(
        reason=reason,
        truth=truth,
        use_browser_agent=True,
        trajectory_dir="/logs/verifier/pochi/test_browser_crud"
    )
    assert result.status == "pass", f"Browser verification failed: {result.reason}"

def test_schema_table_name():
    """Verify that the convex code uses the dynamic table name incorporating ZEALT_RUN_ID."""
    run_id = os.environ.get("ZEALT_RUN_ID", "default_run_id")
    expected_table_name = f"tasks_{run_id.replace('-', '_')}"
    
    convex_dir = os.path.join(PROJECT_DIR, "convex")
    assert os.path.isdir(convex_dir), f"convex directory not found at {convex_dir}."
    
    found = False
    for root, _, files in os.walk(convex_dir):
        for file in files:
            if file.endswith(".ts") or file.endswith(".js"):
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                    if expected_table_name in content or "ZEALT_RUN_ID" in content or "tasks_" in content:
                        found = True
                        break
        if found:
            break
            
    assert found, "Could not find the expected dynamic table name logic or ZEALT_RUN_ID reference in the convex backend code."
