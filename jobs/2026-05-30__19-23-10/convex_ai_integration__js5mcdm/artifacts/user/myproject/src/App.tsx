import { useState } from 'react'
import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generations = useQuery(api.ai.list);
  const generate = useAction(api.ai.generate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      await generate({ prompt });
      setPrompt("");
    } catch (error) {
      console.error("Failed to generate:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Convex AI Generator</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          disabled={isGenerating}
        />
        <button type="submit" disabled={isGenerating || !prompt.trim()}>
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </form>

      <div>
        <h2>Results</h2>
        {generations === undefined ? (
          <p>Loading...</p>
        ) : generations.length === 0 ? (
          <p>No generations yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {generations.map((gen) => (
              <li key={gen._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "4px", textAlign: "left" }}>
                <strong>Prompt:</strong> {gen.prompt}
                <br /><br />
                <strong>Result:</strong> {gen.result}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
