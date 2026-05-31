"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const runId = process.env.NEXT_PUBLIC_ZEALT_RUN_ID || "default-run-id";
  const tasks = useQuery(api.tasks.getTasks, { runId });
  const addTask = useMutation(api.tasks.addTask);
  const toggleTask = useMutation(api.tasks.toggleTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    await addTask({ text: newTaskText, runId });
    setNewTaskText("");
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      
      <form onSubmit={handleAddTask} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="border p-2 flex-grow rounded text-black"
          data-testid="task-input"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          data-testid="add-button"
        >
          Add
        </button>
      </form>

      {tasks === undefined ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex items-center justify-between p-3 border rounded bg-white text-black"
              data-testid="task-item"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() =>
                    toggleTask({ id: task._id, isCompleted: !task.isCompleted })
                  }
                  data-testid="toggle-button"
                  className="w-5 h-5"
                />
                <span
                  className={task.isCompleted ? "line-through text-gray-400" : ""}
                >
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask({ id: task._id })}
                data-testid="delete-button"
                className="text-red-500 hover:text-red-700 font-bold px-2"
              >
                X
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
