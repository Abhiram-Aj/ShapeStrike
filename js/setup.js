// ===================== SETUP FORM & PLAYER CONFIGURATION =====================

function buildSetupForm() {
  const shapes = G.playerCount === 3 ? SHAPES_3P : SHAPES_4P;
  const form = document.getElementById('setup-form');
  const title = document.getElementById('setup-title');
  title.textContent = G.gameMode === 'fixed' ? 'PLAYER SETUP' : 'PLAYER NAMES';

  form.innerHTML = '';

  for (let i = 0; i < G.playerCount; i++) {
    const row = document.createElement('div');
    row.className = 'player-row';
    row.dataset.player = i;
    row.dataset.isAi = 'false';

    const num = document.createElement('div');
    num.className = 'player-num';
    num.textContent = i + 1;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'player-name-input';
    input.placeholder = `Player ${i + 1} name`;
    input.maxLength = 18;
    input.dataset.player = i;
    input.addEventListener('input', checkStartReady);

    row.appendChild(num);
    row.appendChild(input);

    if (G.gameMode === 'fixed') {
      const shapePicker = document.createElement('div');
      shapePicker.className = 'player-shapes';
      shapePicker.dataset.player = i;

      shapes.forEach(sh => {
        const btn = document.createElement('button');
        btn.className = 'shape-pick-btn';
        btn.type = 'button';
        btn.dataset.shape = sh;
        btn.dataset.player = i;
        btn.title = SHAPES[sh].label;
        btn.textContent = SHAPES[sh].sym;
        btn.addEventListener('click', () => pickShape(i, sh));
        shapePicker.appendChild(btn);
      });

      row.appendChild(shapePicker);
    }

    // AI toggle
    const aiToggle = document.createElement('label');
    aiToggle.className = 'ai-toggle';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.player = i;
    checkbox.addEventListener('change', (e) => toggleAI(i, e.target.checked));
    const label = document.createElement('span');
    label.className = 'ai-toggle-label';
    label.textContent = 'AI';
    aiToggle.appendChild(checkbox);
    aiToggle.appendChild(label);
    row.appendChild(aiToggle);

    form.appendChild(row);
  }

  checkStartReady();
}

function toggleAI(playerIndex, isAI) {
  const row = document.querySelector(`.player-row[data-player="${playerIndex}"]`);
  const input = row.querySelector('.player-name-input');
  
  if (isAI) {
    row.classList.add('ai-player');
    row.dataset.isAi = 'true';
    input.value = `AI ${playerIndex + 1}`;
    input.disabled = true;
  } else {
    row.classList.remove('ai-player');
    row.dataset.isAi = 'false';
    input.value = '';
    input.disabled = false;
  }
  
  checkStartReady();
}

function pickShape(playerIndex, shape) {
  const shapes = G.playerCount === 3 ? SHAPES_3P : SHAPES_4P;
  const prev = document.querySelector(`.shape-pick-btn.selected[data-player="${playerIndex}"]`);
  
  if (prev) prev.classList.remove('selected');

  const clicked = document.querySelector(`.shape-pick-btn[data-player="${playerIndex}"][data-shape="${shape}"]`);
  
  if (prev && prev.dataset.shape === shape) {
    // Deselected
    refreshShapePickers();
    checkStartReady();
    return;
  }

  clicked.classList.add('selected');
  refreshShapePickers();
  checkStartReady();
}

function refreshShapePickers() {
  const shapes = G.playerCount === 3 ? SHAPES_3P : SHAPES_4P;
  const takenByPlayer = {};
  
  document.querySelectorAll('.shape-pick-btn.selected').forEach(btn => {
    takenByPlayer[btn.dataset.shape] = parseInt(btn.dataset.player);
  });

  for (let i = 0; i < G.playerCount; i++) {
    shapes.forEach(sh => {
      const btn = document.querySelector(`.shape-pick-btn[data-player="${i}"][data-shape="${sh}"]`);
      if (!btn) return;
      
      const takenBy = takenByPlayer[sh];
      const isMine = btn.classList.contains('selected');
      
      if (takenBy !== undefined && takenBy !== i) {
        btn.disabled = true;
        let x = btn.querySelector('.taken-x');
        if (!x) {
          x = document.createElement('span');
          x.className = 'taken-x';
          btn.appendChild(x);
        }
        x.textContent = `P${takenBy+1}`;
      } else {
        btn.disabled = false;
        const x = btn.querySelector('.taken-x');
        if (x) x.remove();
      }
    });
  }
}

function checkStartReady() {
  const inputs = document.querySelectorAll('.player-name-input');
  let allNamed = true;
  
  inputs.forEach(inp => {
    if (inp.disabled) return;  // AI players auto-filled
    if (!inp.value.trim()) allNamed = false;
  });

  let allShaped = true;
  if (G.gameMode === 'fixed') {
    for (let i = 0; i < G.playerCount; i++) {
      const isAI = document.querySelector(`.player-row[data-player="${i}"]`).dataset.isAi === 'true';
      if (!isAI && !document.querySelector(`.shape-pick-btn.selected[data-player="${i}"]`)) {
        allShaped = false;
        break;
      }
    }
  }

  document.getElementById('btn-start').disabled = !(allNamed && allShaped);
}