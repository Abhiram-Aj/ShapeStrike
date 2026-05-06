// ===================== LINE DETECTION & SCORING =====================

function checkLines(r, c, shape) {
  const size = G.boardSize;
  const dirs = [
    { name: 'H', dr: 0, dc: 1 },
    { name: 'V', dr: 1, dc: 0 },
    { name: 'D1', dr: 1, dc: 1 },
    { name: 'D2', dr: 1, dc: -1 },
  ];
  
  let points = 0;
  const newScored = [];

  for (const dir of dirs) {
    for (let offset = -2; offset <= 0; offset++) {
      const sr = r + dir.dr * offset;
      const sc = c + dir.dc * offset;
      let valid = true;
      const cells = [];

      for (let i = 0; i < 3; i++) {
        const nr = sr + dir.dr * i;
        const nc = sc + dir.dc * i;
        
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) {
          valid = false;
          break;
        }
        
        const cell = G.board[nr][nc];
        if (!cell || cell.shape !== shape) {
          valid = false;
          break;
        }
        
        cells.push([nr, nc]);
      }

      if (valid) {
        const key = `${dir.name}_${sr}_${sc}`;
        if (!G.scoredLines.has(key)) {
          G.scoredLines.add(key);
          points++;
          newScored.push(cells);
        }
      }
    }
  }

  // Flash all scored cells
  newScored.forEach(cells => {
    cells.forEach(([nr, nc]) => {
      flashCell(nr, nc);
    });
  });

  return points;
}

function simulateCheckLines(r, c, shape) {
  // Used by AI to evaluate moves without modifying game state
  const size = G.boardSize;
  const dirs = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
  ];
  
  let points = 0;
  const scored = new Set();

  for (const dir of dirs) {
    for (let offset = -2; offset <= 0; offset++) {
      const sr = r + dir.dr * offset;
      const sc = c + dir.dc * offset;
      let valid = true;

      for (let i = 0; i < 3; i++) {
        const nr = sr + dir.dr * i;
        const nc = sc + dir.dc * i;
        
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) {
          valid = false;
          break;
        }
        
        const cell = G.board[nr][nc];
        if (!cell || cell.shape !== shape) {
          valid = false;
          break;
        }
      }

      if (valid) {
        const key = `${dir.dr}_${dir.dc}_${sr}_${sc}`;
        if (!scored.has(key)) {
          scored.add(key);
          points++;
        }
      }
    }
  }

  return points;
}