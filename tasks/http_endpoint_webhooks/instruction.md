# Convex HTTP Webhooks

## Background
Convex allows you to define HTTP actions to handle incoming webhooks from external services. In this task, you will create a Convex backend that receives a POST request and stores the data.

## Requirements
- Initialize a Convex project in `/home/user/project`.
- Define a schema (`convex/schema.ts`) with a `messages` table containing `author` (string) and `body` (string).
- Create a mutation `sendMessage` in `convex/messages.ts` that inserts a message into the `messages` table.
- Create an HTTP action at `POST /webhook` in `convex/http.ts` that reads a JSON payload containing `author` and `body`, calls the `sendMessage` mutation, and returns a 200 response.
- Save the Convex site URL (e.g., `https://<deployment-name>.convex.site`) to `/home/user/project/convex_site_url.txt`.

## Implementation Guide
1. The project directory `/home/user/project` is already created with `package.json` and `convex` installed.
2. Write `convex/schema.ts` to define the `messages` table.
3. Write `convex/messages.ts` defining the `sendMessage` mutation.
4. Write `convex/http.ts` defining the HTTP action and routing `POST /webhook` to it.
5. Deploy the Convex functions using `npx convex deploy`.
6. Determine your deployment's site URL and save it to `/home/user/project/convex_site_url.txt`.

## Constraints
- Project path: `/home/user/project`
- You must use `npx convex deploy` to push your code. The `CONVEX_DEPLOY_KEY` is already provided in the environment.
- The payload format for the webhook is `{"author": "Alice", "body": "Hello"}`.
- Do not use `npx convex dev` as it is interactive.
- The file `/home/user/project/convex_site_url.txt` must contain exactly the base URL (no trailing slash, e.g., `https://happy-animal-123.convex.site`).