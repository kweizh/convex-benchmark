import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import './App.css'

type StatusFilter = 'all' | 'todo' | 'done'

function App() {
  const runId = import.meta.env.VITE_ZEALT_RUN_ID ?? 'local'
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')

  const statusArg = useMemo(() => {
    if (filter === 'all') {
      return undefined
    }
    return filter
  }, [filter])

  const tasks = useQuery(api.tasks.getTasks, {
    runId,
    status: statusArg,
  })
  const addTask = useMutation(api.tasks.addTask)
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus)
  const deleteTask = useMutation(api.tasks.deleteTask)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      return
    }
    await addTask({ text: trimmed, runId })
    setText('')
  }

  return (
    <div className="app">
      <header>
        <div>
          <h1>Task Manager</h1>
          <p>Run ID: {runId}</p>
        </div>
        <div className="filters">
          <label htmlFor="status-filter">Filter</label>
          <select
            id="status-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value as StatusFilter)}
          >
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="done">Done</option>
          </select>
        </div>
      </header>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a task"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <main>
        {!tasks && <p className="loading">Loading tasks...</p>}
        {tasks && tasks.length === 0 && (
          <p className="empty">No tasks yet. Add one above.</p>
        )}
        <ul className="task-list">
          {tasks?.map((task) => (
            <li key={task._id} className={task.status === 'done' ? 'done' : ''}>
              <div>
                <p>{task.text}</p>
                <span className="status">{task.status}</span>
              </div>
              <div className="actions">
                <button
                  type="button"
                  onClick={() =>
                    updateTaskStatus({
                      id: task._id,
                      status: task.status === 'todo' ? 'done' : 'todo',
                    })
                  }
                >
                  Toggle
                </button>
                <button
                  type="button"
                  className="delete"
                  onClick={() => deleteTask({ id: task._id })}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default App
