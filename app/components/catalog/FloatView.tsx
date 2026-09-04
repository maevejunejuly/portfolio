"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";
import ImageSlot from "../ImageSlot";
import ProjectLink from "./ProjectLink";
import type { Project } from "../../lib/projects";

type Rect = { x: number; y: number; w: number; h: number };
type Placed = Rect & { p: Project };

const SIZES: Record<Project["aspect"], { w: number; h: number }> = {
  square: { w: 180, h: 180 },
  portrait: { w: 150, h: 210 },
  landscape: { w: 220, h: 150 },
  video: { w: 230, h: 130 },
};

const LABEL_W = 220;
const LABEL_CPL = 31;
const LABEL_LINE = 23;
const LABEL_HEAD = 36;
const LABEL_GAP = 14;
const STEP = 20;
const GAP = 18;
const TRIES = 400;
const HOLE = { w: 420, h: 120 };
const FILL = 0.3;
const MIN_SCALE = 0.3;
const ZOOM = [0.4, 2.5] as const;

const hits = (a: Rect, b: Rect, pad = 0) =>
  a.x < b.x + b.w + pad &&
  a.x + a.w + pad > b.x &&
  a.y < b.y + b.h + pad &&
  a.y + a.h + pad > b.y;

const overlap = (a: Rect, b: Rect) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

const labelH = (p: Project) =>
  LABEL_HEAD + Math.ceil(p.blurb.length / LABEL_CPL) * LABEL_LINE;

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function bestSpot(target: Rect, size: { w: number; h: number }, blockers: Rect[], area: Rect) {
  const cx = target.x + target.w / 2;
  const cy = target.y + target.h / 2;
  const spots: Rect[] = [];
  for (let y = area.y; y + size.h <= area.y + area.h; y += STEP)
    for (let x = area.x; x + size.w <= area.x + area.w; x += STEP)
      spots.push({ x, y, w: size.w, h: size.h });
  if (!spots.length) return { x: cx, y: cy, ...size };

  const near = (r: Rect) => (r.x + size.w / 2 - cx) ** 2 + (r.y + size.h / 2 - cy) ** 2;
  spots.sort((a, b) => near(a) - near(b));

  let best = spots[0];
  let bestCost = Infinity;
  for (const s of spots) {
    const padded = {
      x: s.x - LABEL_GAP,
      y: s.y - LABEL_GAP,
      w: s.w + LABEL_GAP * 2,
      h: s.h + LABEL_GAP * 2,
    };
    let cost = 0;
    for (const b of blockers) cost += overlap(padded, b);
    if (cost < bestCost) {
      bestCost = cost;
      best = s;
    }
    if (cost === 0) break;
  }
  return best;
}

function layout(projects: Project[], stage: Rect): Placed[] {
  const hole: Rect = {
    x: stage.x + (stage.w - HOLE.w) / 2,
    y: stage.y + (stage.h - HOLE.h) / 2,
    w: HOLE.w,
    h: HOLE.h,
  };
  const tileArea = projects.reduce((n, p) => n + SIZES[p.aspect].w * SIZES[p.aspect].h, 0);
  const fit = Math.sqrt((stage.w * stage.h * FILL) / Math.max(1, tileArea));

  for (let attempt = 0; attempt < 7; attempt++) {
    const s = Math.max(MIN_SCALE, Math.min(1, fit * 0.9 ** attempt));
    const rand = rng(projects.map((p) => p.slug).join(","));
    const placed: Placed[] = [];
    let failed = false;

    for (const p of projects) {
      const w = SIZES[p.aspect].w * s;
      const h = SIZES[p.aspect].h * s;
      let spot: Rect | null = null;
      for (let i = 0; i < TRIES; i++) {
        const rect = {
          x: stage.x + rand() * Math.max(0, stage.w - w),
          y: stage.y + rand() * Math.max(0, stage.h - h),
          w,
          h,
        };
        if (hits(rect, hole, GAP * s)) continue;
        if (placed.some((q) => hits(rect, q, GAP * s))) continue;
        spot = rect;
        break;
      }
      if (!spot) {
        failed = true;
        break;
      }
      placed.push({ ...spot, p });
    }

    if (!failed) return placed;
  }

  // ponytail: last resort — everything at min scale on a loose spiral, may overflow
  // the stage and rely on panning. Bump FILL or shrink SIZES if this fires often.
  const rand = rng(projects.map((p) => p.slug).join(","));
  return projects.map((p) => {
    const w = SIZES[p.aspect].w * MIN_SCALE;
    const h = SIZES[p.aspect].h * MIN_SCALE;
    return {
      p,
      w,
      h,
      x: stage.x + rand() * Math.max(0, stage.w - w),
      y: stage.y + rand() * Math.max(0, stage.h - h),
    };
  });
}

export default function FloatView({ projects }: { projects: Project[] }) {
  const shell = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLParagraphElement>(null);
  const dragged = useRef(false);
  const [stage, setStage] = useState<Rect | null>(null);
  const [label, setLabel] = useState<(Rect & { p: Project }) | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let top = 0;
      let bottom = vh;
      let left = 0;
      const right = vw;
      for (const n of document.querySelectorAll("[data-chrome]")) {
        const r = n.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.width < vw * 0.4 && r.height > vh * 0.3) left = Math.max(left, r.right);
        else if (r.top < vh / 2) top = Math.max(top, r.bottom);
        else bottom = Math.min(bottom, r.top);
      }
      // Chrome that would eat the viewport (the filter list stacks full-height on
      // mobile) gets capped so the stage never collapses; tiles float under it.
      left = Math.min(left, vw * 0.35);
      top = Math.min(top, vh * 0.25);
      bottom = Math.max(bottom, vh * 0.78);

      const pad = 16;
      setStage({
        x: left + pad,
        y: top + pad,
        w: Math.max(240, right - left - pad * 2),
        h: Math.max(240, bottom - top - pad * 2),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const placed = useMemo(
    () => (stage ? layout(projects, stage) : []),
    [projects, stage],
  );

  const showLabel = useCallback((p: Project) => {
    const shellEl = shell.current;
    const tile = canvas.current?.querySelector(`[data-slug="${p.slug}"]`);
    if (!shellEl || !tile) return;

    const toRect = (r: DOMRect): Rect => ({ x: r.x, y: r.y, w: r.width, h: r.height });
    const blockers: Rect[] = [];
    for (const n of canvas.current!.querySelectorAll("[data-slug]"))
      blockers.push(toRect(n.getBoundingClientRect()));
    for (const n of document.querySelectorAll("[data-chrome]"))
      blockers.push(toRect(n.getBoundingClientRect()));
    if (title.current) blockers.push(toRect(title.current.getBoundingClientRect()));

    const area: Rect = { x: 8, y: 8, w: window.innerWidth - 16, h: window.innerHeight - 16 };
    const spot = bestSpot(
      toRect(tile.getBoundingClientRect()),
      { w: LABEL_W, h: labelH(p) },
      blockers,
      area,
    );
    setLabel({ ...spot, p });
  }, []);

  useEffect(() => {
    const el = shell.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setLabel(null);
      const from = scale.get();
      const to = Math.min(
        ZOOM[1],
        Math.max(ZOOM[0], from * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015))),
      );
      if (to === from) return;
      const k = to / from;
      const ox = window.innerWidth / 2;
      const oy = window.innerHeight / 2;
      x.set(x.get() * k + (e.clientX - ox) * (1 - k));
      y.set(y.get() * k + (e.clientY - oy) * (1 - k));
      scale.set(to);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [stage, scale, x, y]);

  if (!stage) return null;

  return (
    <div
      ref={shell}
      className="fixed inset-0 z-0 cursor-grab overflow-hidden active:cursor-grabbing"
    >
      <motion.div
        ref={canvas}
        drag
        dragMomentum={false}
        dragElastic={0.05}
        dragConstraints={{
          left: -window.innerWidth / 2,
          right: window.innerWidth / 2,
          top: -window.innerHeight / 2,
          bottom: window.innerHeight / 2,
        }}
        style={{ x, y, scale }}
        className="absolute inset-0 touch-none"
      >
        <div className="absolute -inset-[150vmax]" />

        <p
          ref={title}
          className="pointer-events-none absolute w-[560px] -translate-x-1/2 -translate-y-1/2 text-center text-statement"
          style={{ left: stage.x + stage.w / 2, top: stage.y + stage.h / 2 }}
        >
          Projects
        </p>

        {placed.map(({ p, w, h, x: px, y: py }) => (
          <motion.div
            key={p.slug}
            data-slug={p.slug}
            drag
            dragMomentum={false}
            whileDrag={{ zIndex: 40 }}
            onDragStart={() => {
              dragged.current = true;
              setLabel(null);
            }}
            onDragEnd={() => showLabel(p)}
            onHoverStart={() => showLabel(p)}
            onHoverEnd={() => setLabel(null)}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: w,
              rotate: rng(`${p.slug}-rot`)() * 6 - 3,
            }}
            className="touch-none select-none hover:z-40"
          >
            <ProjectLink
              project={p}
              className="block cursor-grab active:cursor-grabbing"
              onFocus={() => showLabel(p)}
              onBlur={() => setLabel(null)}
              onClickCapture={(e: React.MouseEvent) => {
                if (dragged.current) e.preventDefault();
                dragged.current = false;
              }}
            >
              <div className="relative w-full" style={{ height: h }}>
                <ImageSlot
                  src={p.cover}
                  placeholder={p.title}
                  fit="contain"
                  className="pointer-events-none"
                />
              </div>
            </ProjectLink>
          </motion.div>
        ))}
      </motion.div>

      {label && (
        <div
          className="pointer-events-none fixed z-[45]"
          style={{ left: label.x, top: label.y, width: label.w }}
        >
          <p className="text-[18px] font-semibold leading-tight tracking-display">
            {label.p.title}
            {label.p.year && (
              <span className="ml-2 align-baseline text-label font-bold">{label.p.year}</span>
            )}
          </p>
          <p className="mt-1 text-dek opacity-75 [text-wrap:pretty]">{label.p.blurb}</p>
        </div>
      )}
    </div>
  );
}
