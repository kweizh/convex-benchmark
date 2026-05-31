import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "cleanup expired sessions",
  { minutes: 1 },
  api.sessions.cleanup
);

export default crons;