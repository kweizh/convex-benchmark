import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'
import './App.css'

function App() {
  const runId = import.meta.env.VITE_RUN_ID;
  const counter = useQuery(api.counters.get, { runId });
  const increment = useMutation(api.counters.increment);

  return (
    <section id="center">
      <h1>Collaborative Counter</h1>
      <p className="run-id">Run ID: {runId}</p>
      <button
        type="button"
        className="counter"
        onClick={() => increment({ runId })}
        disabled={counter === undefined}
      >
        Increment
      </button>
      <div className="count-display">
        {counter === undefined ? '...' : counter.count}
      </div>
    </section>
  )
}

export default App