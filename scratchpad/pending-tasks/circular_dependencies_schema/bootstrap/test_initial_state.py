import os
import shutil
import subprocess
import pytest

PROJECT_DIR = "/home/user/convex-project"

def test_npx_binary_available():
    assert shutil.which("npx") is not None, "npx binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_convex_files_exist():
    for filename in ["users.ts", "posts.ts", "comments.ts"]:
        filepath = os.path.join(PROJECT_DIR, "convex", filename)
        assert os.path.isfile(filepath), f"Convex file {filepath} does not exist."

def test_initial_tsc_fails():
    result = subprocess.run(["npx", "tsc"], cwd=PROJECT_DIR, capture_output=True)
    assert result.returncode != 0, "Expected initial npx tsc to fail due to circular dependencies, but it passed."
