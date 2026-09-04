"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  applySteps,
  buildWinScript,
  CELL_FLAGGED,
  CELL_HITMINE,
  CELL_MINE,
  CELL_NBRMASK,
  CELL_REVEALED,
  CELL_WRONGFLAG,
  HARD,
  WIN,
  type Game,
  type Step,
} from "../../lib/minesweeper";
import { SPRITES, type SpriteName } from "../../lib/psoc-sprites";

const SEED = 1337;
const OPEN_R = 8;
const OPEN_C = 8;
const REST_STEP = 45;
const PLAY_MS = 500;

const TFT_W = 240;
const TFT_H = 320;
const HUD_H = 40;
const CELL = 15;
const GRID_Y = HUD_H + (TFT_H - HUD_H - CELL * 16) / 2;
const HUD_FLAG_X = 4;
const HUD_TIMER_X = 187;
const HUD_FACE_X = 108;
const HUD_FACE_Y = 8;
const HUDW = 13;
const HUDH = 23;
const FACEW = 24;
const INSET_W = HUDW * 3 + 10;
const INSET_H = HUDH + 8;
const INSET_Y = Math.floor(HUD_H / 2) - Math.floor(INSET_H / 2);
const DIGS_Y = Math.floor(HUD_H / 2) - Math.floor(HUDH / 2);

const COL_WIN95 = "#BDBEBD";
const COL_HUDHI = "#FFFFFF";
const COL_HUDSH = "#848284";
const COL_BLACK = "#000000";

const SCREEN = { x: 38, y: 68, w: 224, h: 299 };
const BOARD_W = 300;
const BOARD_H = 424;

const NBR: SpriteName[] = [
  "SPR_EMPTY",
  "SPR_N1",
  "SPR_N2",
  "SPR_N3",
  "SPR_N4",
  "SPR_N5",
  "SPR_N6",
  "SPR_N7",
  "SPR_N8",
];

function cellSprite(cell: number): SpriteName {
  if (cell & CELL_WRONGFLAG) return "SPR_WRONGFLAG";
  if (cell & CELL_REVEALED) {
    if (cell & CELL_MINE) return cell & CELL_HITMINE ? "SPR_MINEHIT" : "SPR_MINE";
    return NBR[cell & CELL_NBRMASK];
  }
  if (cell & CELL_FLAGGED) return "SPR_FLAG";
  return "SPR_UNREV";
}

const cache = new Map<SpriteName, HTMLImageElement>();

function useSprites() {
  const [ready, setReady] = useState(cache.size > 0);
  useEffect(() => {
    if (cache.size > 0) return;
    let live = true;
    const names = Object.keys(SPRITES) as SpriteName[];
    Promise.all(
      names.map(
        (n) =>
          new Promise<void>((res) => {
            const img = new Image();
            img.onload = () => {
              cache.set(n, img);
              res();
            };
            img.onerror = () => res();
            img.src = SPRITES[n].uri;
          }),
      ),
    ).then(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, []);
  return ready;
}

function blit(ctx: CanvasRenderingContext2D, name: SpriteName, x: number, y: number, size?: number) {
  const img = cache.get(name);
  if (!img) return;
  ctx.drawImage(img, x, y, size ?? img.width, size ?? img.height);
}

function hudNumber(ctx: CanvasRenderingContext2D, x: number, value: number) {
  const neg = value < 0;
  const v = Math.min(neg ? 99 : 999, Math.abs(value));
  const digits: SpriteName[] = neg
    ? ["HUD_MINUS", `HUD_${Math.floor(v / 10)}` as SpriteName, `HUD_${v % 10}` as SpriteName]
    : (String(v).padStart(3, "0").split("").map((d) => `HUD_${d}`) as SpriteName[]);

  ctx.fillStyle = COL_HUDSH;
  ctx.fillRect(x, INSET_Y, INSET_W, INSET_H);
  ctx.fillRect(x + 1, INSET_Y + 1, INSET_W - 2, INSET_H - 2);
  ctx.fillStyle = COL_BLACK;
  ctx.fillRect(x + 2, INSET_Y + 2, INSET_W - 4, INSET_H - 4);
  ctx.fillStyle = COL_HUDHI;
  ctx.fillRect(x + 2, INSET_Y + INSET_H - 4, INSET_W - 4, 2);
  ctx.fillRect(x + INSET_W - 4, INSET_Y + 2, 2, INSET_H - 4);
  digits.forEach((d, i) => blit(ctx, d, x + 4 + i * (HUDW + 2), DIGS_Y));
}

function paint(ctx: CanvasRenderingContext2D, game: Game, seconds: number, cursor?: Step) {
  const won = game.state === WIN;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = COL_WIN95;
  ctx.fillRect(0, 0, TFT_W, TFT_H);

  ctx.fillStyle = COL_HUDHI;
  ctx.fillRect(0, 0, TFT_W, 2);
  ctx.fillRect(0, 0, 2, HUD_H);
  ctx.fillStyle = COL_HUDSH;
  ctx.fillRect(0, HUD_H - 2, TFT_W, 2);
  ctx.fillRect(TFT_W - 2, 0, 2, HUD_H);

  hudNumber(ctx, HUD_FLAG_X, game.flagCount);
  hudNumber(ctx, HUD_TIMER_X, seconds);

  ctx.fillStyle = COL_HUDHI;
  ctx.fillRect(HUD_FACE_X - 2, INSET_Y, FACEW + 4, INSET_H);
  ctx.fillStyle = COL_HUDSH;
  ctx.fillRect(HUD_FACE_X - 2, INSET_Y + INSET_H - 2, FACEW + 4, 2);
  ctx.fillRect(HUD_FACE_X + FACEW, INSET_Y, 2, INSET_H);
  blit(ctx, won ? "FACE_WIN" : "FACE_NORM", HUD_FACE_X, HUD_FACE_Y);

  ctx.fillStyle = COL_HUDSH;
  ctx.fillRect(0, HUD_H, TFT_W, 3);
  ctx.fillRect(0, HUD_H, 3, TFT_H - HUD_H);
  ctx.fillStyle = COL_HUDHI;
  ctx.fillRect(0, TFT_H - 3, TFT_W, 3);
  ctx.fillRect(TFT_W - 3, HUD_H, 3, TFT_H - HUD_H);

  for (let r = 0; r < game.rows; r++)
    for (let c = 0; c < game.cols; c++)
      blit(ctx, cellSprite(game.grid[r * game.cols + c]), c * CELL, GRID_Y + r * CELL, CELL);

  if (cursor) blit(ctx, "SPR_CURSOR", cursor.c * CELL, GRID_Y + cursor.r * CELL, CELL);
}

export default function MinesweeperCard() {
  const script = useMemo(() => buildWinScript(HARD, SEED, OPEN_R, OPEN_C), []);
  const [step, setStep] = useState(REST_STEP);
  const [playing, setPlaying] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ready = useSprites();

  useEffect(() => {
    const total = script.steps.length;
    if (!playing) {
      setStep(REST_STEP);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(total);
      return;
    }
    const t0 = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const s = REST_STEP + ((now - t0) / PLAY_MS) * (total - REST_STEP);
      setStep(Math.min(total, Math.round(s)));
      if (s < total) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, script.steps.length]);

  const game = useMemo(() => applySteps(HARD, SEED, script.steps, step), [script.steps, step]);
  const won = game.state === WIN;
  const seconds = Math.round(4 + (step / script.steps.length) * 38);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || !ready) return;
    paint(ctx, game, seconds, script.steps[Math.min(step, script.steps.length) - 1]);
  }, [game, seconds, ready, script.steps, step]);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setPlaying(true)}
      onMouseLeave={() => setPlaying(false)}
      onFocus={() => setPlaying(true)}
      onBlur={() => setPlaying(false)}
      tabIndex={0}
      role="img"
      aria-label={`Minesweeper running on a PSoC 5LP development board. ${
        won ? "Board solved." : "Game in progress."
      }`}
    >
      <div className="card-box">
        <div className="relative overflow-hidden rounded-xl">
          <svg viewBox={`0 0 ${BOARD_W} ${BOARD_H}`} className="block w-full">
            <rect width={BOARD_W} height={BOARD_H} fill="#15181c" />
            <rect width={BOARD_W} height={BOARD_H} fill="none" stroke="#2c3238" strokeWidth={2} />
            {Array.from({ length: 20 }).map((_, i) => (
              <g key={i} opacity={0.85}>
                <rect x={7} y={34 + i * 18} width={13} height={9} rx={1} fill="#d8c46a" />
                <rect x={280} y={34 + i * 18} width={13} height={9} rx={1} fill="#d8c46a" />
              </g>
            ))}
            <text
              x={296}
              y={230}
              fill="#7d8894"
              fontSize={9}
              fontFamily="var(--font-mono), monospace"
              transform="rotate(90 296 230)"
            >
              PORT D
            </text>
            <text
              x={12}
              y={230}
              fill="#7d8894"
              fontSize={9}
              fontFamily="var(--font-mono), monospace"
              transform="rotate(-90 12 230)"
            >
              PORT E
            </text>

            <rect x={28} y={22} width={244} height={382} rx={5} fill="#b52626" />
            <circle cx={44} cy={38} r={7} fill="#15181c" />
            <circle cx={256} cy={38} r={7} fill="#15181c" />
            <circle cx={44} cy={390} r={7} fill="#15181c" />
            <circle cx={256} cy={390} r={7} fill="#15181c" />
            <rect x={35} y={59} width={230} height={317} rx={2} fill="#3b3f45" />

            <rect x={100} y={378} width={100} height={12} fill="#d89b3a" />
            <rect x={44} y={392} width={212} height={16} rx={2} fill="#15181c" />
            {Array.from({ length: 14 }).map((_, i) => (
              <rect key={i} x={52 + i * 15} y={396} width={8} height={8} rx={1} fill="#d8c46a" />
            ))}
          </svg>

          <canvas
            ref={canvas}
            width={TFT_W}
            height={TFT_H}
            aria-hidden
            className="absolute"
            style={{
              left: `${(SCREEN.x / BOARD_W) * 100}%`,
              top: `${(SCREEN.y / BOARD_H) * 100}%`,
              width: `${(SCREEN.w / BOARD_W) * 100}%`,
              height: `${(SCREEN.h / BOARD_H) * 100}%`,
              imageRendering: "pixelated",
            }}
          />
        </div>
      </div>
    </div>
  );
}
