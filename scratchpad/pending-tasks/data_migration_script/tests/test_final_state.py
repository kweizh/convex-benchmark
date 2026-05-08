import os
import pytest

PROJECT_DIR = "/home/user/project"

def test_migration_file_exists():
    migration_path = os.path.join(PROJECT_DIR, "convex", "migration.ts")
    assert os.path.isfile(migration_path), f"File {migration_path} does not exist."

def test_migration_exports_seedTasks():
    migration_path = os.path.join(PROJECT_DIR, "convex", "migration.ts")
    with open(migration_path) as f:
        content = f.read()
    assert "export const seedTasks" in content or "export default mutation" in content or "seedTasks" in content, \
        "Expected convex/migration.ts to export seedTasks."

def test_migration_inserts_tasks():
    migration_path = os.path.join(PROJECT_DIR, "convex", "migration.ts")
    with open(migration_path) as f:
        content = f.read()
    assert "Buy milk" in content, "Expected 'Buy milk' task to be inserted."
    assert "Read book" in content, "Expected 'Read book' task to be inserted."
    assert "Write code" in content, "Expected 'Write code' task to be inserted."
    assert "db.insert" in content, "Expected db.insert to be used."
