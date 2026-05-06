// ===================== GAME STATE =====================

let G = {
  playerCount: 3,
  gameMode: 'fixed',        // 'fixed' or 'free'
  players: [],              // [{name, shape, score, isAI}]
  board: [],                // 2D array of null | {shape, playerIndex}
  boardSize: 20,
  currentPlayer: 0,
  scoredLines: new Set(),   // Track already scored lines
  selectedShape: null,      // Currently selected shape in free mode
  turnCount: 1,
  gameOver: false,
  aiThinking: false,
};

let cellEls = [];  // 2D array of DOM elements for board cells

// ===================== STATE HELPERS =====================

function resetGameState() {
  G.board = Array.from({ length: G.boardSize }, () => Array(G.boardSize).fill(null));
  G.currentPlayer = 0;
  G.scoredLines = new Set();
  G.selectedShape = G.gameMode === 'fixed' ? G.players[0].shape : null;
  G.turnCount = 1;
  G.gameOver = false;
  G.aiThinking = false;
  G.players.forEach(p => p.score = 0);
}

function getEmptyCells() {
  const empty = [];
  for (let r = 0; r < G.boardSize; r++) {
    for (let c = 0; c < G.boardSize; c++) {
      if (G.board[r][c] === null) {
        empty.push([r, c]);
      }
    }
  }
  return empty;
}

function getFilledCellCount() {
  return G.board.flat().filter(x => x !== null).length;
}

function isGameBoardFull() {
  const totalCells = G.boardSize * G.boardSize;
  return getFilledCellCount() >= totalCells;
}