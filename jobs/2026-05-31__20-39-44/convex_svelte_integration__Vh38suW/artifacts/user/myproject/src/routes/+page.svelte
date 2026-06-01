<script lang="ts">
  import { onMount } from 'svelte';
  import { ConvexClient } from 'convex/browser';
  import { api } from '../../convex/_generated/api.js';

  interface Task {
    _id: string;
    text: string;
    isCompleted: boolean;
  }

  let tasks: Task[] = $state([]);
  let newTaskText = $state('');
  let client: ConvexClient | null = null;
  let unsubscribe: (() => void) | null = null;

  onMount(() => {
    const convexUrl: string = import.meta.env.VITE_CONVEX_URL;
    if (convexUrl) {
      client = new ConvexClient(convexUrl);
      unsubscribe = client.onUpdate(api.tasks.list, {}, (result: Task[]) => {
        tasks = result;
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  });

  async function addTask() {
    const runId: string = import.meta.env.ZEALT_RUN_ID || '';
    const text = newTaskText.trim();
    if (!text) return;
    const taskText = runId ? `${text} ${runId}` : text;
    if (client) {
      await client.mutation(api.tasks.add, { text: taskText });
    }
    newTaskText = '';
  }

  async function toggleTask(id: string) {
    if (client) {
      await client.mutation(api.tasks.toggle, { id: id as any });
    }
  }

  async function deleteTask(id: string) {
    if (client) {
      await client.mutation(api.tasks.remove, { id: id as any });
    }
  }
</script>

<main>
  <h1>Task Manager</h1>

  <form onsubmit={(e) => { e.preventDefault(); addTask(); }} class="add-task-form">
    <input
      type="text"
      bind:value={newTaskText}
      placeholder="Enter a new task..."
    />
    <button type="submit">Add Task</button>
  </form>

  <ul class="task-list">
    {#each tasks as task (task._id)}
      <li class={task.isCompleted ? 'completed' : ''}>
        <input
          type="checkbox"
          checked={task.isCompleted}
          onchange={() => toggleTask(task._id)}
        />
        <span class="task-text">{task.text}</span>
        <button class="delete-btn" onclick={() => deleteTask(task._id)}>Delete</button>
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    max-width: 600px;
    margin: 2rem auto;
    font-family: Arial, sans-serif;
    padding: 0 1rem;
  }

  h1 {
    text-align: center;
    color: #333;
  }

  .add-task-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .add-task-form input {
    flex: 1;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .add-task-form button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .add-task-form button:hover {
    background-color: #45a049;
  }

  .task-list {
    list-style: none;
    padding: 0;
  }

  .task-list li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
  }

  .task-list li.completed .task-text {
    text-decoration: line-through;
    color: #999;
  }

  .task-text {
    flex: 1;
  }

  .delete-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .delete-btn:hover {
    background-color: #d32f2f;
  }
</style>