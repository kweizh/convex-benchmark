import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/chat-app"

def test_schema_file_exists_and_contains_table():
    schema_path = os.path.join(PROJECT_DIR, "convex", "schema.ts")
    assert os.path.isfile(schema_path), f"schema.ts not found at {schema_path}"
    
    with open(schema_path, "r") as f:
        content = f.read()
        
    assert "typing_indicators" in content, "Expected 'typing_indicators' table in schema.ts"
    assert "user:" in content or "user :" in content, "Expected 'user' field in typing_indicators table"
    assert "isTyping:" in content or "isTyping :" in content, "Expected 'isTyping' field in typing_indicators table"
    assert "updatedAt:" in content or "updatedAt :" in content, "Expected 'updatedAt' field in typing_indicators table"
    assert "by_user" in content, "Expected 'by_user' index in schema.ts"

def test_typing_file_exists_and_contains_functions():
    typing_path = os.path.join(PROJECT_DIR, "convex", "typing.ts")
    assert os.path.isfile(typing_path), f"typing.ts not found at {typing_path}"
    
    with open(typing_path, "r") as f:
        content = f.read()
        
    assert "setTyping" in content, "Expected 'setTyping' mutation in typing.ts"
    assert "getTypingUsers" in content, "Expected 'getTypingUsers' query in typing.ts"
    assert "mutation(" in content or "mutation {" in content, "Expected mutation definition in typing.ts"
    assert "query(" in content or "query {" in content, "Expected query definition in typing.ts"

def test_convex_codegen_succeeds():
    """Priority 1: Run npx convex codegen to verify the schema and functions."""
    result = subprocess.run(
        ["npx", "convex", "codegen"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npx convex codegen' failed: {result.stderr}\n{result.stdout}"
