import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const generations = useQuery(api.ai.list);
  const generate = useAction(api.ai.generate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      await generate({ prompt });
      setPrompt("");
    } catch (error) {
      console.error("Failed to generate:", error);
      alert("Error generating response. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Convex AI Generator</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      <div className="results">
        <h2>Results</h2>
        {generations === undefined ? (
          <p>Loading...</p>
        ) : generations.length === 0 ? (
          <p>No generations yet.</p>
        ) : (
          <ul>
            {generations.map((gen) => (
              <li key={gen._id}>
                <strong>Prompt:</strong> {gen.prompt}
                <div>
                  <strong>Result:</strong> {gen.result}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
