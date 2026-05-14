import os
import shutil
import json
import pytest

PROJECT_DIR = "/home/user/app"

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_package_json_exists():
    pkg_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(pkg_path), f"package.json not found at {pkg_path}."

def test_convex_dir_exists():
    convex_dir = os.path.join(PROJECT_DIR, "convex")
    assert os.path.isdir(convex_dir), f"convex directory not found at {convex_dir}."

def test_app_dir_exists():
    app_dir = os.path.join(PROJECT_DIR, "app")
    assert os.path.isdir(app_dir), f"app directory not found at {app_dir}."

def test_layout_file_exists():
    layout_path = os.path.join(PROJECT_DIR, "app", "layout.tsx")
    assert os.path.isfile(layout_path), f"layout.tsx not found at {layout_path}."
