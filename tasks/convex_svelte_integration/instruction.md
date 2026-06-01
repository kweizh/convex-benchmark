# SvelteKit CRUD App with Convex

## Background
Build a simple CRUD application integrating SvelteKit with Convex as the reactive backend.

## Requirements
- Create a SvelteKit web application and configure it to use Convex.
- Define a Convex schema with a `tasks` table containing `text` (string) and `isCompleted` (boolean).
- Implement Convex queries and mutations to:
  - List all tasks.
  - Add a new task.
  - Toggle a task's `isCompleted` status.
  - Delete a task.
- Build a frontend UI in SvelteKit to display the tasks and interact with the Convex backend.
- Use the provided `CONVEX_URL` to configure the frontend client (e.g., by setting it as `VITE_CONVEX_URL` in your `.env`) and use `CONVEX_DEPLOY_KEY` to authenticate the backend deployment.
- Read the `run-id` from the `ZEALT_RUN_ID` environment variable. When adding a new task, ensure the UI can accept and correctly store a task text that includes this `run-id`.

## Implementation Hints
- Scaffold a SvelteKit project in the project directory.
- Initialize Convex and define your schema in `convex/schema.ts` and functions in `convex/tasks.ts`.
- You can use the Convex client in SvelteKit to subscribe to queries and call mutations.
- Be sure to use the environment variables provided by the system.
- If you start a dev server (`npm run dev`) or Convex dev server (`npx convex dev`) for local testing, ensure you kill them before finishing the task, as the automated test will start the dev server itself for validation.

## Acceptance Criteria
- Project path: /home/user/myproject
- Start command: npm run dev
- Port: 5173
- Ensure you kill the dev server before completing the task.
- The web app must run on port 5173 and be accessible at the root path `/`.
- The UI must display a list of tasks fetched from Convex.
- The UI must contain an input field and a button to add a new task. The input must support appending `${run-id}` to the task text.
- The UI must provide a way to toggle the `isCompleted` status of a task.
- The UI must provide a way to delete a task.
- The backend must strictly use the Convex `tasks` table with `text` and `isCompleted` fields.

