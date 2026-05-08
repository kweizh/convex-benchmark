A common friction point in Convex is the strict separation between deterministic mutations and side-effect-producing actions. Fetching external data cannot be done inside a mutation.

You need to build a workflow in `convex/integrations.ts` that fetches user data from an external API and saves it to the database. Write an `action` named `fetchExternalUser` that makes an HTTP GET request to `https://api.example.com/user`, retrieves the JSON response, and then calls an internal mutation named `saveUser` (which you must also define) to write the fetched data to the database.

**Constraints:**
- Do NOT attempt to use `fetch` or call the external API directly inside a `mutation`.
- Ensure the internal mutation is strictly exported as an internal function using `internalMutation` from `./_generated/server` so it cannot be invoked directly by clients.