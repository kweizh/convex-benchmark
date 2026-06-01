# Convex Role-Based Access Control (RBAC)

## Background
You need to implement Role-Based Access Control (RBAC) in a Convex backend to manage access to sensitive data. Convex provides a reactive database where queries and mutations are written in TypeScript. You will build a custom RBAC mechanism that checks a user's role before allowing them to perform specific actions.

## Requirements
- Initialize a new Convex project.
- Read the `run-id` from the `ZEALT_RUN_ID` environment variable.
- Create a safe version of the `run-id` by replacing all hyphens (`-`) with underscores (`_`) (e.g., `zr_abc_123`), because Convex table names must be alphanumeric and underscores only.
- Set the `ZEALT_RUN_ID` environment variable in the Convex deployment using the Convex CLI so it can be accessed in backend functions.
- Define a Convex schema with two tables: `users_<safe_run_id>` and `documents_<safe_run_id>`.
  - The users table must have fields: `name` (string) and `role` (string).
  - The documents table must have fields: `title` (string), `content` (string), and `authorId` (ID of the users table).
- Implement a mutation `api.init.seed` that creates three users and returns their IDs:
  - User 1: name "Admin", role "admin"
  - User 2: name "Editor", role "editor"
  - User 3: name "Viewer", role "viewer"
  - Returns: `{ adminId, editorId, viewerId }`
- Implement RBAC-protected queries and mutations in `convex/documents.ts`:
  - `api.documents.get`: Query taking `{ userId: string }`. Returns all documents.
  - `api.documents.create`: Mutation taking `{ userId: string, title: string, content: string }`. Only users with the "admin" or "editor" role can create documents. If unauthorized, throw a `ConvexError` with the exact message `"Unauthorized"`. Otherwise, insert the document and return the document ID.
  - `api.documents.delete`: Mutation taking `{ userId: string, documentId: string }`. Only users with the "admin" role can delete documents. If unauthorized, throw a `ConvexError` with the exact message `"Unauthorized"`. Otherwise, delete the document.
- Deploy the Convex backend to production.
- Write "Deployment successful" to a log file after successful deployment.

## Implementation Hints
- Use `npx convex env set` to set environment variables in the Convex cloud environment.
- You can use dynamic table names in `convex/schema.ts` by reading `process.env.ZEALT_RUN_ID` and replacing hyphens with underscores.
- In your functions, query the users table using the provided `userId` to determine the user's role before performing the requested action.
- Use `import { ConvexError } from "convex/values";` to throw the required errors.
- Deploy the backend using `npx convex deploy`.

## Acceptance Criteria
- Project path: `/home/user/rbac-project`
- Ensure the real action of deploying to Convex is executed.
- Log file: `/home/user/rbac-project/deploy.log`
- The log file must contain `Deployment successful`.
- The schema must enforce table names `users_<safe_run_id>` and `documents_<safe_run_id>`.
- The deployed Convex backend must expose the `api.init.seed`, `api.documents.get`, `api.documents.create`, and `api.documents.delete` functions with the specified arguments and RBAC logic.

