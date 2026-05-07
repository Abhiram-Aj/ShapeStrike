// ===================== GAME CONSTANTS =====================

const SHAPES = {
  circle:   { sym:'●', label:'Circle'   },
  square:   { sym:'■', label:'Square'   },
  triangle: { sym:'▲', label:'Triangle' },
  star:     { sym:'★', label:'Star'     },
};

const SHAPES_3P = ['circle', 'square', 'triangle'];
const SHAPES_4P = ['circle', 'square', 'triangle', 'star'];

const GRID_SIZES = [10, 15, 20, 25, 30];

const GRID_DESCS = {
  10: 'Quick game · 100 cells · Fast & fierce',
  15: 'Short match · 225 cells · Warm-up mode',
  20: 'Standard · 400 cells · Balanced strategy',
  25: 'Extended · 625 cells · Deep tactics',
  30: 'Marathon · 900 cells · Ultimate challenge',
};

const CELL_SIZE_MAP = { 10: 48, 15: 36, 20: 28, 25: 23, 30: 20 };

const AI_THINKING_DELAY = { min: 1000, max: 1500 };
const SCORE_MULTIPLIER = 10;  // Weight for scoring moves in AI evaluation
const BLOCK_WEIGHT = 1;       // Weight for blocking opponent threats