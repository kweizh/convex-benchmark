<script lang="ts">
	import { client } from '$lib/convex';
	import { useQuery } from '$lib/convexStore';
	import { api } from '../../convex/_generated/api';

	let newTaskText = '';
	// Using import.meta.env.VITE_ZEALT_RUN_ID because Vite only exposes VITE_ prefixed variables to the client
	const runId = import.meta.env.VITE_ZEALT_RUN_ID || '';

	const tasksStore = useQuery(api.tasks.list, {});
	let tasks: any[] = [];

	$: tasks = $tasksStore || [];

	async function addTask() {
		if (!newTaskText.trim()) return;
		await client.mutation(api.tasks.add, { text: newTaskText });
		newTaskText = '';
	}

	async function toggleTask(id: any, isCompleted: boolean) {
		await client.mutation(api.tasks.toggle, { id, isCompleted: !isCompleted });
	}

	async function deleteTask(id: any) {
		await client.mutation(api.tasks.remove, { id });
	}

	function appendRunId() {
		newTaskText += runId;
	}
</script>

<main>
	<h1>SvelteKit + Convex Tasks</h1>

	<div class="add-task">
		<input type="text" bind:value={newTaskText} placeholder="Enter task text..." />
		<button on:click={addTask}>Add Task</button>
		<button on:click={appendRunId}>Append Run ID</button>
	</div>

	<ul>
		{#each tasks as task (task._id)}
			<li>
				<input
					type="checkbox"
					checked={task.isCompleted}
					on:change={() => toggleTask(task._id, task.isCompleted)}
				/>
				<span class:completed={task.isCompleted}>{task.text}</span>
				<button on:click={() => deleteTask(task._id)}>Delete</button>
			</li>
		{/each}
	</ul>
</main>

<style>
	.completed {
		text-decoration: line-through;
		color: gray;
	}
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;
		font-family: sans-serif;
	}
	.add-task {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	input[type="text"] {
		flex: 1;
		padding: 0.5rem;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid #eee;
	}
	span {
		flex: 1;
	}
</style>
