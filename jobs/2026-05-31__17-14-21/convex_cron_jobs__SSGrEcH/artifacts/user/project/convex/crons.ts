import { cronJobs } from "convex/server";

const crons = cronJobs();

crons.interval(
  "cleanupExpiredSessions",
  { minutes: 1 },
  "sessions:cleanupExpiredSessions"
);

export default crons;