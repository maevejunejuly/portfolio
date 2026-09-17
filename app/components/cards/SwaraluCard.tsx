"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GemLogo from "../GemLogo";
import DefinitionPopup, { type Definition } from "../DefinitionPopup";
import AsciiArt from "../AsciiArt";
import { SWARALU_ASCII } from "../../lib/swaralu-ascii";

const SWARALU: Definition = {
  headword: "స్వరాలు",
  roman: "swaralu",
  pos: "noun",
  senses: [
    "notes, tones; vowels — plural of స్వరం (swaram), “a note”",
    "a Telugu immersion learning software",
  ],
};

export default function SwaraluCard() {
  const [hover, setHover] = useState(false);

  const onEnter = () => setHover(true);

  return (
    <Link
      href="/catalog/swaralu"
      aria-label="Swaralu — a Telugu sentence-mining workshop"
      className="group relative block overflow-hidden rounded-card bg-[#14120f] outline-none"
      onMouseEnter={onEnter}
      onMouseLeave={() => setHover(false)}
      onFocus={onEnter}
      onBlur={() => setHover(false)}
    >
      <div className="relative aspect-[4/3] w-full">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src="/media/swaralu-background.jpg"
            alt=""
            fill
            sizes="(max-width:1024px) 100vw, 400px"
            className="object-cover opacity-[.45]"
          />
          <AsciiArt
            source={SWARALU_ASCII}
            alt="The opening of Nannaya's Ādi Parvam set over a photograph"
            className="absolute inset-0 brightness-[.85] transition-[filter,opacity] duration-500 ease-smooth"
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
              animation: hover ? "swaralu-sweep 2.6s linear infinite" : "none",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-5">
          <div className="flex items-center gap-[12px]">
            <GemLogo size={48} active={false} />
            <span className="relative block">
              <span
                className="block font-bricolage text-[36px] font-bold leading-none tracking-[-0.01em] text-swaralu-paper transition-opacity duration-200"
                style={{ opacity: hover ? 0 : 1 }}
              >
                Swaralu
              </span>
              <span
                lang="te"
                aria-hidden
                className="absolute left-0 top-0 block whitespace-nowrap font-telugu text-[36px] font-bold leading-none text-swaralu-paper transition-opacity duration-200"
                style={{ opacity: hover ? 1 : 0 }}
              >
                స్వరాలు
              </span>
            </span>
          </div>

          <div
            className="grid transition-[grid-template-rows] duration-500 ease-smooth"
            style={{ gridTemplateRows: hover ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div className="pr-1.5">
                <DefinitionPopup def={SWARALU} open={hover} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
