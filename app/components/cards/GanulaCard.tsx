"use client";

import { useState } from "react";
import Link from "next/link";
import GemLogo, { GEM_COLORS } from "../GemLogo";
import DefinitionPopup, { type Definition } from "../DefinitionPopup";
import AsciiArt from "../AsciiArt";
import { GANULA_ASCII } from "../../lib/ganula-ascii";

const GANULA: Definition = {
  headword: "గనుల",
  roman: "ganula",
  pos: "Telugu · noun",
  senses: [
    "of mines; to mine — oblique plural of గని (gani), “a mine”",
    "a sentence-mining workshop for Telugu learners",
  ],
  source: "ganula.app",
};

let colorIdx = 0;

export default function GanulaCard() {
  const [hover, setHover] = useState(false);
  const [color, setColor] = useState(GEM_COLORS[0]);

  const onEnter = () => {
    setColor(GEM_COLORS[colorIdx++ % GEM_COLORS.length]);
    setHover(true);
  };

  return (
    <Link
      href="/catalog?tag=ganula"
      aria-label="Ganula — a Telugu sentence-mining workshop"
      className="group relative block overflow-hidden rounded-[3px] bg-[#14120f] outline-none"
      onMouseEnter={onEnter}
      onMouseLeave={() => setHover(false)}
      onFocus={onEnter}
      onBlur={() => setHover(false)}
    >
      <div className="relative aspect-[4/3] w-full">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <AsciiArt
            source={GANULA_ASCII}
            alt="A Telugu wedding photograph rendered as coloured ASCII art"
            className="absolute inset-0 transition-[filter,opacity] duration-500 ease-smooth"
          />
          <div
            className="absolute inset-0 bg-[#14120f] transition-opacity duration-500"
            style={{ opacity: hover ? 0 : 0.1 }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: hover ? 1 : 0,
              background:
                "linear-gradient(105deg, transparent 35%, rgba(255,240,200,.16) 50%, transparent 65%)",
              backgroundSize: "260% 100%",
              animation: hover ? "ganula-sweep 2.6s linear infinite" : "none",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" />
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-5 transition-transform duration-500 ease-smooth"
          style={{ transform: hover ? "translateY(-14%)" : "translateY(0)" }}
        >
          <div className="flex items-center gap-[9px]">
            <GemLogo size={40} active={hover} color={color} />
            <span className="relative block">
              <span
                className="block font-bricolage text-[30px] font-bold leading-none tracking-[-0.01em] transition-[opacity,color] duration-200"
                style={{ opacity: hover ? 0 : 1, color: "#fffdf6" }}
              >
                Ganula
              </span>
              <span
                lang="te"
                aria-hidden
                className="absolute left-0 top-0 block whitespace-nowrap font-telugu text-[30px] font-bold leading-none transition-[opacity,color] duration-200"
                style={{ opacity: hover ? 1 : 0, color }}
              >
                గనుల
              </span>
            </span>
          </div>

          <div className="mt-5">
            <DefinitionPopup def={GANULA} open={hover} />
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-3 border-t border-white/10 px-4 py-3 font-label text-label uppercase text-[#efe9dc]">
        <span className="font-bold">Ganula</span>
        <span className="opacity-55">2026 — now</span>
      </div>
    </Link>
  );
}
