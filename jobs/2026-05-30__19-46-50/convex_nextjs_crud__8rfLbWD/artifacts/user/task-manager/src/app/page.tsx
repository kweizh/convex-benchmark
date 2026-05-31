"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import styles from "./page.module.css";
import { addTask, deleteTask, listTasks, toggleTask } from "../convex/api";

export default function Home() {
  const runId = useMemo(
    () => process.env.NEXT_PUBLIC_ZEALT_RUN_ID ?? "local",
    [],
  );
  const tasks = useQuery(listTasks, { runId }) ?? [];
  const addTaskMutation = useMutation(addTask);
  const toggleTaskMutation = useMutation(toggleTask);
  const deleteTaskMutation = useMutation(deleteTask);
  const [text, setText] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    await addTaskMutation({ text: trimmed, runId });
    setText("");
  };

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <header className={styles.header}>
          <h1>Convex Task Manager</h1>
          <p className={styles.meta}>Run ID: {runId}</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            data-testid="task-input"
            type="text"
            placeholder="Add a task"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <button
            className={styles.button}
            data-testid="add-button"
            type="submit"
            disabled={!text.trim()}
          >
            Add Task
          </button>
        </form>

        {tasks.length === 0 ? (
          <p className={styles.empty}>No tasks yet. Add one above.</p>
        ) : (
          <ul className={styles.list}>
            {tasks.map((task) => (
              <li className={styles.task} data-testid="task-item" key={task._id}>
                <div className={styles.taskInfo}>
                  <input
                    checked={task.isCompleted}
                    data-testid="toggle-button"
                    type="checkbox"
                    onChange={() =>
                      toggleTaskMutation({ id: task._id, runId })
                    }
                  />
                  <span
                    className={`${styles.taskText} ${
                      task.isCompleted ? styles.completed : ""
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
                <button
                  className={styles.actionButton}
                  data-testid="delete-button"
                  type="button"
                  onClick={() => deleteTaskMutation({ id: task._id, runId })}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
