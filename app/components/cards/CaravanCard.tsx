"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const FACETS = ["18-25", "Black", "Woman", "Solo", "LGBTQ+", "Budget"];

const SCREENS = [
  { src: "/media/caravan-home.png", label: "Home" },
  { src: "/media/caravan-search.png", label: "Search results" },
  { src: "/media/caravan-destination.png", label: "Destination portfolio" },
  { src: "/media/caravan-log.png", label: "Travel log" },
];

function Globe({ spinning }: { spinning: boolean }) {
  return (
    <span
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-caravan-pink"
      aria-hidden
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
        style={{
          animation: spinning ? "caravan-spin 3.6s linear infinite" : "none",
        }}
      >
        <circle cx="16" cy="16" r="14" fill="#69b3e7" />
        <path
          d="M4 12 Q10 9 15 12 T27 11 M3 20 Q9 17 14 20 T29 19"
          stroke="#f4efe0"
          strokeWidth="1.2"
          fill="none"
          opacity="0.65"
        />
        <path
          d="M9 6 Q13 11 10 16 Q7 21 12 26 M22 4 Q19 10 24 14 Q28 17 24 24"
          fill="#4f8a3a"
          stroke="#4f8a3a"
          strokeWidth="3.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="14" fill="none" stroke="#1d2b1a" strokeWidth="1.4" />
      </svg>
    </span>
  );
}

export default function CaravanCard() {
  const [open, setOpen] = useState(false);
  const [frame, setFrame] = useState(0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!open) {
      setFrame(0);
      setShown(0);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(FACETS.length);
      return;
    }
    const facets = setInterval(
      () => setShown((n) => (n >= FACETS.length ? n : n + 1)),
      170,
    );
    const screens = setInterval(() => setFrame((f) => (f + 1) % SCREENS.length), 1600);
    return () => {
      clearInterval(facets);
      clearInterval(screens);
    };
  }, [open]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        href="/catalog?tag=caravan"
        className="flex items-center gap-3 rounded-[3px] border-2 border-fg bg-bg px-3 py-2.5 outline-none transition-transform duration-300 ease-smooth hover:-translate-y-0.5"
      >
        <Globe spinning={open} />
        <span className="font-bricolage text-[22px] font-bold tracking-[-0.02em]">Caravan</span>
        <span className="ml-auto font-label text-label uppercase opacity-45">2025 — now</span>
      </Link>

      <div
        className="absolute left-0 right-0 top-full z-30 origin-top pt-2 transition-all duration-300 ease-smooth"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scaleY(1)" : "translateY(-8px) scaleY(0.94)",
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
      >
        <div className="overflow-hidden rounded-[3px] border-2 border-fg bg-caravan-cream shadow-[6px_6px_0_rgba(20,19,15,0.16)]">
          <div className="flex items-center gap-1.5 border-b-2 border-fg bg-caravan-olive px-2.5 py-1.5">
            <span className="h-2 w-2 rounded-full bg-caravan-cream/80" />
            <span className="h-2 w-2 rounded-full bg-caravan-cream/55" />
            <span className="h-2 w-2 rounded-full bg-caravan-cream/40" />
            <span className="ml-2 truncate font-mono text-[10px] text-caravan-cream/90">
              caravan / {SCREENS[frame].label}
            </span>
          </div>

          <div className="relative aspect-[16/10] w-full overflow-hidden bg-caravan-cream">
            {SCREENS.map((s, i) => (
              <Image
                key={s.src}
                src={s.src}
                alt={`Caravan — ${s.label}`}
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover object-top transition-opacity duration-300"
                style={{ opacity: i === frame ? 1 : 0 }}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t-2 border-fg px-2.5 py-2">
            <span className="mr-1 font-label text-label uppercase text-caravan-rust opacity-70">
              Your filters:
            </span>
            {FACETS.map((f, i) => (
              <span
                key={f}
                className="rounded-full bg-caravan-orange px-2 py-0.5 font-label text-label text-white transition-all duration-300"
                style={{
                  opacity: i < shown ? 1 : 0,
                  transform: i < shown ? "translateY(0) scale(1)" : "translateY(4px) scale(0.85)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
