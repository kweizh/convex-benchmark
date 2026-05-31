import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

function App() {
  const runId = import.meta.env.VITE_ZEALT_RUN_ID || import.meta.env.ZEALT_RUN_ID || 'default-run-id';
  const tasks = useQuery(api.tasks.get, { runId });
  const addTask = useMutation(api.tasks.add);
  const updateStatus = useMutation(api.tasks.updateStatus);
  const removeTask = useMutation(api.tasks.remove);

  const [newTaskText, setNewTaskText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    await addTask({ text: newTaskText, runId });
    setNewTaskText('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Manager</h1>
      <p>Run ID: {runId}</p>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="New task..."
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 10px' }}>Add Task</button>
      </form>

      {tasks === undefined ? (
        <p>Loading tasks...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li key={task._id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  textDecoration: task.status === 'done' ? 'line-through' : 'none',
                  flexGrow: 1,
                  marginRight: '10px'
                }}
              >
                {task.text}
              </span>
              <button
                onClick={() => updateStatus({ id: task._id, status: task.status === 'todo' ? 'done' : 'todo' })}
                style={{ marginRight: '10px' }}
              >
                {task.status === 'todo' ? 'Mark Done' : 'Mark Todo'}
              </button>
              <button onClick={() => removeTask({ id: task._id })}>
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
