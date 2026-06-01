import os
import shutil

def test_cargo_installed():
    assert shutil.which("cargo") is not None, "cargo is not installed"

def test_project_dir_exists():
    assert os.path.isdir("/home/user/project"), "/home/user/project directory does not exist"
