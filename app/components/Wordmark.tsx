"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import RopeSign, { PLANKS } from "./RopeSign";

const W = 820;
const BASE_Y = 74;
const SAG = 46;
const SPRING_K = 190;
const SPRING_C = 14;

const flatPath = (sag: number) =>
  `M 34 ${BASE_Y} Q ${W / 2} ${BASE_Y + sag * 2} ${W - 34} ${BASE_Y}`;

export default function Wordmark() {
  const [open, setOpen] = useState(false);
  const [sag, setSag] = useState(0);
  const [cursorVX, setCursorVX] = useState(0);
  const [pinned, setPinned] = useState(false);

  const spring = useRef({ value: 0, vel: 0 });
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const lastX = useRef<number | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (max-width: 767px)");
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => mq.removeEventListener("change", sync);
  }, []);

  const active = open || pinned;

  useEffect(() => {
    if (reduced.current) {
      setSag(active ? SAG : 0);
      return;
    }
    const target = active ? SAG : 0;
    const tick = (t: number) => {
      const dt = Math.min(0.032, (t - last.current) / 1000 || 0.016);
      last.current = t;
      const s = spring.current;
      s.vel += (SPRING_K * (target - s.value) - SPRING_C * s.vel) * dt;
      s.value += s.vel * dt;
      setSag(s.value);
      if (Math.abs(target - s.value) < 0.05 && Math.abs(s.vel) < 0.05) {
        s.value = target;
        s.vel = 0;
        setSag(target);
        raf.current = null;
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    last.current = performance.now();
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [active]);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (lastX.current !== null) setCursorVX(e.clientX - lastX.current);
    lastX.current = e.clientX;
  }, []);

  if (pinned) {
    return (
      <header className="relative z-50 px-4 pt-4 sm:px-7">
        <Link href="/" aria-label="Maevejunejuly — home" className="mx-auto block max-w-[560px]">
          <svg
            viewBox={`0 0 ${W} ${BASE_Y + 42}`}
            className="w-full"
            role="img"
            aria-label="Maevejunejuly"
          >
            <text
              className="fill-[var(--fg)] font-hand"
              x={W / 2}
              y={BASE_Y}
              fontSize={72}
              textAnchor="middle"
            >
              MAEVEJUNEJULY
            </text>
          </svg>
        </Link>
        <nav className="mt-2 flex flex-wrap justify-center gap-2">
          {PLANKS.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="rounded-[2px] border-2 border-fg px-3 py-1.5 font-hand text-[15px] tracking-[0.06em]"
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </header>
    );
  }

  return (
    <header className="relative z-50 flex justify-center px-4 pt-4 sm:px-7">
      <div
        className="relative w-full max-w-[560px]"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => {
          setOpen(false);
          lastX.current = null;
        }}
        onMouseMove={onMove}
        onFocusCapture={() => setOpen(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
        }}
      >
        <Link
          href="/"
          aria-label="Maevejunejuly — home"
          className="block outline-none"
        >
          <svg
            viewBox={`0 0 ${W} ${BASE_Y + SAG + 42}`}
            className="w-full overflow-visible"
            role="img"
            aria-label="Maevejunejuly"
          >
            <defs>
              <path id="mjj-curve" d={flatPath(sag)} fill="none" />
            </defs>
            <text
              className="fill-[var(--fg)] font-hand"
              fontSize={72}
              letterSpacing="0.005em"
            >
              <textPath href="#mjj-curve" startOffset="50%" textAnchor="middle">
                MAEVEJUNEJULY
              </textPath>
            </text>
          </svg>
        </Link>
        <RopeSign open={active} cursorVX={cursorVX} />
      </div>
    </header>
  );
}
