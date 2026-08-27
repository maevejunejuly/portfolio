"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type Plank = { label: string; href: string; width: number; lean: number };

export const PLANKS: Plank[] = [
  { label: "ABOUT", href: "/about", width: 152, lean: -0.13 },
  { label: "ENGINEERING", href: "/catalog?tag=engineering", width: 244, lean: 0.1 },
  { label: "CREATIVE", href: "/catalog?tag=creative", width: 186, lean: -0.07 },
];

const LINKS = [58, 54, 54];
const PLANK_H = 38;
const ROPE_X = 58;
const GRAVITY = 42;
const DAMPING = 1.55;
const COUPLING = 26;
const DROP_K = 150;
const DROP_C = 13;

type Link = { theta: number; omega: number };

export default function RopeSign({ open, cursorVX }: { open: boolean; cursorVX: number }) {
  const router = useRouter();
  const [, force] = useState(0);

  const links = useRef<Link[]>(PLANKS.map(() => ({ theta: 0, omega: 0 })));
  const drop = useRef({ value: 0, vel: 0 });
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!open || reduced.current) return;
    links.current[0].omega += Math.max(-9, Math.min(9, cursorVX * 0.05));
  }, [cursorVX, open]);

  useEffect(() => {
    if (reduced.current) {
      drop.current.value = open ? 1 : 0;
      links.current.forEach((l) => {
        l.theta = 0;
        l.omega = 0;
      });
      force((n) => n + 1);
      return;
    }

    if (open && drop.current.value < 0.02) links.current[0].omega = 1.1;

    const tick = (t: number) => {
      const dt = Math.min(0.032, (t - last.current) / 1000 || 0.016);
      last.current = t;

      const d = drop.current;
      const target = open ? 1 : 0;
      d.vel += (DROP_K * (target - d.value) - DROP_C * d.vel) * dt;
      d.value += d.vel * dt;

      const ls = links.current;
      for (let i = 0; i < ls.length; i++) {
        const parent = i === 0 ? 0 : ls[i - 1].theta;
        const accel =
          -GRAVITY * Math.sin(ls[i].theta) -
          DAMPING * ls[i].omega +
          COUPLING * (parent - ls[i].theta);
        ls[i].omega += accel * dt;
        ls[i].theta += ls[i].omega * dt;
      }

      force((n) => n + 1);

      const settled =
        Math.abs(target - d.value) < 0.001 &&
        Math.abs(d.vel) < 0.001 &&
        ls.every((l) => Math.abs(l.theta) < 0.0006 && Math.abs(l.omega) < 0.0006);

      if (settled) {
        d.value = target;
        d.vel = 0;
        ls.forEach((l) => {
          l.theta = 0;
          l.omega = 0;
        });
        force((n) => n + 1);
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
  }, [open]);

  const d = drop.current.value;
  let x = 0;
  let y = 0;
  const rungs = PLANKS.map((p, i) => {
    const theta = links.current[i].theta;
    const len = LINKS[i] * d;
    const sin = Math.sin(theta);
    const cos = Math.cos(theta);
    const topX = x;
    const topY = y;
    x += len * sin;
    y += len * cos;
    const cx = x;
    const cy = y;
    x += (PLANK_H / 2) * sin;
    y += (PLANK_H / 2) * cos;
    return { ...p, theta: theta + p.lean * d, cx, cy, topX, topY, sin, cos };
  });

  const rope = (side: -1 | 1) => {
    const pts: string[] = [`${side * ROPE_X},0`];
    for (const r of rungs) {
      pts.push(`${r.cx + side * ROPE_X * r.cos},${r.cy - side * ROPE_X * r.sin}`);
    }
    return pts.join(" ");
  };

  const visible = d > 0.005;

  return (
    <svg
      viewBox="-170 -6 340 230"
      width="340"
      height="230"
      className="pointer-events-none absolute left-1/2 top-full z-40 -translate-x-1/2 overflow-visible"
      aria-hidden={!open}
      style={{ opacity: visible ? 1 : 0 }}
    >
      {visible && (
        <>
          <polyline
            points={rope(-1)}
            fill="none"
            stroke="var(--fg)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <polyline
            points={rope(1)}
            fill="none"
            stroke="var(--fg)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          {rungs.map((r) => (
            <g
              key={r.label}
              transform={`translate(${r.cx} ${r.cy}) rotate(${(r.theta * 180) / Math.PI})`}
              className="pointer-events-auto"
            >
              <a
                href={r.href}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(r.href);
                }}
                tabIndex={open ? 0 : -1}
                className="group cursor-pointer outline-none"
              >
                <rect
                  x={-r.width / 2}
                  y={0}
                  width={r.width}
                  height={PLANK_H}
                  rx={2}
                  fill="var(--bg)"
                  stroke="var(--fg)"
                  strokeWidth={2}
                  className="transition-colors duration-150 group-hover:fill-[var(--fg)] group-focus-visible:fill-[var(--fg)]"
                />
                <text
                  x={0}
                  y={PLANK_H / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[var(--fg)] font-hand text-[17px] tracking-[0.06em] transition-colors duration-150 group-hover:fill-[var(--bg)] group-focus-visible:fill-[var(--bg)]"
                >
                  {r.label}
                </text>
              </a>
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
