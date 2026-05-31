import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

const runId = process.env.ZEALT_RUN_ID as string;

crons.cron(
  `cleanup-sessions-${runId}`,
  "0 * * * *",
  internal.sessions.cleanup,
  {}
);

export default crons;