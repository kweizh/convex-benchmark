import { makeFunctionReference, type Id } from "convex/server";

export type Task = {
  _id: Id<"tasks">;
  text: string;
  isCompleted: boolean;
  runId: string;
};

export const listTasks = makeFunctionReference<
  "query",
  { runId: string },
  Task[]
>("tasks:listTasks");

export const addTask = makeFunctionReference<
  "mutation",
  { text: string; runId: string },
  Id<"tasks">
>("tasks:addTask");

export const toggleTask = makeFunctionReference<
  "mutation",
  { id: Id<"tasks">; runId: string },
  null
>("tasks:toggleTask");

export const deleteTask = makeFunctionReference<
  "mutation",
  { id: Id<"tasks">; runId: string },
  null
>("tasks:deleteTask");
