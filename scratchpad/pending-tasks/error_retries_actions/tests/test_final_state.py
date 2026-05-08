import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/myproject"
MESSAGES_TS_PATH = os.path.join(PROJECT_DIR, "convex", "messages.ts")

def test_typescript_compilation():
    """Verify that npx tsc passes without errors."""
    result = subprocess.run(
        ["npx", "tsc"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"TypeScript compilation failed:\n{result.stdout}\n{result.stderr}"

def test_send_message_mutation_removed():
    with open(MESSAGES_TS_PATH, "r") as f:
        content = f.read()
    assert "export const sendMessage =" not in content, \
        "The original 'sendMessage' mutation should have been removed or renamed."

def test_send_message_action_exists():
    with open(MESSAGES_TS_PATH, "r") as f:
        content = f.read()
    assert "export const sendMessageAction = action(" in content or "export const sendMessageAction = internalAction(" in content, \
        "Expected 'sendMessageAction' to be defined as an action."

def test_save_message_mutation_exists():
    with open(MESSAGES_TS_PATH, "r") as f:
        content = f.read()
    assert "export const saveMessage = mutation(" in content or "export const saveMessage = internalMutation(" in content, \
        "Expected 'saveMessage' to be defined as a mutation."

def test_action_contains_retry_logic():
    with open(MESSAGES_TS_PATH, "r") as f:
        content = f.read()
    # Looking for signs of a loop or retry logic
    has_loop = "for (" in content or "while (" in content or "for(" in content or "while(" in content
    has_retry_var = "retry" in content.lower() or "attempts" in content.lower()
    
    assert has_loop or has_retry_var, \
        "Expected 'sendMessageAction' to contain logic (like a loop or retry counter) to retry the fetch call."

def test_action_calls_run_mutation():
    with open(MESSAGES_TS_PATH, "r") as f:
        content = f.read()
    assert "ctx.runMutation(" in content, \
        "Expected 'sendMessageAction' to call 'ctx.runMutation' to save the message."
    assert "saveMessage" in content, \
        "Expected the mutation call to reference 'saveMessage'."
