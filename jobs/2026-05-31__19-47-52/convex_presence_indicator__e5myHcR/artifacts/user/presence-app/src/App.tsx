import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import "./App.css";

function App() {
  const [userIdInput, setUserIdInput] = useState("");
  const [onlineUserId, setOnlineUserId] = useState<string | null>(null);
  const heartbeat = useMutation(api.presence.heartbeat);
  const onlineUsers = useQuery(api.presence.getOnlineUsers) ?? [];

  const isOnline = useMemo(
    () => onlineUserId !== null && onlineUserId.length > 0,
    [onlineUserId],
  );

  useEffect(() => {
    if (!onlineUserId) {
      return undefined;
    }

    let isActive = true;

    const sendHeartbeat = async () => {
      if (!isActive) {
        return;
      }
      try {
        await heartbeat({ user_id: onlineUserId });
      } catch (error) {
        console.error("Heartbeat failed", error);
      }
    };

    void sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, 5000);

    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, [heartbeat, onlineUserId]);

  const handleGoOnline = () => {
    const trimmed = userIdInput.trim();
    if (!trimmed) {
      return;
    }
    setOnlineUserId(trimmed);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Real-time Presence</h1>
        <p>Send a heartbeat every 5 seconds to stay online.</p>
      </header>

      <section className="controls">
        <label className="field">
          <span>User ID</span>
          <input
            type="text"
            placeholder="Enter User ID"
            value={userIdInput}
            onChange={(event) => setUserIdInput(event.target.value)}
          />
        </label>
        <button type="button" onClick={handleGoOnline}>
          Go Online
        </button>
        {isOnline ? (
          <p className="status online">Online as {onlineUserId}</p>
        ) : (
          <p className="status offline">Offline</p>
        )}
      </section>

      <section className="online-list">
        <h2>Online users</h2>
        {onlineUsers.length === 0 ? (
          <p className="empty">No one is online yet.</p>
        ) : (
          <ul>
            {onlineUsers.map((user) => (
              <li key={user.user_id} data-testid="online-user">
                {user.user_id}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
