import { cronJobs } from "convex/server";

const runId = process.env.ZEALT_RUN_ID;
if (!runId) {
  throw new Error("ZEALT_RUN_ID is not set");
}

const crons = cronJobs();

crons.interval(`cleanup-sessions-${runId}`, { hours: 1 }, "sessions:cleanup");

export default crons;
