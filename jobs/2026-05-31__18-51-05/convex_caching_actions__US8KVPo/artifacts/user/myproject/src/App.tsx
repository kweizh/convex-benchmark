import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import "./App.css";

function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [result, setResult] = useState<{ name: string; weight: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPokemon = useAction(api.api.getPokemon);

  const handleFetch = async () => {
    if (!pokemonName) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const runId = import.meta.env.VITE_ZEALT_RUN_ID || "default-run-id";
      const data = await getPokemon({ pokemonName, runId });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Pokemon Fetcher</h1>
      <div>
        <input
          type="text"
          id="pokemon-input"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          placeholder="Enter Pokemon name"
        />
        <button id="fetch-button" onClick={handleFetch} disabled={loading}>
          {loading ? "Fetching..." : "Fetch"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div id="result-display">
        {result && (
          <div>
            <p>Name: {result.name}</p>
            <p>Weight: {result.weight}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
