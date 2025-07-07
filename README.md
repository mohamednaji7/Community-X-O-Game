# Community X-O Game

**Current Game Status:** Game in progress - **{{currentPlayer}}'s turn**

## Game Board

|   | 1 | 2 | 3 |
|---|---|---|---|
| **A** | {{A1}} | {{A2}} | {{A3}} |
| **B** | {{B1}} | {{B2}} | {{B3}} |
| **C** | {{C1}} | {{C2}} | {{C3}} |

## Your Move Options

{{#if gameOver}}
**Game Over!** {{#if winner}}{{winner}} wins!{{else}}It's a tie!{{/if}}

[🎮 Start New Game](https://github.com/{{username}}/{{username}}/issues/new?title=xo%7Cnewgame%7C{{gameId}}&body=Starting+a+new+X-O+game!)
{{else}}
**{{currentPlayer}}'s Turn** - Click a square to make your move:

{{#each availableMoves}}
| {{position}} | [Make Move](https://github.com/{{../username}}/{{../username}}/issues/new?title=xo%7Cmove%7C{{position}}%7C{{../gameId}}&body=Making+move+{{../currentPlayer}}+to+{{position}}) |
{{/each}}
{{/if}}

## How to Play

1. Click any available square to make your move
2. The game alternates between X and O
3. First player to get 3 in a row wins!
4. Anyone can make the next move - it's a community game!

## Recent Moves

{{#each recentMoves}}
| {{player}} to {{position}} | [@{{username}}](https://github.com/{{username}}) |
{{/each}}