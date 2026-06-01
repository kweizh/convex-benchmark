# Real-time User Presence Indicator with Convex

## Background
Convex is a reactive backend-as-a-service that automatically syncs data between the database and the client. In this task, you will build a real-time user presence indicator (showing who is currently online) using Convex and React.

## Requirements
- Initialize a React project using Vite (React + TypeScript) at `/home/user/presence-app`.
- Configure Convex in the project using the provided `CONVEX_URL` (as `VITE_CONVEX_URL` for the frontend) and `CONVEX_DEPLOY_KEY`.
- Define a schema with a `presence` table that stores `user_id` (string) and `updated_at` (number).
- Implement a mutation `api.presence.heartbeat` that takes a `user_id`, and upserts a record in the `presence` table setting `updated_at` to the current server time (`Date.now()`).
- Implement a query `api.presence.getOnlineUsers` that returns a list of users who have sent a heartbeat within the last 15 seconds.
- Build a frontend in `src/App.tsx` that:
  - Has an input field to enter a User ID (use an input with placeholder `Enter User ID` or label).
  - Has a "Go Online" button. When clicked, it should start sending the `heartbeat` mutation every 5 seconds.
  - Displays a list of currently online users fetched from `getOnlineUsers` (render elements with a specific class or data-testid, e.g., `<li data-testid="online-user">{user_id}</li>`).
- Ensure you kill the dev server after testing. Do not leave it running in the background when you finish.

## Implementation Hints
- Use `npm create vite@latest presence-app -- --template react-ts` to scaffold the app.
- Install the `convex` package.
- Set `VITE_CONVEX_URL=$CONVEX_URL` in an `.env.local` file so the Vite dev server can pick it up.
- Use `npx convex deploy` to push your schema and functions to the Convex cloud. Do not use `npx convex dev` as it requires interactive login.
- In your React app, wrap the root component with `ConvexProvider` and pass a `ConvexReactClient` initialized with `import.meta.env.VITE_CONVEX_URL`.
- For the heartbeat interval, consider using a `useEffect` hook in React that sets up a `setInterval` when the user is "online".
- Read the `run-id` from the `ZEALT_RUN_ID` environment variable if you need to namespace any test data, though for this task the user ID entered in the UI will handle uniqueness.

## Acceptance Criteria
- Project path: /home/user/presence-app
- Start command: npm run dev
- Port: 5173
- Routes and features:
  - The page at `http://localhost:5173` must have an input field for the User ID.
  - The page must have a "Go Online" button.
  - The page must display a list of online users.
  - When a user enters a User ID and clicks "Go Online", their ID should appear in the online users list within a few seconds.

