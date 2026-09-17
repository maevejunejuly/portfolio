"use client";

import { useCallback, useEffect, useRef } from "react";
import type { AsciiRun } from "../lib/swaralu-ascii";

export type AsciiSource = {
  cols: number;
  rows: number;
  palette: Record<string, string>;
  lines: AsciiRun[][];
};

export default function AsciiArt({
  source,
  className = "",
  alt,
}: {
  source: AsciiSource;
  className?: string;
  alt: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  const paint = useCallback(() => {
    const el = canvas.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w === 0 || h === 0) return;

    el.width = Math.round(w * dpr);
    el.height = Math.round(h * dpr);
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;

    const ctx = el.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cw = w / source.cols;
    const ch = h / source.rows;

    const family =
      getComputedStyle(document.documentElement).getPropertyValue("--font-telugu") ||
      "sans-serif";
    ctx.font = `700 ${ch * 0.98}px ${family}, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = ch * 0.08;
    ctx.lineJoin = "round";

    for (let y = 0; y < source.lines.length; y++) {
      let x = 0;
      for (const [key, glyphs] of source.lines[y]) {
        ctx.fillStyle = ctx.strokeStyle = source.palette[key] ?? "#888";
        for (const g of glyphs) {
          if (g !== " ") {
            ctx.fillText(g, (x + 0.5) * cw, (y + 0.5) * ch, cw * 1.15);
            ctx.strokeText(g, (x + 0.5) * cw, (y + 0.5) * ch, cw * 1.15);
          }
          x++;
        }
      }
    }
  }, [source]);

  useEffect(() => {
    paint();
    const parent = canvas.current?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(paint);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [paint]);

  return <canvas ref={canvas} role="img" aria-label={alt} className={className} />;
}
