import { useState, useEffect } from 'react'
import { useQuery, useMutation } from "convex/react"
import { api } from "../convex/_generated/api"
import './App.css'

function App() {
  const [userId, setUserId] = useState('')
  const [isOnline, setIsOnline] = useState(false)
  const heartbeat = useMutation(api.presence.heartbeat)
  const onlineUsers = useQuery(api.presence.getOnlineUsers) || []

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOnline && userId) {
      // Send immediate heartbeat
      heartbeat({ user_id: userId }).catch(console.error);
      
      // Setup interval
      interval = setInterval(() => {
        heartbeat({ user_id: userId }).catch(console.error);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [isOnline, userId, heartbeat]);

  const handleGoOnline = () => {
    if (userId.trim()) {
      setIsOnline(true)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Real-time Presence</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Enter User ID" 
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          disabled={isOnline}
        />
        <button 
          onClick={handleGoOnline}
          disabled={isOnline || !userId.trim()}
          style={{ marginLeft: '10px' }}
        >
          {isOnline ? 'Online' : 'Go Online'}
        </button>
      </div>

      <div>
        <h2>Online Users</h2>
        <ul>
          {onlineUsers.map((user) => (
            <li key={user} data-testid="online-user">
              {user}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
