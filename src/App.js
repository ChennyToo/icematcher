import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Initialize socket.io connection

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // Handle receiving messages from server
  useEffect(() => {
    socket.on('chatMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  }, []);

  // Handle sending message to server
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sended", message)
      socket.emit('chatMessage', message); // Emit message to server
      setMessage(''); // Clear input
    }
  };

  return (
    <div>
      <h1>Real-time Chat</h1>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          id="message"
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Sed</button>
      </form>
      <d1>{messages}</d1>
    </div>
  );
};

export default App;
