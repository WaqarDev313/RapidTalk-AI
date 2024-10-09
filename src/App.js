import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'; // Optional for additional custom styles if needed

const socket = io('http://localhost:5000'); // Connect to the backend

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id); // Verify connection to backend
    });
  
    socket.on('chat message', (msg) => {
      console.log('Message from server:', msg); // Log messages from backend
      setChat((prev) => [...prev, msg]);
    });
  
    return () => socket.off('chat message');
  }, []);
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', message);
      setMessage(''); // Clear the input field after sending
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 w-100">
      <div className="card w-100">
        <div className="card-header text-white bg-primary">
          <h3 className="mb-0">Real-Time Chat</h3>
        </div>

        <div className="card-body chat-window" style={{ height: '400px', overflowY: 'auto' }}>
          {chat.map((msg, index) => (
            <p key={index} className={`chat-message ${index % 2 === 0 ? 'bg-light' : 'bg-info text-white'} p-2 rounded`}>
              {msg}
            </p>
          ))}
        </div>

        <div className="card-footer">
          <form className="d-flex" onSubmit={sendMessage}>
            <input
              type="text"
              className="form-control me-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
