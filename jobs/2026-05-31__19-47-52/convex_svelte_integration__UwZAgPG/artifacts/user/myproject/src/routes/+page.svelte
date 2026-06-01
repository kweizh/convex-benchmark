<script lang="ts">
  import { onMount } from "svelte";
  import { convex } from "$lib/convex";

  type Task = {
    _id: string;
    text: string;
    isCompleted: boolean;
  };

  let tasks: Task[] = [];
  let newTask = "";
  const runId = import.meta.env.VITE_ZEALT_RUN_ID as string | undefined;

  const appendRunIdToInput = () => {
    if (!runId) {
      return;
    }
    const trimmed = newTask.trim();
    if (trimmed.includes(runId)) {
      return;
    }
    newTask = `${trimmed} ${runId}`.trim();
  };

  const addTask = async () => {
    const text = newTask.trim();
    if (!text) {
      return;
    }
    await convex.mutation("tasks:add", { text });
    newTask = "";
  };

  const toggleTask = async (id: string) => {
    await convex.mutation("tasks:toggle", { id });
  };

  const deleteTask = async (id: string) => {
    await convex.mutation("tasks:remove", { id });
  };

  onMount(() => {
    const watch = convex.watchQuery("tasks:list", {});
    const unsubscribe = watch.onUpdate((value) => {
      tasks = value as Task[];
    });

    return () => {
      unsubscribe();
      watch.destroy();
    };
  });
</script>

<svelte:head>
  <title>Convex Tasks</title>
</svelte:head>

<main class="page">
  <section class="panel">
    <header>
      <h1>Tasks</h1>
      <p>Manage tasks backed by Convex.</p>
    </header>

    <div class="composer">
      <input
        class="task-input"
        placeholder="Add a task"
        bind:value={newTask}
        on:keydown={(event) => {
          if (event.key === "Enter") {
            addTask();
          }
        }}
      />
      <button class="primary" type="button" on:click={addTask}>Add</button>
      {#if runId}
        <button class="secondary" type="button" on:click={appendRunIdToInput}>
          Append run-id
        </button>
      {/if}
    </div>

    {#if runId}
      <p class="hint">Run-id available: <span>{runId}</span></p>
    {/if}

    <ul class="task-list">
      {#if tasks.length === 0}
        <li class="empty">No tasks yet. Add one above.</li>
      {:else}
        {#each tasks as task}
          <li class="task-item">
            <label class="task-label">
              <input
                type="checkbox"
                checked={task.isCompleted}
                on:change={() => toggleTask(task._id)}
              />
              <span class:completed={task.isCompleted}>{task.text}</span>
            </label>
            <button class="danger" type="button" on:click={() => deleteTask(task._id)}>
              Delete
            </button>
          </li>
        {/each}
      {/if}
    </ul>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: "Inter", system-ui, sans-serif;
    background: #f5f5f7;
    color: #111827;
  }

  .page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 3rem 1.5rem;
  }

  .panel {
    width: min(720px, 100%);
    background: #ffffff;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  header h1 {
    margin: 0;
    font-size: 2rem;
  }

  header p {
    margin: 0.35rem 0 0;
    color: #6b7280;
  }

  .composer {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .task-input {
    flex: 1 1 260px;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    font-size: 1rem;
  }

  button {
    border: none;
    border-radius: 10px;
    padding: 0.7rem 1.25rem;
    font-weight: 600;
    cursor: pointer;
  }

  button.primary {
    background: #2563eb;
    color: white;
  }

  button.secondary {
    background: #e0e7ff;
    color: #4338ca;
  }

  button.danger {
    background: #fee2e2;
    color: #b91c1c;
  }

  .hint {
    margin: 0;
    color: #374151;
    font-size: 0.9rem;
  }

  .hint span {
    font-weight: 600;
  }

  .task-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .task-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
  }

  .task-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .task-label span.completed {
    text-decoration: line-through;
    color: #6b7280;
  }

  .empty {
    padding: 1rem;
    text-align: center;
    color: #6b7280;
  }
</style>
