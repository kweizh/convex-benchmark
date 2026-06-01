import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

function App() {
  const [userId, setUserId] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const heartbeat = useMutation(api.presence.heartbeat);
  const onlineUsers = useQuery(api.presence.getOnlineUsers);

  useEffect(() => {
    if (isOnline && userId.trim()) {
      // Send initial heartbeat
      heartbeat({ user_id: userId.trim() });

      // Set up interval to send heartbeat every 5 seconds
      intervalRef.current = setInterval(() => {
        heartbeat({ user_id: userId.trim() });
      }, 5000);
    } else {
      // Clear interval when going offline
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOnline, userId, heartbeat]);

  const handleGoOnline = () => {
    if (userId.trim()) {
      setIsOnline(true);
    }
  };

  const handleGoOffline = () => {
    setIsOnline(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>User Presence</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          disabled={isOnline}
          style={{ padding: '8px 12px', fontSize: 16, marginRight: 8 }}
        />
        {!isOnline ? (
          <button onClick={handleGoOnline} disabled={!userId.trim()} style={{ padding: '8px 16px', fontSize: 16 }}>
            Go Online
          </button>
        ) : (
          <button onClick={handleGoOffline} style={{ padding: '8px 16px', fontSize: 16 }}>
            Go Offline
          </button>
        )}
      </div>

      <div>
        <h2>Online Users</h2>
        {onlineUsers === undefined ? (
          <p>Loading...</p>
        ) : onlineUsers.length === 0 ? (
          <p>No users online</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {onlineUsers.map((uid: string) => (
              <li key={uid} data-testid="online-user" style={{ padding: '4px 0' }}>
                {uid}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;