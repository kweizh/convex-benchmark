import os
import shutil
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_package_json_exists():
    package_json = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json), f"package.json not found in {PROJECT_DIR}"

def test_convex_installed():
    package_json = os.path.join(PROJECT_DIR, "package.json")
    with open(package_json) as f:
        content = f.read()
    assert "convex" in content, "convex package not found in package.json"
