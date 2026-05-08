import os
import pytest

PROJECT_DIR = "/home/user/convex-cron"

def test_schema_exists():
    schema_path = os.path.join(PROJECT_DIR, "convex", "schema.ts")
    assert os.path.isfile(schema_path), f"Schema file not found at {schema_path}"
    with open(schema_path) as f:
        content = f.read()
    assert "sessions" in content, "Expected 'sessions' table to be defined in schema.ts"
    assert "expiresAt" in content, "Expected 'expiresAt' field in 'sessions' table"

def test_sessions_mutation_exists():
    sessions_path = os.path.join(PROJECT_DIR, "convex", "sessions.ts")
    assert os.path.isfile(sessions_path), f"Sessions file not found at {sessions_path}"
    with open(sessions_path) as f:
        content = f.read()
    assert "cleanupExpired" in content, "Expected 'cleanupExpired' export in sessions.ts"
    assert "internalMutation" in content, "Expected 'internalMutation' to be used for 'cleanupExpired'"

def test_crons_exists():
    crons_path = os.path.join(PROJECT_DIR, "convex", "crons.ts")
    assert os.path.isfile(crons_path), f"Crons file not found at {crons_path}"
    with open(crons_path) as f:
        content = f.read()
    assert "crons.hourly" in content, "Expected 'crons.hourly' to be used in crons.ts"
    assert "internal.sessions.cleanupExpired" in content, "Expected 'internal.sessions.cleanupExpired' to be called in crons.ts"
