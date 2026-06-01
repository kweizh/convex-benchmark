import os
import shutil
import pytest

PROJECT_DIR = "/home/user/convex-aggregate"

def test_npm_available():
    assert shutil.which("npm") is not None, "npm is not available in PATH"

def test_npx_available():
    assert shutil.which("npx") is not None, "npx is not available in PATH"

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."
