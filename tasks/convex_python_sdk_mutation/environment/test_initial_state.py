import os
import shutil
import pytest

PROJECT_DIR = "/home/user/myproject"

def test_python_available():
    assert shutil.which("python3") is not None, "python3 is not available in PATH."

def test_pip_available():
    assert shutil.which("pip") is not None, "pip is not available in PATH."

def test_node_available():
    assert shutil.which("node") is not None, "node is not available in PATH."

def test_npm_available():
    assert shutil.which("npm") is not None, "npm is not available in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."