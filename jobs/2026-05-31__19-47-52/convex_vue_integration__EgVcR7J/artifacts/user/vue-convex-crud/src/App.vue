<script setup lang="ts">
import { computed, ref } from "vue";
import { useMutation, useQuery } from "convex-vue";
import { api } from "../convex/_generated/api";

const newTaskText = ref("");
const tasks = useQuery(api.tasks.list, {});
const createTask = useMutation(api.tasks.create);
const toggleTask = useMutation(api.tasks.toggle);
const removeTask = useMutation(api.tasks.remove);

const taskItems = computed(() => tasks.value ?? []);

const addTask = async () => {
  const trimmed = newTaskText.value.trim();
  if (!trimmed) {
    return;
  }
  await createTask({ text: trimmed });
  newTaskText.value = "";
};

const toggle = async (id: string) => {
  await toggleTask({ id });
};

const remove = async (id: string) => {
  await removeTask({ id });
};
</script>

<template>
  <main class="app">
    <section class="card">
      <header class="header">
        <h1>Task Tracker</h1>
        <p>Manage your tasks with Convex + Vue.</p>
      </header>

      <div class="input-row">
        <input
          id="new-task-input"
          v-model="newTaskText"
          type="text"
          placeholder="Add a new task"
          @keyup.enter="addTask"
        />
        <button id="add-task-btn" type="button" @click="addTask">Add</button>
      </div>

      <ul class="task-list">
        <li v-for="task in taskItems" :key="task._id" class="task-item">
          <span :class="{ completed: task.isCompleted }">{{ task.text }}</span>
          <div class="actions">
            <button class="toggle-btn" type="button" @click="toggle(task._id)">
              {{ task.isCompleted ? "Undo" : "Complete" }}
            </button>
            <button class="delete-btn" type="button" @click="remove(task._id)">
              Delete
            </button>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>
