import os
import shutil
import pytest

PROJECT_DIR = "/home/user/myproject"

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_package_json_exists():
    path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(path), f"File {path} does not exist."

def test_tsconfig_json_exists():
    path = os.path.join(PROJECT_DIR, "tsconfig.json")
    assert os.path.isfile(path), f"File {path} does not exist."

def test_messages_ts_exists_and_contains_mutation():
    path = os.path.join(PROJECT_DIR, "convex", "messages.ts")
    assert os.path.isfile(path), f"File {path} does not exist."
    with open(path) as f:
        content = f.read()
    assert "export const sendMessage = mutation(" in content, \
        "Expected initial convex/messages.ts to contain 'sendMessage' mutation."
    assert "fetch(" in content, \
        "Expected initial convex/messages.ts to contain 'fetch' call inside mutation."
