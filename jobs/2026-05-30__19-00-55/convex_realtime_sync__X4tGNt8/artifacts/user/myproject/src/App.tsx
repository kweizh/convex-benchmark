import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import './App.css'

function App() {
  const runId = import.meta.env.VITE_RUN_ID;
  const count = useQuery(api.counter.getCount, { runId });
  const increment = useMutation(api.counter.increment);

  return (
    <div className="App">
      <h1>Collaborative Counter</h1>
      <div className="card">
        <p>Run ID: <code>{runId}</code></p>
        <p>Current Count: <strong>{count ?? "Loading..."}</strong></p>
        <button onClick={() => increment({ runId })}>
          Increment
        </button>
      </div>
    </div>
  )
}

export default App
