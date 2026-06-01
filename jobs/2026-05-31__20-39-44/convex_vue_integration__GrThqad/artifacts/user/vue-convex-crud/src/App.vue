<script setup lang="ts">
import { ref } from 'vue'
import { useConvexQuery, useConvexMutation } from 'convex-vue'
import { api } from '../convex/_generated/api'

const newTaskText = ref('')

const { data: tasks } = useConvexQuery(api.tasks.get)

const { mutate: createTask } = useConvexMutation(api.tasks.create)
const { mutate: toggleTask } = useConvexMutation(api.tasks.toggle)
const { mutate: deleteTaskMut } = useConvexMutation(api.tasks.deleteTask)

function addTask() {
  const text = newTaskText.value.trim()
  if (!text) return
  createTask({ text })
  newTaskText.value = ''
}

function toggleTaskCompletion(id: string) {
  toggleTask({ id })
}

function deleteTask(id: string) {
  deleteTaskMut({ id })
}
</script>

<template>
  <div id="app">
    <h1>Task Manager</h1>
    <div class="add-task">
      <input
        id="new-task-input"
        v-model="newTaskText"
        type="text"
        placeholder="Add a new task..."
        @keyup.enter="addTask"
      />
      <button id="add-task-btn" @click="addTask">Add</button>
    </div>
    <ul class="task-list">
      <li v-for="task in tasks" :key="task._id" class="task-item">
        <span :class="{ completed: task.isCompleted }">{{ task.text }}</span>
        <button class="toggle-btn" @click="toggleTaskCompletion(task._id)">
          {{ task.isCompleted ? 'Undo' : 'Complete' }}
        </button>
        <button class="delete-btn" @click="deleteTask(task._id)">Delete</button>
      </li>
    </ul>
    <p v-if="!tasks || tasks.length === 0" class="empty-message">No tasks yet. Add one above!</p>
  </div>
</template>

<style scoped>
#app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.add-task {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.add-task input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-task button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-task button:hover {
  background-color: #45a049;
}

.task-list {
  list-style: none;
  padding: 0;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #eee;
}

.task-item span {
  flex: 1;
}

.task-item span.completed {
  text-decoration: line-through;
  color: #888;
}

.toggle-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-btn:hover {
  background-color: #1976d2;
}

.delete-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.empty-message {
  text-align: center;
  color: #888;
}
</style>