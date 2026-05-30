# Integrate Clerk Auth with Convex

## Background
You have a Convex backend that needs to be secured using Clerk authentication. Configure the Convex project to use Clerk, and ensure that your queries and mutations require a valid user identity before proceeding.

## Requirements
- Initialize a new Convex project in the specified directory.
- Configure Clerk as the authentication provider in `convex/auth.config.ts` using the `CLERK_ISSUER_URL` environment variable for the domain.
- Create a `tasks` table with a `text` (string) field and a `tokenIdentifier` (string) field to store who created it.
- Implement a `get` query in `convex/tasks.ts` that requires authentication.
- Implement a `create` mutation in `convex/tasks.ts` that takes a `text` argument, requires authentication, and inserts a task with the `text` and the user's `tokenIdentifier`.
- Deploy the Convex backend to the cloud as a preview deployment using the current `run-id`.
- Save the Convex deployment URL to a log file.

## Implementation Hints
- Read the current `run-id` from the `ZEALT_RUN_ID` environment variable.
- Use `npx convex deploy --preview-create harbor-clerk-${run-id}` to push the schema and functions to an isolated preview environment. Ensure `CONVEX_DEPLOY_KEY` (a preview deploy key) is set in your environment.
- In `convex/auth.config.ts`, set the provider domain to `process.env.CLERK_ISSUER_URL` and `applicationID` to `"convex"`.
- In your functions, use `ctx.auth.getUserIdentity()` to check for authentication. If it returns `null`, throw an error containing the word "Unauthenticated".
- Write the deployment URL to the log file.

## Acceptance Criteria
- Project path: /home/user/myproject
- Ensure the deployment action is executed and the backend is live.
- Log file: /home/user/myproject/output.log
- The log file must contain the deployment URL in the format: `Deployment URL: <url>`.
- The deployment must be a preview deployment named `harbor-clerk-${run-id}` where `run-id` is read from the `ZEALT_RUN_ID` environment variable.
- Running `npx convex run tasks:get --url <url>` without authentication must fail with an error containing "Unauthenticated" (where `<url>` is the deployment URL).
- Running `npx convex run tasks:create '{"text": "hello"}' --url <url>` without authentication must fail with an error containing "Unauthenticated".

