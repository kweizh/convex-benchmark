import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import "./App.css";

function App() {
  const runId = import.meta.env.VITE_RUN_ID;
  const counter = useQuery(api.counters.get, runId ? { runId } : "skip");
  const increment = useMutation(api.counters.increment);

  const handleIncrement = async () => {
    if (!runId) {
      return;
    }
    await increment({ runId });
  };

  if (!runId) {
    return (
      <div className="app">
        <h1>Collaborative Counter</h1>
        <p className="status">
          Missing <code>VITE_RUN_ID</code>. Start the app with
          <code>VITE_RUN_ID=$ZEALT_RUN_ID</code> so each run is isolated.
        </p>
      </div>
    );
  }

  const countValue = counter ? counter.count : 0;

  return (
    <div className="app">
      <h1>Collaborative Counter</h1>
      <p className="status">Run ID: {runId}</p>
      <div className="counter-card">
        <p className="count">{counter === undefined ? "Loading..." : countValue}</p>
        <button type="button" onClick={handleIncrement}>
          Increment
        </button>
      </div>
    </div>
  );
}

export default App;
