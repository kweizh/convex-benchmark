import os
import shutil
import pytest

PROJECT_DIR = "/home/user/rust-convex-task"

def test_npm_available():
    assert shutil.which("npm") is not None, "npm command not found in PATH."

def test_cargo_available():
    assert shutil.which("cargo") is not None, "cargo command not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."
