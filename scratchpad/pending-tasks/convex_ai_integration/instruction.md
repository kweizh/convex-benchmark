# Convex AI Integration: GitHub Repo Pitch Generator

## Background
Create a GitHub Repo Pitch Generator using React, Convex, and OpenAI. This task demonstrates how to build a Convex action that fetches data from an external API, processes it with an LLM, and saves the result via a mutation.

## Requirements
- **Convex Schema**: Define a `repo_pitches` table with `repo` (string) and `pitch` (string).
- **Convex Backend**:
  - A query `api.pitches.list` to fetch all generated pitches.
  - An action `api.pitches.generate` that takes a `repo` string (e.g., "facebook/react").
  - The action must fetch repository data from the public GitHub API (`https://api.github.com/repos/{repo}`).
  - The action must then call the OpenAI API (using the `OPENAI_API_KEY` environment variable) to generate a 1-sentence promotional pitch based on the repository's description.
  - Finally, the action must call an internal mutation `internal.pitches.save` to save the `repo` and the generated `pitch` to the database.
- **Frontend**:
  - A React application that displays a list of all generated pitches.
  - The UI must contain an input field for the GitHub repo name and a submit button to trigger the generation.

## Implementation Hints
- Use `npm create vite@latest myproject -- --template react-ts` to scaffold the React app, then install `convex` and `openai`.
- Use `npx convex dev` to initialize the Convex project and configure the schema.
- Convex actions are required for side effects like calling external APIs (GitHub, OpenAI). Use `"use node";` if you need Node.js specific features in the action, or use the default V8 runtime with standard `fetch`.
- Use `internalMutation` to allow the action to save data to the database, as actions cannot write to the database directly.
- In the React frontend, use the `useQuery` and `useAction` hooks from `convex/react` to interact with the backend.

## Acceptance Criteria
- Project path: `/home/user/myproject`
- Start command: `npm run dev`
- Port: 5173
- The UI must have an input field to enter a GitHub repository name (e.g., "octocat/Hello-World") and a submit button.
- The UI must display the list of generated pitches fetched from the Convex database.
- Submitting a repository name must successfully trigger the backend flow: fetching from GitHub, generating with OpenAI, and saving to Convex.

