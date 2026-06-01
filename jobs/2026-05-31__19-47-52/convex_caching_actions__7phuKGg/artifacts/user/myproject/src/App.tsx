import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import "./App.css";

interface PokemonResult {
  name: string;
  weight: number;
}

const runId = import.meta.env.VITE_ZEALT_RUN_ID ?? "";

function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [result, setResult] = useState<PokemonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const getPokemon = useAction(api.pokemon.getPokemon);

  const handleFetch = async () => {
    const trimmedName = pokemonName.trim().toLowerCase();
    if (!trimmedName) {
      setError("Enter a Pokemon name.");
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await getPokemon({
        pokemonName: trimmedName,
        runId,
      });
      setResult({ name: data.name, weight: data.weight });
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch Pokemon.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app">
      <h1>Pokemon Cache Lookup</h1>
      <p className="subtitle">
        Cached by Convex for run ID: <span>{runId || "(missing)"}</span>
      </p>
      <div className="controls">
        <label htmlFor="pokemon-input">Pokemon name</label>
        <input
          id="pokemon-input"
          type="text"
          value={pokemonName}
          placeholder="pikachu"
          onChange={(event) => setPokemonName(event.target.value)}
        />
        <button id="fetch-button" type="button" onClick={handleFetch}>
          {isLoading ? "Fetching..." : "Fetch"}
        </button>
      </div>
      <div id="result-display" className="result">
        {error && <p className="error">{error}</p>}
        {result && !error && (
          <div className="card">
            <h2>{result.name}</h2>
            <p>Weight: {result.weight}</p>
          </div>
        )}
        {!result && !error && !isLoading && (
          <p className="hint">Search for a Pokemon to see cached results.</p>
        )}
      </div>
    </main>
  );
}

export default App;
