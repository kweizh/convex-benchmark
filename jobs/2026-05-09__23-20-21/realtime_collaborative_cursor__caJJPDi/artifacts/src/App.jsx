import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";
import './App.css'

// Generate a random ID for this session
const userId = Math.random().toString(36).substring(2, 9);
const userColor = '#' + Math.floor(Math.random()*16777215).toString(16);

function App() {
  const cursors = useQuery(api.cursors.get);
  const updateCursor = useMutation(api.cursors.update);

  const handleMouseMove = (e) => {
    updateCursor({
      id: userId,
      x: e.clientX,
      y: e.clientY,
      color: userColor,
    });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      <h1 style={{ textAlign: 'center', marginTop: '20vh' }}>Collaborative Cursors</h1>
      <p style={{ textAlign: 'center' }}>Move your mouse around!</p>
      
      {cursors?.map((cursor) => (
        <div
          key={cursor.id}
          className="cursor"
          style={{
            position: 'absolute',
            left: cursor.x,
            top: cursor.y,
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            backgroundColor: cursor.color,
            pointerEvents: 'none',
            zIndex: 100,
            transform: 'translate(-50%, -50%)',
            border: '2px solid white',
            boxShadow: '0 0 5px rgba(0,0,0,0.5)'
          }}
        />
      ))}
    </div>
  )
}

export default App
