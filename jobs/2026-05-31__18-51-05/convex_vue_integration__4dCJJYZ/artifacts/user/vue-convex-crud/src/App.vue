<script setup lang="ts">
import { ref } from 'vue';
import { useQuery, useMutation } from 'convex-vue';
import { api } from '../convex/_generated/api';

const newTaskText = ref('');
const tasks = useQuery(api.tasks.get, {});
const { mutate: createTask } = useMutation(api.tasks.create);
const { mutate: toggleTask } = useMutation(api.tasks.toggle);
const { mutate: deleteTask } = useMutation(api.tasks.remove);

const addTask = async () => {
  if (newTaskText.value.trim()) {
    await createTask({ text: newTaskText.value });
    newTaskText.value = '';
  }
};

const handleToggle = async (id: any) => {
  await toggleTask({ id });
};

const handleDelete = async (id: any) => {
  await deleteTask({ id });
};
</script>

<template>
  <div class="container">
    <h1>Task List</h1>
    <div class="input-group">
      <input 
        id="new-task-input" 
        v-model="newTaskText" 
        type="text" 
        placeholder="Add a new task"
        @keyup.enter="addTask"
      />
      <button id="add-task-btn" @click="addTask">Add Task</button>
    </div>

    <ul v-if="tasks">
      <li v-for="task in tasks" :key="task._id" class="task-item">
        <span :style="{ textDecoration: task.isCompleted ? 'line-through' : 'none' }">
          {{ task.text }}
        </span>
        <button class="toggle-btn" @click="handleToggle(task._id)">
          {{ task.isCompleted ? 'Undo' : 'Complete' }}
        </button>
        <button class="delete-btn" @click="handleDelete(task._id)">Delete</button>
      </li>
    </ul>
    <p v-else>Loading tasks...</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.input-group {
  margin-bottom: 2rem;
}

#new-task-input {
  padding: 0.5rem;
  font-size: 1rem;
  margin-right: 0.5rem;
}

#add-task-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}

.toggle-btn, .delete-btn {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}
</style>
