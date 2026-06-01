# Vue.js + Convex CRUD Application

## Background
Build a simple CRUD application integrating Vue.js with Convex. You will create a Vue 3 frontend and a Convex backend to manage a list of tasks.

## Requirements
- Initialize a Vue.js project in `/home/user/vue-convex-crud`.
- Integrate Convex for the backend database and functions.
- Implement a CRUD interface for a task entity with `text` (string) and `isCompleted` (boolean) fields.
- The UI must allow creating a new task, listing all tasks, toggling a task's completion status, and deleting a task.
- To prevent cross-trial conflicts, the Convex table name **must** be `tasks_<run_id_with_underscores>`, where the run-id is read from the `ZEALT_RUN_ID` environment variable (with hyphens replaced by underscores, e.g., `tasks_zr_1234`).

## Implementation Hints
- You can initialize the project using Vite (e.g., `npm create vite@latest vue-convex-crud -- --template vue-ts`).
- Install `convex` and `convex-vue` to connect the Vue frontend to Convex.
- Since the Convex backend needs to know the `ZEALT_RUN_ID` for the table name, you can either pass the table name dynamically from the frontend to your Convex functions as an argument, or set the environment variable in Convex using `npx convex env set ZEALT_RUN_ID $ZEALT_RUN_ID` before running `npx convex deploy`.
- Ensure your Convex schema and functions (`get`, `create`, `toggle`, `delete`) use the dynamically generated table name.
- Ensure the dev server is started and accessible on port 5173.

## Acceptance Criteria
- Project path: `/home/user/vue-convex-crud`
- Start command: `npm run dev`
- Port: `5173`
- The Vue app must have an input field with id `new-task-input`.
- The Vue app must have a button with id `add-task-btn`.
- The list of tasks must be rendered, with each task having a class `task-item`.
- Each `task-item` must contain the text of the task, a button with class `toggle-btn` to toggle its `isCompleted` status, and a button with class `delete-btn` to delete it.
- The tasks must be persisted in Convex in a table named `tasks_<run_id_with_underscores>`.

