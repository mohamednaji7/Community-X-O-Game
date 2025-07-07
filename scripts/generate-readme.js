const fs = require('fs');
const path = require('path');

// Read game state
const gameState = JSON.parse(fs.readFileSync('game-state.json', 'utf8'));

// Generate board display
function generateBoard() {
  const symbols = { 'X': '❌', 'O': '⭕', '': '⬜' };
  
  let board = '|   | 1 | 2 | 3 |\n|---|---|---|---|\n';
  
  for (let i = 0; i < 3; i++) {
    const rowLabel = String.fromCharCode(65 + i); // A, B, C
    board += `| **${rowLabel}** |`;
    
    for (let j = 0; j < 3; j++) {
      const cell = gameState.board[i][j];
      board += ` ${symbols[cell]} |`;
    }
    board += '\n';
  }
  
  return board;
}

// Generate available moves
function generateMoves() {
  if (gameState.gameOver) return '';
  
  let moves = `**${gameState.currentPlayer}'s Turn** - Click a square to make your move:\n\n`;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (gameState.board[i][j] === '') {
        const position = String.fromCharCode(65 + i) + (j + 1);
        moves += `| ${position} | [Make Move](https://github.com/mohamednaji7/Community-X-O-Game/issues/new?title=xo%7Cmove%7C${position}%7C${gameState.gameId}&body=Making+move+${gameState.currentPlayer}+to+${position}) |\n`;
      }
    }
  }
  
  return moves;
}

// Generate README content
const readmeContent = `# 🎮 Community X-O Game

**Current Game Status:** ${gameState.gameOver ? 
  (gameState.winner ? `🎉 ${gameState.winner} wins!` : "🤝 It's a tie!") : 
  `Game in progress - **${gameState.currentPlayer}'s turn**`}

## Game Board

${generateBoard()}

## Your Move

${gameState.gameOver ? 
  `**Game Over!** ${gameState.winner ? `${gameState.winner} wins!` : "It's a tie!"}\n\n[🎮 Start New Game](https://github.com/mohamednaji7/Community-X-O-Game/issues/new?title=xo%7Cnewgame%7C${gameState.gameId}&body=Starting+a+new+X-O+game!)` : 
  generateMoves()}

## How to Play

1. 🖱️ Click any available square to make your move
2. 🔄 The game alternates between X and O
3. 🏆 First player to get 3 in a row wins!
4. 👥 Anyone can make the next move - it's a community game!

## Recent Move

${gameState.lastMove ? 
  `**${gameState.lastMove.player}** to **${gameState.lastMove.position}** by [@${gameState.lastMove.username}](https://github.com/${gameState.lastMove.username})` : 
  'No moves yet - be the first to play!'}

---

*Inspired by [@timburgan](https://github.com/timburgan)'s amazing community chess game!*
`;

// Write README
fs.writeFileSync('README.md', readmeContent);
console.log('README.md updated successfully!');