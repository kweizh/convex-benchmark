import { useState } from 'react'
import { useAction } from 'convex/react'
import { api } from '../convex/_generated/api'
import './App.css'

function App() {
  const [pokemonName, setPokemonName] = useState('')
  const [result, setResult] = useState<{ name: string, weight: number } | null>(null)
  const [error, setError] = useState('')
  
  const getPokemon = useAction(api.pokemon.getPokemon)

  const handleFetch = async () => {
    setError('')
    setResult(null)
    try {
      const runId = import.meta.env.VITE_ZEALT_RUN_ID || ''
      const data = await getPokemon({ pokemonName, runId })
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch')
    }
  }

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
        />
        <button id="fetch-button" onClick={handleFetch}>Fetch</button>
      </div>
      
      <div id="result-display">
        {error && <p style={{color: 'red'}}>{error}</p>}
        {result && (
          <div>
            <p>Name: {result.name}</p>
            <p>Weight: {result.weight}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
