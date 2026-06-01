<script setup lang="ts">
import { ref } from 'vue'
import { useConvexQuery, useConvexMutation } from 'convex-vue'
import { api } from '../convex/_generated/api'

// @ts-ignore
const runId = process.env.ZEALT_RUN_ID || "default";
const tableName = `tasks_${runId.replace(/-/g, '_')}`;

const { data: tasks } = useConvexQuery(api.tasks.get, { tableName });
const { mutate: createTask } = useConvexMutation(api.tasks.create);
const { mutate: toggleTask } = useConvexMutation(api.tasks.toggle);
const { mutate: deleteTask } = useConvexMutation(api.tasks.delete);

const newTaskText = ref('');

const addTask = async () => {
  if (!newTaskText.value.trim()) return;
  await createTask({
    tableName,
    text: newTaskText.value.trim(),
    isCompleted: false
  });
  newTaskText.value = '';
};

const handleToggle = async (id: string) => {
  await toggleTask({ tableName, id });
};

const handleDelete = async (id: string) => {
  await deleteTask({ tableName, id });
};
</script>

<template>
  <div class="app">
    <h1>Convex CRUD</h1>
    
    <div>
      <input id="new-task-input" v-model="newTaskText" @keyup.enter="addTask" placeholder="New task" />
      <button id="add-task-btn" @click="addTask">Add Task</button>
    </div>

    <ul v-if="tasks">
      <li v-for="task in tasks" :key="task._id" class="task-item">
        <span :style="{ textDecoration: task.isCompleted ? 'line-through' : 'none' }">
          {{ task.text }}
        </span>
        <button class="toggle-btn" @click="handleToggle(task._id)">Toggle</button>
        <button class="delete-btn" @click="handleDelete(task._id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}
.task-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  align-items: center;
}
</style>
