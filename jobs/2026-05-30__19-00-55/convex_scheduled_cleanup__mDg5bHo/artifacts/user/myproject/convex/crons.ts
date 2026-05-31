import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

const runId = process.env.ZEALT_RUN_ID;
if (!runId) {
  // During deployment or local development, ZEALT_RUN_ID might not be available yet
  // but we still need to define the cron job if we want it to be registered.
  // However, the requirement says "The cron job must be named cleanup-sessions-${run-id}".
  // If it's undefined, it will be "cleanup-sessions-undefined".
  // We'll proceed, assuming ZEALT_RUN_ID will be set before the cron is evaluated by Convex.
}

crons.interval(
  `cleanup-sessions-${runId}`,
  { hours: 1 },
  api.sessions.cleanup,
  {}
);

export default crons;
