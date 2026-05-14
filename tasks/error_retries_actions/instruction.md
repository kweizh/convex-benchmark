# Fix Convex Mutation with External API Call

## Background
In a Convex project at `/home/user/myproject`, there is a mutation `sendMessage` in `convex/messages.ts` that incorrectly tries to call an external API using `fetch`. This is an anti-pattern because mutations must be deterministic and have no side effects.

## Requirements
- Refactor the external API call into a new Action named `sendMessageAction` in `convex/messages.ts`.
- The action should accept a `text` argument (string).
- The action should call `fetch('https://httpstat.us/200', { method: 'POST', body: JSON.stringify({text: args.text}) })`.
- Implement a simple retry loop in the action: if the `fetch` fails (throws or returns non-ok status), retry up to 3 times (i.e., 4 attempts total) before throwing an error.
- If the fetch succeeds, the action should call a mutation `saveMessage` to save the message to the database.
- Create the `saveMessage` mutation in the same file, which accepts `text` (string) and inserts into the `messages` table.
- Remove the original `sendMessage` mutation.
- Ensure the code passes `npx tsc` (type checks).

## Constraints
- Project path: `/home/user/myproject`
- Use `https://httpstat.us/200` for the external API call to avoid real side effects while still performing a real fetch.
- Do not use `use node` directive, keep it in the default Convex runtime.
- Use Convex `v` validator for arguments.