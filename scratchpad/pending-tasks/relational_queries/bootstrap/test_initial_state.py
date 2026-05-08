import os
import shutil
import pytest

PROJECT_DIR = "/home/user/project"

def test_project_directory_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_convex_directory_exists():
    convex_dir = os.path.join(PROJECT_DIR, "convex")
    assert os.path.isdir(convex_dir), f"Convex directory {convex_dir} does not exist."

def test_package_json_exists():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json_path), f"package.json {package_json_path} does not exist."
