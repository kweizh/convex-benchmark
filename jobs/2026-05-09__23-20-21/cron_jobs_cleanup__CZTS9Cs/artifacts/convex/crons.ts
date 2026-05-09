import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.hourly(
  "cleanup-expired-sessions",
  { minute: 0 },
  internal.sessions.cleanupExpired
);

export default crons;
