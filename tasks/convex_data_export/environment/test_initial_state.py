import os
import shutil

def test_npm_npx_available():
    assert shutil.which("npm") is not None, "npm is not available in PATH"
    assert shutil.which("npx") is not None, "npx is not available in PATH"

def test_project_dir_exists():
    assert os.path.isdir("/home/user/myproject"), "Project directory /home/user/myproject does not exist"

def test_env_vars_set():
    assert "CONVEX_DEPLOY_KEY" in os.environ, "CONVEX_DEPLOY_KEY environment variable is not set"
    assert "ZEALT_RUN_ID" in os.environ, "ZEALT_RUN_ID environment variable is not set"
