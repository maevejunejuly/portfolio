"use client";

import { useCallback, useEffect, useRef } from "react";

const GEM =
  "M 35.17 11.56 Q 44 5 52.86 11.52 L 88.14 37.48 Q 97 44 92.31 53.95 L 76.69 87.05 Q 72 97 61.35 94.23 L 32.65 86.77 Q 22 84 18.46 73.59 L 8.54 44.41 Q 5 34 13.83 27.44 Z";
const HOOK = "M60 22 A38 38 0 1 0 96 47 A17 17 0 0 1 66 63";

export const GEM_COLORS = ["#d9503a", "#3d5a99", "#4f8a5b"];

export default function GemLogo({
  size = 34,
  active,
  color,
  restFill = "#ffffff",
  restIcon = "#1b1915",
}: {
  size?: number;
  active: boolean;
  color: string;
  restFill?: string;
  restIcon?: string;
}) {
  const wrap = useRef<HTMLSpanElement>(null);
  const raf = useRef<number | null>(null);
  const start = useRef(0);
  const lastRot = useRef(0);

  const loop = useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    const t = (performance.now() - start.current) / 1000;
    const dx = 4 * Math.sin(t * 1.3) + 3 * Math.sin(t * 2.7 + 1);
    const dy = 4 * Math.cos(t * 1.1) + 3 * Math.sin(t * 2.3 + 2);
    lastRot.current = t * 95;
    el.style.transition = "none";
    el.style.transform = `translate(${dx}px, ${dy}px) rotate(${lastRot.current}deg)`;
    raf.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (active) {
      start.current = performance.now();
      raf.current = requestAnimationFrame(loop);
    } else if (raf.current !== null) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
      el.style.transition = "transform 0.6s ease";
      el.style.transform = `rotate(${lastRot.current % 360}deg)`;
    }
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [active, loop]);

  return (
    <span ref={wrap} className="inline-block shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
        <path
          d={GEM}
          fill={active ? color : restFill}
          style={{ transition: active ? "none" : "fill 0.4s ease" }}
        />
        <g transform="translate(21 21) scale(0.4833)">
          <path
            d={HOOK}
            fill="none"
            stroke={active ? "#ffffff" : restIcon}
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: active ? "none" : "stroke 0.4s ease" }}
          />
        </g>
      </svg>
    </span>
  );
}
