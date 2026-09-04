"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import useHover from "./useHover";

const MAX = 2.6;
const SPREAD = 0.9;
const VERTICAL = 0.18;
const SPEED = 0.22;

export default function Smear({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const id = `smear-${useId().replace(/:/g, "")}`;
  const { on, props } = useHover();
  const blur = useRef<SVGFEGaussianBlurElement>(null);
  const bleed = useRef<SVGFEMorphologyElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (on) setActive(true);

    let raf = 0;
    let value = on ? 0 : MAX;
    const target = on ? MAX : 0;

    const loop = () => {
      value += (target - value) * SPEED;
      const spread = (value / MAX) * SPREAD;
      blur.current?.setAttribute(
        "stdDeviation",
        `${value.toFixed(3)} ${(value * VERTICAL).toFixed(3)}`,
      );
      bleed.current?.setAttribute(
        "radius",
        `${spread.toFixed(3)} ${(spread * VERTICAL).toFixed(3)}`,
      );
      if (Math.abs(target - value) > 0.02) raf = requestAnimationFrame(loop);
      else if (!on) setActive(false);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  return (
    <>
      <svg width="0" height="0" aria-hidden className="absolute">
        <filter id={id} x="-60%" y="-20%" width="220%" height="140%">
          <feMorphology
            ref={bleed}
            in="SourceGraphic"
            operator="dilate"
            radius="0 0"
            result="d"
          />
          <feGaussianBlur ref={blur} in="d" stdDeviation="0 0" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -6"
          />
        </filter>
      </svg>
      <Link
        href={href}
        {...props}
        className="inline-block"
        style={active ? { filter: `url(#${id})` } : undefined}
      >
        {children}
      </Link>
    </>
  );
}
