// ===================== SCREEN NAVIGATION =====================

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  el.classList.add('active');
  
  // Re-trigger fade-in animation
  const inner = el.querySelector('.flow-screen, .home-inner');
  if (inner) {
    inner.classList.remove('fade-in');
    void inner.offsetWidth;  // Force reflow
    inner.classList.add('fade-in');
  }
}

function goToCount() {
  showScreen('count');
}

function selectCount(n) {
  G.playerCount = n;
  showScreen('grid');
  buildGridOptions();
}

function buildGridOptions() {
  const container = document.getElementById('grid-size-options');
  container.innerHTML = '';
  
  GRID_SIZES.forEach((sz, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    if (idx > 0) btn.style.borderTop = 'none';
    
    btn.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem">
        <div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:2rem;line-height:1;letter-spacing:.05em">${sz} × ${sz}</div>
          <span class="cb-desc" style="margin-top:.3rem">${GRID_DESCS[sz]}</span>
        </div>
        <span style="font-family:'Bebas Neue',sans-serif;font-size:1rem;color:var(--light);white-space:nowrap">${sz*sz} CELLS</span>
      </div>`;
    
    btn.addEventListener('click', () => selectGridSize(sz));
    container.appendChild(btn);
  });
}

function selectGridSize(sz) {
  G.boardSize = sz;
  showScreen('mode');
}

function selectMode(mode) {
  G.gameMode = mode;
  showScreen('setup');
  buildSetupForm();
}