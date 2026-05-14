import os
import json
import pytest

PROJECT_DIR = "/home/user/cursor-app"

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_package_json_exists():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json_path), f"package.json not found at {package_json_path}"

def test_convex_installed():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    with open(package_json_path) as f:
        data = json.load(f)
    deps = data.get("dependencies", {})
    dev_deps = data.get("devDependencies", {})
    assert "convex" in deps or "convex" in dev_deps, "Convex is not installed in package.json."
