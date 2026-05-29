import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.hourly(
  "clear expired sessions",
  { minuteUTC: 0 },
  api.sessions.clearExpired,
);

export default crons;
