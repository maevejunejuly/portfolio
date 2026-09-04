"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import useHover from "./useHover";

const SRC = "/media/maeve-handwritten.png";
const RATIO = 480 / 139;
const HEIGHT = .85;

export default function Handwritten({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const { on, props } = useHover();
  const img = useRef<HTMLImageElement>(null);
  const run = useRef(0);

  useEffect(() => {
    if (on && img.current) img.current.src = `${SRC}#${run.current++}`;
  }, [on]);

  return (
    <Link href={href} {...props} className="relative inline-block align-baseline">
      <span
        className="block transition-opacity"
        style={{ opacity: on ? 0 : 1 }}
      >
        {children}
      </span>
      <img
        ref={img}
        src={SRC}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 max-w-none -translate-y-1/2 transition-opacity"
        style={{
          height: `${HEIGHT}em`,
          width: `${HEIGHT * RATIO}em`,
          opacity: on ? 1 : 0,
        }}
      />
    </Link>
  );
}
