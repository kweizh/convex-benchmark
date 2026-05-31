import { useState } from 'react'
import { useQuery, useAction } from 'convex/react'
import { api } from '../convex/_generated/api'

function App() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const generations = useQuery(api.ai.list)
  const generate = useAction(api.ai.generate)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return
    setIsGenerating(true)
    try {
      await generate({ prompt: prompt.trim() })
      setPrompt('')
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>AI Generation</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
          disabled={isGenerating}
          style={{ flex: 1, padding: 8, fontSize: 16 }}
        />
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          style={{ padding: '8px 16px', fontSize: 16 }}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </form>

      <h2>Generations</h2>
      {generations === undefined ? (
        <p>Loading...</p>
      ) : generations.length === 0 ? (
        <p>No generations yet. Submit a prompt above!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {generations.map((gen) => (
            <div
              key={gen._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 16,
              }}
            >
              <p>
                <strong>Prompt:</strong> {gen.prompt}
              </p>
              <p>
                <strong>Result:</strong> {gen.result}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App