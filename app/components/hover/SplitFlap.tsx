"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useHover from "./useHover";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@?/*";
const TICK = 35;
const SETTLE = 2;

export default function SplitFlap({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const { on, props } = useHover();
  const [glyphs, setGlyphs] = useState(children);

  useEffect(() => {
    if (!on) return setGlyphs(children);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tick = 0;
    const id = setInterval(() => {
      tick += 1;
      if (tick > children.length * SETTLE) return clearInterval(id);
      setGlyphs(
        [...children]
          .map((c, i) =>
            c === " " || tick >= (i + 1) * SETTLE
              ? c
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(""),
      );
    }, TICK);

    return () => clearInterval(id);
  }, [on, children]);

  return (
    <Link
      href={href}
      {...props}
      aria-label={children}
      className="relative inline-block align-baseline"
    >
      <span aria-hidden className="invisible whitespace-pre">
        {children}
      </span>
      <span aria-hidden className="absolute left-0 top-0 whitespace-pre">
        {glyphs}
      </span>
    </Link>
  );
}
