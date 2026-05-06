// ===================== UI UPDATES =====================

function updateTopBar() {
  const p = G.players[G.currentPlayer];
  document.getElementById('turn-player-name').textContent = p.name.toUpperCase();
  document.getElementById('turn-counter').textContent = `Turn ${G.turnCount} · ${G.boardSize}×${G.boardSize}`;

  const shapeArea = document.getElementById('turn-shape-area');
  shapeArea.innerHTML = '';

  const shapes = G.playerCount === 3 ? SHAPES_3P : SHAPES_4P;

  if (G.gameMode === 'fixed') {
    const s = document.createElement('div');
    s.className = 'turn-shape-fixed';
    s.textContent = SHAPES[p.shape].sym + ' ' + SHAPES[p.shape].label;
    shapeArea.appendChild(s);
    G.selectedShape = p.shape;
  } else {
    if (p.isAI) {
      const s = document.createElement('div');
      s.className = 'turn-shape-fixed';
      s.textContent = '◈ Free Mode';
      shapeArea.appendChild(s);
    } else {
      const row = document.createElement('div');
      row.className = 'turn-shape-free';
      shapes.forEach(sh => {
        const btn = document.createElement('button');
        btn.className = 'free-shape-btn' + (G.selectedShape === sh ? ' selected' : '');
        btn.title = SHAPES[sh].label;
        btn.textContent = SHAPES[sh].sym;
        btn.disabled = G.aiThinking;
        btn.addEventListener('click', () => selectShapeButton(sh));
        row.appendChild(btn);
      });
      shapeArea.appendChild(row);
    }
  }

  updateHintMsg();
}

function selectShapeButton(shape) {
  if (!G.aiThinking) {
    G.selectedShape = shape;
    updateTopBar();
  }
}

function updateHintMsg() {
  const hint = document.getElementById('hint-msg');
  if (G.players[G.currentPlayer].isAI) {
    hint.textContent = 'AI is making a move...';
  } else if (G.gameMode === 'free') {
    if (!G.selectedShape) {
      hint.textContent = 'Select a shape above, then click a cell to place it';
    } else {
      hint.textContent = `Placing ${SHAPES[G.selectedShape].label} — click a cell`;
    }
  } else {
    hint.textContent = 'Click any empty cell to place your shape';
  }
}

function updateScoreboard() {
  const sb = document.getElementById('scoreboard');
  sb.innerHTML = '';
  G.players.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'score-card' + (i === G.currentPlayer ? ' active-player' : '') + (p.isAI ? ' ai-player' : '');
    card.id = `score-card-${i}`;

    const shapeSym = G.gameMode === 'fixed' ? SHAPES[p.shape].sym : '◈';

    card.innerHTML = `
      <span class="score-shape">${shapeSym}</span>
      <div class="score-info">
        <div class="score-name">${p.name}</div>
        <div class="score-pts">${p.score}<span class="score-pts-label">pts</span></div>
      </div>`;
    sb.appendChild(card);
  });
}