# Convex 1:N and N:M Relationships

## Background
Convex is a reactive backend-as-a-service. In many applications, you need to model relationships between different entities. In this task, you will build a Vite + React application that manages 1:N (Users to Posts) and N:M (Posts to Tags) data relationships using Convex.

## Requirements
- Initialize a Vite React TypeScript project in `/home/user/myproject`.
- Install and configure Convex.
- Define a Convex schema with the following tables (remember that Convex table names must be alphanumeric and underscores only):
  - `users`: `name` (string)
  - `posts`: `title` (string), `content` (string), `author_id` (reference to users)
  - `tags`: `name` (string)
  - `post_tags`: `post_id` (reference to posts), `tag_id` (reference to tags)
- Create Convex queries and mutations to:
  - Create users, posts, and tags.
  - Link tags to posts (creating records in `post_tags`).
  - Fetch all users with their associated posts.
  - Fetch all posts with their associated tags.
- Build a React UI that allows a user to:
  - Create a new User.
  - Create a new Post for a User.
  - Create a new Tag.
  - Assign a Tag to a Post.
  - View a list of Posts, displaying the author's name and the names of all assigned tags.
- Deploy the Convex backend using `npx convex deploy` so the schema and functions are live.

## Implementation Hints
- Use `npm create vite@latest myproject -- --template react-ts` to scaffold the project.
- Use `npm install convex` to add the Convex SDK.
- Set up the `ConvexProvider` in `src/main.tsx` using `import.meta.env.VITE_CONVEX_URL`.
- Use `defineTable` and `v.id("table_name")` in `convex/schema.ts` to define relationships.
- When fetching related data in a query, you can use `Promise.all` to fetch related records by their IDs.
- In your UI, add specific `data-testid` attributes to elements to make them easily testable (e.g., `data-testid="create-user-input"`, `data-testid="submit-user-btn"`, `data-testid="post-item"`).
- Since Convex requires a deploy key for CI/CD, ensure you run `npx convex deploy` using the provided `CONVEX_DEPLOY_KEY` environment variable. The Vite app will connect to `CONVEX_URL`.
- **CRITICAL**: If you start the dev server (`npm run dev`) to test your work, you MUST kill the dev server process before finishing the task. The automated validation will start the dev server itself.

## Acceptance Criteria
- Project path: /home/user/myproject
- Start command: npm run dev
- Port: 5173
- The Convex schema must define the 4 tables (`users`, `posts`, `tags`, `post_tags`).
- The UI must render at `http://localhost:5173`.
- The UI must allow creating a user, creating a post for that user, creating a tag, and assigning the tag to the post.
- The UI must display the posts, including the author's name and the assigned tags' names.
- The Convex backend must be successfully deployed.

