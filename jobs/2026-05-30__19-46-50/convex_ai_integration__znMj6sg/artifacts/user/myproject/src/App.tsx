import { FormEvent, useMemo, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import "./App.css";

function App() {
  const generations = useQuery(api.ai.list) ?? [];
  const generate = useAction(api.ai.generate);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => prompt.trim().length > 0 && !isSubmitting,
    [prompt, isSubmitting],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await generate({ prompt: prompt.trim() });
      setPrompt("");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Failed to generate a response.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Convex AI Generations</h1>
        <p>Submit a prompt to generate a response and save it to Convex.</p>
      </header>

      <form className="prompt-form" onSubmit={handleSubmit}>
        <label htmlFor="prompt">Prompt</label>
        <textarea
          id="prompt"
          name="prompt"
          rows={4}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask something interesting..."
        />
        <button type="submit" disabled={!canSubmit}>
          {isSubmitting ? "Generating..." : "Generate"}
        </button>
        {error ? <span className="error">{error}</span> : null}
      </form>

      <section className="results">
        <h2>Previous generations</h2>
        {generations.length === 0 ? (
          <p className="empty">No generations yet. Submit a prompt above.</p>
        ) : (
          <ul>
            {generations.map((generation) => (
              <li key={generation._id}>
                <div className="prompt">{generation.prompt}</div>
                <div className="result">{generation.result}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
