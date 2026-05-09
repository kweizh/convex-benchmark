import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "aggregate events",
  { hours: 1 },
  internal.aggregate.run,
  {}
);

export default crons;
