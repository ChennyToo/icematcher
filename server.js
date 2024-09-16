const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

const games = {}; // In-memory store for game data

// Endpoint to create a new game
app.post('/create-game', (req, res) => {
  const gameId = uuidv4(); // Generate a unique game ID
  const joinCode = gameId.slice(0, 6).toUpperCase(); // Create a join code from the ID

  games[joinCode] = {
    gameId,
    questions: req.body.questions || [],
    players: [],
    gameState: 'waiting'
  };

  res.json({ joinCode });
});

// Endpoint to join a game
app.post('/join-game', (req, res) => {
  const { joinCode } = req.body;
  const game = games[joinCode];

  if (game && game.gameState === 'waiting') {
    const playerId = uuidv4(); // Unique player ID
    game.players.push({ playerId, score: 0 });

    res.json({ playerId });
  } else {
    res.status(400).json({ error: 'Game not found or already started' });
  }
});

// Handle real-time communication
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('start-game', (joinCode) => {
    const game = games[joinCode];
    if (game) {
      game.gameState = 'active';
      io.emit('game-started', joinCode);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
