"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import ImageSlot from "../ImageSlot";
import type { Project } from "../../lib/projects";

const W = 1200;
const H = 1120;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

const SIZES: Record<NonNullable<Project["aspect"]>, { w: number; h: number }> = {
  square: { w: 230, h: 230 },
  portrait: { w: 200, h: 280 },
  landscape: { w: 290, h: 200 },
  video: { w: 300, h: 176 },
};

export default function BoardView({ projects }: { projects: Project[] }) {
  const [nonce, setNonce] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const placed = useMemo(() => {
    const cols = 4;
    return projects.map((p, i) => {
      const size = SIZES[p.aspect ?? "landscape"];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const jx = (hash(p.slug + "x") - 0.5) * 130;
      const jy = (hash(p.slug + "y") - 0.5) * 90;
      const rot = (hash(p.slug + "r") - 0.5) * 13;
      return {
        p,
        size,
        x: Math.max(8, Math.min(W - size.w - 8, 40 + col * ((W - 120) / cols) + jx)),
        y: Math.max(8, Math.min(H - size.h - 8, 30 + row * 275 + jy)),
        rot,
        z: Math.round(hash(p.slug + "z") * 10),
      };
    });
  }, [projects]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between font-label text-label uppercase">
        <span className="opacity-45">Drag anything. Nothing is where it should be.</span>
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="rounded-full border border-line px-3 py-1 uppercase transition-colors hover:border-fg"
        >
          Tidy
        </button>
      </div>

      <div
        ref={wrap}
        className="relative w-full overflow-hidden border border-line bg-surface/40"
        style={{ height: H * scale }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          {placed.map(({ p, size, x, y, rot, z }) => (
            <motion.div
              key={`${p.slug}-${nonce}`}
              drag
              dragMomentum
              dragElastic={0.12}
              whileDrag={{ scale: 1.04, zIndex: 50, cursor: "grabbing" }}
              style={{
                position: "absolute",
                left: x,
                top: y,
                rotate: rot,
                width: size.w,
                zIndex: z,
                cursor: "grab",
              }}
              className="touch-none select-none border-2 border-fg bg-bg p-2 shadow-[4px_4px_0_rgba(20,19,15,0.14)]"
            >
              <div className="relative w-full" style={{ height: size.h }}>
                <ImageSlot
                  src={p.src}
                  placeholder={p.title}
                  className="pointer-events-none h-full w-full"
                />
              </div>
              <div className="mt-1.5 font-label text-label uppercase leading-tight">
                <div className="truncate font-bold">{p.title}</div>
                <div className="truncate opacity-55">{p.date || "date TBC"}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
