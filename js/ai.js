// ===================== AI LOGIC =====================

function evaluateMove(r, c, shape) {
  // Simulate move and return score
  const oldCell = G.board[r][c];
  G.board[r][c] = { shape, playerIndex: G.currentPlayer };
  
  const points = simulateCheckLines(r, c, shape);
  
  G.board[r][c] = oldCell;  // Undo
  return points;
}

function countBlockingOpportunities(r, c, shape) {
  // Count how many opponent threats this move blocks
  const size = G.boardSize;
  const dirs = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
  ];
  
  let blocks = 0;

  for (const dir of dirs) {
    for (let offset = -2; offset <= 0; offset++) {
      const sr = r + dir.dr * offset;
      const sc = c + dir.dc * offset;
      let opponentCount = 0;
      let emptyCount = 0;

      for (let i = 0; i < 3; i++) {
        const nr = sr + dir.dr * i;
        const nc = sc + dir.dc * i;
        
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) {
          opponentCount = -1;
          break;
        }
        
        const cell = G.board[nr][nc];
        if (cell && cell.playerIndex !== G.currentPlayer && cell.shape === shape) {
          opponentCount++;
        } else if (!cell) {
          emptyCount++;
        } else {
          opponentCount = -1;
          break;
        }
      }

      // If opponent has 2 in a row of this shape and we fill the empty spot
      if (opponentCount === 2 && emptyCount === 1) {
        blocks++;
      }
    }
  }

  return blocks;
}

function makeAIMove() {
  const empty = getEmptyCells();
  if (empty.length === 0) return null;

  const shapes = G.playerCount === 3 ? SHAPES_3P : SHAPES_4P;
  const currentPlayerShape = G.players[G.currentPlayer].shape;
  
  let bestScore = -1;
  let bestMoves = [];

  const shapesToTry = G.gameMode === 'fixed' ? [currentPlayerShape] : shapes;

  if (G.gameMode === 'fixed') {
    // Fixed mode: only use assigned shape
    for (const [r, c] of empty) {
      const points = evaluateMove(r, c, currentPlayerShape);
      const blocks = countBlockingOpportunities(r, c, currentPlayerShape);
      const score = points * SCORE_MULTIPLIER + blocks * BLOCK_WEIGHT;

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [[r, c]];
      } else if (score === bestScore) {
        bestMoves.push([r, c]);
      }
    }
  } else {
    // Free mode: try all shapes for each position
    for (const shape of shapes) {
      for (const [r, c] of empty) {
        const points = evaluateMove(r, c, shape);
        const blocks = countBlockingOpportunities(r, c, shape);
        const score = points * SCORE_MULTIPLIER + blocks * BLOCK_WEIGHT;

        if (score > bestScore) {
          bestScore = score;
          bestMoves = [[r, c, shape]];
        } else if (score === bestScore) {
          bestMoves.push([r, c, shape]);
        }
      }
    }
  }

  if (bestMoves.length === 0) {
    // Fallback: random move
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    const shape = G.gameMode === 'fixed' ? currentPlayerShape : shapes[Math.floor(Math.random() * shapes.length)];
    return [r, c, shape];
  }

  const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  if (move.length === 2) {
    return [move[0], move[1], currentPlayerShape];
  }
  return move;
}

function scheduleAIMove() {
  if (!G.players[G.currentPlayer].isAI || G.gameOver) return;
  
  G.aiThinking = true;
  document.getElementById('turn-ai-indicator').style.display = 'block';
  
  const delay = AI_THINKING_DELAY.min + Math.random() * (AI_THINKING_DELAY.max - AI_THINKING_DELAY.min);
  
  setTimeout(() => {
    const move = makeAIMove();
    if (move) {
      const [r, c, shape] = move;
      G.selectedShape = shape;
      performMove(r, c);
    }
    G.aiThinking = false;
    document.getElementById('turn-ai-indicator').style.display = 'none';
  }, delay);
}