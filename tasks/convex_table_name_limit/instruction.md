# Convex Table Name Limit

## Background
You are working on a Convex backend project. The project currently has a schema defined with a table named `my-tasks`, which violates Convex's table naming rules.

## Requirements
- Fix the table name in `convex/schema.ts` to comply with Convex's naming constraints (alphanumeric characters and underscores only, e.g., `my_tasks`).
- Update any queries or mutations in the `convex/` directory that reference the old table name to use the new valid table name.
- Ensure the Convex backend can be successfully deployed.

## Implementation Hints
- Convex table names must only contain alphanumeric characters and underscores.
- You can use `npx convex deploy` to deploy and verify your fixes.

## Acceptance Criteria
- Project path: /home/user/project
- Ensure the real schema deployment action is executed.
- The table name must be updated to a valid format (e.g., `my_tasks`).
- There must be a working mutation `api.tasks.add` that accepts a `text` string and inserts it into the table.
- There must be a working query `api.tasks.get` that returns all tasks from the table.

