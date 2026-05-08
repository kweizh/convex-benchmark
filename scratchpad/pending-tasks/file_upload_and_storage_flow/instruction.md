Convex provides built-in file storage, but uploading files requires a specific multi-step flow involving URL generation followed by metadata storage.

You need to implement the backend endpoints for a file upload process in `convex/uploads.ts`. Write a mutation named `generateUploadUrl` that uses `ctx.storage.generateUploadUrl()` and returns the generated URL to the client. Write a second mutation named `saveFileMetadata` that accepts a `storageId` (string) and an `authorId` (string) as arguments, and inserts these values into a `files` table.

**Constraints:**
- Both functions must be exported as public mutations using `mutation`.
- You MUST validate the arguments for `saveFileMetadata` using Convex's `v` validator.