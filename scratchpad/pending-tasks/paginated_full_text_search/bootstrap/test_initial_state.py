import shutil
import pytest

def test_node_installed():
    assert shutil.which("node") is not None, "Node.js (node) is not installed."
    assert shutil.which("npm") is not None, "npm is not installed."
