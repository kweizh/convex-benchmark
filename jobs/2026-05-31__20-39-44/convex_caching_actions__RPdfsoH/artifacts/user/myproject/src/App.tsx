import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [result, setResult] = useState<{
    name: string;
    weight: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPokemon = useAction(api.api.getPokemon);

  const handleFetch = async () => {
    if (!pokemonName.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const runId = import.meta.env.VITE_ZEALT_RUN_ID || "";
      const data = await getPokemon({
        pokemonName: pokemonName.trim().toLowerCase(),
        runId,
      });
      setResult({ name: data.name, weight: data.weight });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Pokemon Fetcher</h1>
      <div>
        <input
          type="text"
          id="pokemon-input"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          placeholder="Enter Pokemon name"
          onKeyDown={(e) => e.key === "Enter" && handleFetch()}
        />
        <button id="fetch-button" onClick={handleFetch} disabled={loading}>
          {loading ? "Fetching..." : "Fetch"}
        </button>
      </div>
      <div id="result-display">
        {error && <p style={{ color: "red" }}>{error}</p>}
        {result && (
          <div>
            <p>
              <strong>Name:</strong> {result.name}
            </p>
            <p>
              <strong>Weight:</strong> {result.weight}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;