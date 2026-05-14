# Convex Chat Typing Indicators

## Background
You are building the backend for a real-time chat application using Convex. You need to implement a "typing indicator" feature so users can see when others are typing.

## Requirements
1. Initialize a Convex project in `/home/user/chat-app`.
2. Define a Convex schema in `convex/schema.ts` with a `typing_indicators` table containing:
   - `user`: string
   - `isTyping`: boolean
   - `updatedAt`: number
3. Add an index `by_user` on the `user` field in the schema.
4. Create a file `convex/typing.ts` with two functions:
   - A mutation named `setTyping` that takes `user` (string) and `isTyping` (boolean). It should update the existing record for that user or insert a new one if it doesn't exist, setting `updatedAt` to `Date.now()`.
   - A query named `getTypingUsers` that returns an array of `user` strings who are currently typing (`isTyping` is true).

## Implementation Guide
1. Create the project directory `/home/user/chat-app`.
2. Initialize a Node project and install `convex`.
3. Write the schema in `convex/schema.ts`.
4. Write the functions in `convex/typing.ts`.
5. Run `npx convex codegen` to generate the TypeScript types.

## Constraints
- Project path: /home/user/chat-app
- Do not use a frontend, just the Convex backend files.
- You must ensure `npx convex codegen` runs successfully to generate the `_generated` folder.