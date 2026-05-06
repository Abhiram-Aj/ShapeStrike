// ===================== GAME LOGIC & MOVE EXECUTION =====================

function startGame() {
  const shapes = G.playerCount === 3 ? SHAPES_3P : SHAPES_4P;
  
  G.players = [];
  for (let i = 0; i < G.playerCount; i++) {
    const row = document.querySelector(`.player-row[data-player="${i}"]`);
    const isAI = row.dataset.isAi === 'true';
    const name = row.querySelector('.player-name-input').value.trim() || `Player ${i+1}`;
    
    let shape = null;
    if (G.gameMode === 'fixed') {
      const btn = document.querySelector(`.shape-pick-btn.selected[data-player="${i}"]`);
      shape = btn ? btn.dataset.shape : shapes[i];
    }
    
    G.players.push({ name, shape, score: 0, isAI });
  }

  resetGameState();
  showScreen('game');
  initBoard();
  updateTopBar();
  updateScoreboard();
  
  // Start AI turn if first player is AI
  if (G.players[0].isAI) {
    scheduleAIMove();
  }
}

function performMove(r, c) {
  if (G.gameOver) return;
  if (G.board[r][c] !== null) return;

  const shape = G.selectedShape;
  G.board[r][c] = { shape, playerIndex: G.currentPlayer };

  // Render on board
  placePieceOnCell(r, c, shape, G.currentPlayer);

  // Check for lines
  const pts = checkLines(r, c, shape);
  if (pts > 0) {
    G.players[G.currentPlayer].score += pts;
  }

  // Check if board is full
  if (isGameBoardFull()) {
    G.gameOver = true;
    updateScoreboard();
    showGameOver();
    return;
  }

  // Next turn
  G.currentPlayer = (G.currentPlayer + 1) % G.playerCount;
  G.turnCount++;
  G.selectedShape = G.gameMode === 'fixed' ? G.players[G.currentPlayer].shape : null;

  updateTopBar();
  updateScoreboard();

  // Schedule AI if needed
  if (G.players[G.currentPlayer].isAI) {
    scheduleAIMove();
  }
}