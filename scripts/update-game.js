const fs = require('fs');
const path = require('path');

// Read current game state
const gameStatePath = path.join(__dirname, '../game-state.json');
let gameState = JSON.parse(fs.readFileSync(gameStatePath, 'utf8'));

// Parse command line arguments
const args = process.argv.slice(2);
const action = args.find(arg => arg.startsWith('--action=')).split('=')[1];
const position = args.find(arg => arg.startsWith('--position=')).split('=')[1];
const player = args.find(arg => arg.startsWith('--player=')).split('=')[1];
const gameId = args.find(arg => arg.startsWith('--gameId=')).split('=')[1];

// Validate game ID
if (parseInt(gameId) !== gameState.gameId) {
  console.log('Invalid game ID');
  process.exit(1);
}

if (action === 'move') {
  // Parse position (e.g., "A1" -> row 0, col 0)
  const row = position.charAt(0).charCodeAt(0) - 65; // A=0, B=1, C=2
  const col = parseInt(position.charAt(1)) - 1;     // 1=0, 2=1, 3=2
  
  // Validate move
  if (gameState.gameOver || gameState.board[row][col] !== '') {
    console.log('Invalid move');
    process.exit(1);
  }
  
  // Make move
  gameState.board[row][col] = gameState.currentPlayer;
  gameState.lastMove = {
    player: gameState.currentPlayer,
    position: position,
    timestamp: new Date().toISOString(),
    username: player
  };
  
  // Check for winner
  const winner = checkWinner(gameState.board);
  if (winner) {
    gameState.winner = winner;
    gameState.gameOver = true;
  } else if (isBoardFull(gameState.board)) {
    gameState.gameOver = true;
  } else {
    // Switch players
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
  }
  
} else if (action === 'newgame') {
  // Start new game
  gameState = {
    board: [["", "", ""], ["", "", ""], ["", "", ""]],
    currentPlayer: "X",
    gameId: gameState.gameId + 1,
    winner: null,
    gameOver: false,
    lastMove: null
  };
}

// Save updated game state
fs.writeFileSync(gameStatePath, JSON.stringify(gameState, null, 2));

function checkWinner(board) {
  // Check rows, columns, and diagonals
  for (let i = 0; i < 3; i++) {
    // Rows
    if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      return board[i][0];
    }
    // Columns
    if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
      return board[0][i];
    }
  }
  
  // Diagonals
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0];
  }
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2];
  }
  
  return null;
}

function isBoardFull(board) {
  return board.every(row => row.every(cell => cell !== ''));
}