Convex mutations guarantee transactional atomicity, meaning multiple database operations will either entirely succeed or fail together, provided they are deterministic.

You need to implement a bank transfer mutation in `convex/finances.ts` that safely moves funds between two accounts. Create a mutation named `transfer` that takes `fromAccountId`, `toAccountId`, and `amount` as validated arguments. The mutation must read the balance of the first account, deduct the amount, and then add the amount to the second account.

**Constraints:**
- The mutation must remain deterministic and run in the default V8 environment.
- You MUST throw an error if the `fromAccountId` has insufficient funds before applying any database updates.
- Ensure both account updates occur within the single mutation handler.