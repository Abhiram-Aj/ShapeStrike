// ===================== BOARD INITIALIZATION & RENDERING =====================

function initBoard() {
  const size = G.boardSize;
  const cellSize = CELL_SIZE_MAP[size] || 24;

  const board = document.getElementById('game-board');
  board.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
  board.innerHTML = '';
  cellEls = [];

  for (let r = 0; r < size; r++) {
    cellEls[r] = [];
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      cell.style.fontSize = (cellSize * 0.55) + 'px';
      cell.addEventListener('click', () => handleCellClick(r, c));
      board.appendChild(cell);
      cellEls[r][c] = cell;
    }
  }
}

function placePieceOnCell(r, c, shape, playerIndex) {
  const cell = cellEls[r][c];
  cell.innerHTML = `<span class="cell-sym">${SHAPES[shape].sym}</span>`;
  cell.classList.add('filled');
  cell.style.cursor = 'default';
}

function flashCell(r, c) {
  const el = cellEls[r][c];
  el.classList.remove('score-flash');
  void el.offsetWidth;  // Force reflow
  el.classList.add('score-flash');
}

function handleCellClick(r, c) {
  if (G.gameOver) return;
  if (G.aiThinking) return;
  if (G.players[G.currentPlayer].isAI) return;
  if (G.board[r][c] !== null) return;
  
  if (G.gameMode === 'free' && !G.selectedShape) {
    const hint = document.getElementById('hint-msg');
    hint.style.color = '#c00';
    hint.textContent = '⚠ Select a shape above first!';
    setTimeout(() => {
      hint.style.color = '';
      updateHintMsg();
    }, 1500);
    return;
  }

  performMove(r, c);
}