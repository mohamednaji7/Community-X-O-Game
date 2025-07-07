const fs = require('fs');

function generateCell(row, col, value, gameState) {
  if (value === 'X') {
    return '❌';
  } else if (value === 'O') {
    return '⭕';
  } else {
    // Empty cell - create link for next move
    const nextPlayer = gameState.currentPlayer;
    const issueTitle = `xo|move|${row}|${col}|${nextPlayer}`;
    const issueBody = "Just push 'Submit new issue'. You don't need to do anything else.";
    const url = `https://github.com/mohamednaji7/Community-X-O-Game/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;
    return `[⬜](${url})`;
  }
}

function generateReadme(gameState) {
  let readme = `# Community X-O Game

**Game is in progress!** This is open to ANYONE to play the next move. That's the point! 🎮

`;

  if (gameState.gameStatus === 'ongoing') {
    readme += `**${gameState.currentPlayer}'s turn!** Click on an empty cell to make your move.\n\n`;
  } else if (gameState.winner === 'draw') {
    readme += `**Game Over - It's a Draw!** 🤝\n\n`;
  } else {
    readme += `**Game Over - ${gameState.winner} Wins!** 🎉\n\n`;
  }

  readme += `## Game Board\n\n`;
  readme += `|   | A | B | C |\n`;
  readme += `|---|---|---|---|\n`;

  for (let i = 0; i < 3; i++) {
    readme += `| ${i + 1} |`;
    for (let j = 0; j < 3; j++) {
      readme += ` ${generateCell(i, j, gameState.board[i][j], gameState)} |`;
    }
    readme += `\n`;
  }

  readme += `\n## How to Play\n\n`;
  readme += `1. Click on any empty cell (⬜) to make your move\n`;
  readme += `2. This will create a GitHub issue - just click "Submit new issue"\n`;
  readme += `3. The game will automatically update with your move\n`;
  readme += `4. Players alternate between X and O\n`;
  readme += `5. First to get 3 in a row (horizontal, vertical, or diagonal) wins!\n\n`;

  if (gameState.gameStatus === 'finished') {
    readme += `## Start New Game\n\n`;
    readme += `Want to play again? [Click here to start a new game](https://github.com/mohamednaji7/Community-X-O-Game/issues/new?title=xo%7Cnew-game&body=Just+push+%27Submit+new+issue%27+to+start+a+new+game.)\n\n`;
  }

  readme += `## Share with Friends\n\n`;
  readme += `[Share on Twitter](https://twitter.com/share?text=I'm+playing+X-O+on+a+GitHub+repository!+Can+you+take+the+next+move+at+https://github.com/mohamednaji7/Community-X-O-Game) | [Share on LinkedIn](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/mohamednaji7/Community-X-O-Game)\n\n`;

  readme += `## Game Statistics\n\n`;
  readme += `- **Moves played**: ${gameState.moveCount}\n`;
  readme += `- **Current player**: ${gameState.gameStatus === 'ongoing' ? gameState.currentPlayer : 'Game finished'}\n`;
  readme += `- **Status**: ${gameState.gameStatus === 'ongoing' ? 'In progress' : 'Finished'}\n`;

  if (gameState.winner) {
    readme += `- **Winner**: ${gameState.winner === 'draw' ? 'Draw' : gameState.winner}\n`;
  }

  readme += `\n---\n\n`;
  readme += `**How this works**: When you click a cell, it creates a GitHub Issue that triggers a GitHub Actions workflow. The workflow processes your move and updates this README with the new game state. Cool, right? 🤖\n\n`;
  readme += `**Found a bug?** [Report it here](https://github.com/mohamednaji7/Community-X-O-Game/issues/new?title=Bug+Report&body=Describe+the+issue+here...)\n`;

  return readme;
}

// If called directly (not as a module)
if (require.main === module) {
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

  const readme = generateReadme(gameState);
  fs.writeFileSync('README.md', readme);
  console.log('README generated successfully!');
}

module.exports = { generateReadme, generateCell };