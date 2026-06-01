const rawRunId = process.env.ZEALT_RUN_ID;

if (!rawRunId) {
  throw new Error("ZEALT_RUN_ID is required");
}

const safeRunId = rawRunId.replace(/-/g, "_");

export const usersTableName = `users_${safeRunId}` as const;
export const documentsTableName = `documents_${safeRunId}` as const;
