import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const GameComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [gameState, setGameState] = useState('waiting');
  const [joinCode, setJoinCode] = useState('');
  const [playerId, setPlayerId] = useState('');

  useEffect(() => {
    socket.on('game-started', (code) => {
      if (code === joinCode) {
        setGameState('active');
      }
    });

    return () => {
      socket.off('game-started');
    };
  }, [joinCode]);

  const createGame = async () => {
    const response = await axios.post('http://localhost:3000/create-game', {
      questions: [
        {
          questionText: 'What is the capital of France?',
          options: ['Paris', 'London', 'Berlin', 'Madrid'],
          correctAnswer: 'Paris'
        }
      ]
    });
    setJoinCode(response.data.joinCode);
  };

  const joinGame = async () => {
    const response = await axios.post('http://localhost:3000/join-game', {
      joinCode
    });
    setPlayerId(response.data.playerId);
  };

  const startGame = () => {
    socket.emit('start-game', joinCode);
  };

  return (
    <div>
      <button onClick={createGame}>Create Game</button>
      <input
        type="text"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        placeholder="Enter join code"
      />
      <button onClick={joinGame}>Join Game</button>
      <button onClick={startGame} disabled={gameState !== 'waiting'}>
        Start Game
      </button>
      {/* Render game questions and options */}
    </div>
  );
};

export default GameComponent;
