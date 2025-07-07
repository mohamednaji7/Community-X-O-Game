const fs = require('fs');

// Get move data from environment
const row = parseInt(process.env.ROW);
const col = parseInt(process.env.COL);
const player = process.env.PLAYER;

console.log(`Processing move: Row ${row}, Col ${col}, Player ${player}`);

// Load current game state
let gameState;
try {
  gameState = JSON.parse(fs.readFileSync('game-state.json', 'utf8'));
} catch (error) {
  // Initialize new game if file doesn't exist
  gameState = {
    board: [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ],
    currentPlayer: 'X',
    gameStatus: 'ongoing',
    winner: null,
    moveCount: 0
  };
}

// Validate move
if (gameState.gameStatus !== 'ongoing') {
  console.log('Game is already finished!');
  process.exit(1);
}

if (gameState.currentPlayer !== player) {
  console.log(`Wrong player! It's ${gameState.currentPlayer}'s turn`);
  process.exit(1);
}

if (gameState.board[row][col] !== '') {
  console.log('Cell is already occupied!');
  process.exit(1);
}

// Make the move
gameState.board[row][col] = player;
gameState.moveCount++;

// Check for winner
function checkWinner(board) {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      return board[i][0];
    }
  }
  
  // Check columns
  for (let j = 0; j < 3; j++) {
    if (board[0][j] && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
      return board[0][j];
    }
  }
  
  // Check diagonals
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0];
  }
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2];
  }
  
  return null;
}

const winner = checkWinner(gameState.board);
if (winner) {
  gameState.gameStatus = 'finished';
  gameState.winner = winner;
} else if (gameState.moveCount === 9) {
  gameState.gameStatus = 'finished';
  gameState.winner = 'draw';
} else {
  gameState.currentPlayer = player === 'X' ? 'O' : 'X';
}

// Save updated game state
fs.writeFileSync('game-state.json', JSON.stringify(gameState, null, 2));

console.log('Move processed successfully!');
console.log(`Game state: ${gameState.gameStatus}`);
if (gameState.winner) {
  console.log(`Winner: ${gameState.winner}`);
}

// Generate the README with the updated game state
const { generateReadme } = require('./generate-readme.js');
const readme = generateReadme(gameState);
fs.writeFileSync('README.md', readme);