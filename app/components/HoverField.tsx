"use client";

import { useEffect, useRef, type ReactNode } from "react";

const RADIUS = 700;
const PUSH = 16;

export default function HoverField({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const TRANSITION = "transform 700ms cubic-bezier(.2,.7,.3,1)";
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-push]"));
    let boxes: { x: number; y: number; width: number; height: number }[] = [];
    let source = -1;

    const measure = () => {
      items.forEach((item) => {
        item.style.transition = "none";
        item.style.transform = "";
      });
      boxes = items.map((item) => {
        const r = item.getBoundingClientRect();
        return {
          x: r.x + window.scrollX,
          y: r.y + window.scrollY,
          width: r.width,
          height: r.height,
        };
      });
      items.forEach((item) => (item.style.transition = TRANSITION));
      source = -1;
    };

    const apply = (next: number) => {
      if (next === source) return;
      source = next;
      const from = boxes[source];

      items.forEach((item, i) => {
        if (!from || i === source) {
          item.style.transform = "translate3d(0, 0, 0)";
          return;
        }
        const dx = boxes[i].x + boxes[i].width / 2 - (from.x + from.width / 2);
        const dy = boxes[i].y + boxes[i].height / 2 - (from.y + from.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const m =
          ((PUSH * (Number(item.dataset.push) || 1)) / (1 + (d / RADIUS) ** 2)) / d;
        item.style.transform = `translate3d(${(dx * m).toFixed(2)}px, ${(dy * m).toFixed(2)}px, 0)`;
      });
    };

    const move = (e: PointerEvent) => {
      const x = e.pageX;
      const y = e.pageY;
      apply(
        boxes.findIndex(
          (b) => x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height,
        ),
      );
    };

    measure();

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", measure);
      items.forEach((item) => {
        item.style.transform = "";
        item.style.transition = "";
      });
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
