import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const [userId, setUserId] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  
  const heartbeat = useMutation(api.presence.heartbeat);
  const onlineUsers = useQuery(api.presence.getOnlineUsers);

  useEffect(() => {
    let interval: number | undefined;
    if (isOnline && userId) {
      // Send initial heartbeat
      heartbeat({ user_id: userId });
      
      // Set up interval
      interval = window.setInterval(() => {
        heartbeat({ user_id: userId });
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnline, userId, heartbeat]);

  return (
    <div className="App">
      <h1>Presence App</h1>
      <div>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          disabled={isOnline}
        />
        <button onClick={() => setIsOnline(true)} disabled={isOnline || !userId}>
          Go Online
        </button>
      </div>
      <h2>Online Users</h2>
      <ul>
        {onlineUsers?.map((user) => (
          <li key={user._id} data-testid="online-user">
            {user.user_id}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
