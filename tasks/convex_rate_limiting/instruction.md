# Rate Limiting API Requests in Convex

## Background
You need to implement a rate-limited API endpoint using Convex and the `@convex-dev/rate-limiter` component. This ensures that users cannot spam the system with too many requests.

## Requirements
- Initialize a Convex project in `/home/user/project`.
- Install the `@convex-dev/rate-limiter` component and configure it in `convex/convex.config.ts`.
- Create a mutation `sendMessage` in `convex/messages.ts` that takes `userId` (string) and `text` (string).
- The mutation must insert the message into a table named `messages_<run_id_with_underscores>`, where `<run_id_with_underscores>` is the `run-id` from the `ZEALT_RUN_ID` environment variable with all hyphens replaced by underscores (e.g., if `run-id` is `zr-123`, the table is `messages_zr_123`).
- The mutation must enforce a rate limit of 3 requests per 10 seconds per `userId`.
- To prevent cross-run conflicts, the rate limit key must include the `run-id` (e.g., `${run-id}_${args.userId}`).
- If the rate limit is exceeded, the mutation must throw an error with a message containing "Rate limit exceeded".
- Deploy the project to the Convex cloud environment using `npx convex deploy` and save the deployment output to `/home/user/project/deploy.log`.

## Implementation Hints
- Read the `run-id` from the `ZEALT_RUN_ID` environment variable in your Convex functions using `process.env.ZEALT_RUN_ID`.
- Since table names in Convex only support alphanumeric characters and underscores, replace hyphens in the `run-id` with underscores.
- Use the `@convex-dev/rate-limiter` component by defining a rate limit with `{ kind: "fixed window", rate: 3, period: 10000 }` (or token bucket).
- Check the rate limit using `rateLimiter.limit(ctx, "sendMessage", { key: ... })`.
- If the limit check fails (`ok` is false), throw a new Error.
- Use the provided `CONVEX_DEPLOY_KEY` for deployment.

## Acceptance Criteria
- Project path: /home/user/project
- Ensure the project is deployed to the Convex cloud environment and the log artifact exists.
- Log file: /home/user/project/deploy.log
- The deployed Convex backend must expose a mutation `messages:sendMessage` taking `userId` (string) and `text` (string).
- The mutation must insert data into the `messages_<run_id_with_underscores>` table.
- The mutation must allow up to 3 requests per 10 seconds for a given `userId`.
- The 4th request within 10 seconds for the same `userId` must fail with an error containing "Rate limit exceeded".
- Different `userId`s must have separate rate limits.

