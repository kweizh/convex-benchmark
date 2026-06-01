<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { ConvexClient } from "convex/browser";
  import { api } from "../../convex/_generated/api.js";

  const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL);

  let tasks = $state([]);
  let newTaskText = $state("");
  let unsubscribe;

  onMount(() => {
    unsubscribe = convex.onUpdate(api.tasks.get, {}, (newTasks) => {
      tasks = newTasks;
    });
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
    convex.close();
  });

  async function addTask(e) {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    await convex.mutation(api.tasks.add, { text: newTaskText });
    newTaskText = "";
  }

  async function toggleTask(id, isCompleted) {
    await convex.mutation(api.tasks.toggle, { id, isCompleted: !isCompleted });
  }

  async function deleteTask(id) {
    await convex.mutation(api.tasks.remove, { id });
  }
</script>

<main>
  <h1>Tasks</h1>

  <form onsubmit={addTask}>
    <input type="text" bind:value={newTaskText} placeholder="New task..." />
    <button type="submit">Add Task</button>
  </form>

  <ul>
    {#each tasks as task (task._id)}
      <li>
        <input 
          type="checkbox" 
          checked={task.isCompleted} 
          onchange={() => toggleTask(task._id, task.isCompleted)} 
        />
        <span style="text-decoration: {task.isCompleted ? 'line-through' : 'none'};">
          {task.text}
        </span>
        <button onclick={() => deleteTask(task._id)}>Delete</button>
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    max-width: 600px;
    margin: 0 auto;
    font-family: sans-serif;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
</style>
