# Real-time Collaborative Cursor with Convex

## Background
Create a real-time collaborative cursor application using Convex and React (Vite).

## Requirements
- Define a `cursors` table in `convex/schema.ts` with `id` (string), `x` (number), `y` (number), and `color` (string).
- Create a mutation `update` in `convex/cursors.ts` that takes `id`, `x`, `y`, and `color`. It should update the cursor if `id` exists, or insert it if not.
- Create a query `get` in `convex/cursors.ts` that returns all cursors.
- In `src/App.jsx`, render a full-screen `div` that listens to `onMouseMove`. Call the `update` mutation with a unique ID (e.g., 'user1'), the mouse `x` and `y`, and a color (e.g., 'red').
- Fetch all cursors using the `get` query and render them as `div` elements with `class="cursor"` at their respective `x` and `y` coordinates.

## Implementation Guide
1. The project at `/home/user/cursor-app` is a Vite React app with Convex installed.
2. Run `npx convex deploy` to deploy your Convex backend (the `CONVEX_DEPLOY_KEY` is provided in the environment).
3. Implement the schema and functions in the `convex/` directory.
4. Update `src/main.jsx` to wrap the app in `ConvexProvider` using `import { ConvexProvider, ConvexReactClient } from "convex/react";` and `new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)`.
5. Update `src/App.jsx` to implement the frontend logic.
6. Ensure `npm run dev` starts the frontend on port 5173.

## Constraints
- Project path: `/home/user/cursor-app`
- Start command: `npm run dev`
- Port: 5173