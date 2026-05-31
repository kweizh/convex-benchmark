import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import './App.css'

function App() {
  const runId = import.meta.env.VITE_RUN_ID || "default-run-id";
  const count = useQuery(api.counter.getCounter, { runId }) || 0;
  const increment = useMutation(api.counter.incrementCounter);

  return (
    <div className="App">
      <h1>Collaborative Counter</h1>
      <p>Count is {count}</p>
      <button onClick={() => increment({ runId })}>Increment</button>
    </div>
  );
}

export default App;