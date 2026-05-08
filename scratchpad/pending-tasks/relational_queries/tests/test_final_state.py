import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"

def test_schema_file_exists():
    schema_path = os.path.join(PROJECT_DIR, "convex", "schema.ts")
    assert os.path.isfile(schema_path), f"Schema file {schema_path} does not exist."
    
    with open(schema_path, "r") as f:
        content = f.read()
        
    assert "users:" in content or "users :" in content, "Expected 'users' table definition in schema.ts."
    assert "messages:" in content or "messages :" in content, "Expected 'messages' table definition in schema.ts."
    assert "authorId" in content, "Expected 'authorId' field in messages table definition."

def test_messages_file_exists():
    messages_path = os.path.join(PROJECT_DIR, "convex", "messages.ts")
    assert os.path.isfile(messages_path), f"Messages file {messages_path} does not exist."
    
    with open(messages_path, "r") as f:
        content = f.read()
        
    assert "export const listMessages" in content or "export const listMessages =" in content, "Expected 'listMessages' query export in messages.ts."

def test_typescript_compilation():
    result = subprocess.run(
        ["npx", "tsc", "--noEmit", "convex/schema.ts", "convex/messages.ts"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"TypeScript compilation failed: {result.stdout}\n{result.stderr}"
