import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import "./App.css";

function App() {
  const [repo, setRepo] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const pitches = useQuery(api.pitches.list);
  const generatePitch = useAction(api.pitches.generate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repo) return;

    setIsGenerating(true);
    try {
      await generatePitch({ repo });
      setRepo("");
    } catch (error) {
      console.error("Error generating pitch:", error);
      alert("Failed to generate pitch. Make sure the repo exists and check your API keys.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="App">
      <h1>GitHub Repo Pitch Generator</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="e.g. facebook/react"
          disabled={isGenerating}
        />
        <button type="submit" disabled={isGenerating || !repo}>
          {isGenerating ? "Generating..." : "Generate Pitch"}
        </button>
      </form>

      <section>
        <h2>Recent Pitches</h2>
        {pitches === undefined ? (
          <p>Loading pitches...</p>
        ) : pitches.length === 0 ? (
          <p>No pitches generated yet.</p>
        ) : (
          <ul>
            {pitches.map((pitch) => (
              <li key={pitch._id}>
                <strong>{pitch.repo}</strong>: {pitch.pitch}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
