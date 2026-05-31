import { cronJobs } from "convex/server";

const crons = cronJobs();

crons.interval(
  "cleanup expired sessions",
  { minutes: 1 },
  "sessions:cleanupExpiredSessions"
);

export default crons;
