const io = require('socket.io-client');
const socket = io('http://localhost:3001'); 

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('timer', (data) => {
  console.log(`Timer: ${data.countDown} - ${data.msg}`);
});

socket.on('updateGame', (game) => {
  console.log('Game updated:');
  console.log(game);
});

function createGame(name,difficultyLevel,time) {
  socket.emit('createGame', {name,difficultyLevel,time});
}

function joinGame(gameId, name) {
  socket.emit('joinGame', { gameId, Name: name });
}

function startTimer(gameId,playerId) {
  socket.emit('startTimer', { gameId , playerId});
}

function updateWordIndex(gameId, playerId, currentWordIndex) {
  socket.emit('updateWordIndex', { gameId, playerId, currentWordIndex });
}

function endGame(gameId, playerId, WPM, accuracy) {
  socket.emit('endGame', { gameId, playerId, WPM, accuracy });
}

// createGame('John Doe','Hard',30);
// joinGame('64ba8dc3588bf9a8fce6b7e3', 'Jane Doe');
startTimer('64badcf2c1f80423fc0fad0f','64badcf5c1f80423fc0fad10');
// updateWordIndex('64ba8dc3588bf9a8fce6b7e3', '64ba8dd9588bf9a8fce6b7e8', 10);
// endGame('64ba8dc3588bf9a8fce6b7e3', '64ba8dd9588bf9a8fce6b7e8', 50, 90);