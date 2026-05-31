"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function Home() {
  const runId = process.env.NEXT_PUBLIC_ZEALT_RUN_ID || "";
  const tasks = useQuery(api.tasks.list, { runId }) || [];
  const addTask = useMutation(api.tasks.add);
  const toggleTask = useMutation(api.tasks.toggle);
  const removeTask = useMutation(api.tasks.remove);

  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newTaskText.trim();
    if (!text) return;
    await addTask({ text, runId });
    setNewTaskText("");
  };

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-16 px-8">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-8">
          Task Manager
        </h1>

        <form onSubmit={handleAddTask} className="flex w-full max-w-md gap-2 mb-8">
          <input
            data-testid="task-input"
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm text-black dark:text-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            data-testid="add-button"
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </form>

        <ul className="w-full max-w-md space-y-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              data-testid="task-item"
              className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <button
                data-testid="toggle-button"
                onClick={() => toggleTask({ id: task._id })}
                className={`flex h-5 w-5 items-center justify-center rounded border ${
                  task.isCompleted
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-zinc-300 dark:border-zinc-600"
                }`}
              >
                {task.isCompleted && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3 w-3"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 text-sm ${
                  task.isCompleted
                    ? "text-zinc-400 line-through dark:text-zinc-500"
                    : "text-black dark:text-zinc-50"
                }`}
              >
                {task.text}
              </span>
              <button
                data-testid="delete-button"
                onClick={() => removeTask({ id: task._id })}
                className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}