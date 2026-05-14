# Fix Circular Dependencies in Convex

## Background
In Convex projects, cross-file function calls using `internal` or `api` from `_generated/api` can trigger TypeScript circularity limits (e.g., `Type instantiation is excessively deep and possibly infinite`), because the generated API depends on the files, and the files depend on the generated API.

## Requirements
You have a Convex project at `/home/user/convex-project` with three files: `convex/users.ts`, `convex/posts.ts`, and `convex/comments.ts`. They have queries that call each other using `ctx.runQuery(internal...)`. Currently, running `npx tsc` fails due to circular dependencies.
Your task is to refactor these files to resolve the TypeScript error without changing the runtime behavior.

## Implementation Guide
1. Navigate to `/home/user/convex-project`.
2. Run `npx tsc` to see the circular dependency error.
3. Refactor `convex/users.ts`, `convex/posts.ts`, and `convex/comments.ts` to break the type circularity. You can do this by using `makeFunctionReference` from `convex/server` (e.g., `makeFunctionReference("posts:getPostsByUser")`) instead of importing `internal` from `_generated/api`, or by adding explicit return types to the handlers so TypeScript doesn't need to infer them circularly.
4. Ensure `npx tsc` passes successfully with 0 exit code.

## Constraints
- Project path: `/home/user/convex-project`
- Do not change the runtime behavior or the database schema.
- The functions must still call each other as originally intended.

## Integrations
- None