# Convex Environment Variables

## Background
Convex allows you to store configuration and secrets as environment variables, which can be accessed within your serverless functions (queries, mutations, and actions). You need to create a Convex action that reads an environment variable and verify it works.

## Requirements
- Initialize a Node.js project and install `convex`.
- Create a Convex action named `getToken` in `convex/config.ts` that returns the value of the `SECRET_TOKEN` environment variable.
- Set the `SECRET_TOKEN` environment variable in your Convex deployment to the value of the `ZEALT_RUN_ID` environment variable.
- Deploy the Convex functions to the cloud.
- Write a Node.js script `test.mjs` that uses `ConvexHttpClient` to call the `getToken` action and logs the result to a file.

## Implementation Hints
- Use `npm init -y` and `npm install convex` to set up the project.
- You can access environment variables in Convex functions using `process.env.SECRET_TOKEN`.
- Use `npx convex env set SECRET_TOKEN <value>` to set the environment variable in the deployment.
- Use `npx convex deploy` to deploy your functions. The `CONVEX_DEPLOY_KEY` is already provided in the environment.
- In `test.mjs`, instantiate `ConvexHttpClient` with `process.env.CONVEX_URL`, call the action using `client.action(api.config.getToken)`, and append the result to `output.log` in the format `Token: <value>`.

## Acceptance Criteria
- Project path: `/home/user/convex-env-task`
- Ensure the script is executed and the artifacts exist.
- Log file: `/home/user/convex-env-task/output.log`
- The log file must contain the token in the format: `Token: <token_value>`, where `<token_value>` is the value of `ZEALT_RUN_ID`.
