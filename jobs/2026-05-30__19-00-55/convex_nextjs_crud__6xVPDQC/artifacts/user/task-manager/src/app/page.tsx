"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Trash2, CheckCircle, Circle } from "lucide-react";

export default function Home() {
  const runId = process.env.NEXT_PUBLIC_ZEALT_RUN_ID || "default";
  const tasks = useQuery(api.tasks.list, { runId });
  const addTask = useMutation(api.tasks.add);
  const toggleTask = useMutation(api.tasks.toggle);
  const deleteTask = useMutation(api.tasks.remove);

  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    await addTask({ text: newTaskText, runId });
    setNewTaskText("");
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Task Manager</h1>
      
      <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Enter a new task..."
          className="flex-1 p-2 border rounded text-black"
          data-testid="task-input"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          data-testid="add-button"
        >
          Add Task
        </button>
      </form>

      <div className="space-y-2">
        {tasks === undefined ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between p-4 border rounded bg-white shadow-sm"
              data-testid="task-item"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask({ id: task._id })}
                  className={`transition-colors ${
                    task.isCompleted ? "text-green-500" : "text-gray-400"
                  }`}
                  data-testid="toggle-button"
                >
                  {task.isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <span
                  className={`${
                    task.isCompleted ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask({ id: task._id })}
                className="text-red-500 hover:text-red-700 p-1"
                data-testid="delete-button"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
