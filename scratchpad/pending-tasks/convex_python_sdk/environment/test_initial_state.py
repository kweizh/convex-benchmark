import os
import shutil
import subprocess

PROJECT_DIR = "/home/user/python-sdk-task"

def test_python3_available():
    assert shutil.which("python3") is not None, "python3 binary not found in PATH."

def test_npm_available():
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."