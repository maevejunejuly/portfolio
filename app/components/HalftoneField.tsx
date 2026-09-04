"use client";

import { useEffect, useRef } from "react";
import { HALFTONE, HALFTONE_COLS, HALFTONE_RAMP } from "../lib/halftone";

const GRID = HALFTONE.split("\n").slice(0, -20);
const ROWS = GRID.length;
const MIN_PITCH = 4;
const FADE = 10;
const FLOOR = .5;
const NOISE = 8;
const SKIP = 4;
const FEATHER = 120;
const RAGGED = 26;
const SOLID = 0.67;

type Rect = { x: number; y: number; w: number; h: number };

const noise = (c: number) => {
  let h = Math.imul(c ^ 0x9e3779b9, 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return ((h ^= h >>> 16) >>> 0) / 4294967296;
};

export default function HalftoneField({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const lastKey = useRef("");

  useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;

    const draw = () => {
      const width = box.clientWidth || window.innerWidth;
      const origin = el.getBoundingClientRect();
      const marks = [...box.querySelectorAll("[data-hole]")].map((n) => {
        const r = n.getBoundingClientRect();
        return { top: r.y - origin.y, bottom: r.bottom - origin.y };
      });
      const top = Math.min(...marks.map((m) => m.top));
      const bottom = Math.max(...marks.map((m) => m.bottom));
      const holes: Rect[] = marks.length
        ? [{ x: 0, y: top, w: width, h: bottom - top }]
        : [];

      const key = `${width}|${holes.map((h) => `${h.x | 0},${h.y | 0},${h.w | 0},${h.h | 0}`).join(";")}`;
      if (key === lastKey.current) return;
      lastKey.current = key;

      const pitch = Math.max(width / HALFTONE_COLS, MIN_PITCH);
      const first = (HALFTONE_COLS - width / pitch) / 2;
      const height = ROWS * pitch;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;

      const ctx = el.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(el).color;

      const max = HALFTONE_RAMP.length - 1;
      const from = Math.max(0, Math.floor(first));
      const to = Math.min(HALFTONE_COLS, Math.ceil(first + width / pitch));
      for (let r = 0; r < ROWS; r++) {
        const src = GRID[r];
        for (let c = from; c < to; c++) {
          const cover = HALFTONE_RAMP.indexOf(src[c]) / max;
          const n = noise(c);
          if (r < Math.round(n * SKIP)) continue;
          const t = Math.min(1, Math.max(0, (r + (n - 0.5) * 2 * NOISE) / FADE));
          const px = (c - first + 0.5) * pitch;
          const py = (r + 0.5) * pitch;

          let clear = 1;
          for (const h of holes) {
            const dx = Math.max(h.x - px, 0, px - (h.x + h.w));
            const dy = Math.max(h.y - py, 0, py - (h.y + h.h));
            const d = Math.hypot(dx, dy) + (noise(c * 131 + r) - 0.5) * RAGGED;
            clear = Math.min(clear, Math.min(1, Math.max(0, d / FEATHER)));
          }
          const ink = 1 - clear;
          if (cover <= 0 && ink < 0.02) continue;

          const base = Math.sqrt(cover) * (FLOOR + (1 - FLOOR) * t) * 0.5;
          const radius = pitch * (base + (SOLID - base) * ink);
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(box);
    const overlay = box.lastElementChild;
    if (overlay) ro.observe(overlay);
    for (const n of box.querySelectorAll("[data-hole]")) ro.observe(n);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} className="relative">
      <canvas
        ref={canvas}
        aria-hidden
        className={`pointer-events-none block w-full select-none text-fg ${className}`}
      />
      <div className="absolute inset-x-0 bottom-0">{children}</div>
    </div>
  );
}
