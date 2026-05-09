import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const counter = useQuery(api.counter.get);
  const increment = useMutation(api.counter.increment).withOptimisticUpdate(
    (localStore) => {
      const currentValue = localStore.getQuery(api.counter.get, {});
      if (currentValue !== undefined) {
        localStore.setQuery(api.counter.get, {}, currentValue + 1);
      }
    }
  );

  return (
    <div className="App">
      <h1>Convex Counter</h1>
      <p>Counter value: {counter ?? "Loading..."}</p>
      <button onClick={() => increment()}>Increment</button>
    </div>
  );
}

export default App;
