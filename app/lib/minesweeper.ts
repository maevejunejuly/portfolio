export const CELL_MINE = 0x80;
export const CELL_REVEALED = 0x40;
export const CELL_FLAGGED = 0x20;
export const CELL_HITMINE = 0x10;
export const CELL_WRONGFLAG = 0x08;
export const CELL_NBRMASK = 0x0f;

export const EASY = 0;
export const HARD = 1;
export const EXPERT = 2;

export const UNTOUCHED = 0;
export const IN_PROGRESS = 1;
export const WIN = 2;
export const LOSE = 3;

const ROWS = [9, 16, 24];
const COLS = [9, 16, 20];
const MINES = [10, 40, 99];

export type Game = {
  grid: Uint8Array;
  mode: number;
  rows: number;
  cols: number;
  mines: number;
  state: number;
  curRow: number;
  curCol: number;
  flagCount: number;
  revealCount: number;
  firstClick: boolean;
  rand: () => number;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const idx = (g: Game, r: number, c: number) => r * g.cols + c;

const inBounds = (g: Game, r: number, c: number) =>
  r >= 0 && r < g.rows && c >= 0 && c < g.cols;

export function gameInit(mode: number, seed: number): Game {
  const rows = ROWS[mode];
  const cols = COLS[mode];
  const mines = MINES[mode];
  return {
    grid: new Uint8Array(rows * cols),
    mode,
    rows,
    cols,
    mines,
    state: UNTOUCHED,
    curRow: Math.floor(rows / 2),
    curCol: Math.floor(cols / 2),
    flagCount: mines,
    revealCount: 0,
    firstClick: true,
    rand: mulberry32(seed),
  };
}

function nbrMineCount(g: Game, r: number, c: number) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      if (inBounds(g, r + dr, c + dc) && g.grid[idx(g, r + dr, c + dc)] & CELL_MINE)
        count++;
    }
  return count;
}

function computeNeighbors(g: Game) {
  for (let r = 0; r < g.rows; r++)
    for (let c = 0; c < g.cols; c++) {
      const i = idx(g, r, c);
      if (!(g.grid[i] & CELL_MINE))
        g.grid[i] = (g.grid[i] & 0xf0) | (nbrMineCount(g, r, c) & 0x0f);
    }
}

function placeMines(g: Game, safeRow: number, safeCol: number) {
  const cands: number[] = [];
  for (let r = 0; r < g.rows; r++)
    for (let c = 0; c < g.cols; c++) {
      if (Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1) continue;
      cands.push(idx(g, r, c));
    }

  const placed = Math.min(g.mines, cands.length);
  for (let i = 0; i < placed; i++) {
    const j = i + Math.floor(g.rand() * (cands.length - i));
    const tmp = cands[i];
    cands[i] = cands[j];
    cands[j] = tmp;
    g.grid[cands[i]] |= CELL_MINE;
  }

  computeNeighbors(g);
}

function floodClear(g: Game, r: number, c: number) {
  const queue: number[] = [idx(g, r, c)];
  g.grid[idx(g, r, c)] |= CELL_REVEALED;
  g.revealCount++;

  for (let head = 0; head < queue.length; head++) {
    const cell = queue[head];
    if ((g.grid[cell] & CELL_NBRMASK) !== 0) continue;

    const cr = Math.floor(cell / g.cols);
    const cc = cell % g.cols;
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = cr + dr;
        const nc = cc + dc;
        if (!inBounds(g, nr, nc)) continue;
        const ni = idx(g, nr, nc);
        if (g.grid[ni] & (CELL_REVEALED | CELL_MINE | CELL_FLAGGED)) continue;
        g.grid[ni] |= CELL_REVEALED;
        g.revealCount++;
        queue.push(ni);
      }
  }
}

function checkWin(g: Game) {
  if (g.revealCount !== g.rows * g.cols - g.mines) return;
  g.state = WIN;
  g.flagCount = 0;
  for (let i = 0; i < g.grid.length; i++)
    if (g.grid[i] & CELL_MINE) g.grid[i] |= CELL_FLAGGED;
}

function revealAllMines(g: Game, hitRow: number, hitCol: number) {
  for (let r = 0; r < g.rows; r++)
    for (let c = 0; c < g.cols; c++) {
      const i = idx(g, r, c);
      if (g.grid[i] & CELL_MINE) {
        g.grid[i] |= CELL_REVEALED;
        if (r === hitRow && c === hitCol) g.grid[i] |= CELL_HITMINE;
      } else if (g.grid[i] & CELL_FLAGGED) {
        g.grid[i] |= CELL_WRONGFLAG;
      }
    }
}

export function gameReveal(g: Game, row: number, col: number) {
  if (g.state === WIN || g.state === LOSE) return;
  if (!inBounds(g, row, col)) return;

  const i = idx(g, row, col);
  if (g.grid[i] & CELL_REVEALED) return;
  if (g.grid[i] & CELL_FLAGGED) return;

  if (g.firstClick) {
    g.firstClick = false;
    placeMines(g, row, col);
    g.state = IN_PROGRESS;
  }

  if (g.grid[i] & CELL_MINE) {
    revealAllMines(g, row, col);
    g.state = LOSE;
    return;
  }

  floodClear(g, row, col);
  checkWin(g);
}

export function gameFlag(g: Game, row: number, col: number) {
  if (g.state === WIN || g.state === LOSE) return;
  if (!inBounds(g, row, col)) return;

  const i = idx(g, row, col);
  if (g.grid[i] & CELL_REVEALED) return;

  if (g.grid[i] & CELL_FLAGGED) {
    g.grid[i] &= ~CELL_FLAGGED;
    g.flagCount++;
  } else {
    g.grid[i] |= CELL_FLAGGED;
    g.flagCount--;
  }
}

export function cloneGame(g: Game, seed: number): Game {
  return { ...g, grid: new Uint8Array(g.grid), rand: mulberry32(seed) };
}

export type Step = { type: "reveal" | "flag"; r: number; c: number };

export function buildWinScript(mode: number, seed: number, openRow: number, openCol: number) {
  const g = gameInit(mode, seed);
  const steps: Step[] = [{ type: "reveal", r: openRow, c: openCol }];
  gameReveal(g, openRow, openCol);

  const isMine = (r: number, c: number) => !!(g.grid[r * g.cols + c] & CELL_MINE);
  const revealed = (r: number, c: number) => !!(g.grid[r * g.cols + c] & CELL_REVEALED);
  const flagged = new Set<number>();

  const flagReady = () => {
    for (let r = 0; r < g.rows; r++)
      for (let c = 0; c < g.cols; c++) {
        const i = r * g.cols + c;
        if (!isMine(r, c) || flagged.has(i)) continue;
        let allOpen = true;
        for (let dr = -1; dr <= 1 && allOpen; dr++)
          for (let dc = -1; dc <= 1 && allOpen; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nr >= g.rows || nc < 0 || nc >= g.cols) continue;
            if (!isMine(nr, nc) && !revealed(nr, nc)) allOpen = false;
          }
        if (allOpen) {
          flagged.add(i);
          steps.push({ type: "flag", r, c });
          gameFlag(g, r, c);
        }
      }
  };

  flagReady();

  let progress = true;
  while (g.state !== WIN && progress) {
    progress = false;
    for (let r = 0; r < g.rows && g.state !== WIN; r++)
      for (let c = 0; c < g.cols && g.state !== WIN; c++) {
        if (isMine(r, c) || revealed(r, c)) continue;
        let touchesOpen = false;
        for (let dr = -1; dr <= 1 && !touchesOpen; dr++)
          for (let dc = -1; dc <= 1 && !touchesOpen; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nr >= g.rows || nc < 0 || nc >= g.cols) continue;
            if (revealed(nr, nc)) touchesOpen = true;
          }
        if (!touchesOpen) continue;
        steps.push({ type: "reveal", r, c });
        gameReveal(g, r, c);
        flagReady();
        progress = true;
      }
  }

  for (let r = 0; r < g.rows; r++)
    for (let c = 0; c < g.cols; c++) {
      if (isMine(r, c) || revealed(r, c)) continue;
      steps.push({ type: "reveal", r, c });
      gameReveal(g, r, c);
      flagReady();
    }

  flagReady();
  return { steps, finalState: g.state };
}

export function applySteps(mode: number, seed: number, steps: Step[], count: number): Game {
  const g = gameInit(mode, seed);
  for (let i = 0; i < Math.min(count, steps.length); i++) {
    const s = steps[i];
    if (s.type === "reveal") gameReveal(g, s.r, s.c);
    else gameFlag(g, s.r, s.c);
  }
  return g;
}
