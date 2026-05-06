// ===================== GAME OVER SCREEN =====================

function showGameOver() {
  const sorted = [...G.players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const isTie = sorted[0].score === sorted[1].score;

  document.getElementById('go-winner-name').textContent =
    isTie ? 'IT\'S A TIE!' : winner.name.toUpperCase();
  
  document.getElementById('go-winner-score').textContent =
    isTie
      ? `Multiple players tied at ${winner.score} points`
      : `wins with ${winner.score} point${winner.score !== 1 ? 's' : ''}`;

  const results = document.getElementById('go-results');
  results.innerHTML = '';
  
  sorted.forEach((p, idx) => {
    const row = document.createElement('div');
    const isTopScore = p.score === sorted[0].score;
    row.className = 'go-row' + (isTopScore ? ' winner' : '');
    
    const shapeSym = G.gameMode === 'fixed' ? SHAPES[p.shape].sym : '◈';
    row.innerHTML = `
      <span class="go-row-name">
        ${idx === 0 && !isTie ? '👑 ' : ''}${shapeSym} ${p.name}${p.isAI ? ' 🤖' : ''}
      </span>
      <span class="go-row-pts">${p.score} pts</span>`;
    
    results.appendChild(row);
  });

  document.getElementById('gameover-overlay').classList.add('visible');
}

function restartGame() {
  document.getElementById('gameover-overlay').classList.remove('visible');
  showScreen('home');
}