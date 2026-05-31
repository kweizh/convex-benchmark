import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const RUN_ID = import.meta.env.VITE_ZEALT_RUN_ID as string;

function App() {
  const [newTaskText, setNewTaskText] = useState("");
  const tasks = useQuery(api.tasks.getTasks, { runId: RUN_ID });
  const addTask = useMutation(api.tasks.addTask);
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newTaskText.trim();
    if (!text) return;
    addTask({ text, runId: RUN_ID });
    setNewTaskText("");
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    updateTaskStatus({
      id: id as any,
      status: currentStatus === "todo" ? "done" : "todo",
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Task Manager</h1>
      <form onSubmit={handleAddTask} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: 8, fontSize: 16 }}
        />
        <button type="submit" style={{ padding: "8px 16px", fontSize: 16 }}>
          Add
        </button>
      </form>

      {tasks === undefined ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet. Add one above!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <button
                onClick={() => toggleStatus(task._id, task.status)}
                style={{
                  padding: "4px 12px",
                  fontSize: 14,
                  background: task.status === "done" ? "#4caf50" : "#ff9800",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                {task.status === "done" ? "Done" : "Todo"}
              </button>
              <span
                style={{
                  flex: 1,
                  textDecoration: task.status === "done" ? "line-through" : "none",
                }}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask({ id: task._id })}
                style={{
                  padding: "4px 8px",
                  fontSize: 14,
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;