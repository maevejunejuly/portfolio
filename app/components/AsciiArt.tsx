"use client";

import { useCallback, useEffect, useRef } from "react";
import type { AsciiRun } from "../lib/ganula-ascii";

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

    ctx.font = `${ch}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    const advance = ctx.measureText("M").width || ch * 0.6;
    ctx.font = `${(ch * cw) / advance}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let y = 0; y < source.lines.length; y++) {
      let x = 0;
      for (const [key, chars] of source.lines[y]) {
        ctx.fillStyle = source.palette[key] ?? "#888";
        for (let i = 0; i < chars.length; i++) {
          const c = chars[i];
          if (c !== " ") ctx.fillText(c, (x + 0.5) * cw, (y + 0.5) * ch);
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
