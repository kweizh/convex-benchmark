# Cache Third-Party API Responses in Convex

## Background
Convex provides Actions for executing side effects, such as calling external APIs, while Mutations are strictly for deterministic database updates. In this task, you will build a React application with a Convex backend that fetches data from a public API (PokeAPI) and caches the responses in the Convex database to avoid redundant external network requests.

## Requirements
1. Initialize a React project with Vite (`npm create vite@latest myproject -- --template react-ts`) and configure Convex.
2. Create a Convex schema with a `pokemon_cache` table to store fetched Pokemon data.
3. Implement a Convex Action `api:getPokemon` that:
   - Accepts a `pokemonName` string and a `runId` string.
   - Checks if the data is already cached for this `pokemonName` and `runId` in the database by calling a Convex Query.
   - If cached, returns the cached data.
   - If not cached, fetches the data from `https://pokeapi.co/api/v2/pokemon/${pokemonName}`.
   - Calls a Convex Mutation to store the fetched data in the `pokemon_cache` table, including the `runId` field.
   - Returns the data.
4. Build a simple React UI that allows a user to input a Pokemon name, click a "Fetch" button, and displays the Pokemon's `name` and `weight` on the screen. The UI must read the `ZEALT_RUN_ID` environment variable (exposed to Vite as `VITE_ZEALT_RUN_ID`) and pass it to the Action.
5. Explicitly kill the dev server after your manual testing is done, so the automated verification script can start it on port 5173 without conflicts.

## Implementation Hints
- Use `ctx.runQuery` and `ctx.runMutation` inside your Convex Action to interact with the database.
- Remember that Actions cannot access the database directly; they must delegate to Queries and Mutations.
- Use `CONVEX_DEPLOY_KEY` and `VITE_CONVEX_URL` environment variables for deploying and connecting to the Convex cloud instance.
- Use the standard `npx convex deploy` command to deploy your backend functions.
- Expose the `ZEALT_RUN_ID` to your Vite app by mapping it in your start script or Vite config, so the frontend can send it as `runId`.

## Acceptance Criteria
- Project path: /home/user/myproject
- Start command: npm run dev
- Port: 5173
- The React app must contain an input field (e.g., `<input type="text" id="pokemon-input" />`), a button (e.g., `<button id="fetch-button">Fetch</button>`), and a display area (e.g., `<div id="result-display"></div>`).
- When a valid Pokemon name is submitted, the app must display its `name` and `weight` in the result area.
- The backend must cache the result in the `pokemon_cache` table in Convex, ensuring subsequent requests for the same Pokemon retrieve the data from the database instead of PokeAPI.
- The cache entry must include the `runId` field, which should match the value of the `ZEALT_RUN_ID` environment variable.
- The dev server must be killed after task completion.

