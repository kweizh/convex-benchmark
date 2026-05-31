import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "cleanup expired sessions",
  { minutes: 1 },
  api.sessions.cleanupExpiredSessions,
);

export default crons;
