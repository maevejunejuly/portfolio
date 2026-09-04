"use client";

import { useState } from "react";
import Link from "next/link";

function Globe({ spinning, className }: { spinning: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden
      style={{ animation: spinning ? "caravan-spin 3.6s linear infinite" : "none" }}
    >
      <defs>
        <clipPath id="caravan-orb">
          <circle cx="20" cy="20" r="19" />
        </clipPath>
      </defs>
      <circle cx="20" cy="20" r="19" className="fill-caravan-water" />
      <g clipPath="url(#caravan-orb)" className="fill-caravan-land">
        <path d="M2 8 C8 4 13 8 13 14 C13 20 8 23 10 29 C11 34 6 37 1 34 C-2 27 -1 15 2 8 Z" />
        <path d="M27 1 C33 3 38 7 41 13 C34 15 29 12 26 7 Z" />
        <path d="M31 20 C37 20 41 26 39 32 C36 38 29 39 26 35 C24 30 27 22 31 20 Z" />
        <path d="M17 33 C21 32 23 36 22 41 L14 41 Z" />
      </g>
    </svg>
  );
}

function Stars({ filled, open, delay }: { filled: number; open: boolean; delay: number }) {
  return (
    <span className="relative inline-block whitespace-nowrap text-[13px] leading-none tracking-[0.06em] text-caravan-cream/30">
      ★★★★★
      <span
        className="absolute inset-y-0 left-0 overflow-hidden text-caravan-star transition-[width] duration-700 ease-smooth"
        style={{ width: open ? `${filled * 20}%` : "0%", transitionDelay: `${delay}ms` }}
      >
        ★★★★★
      </span>
    </span>
  );
}

function Rating({
  label,
  filled,
  tier,
  open,
  delay,
}: {
  label: string;
  filled: number;
  tier: string;
  open: boolean;
  delay: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold leading-none text-caravan-cream">{label}</span>
      <Stars filled={filled} open={open} delay={delay} />
      <span className="font-bricolage text-[13px] font-bold leading-none text-caravan-star">
        {tier}
      </span>
    </div>
  );
}

export default function CaravanCard() {
  const [open, setOpen] = useState(false);
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <Link
        href="https://www.figma.com/proto/L5R40xMulApXN7y8Ces77v/Caravan--BU-Forge-Catalyst-Design-a-thon?node-id=24-952"
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-card bg-caravan-cream outline-none"
      >
        <div className="flex items-center gap-2 bg-caravan-olive px-3 py-2.5 sm:gap-3 sm:px-4">
          <span className="flex shrink-0 items-baseline">
            <Globe spinning={open} className="h-[22px] w-[22px] self-center sm:h-6 sm:w-6" />
            <span className="font-bricolage text-[19px] font-bold tracking-[-0.02em] text-caravan-cream sm:text-[22px]">
              RVN
            </span>
          </span>
          <span className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-caravan-cream px-3 py-1.5">
            <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" aria-hidden>
              <circle
                cx="9"
                cy="9"
                r="5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-caravan-olive"
              />
              <path
                d="M13 13 L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-caravan-olive"
              />
            </svg>
            <span className="truncate text-[13px] text-caravan-olive/70">
              Plan your next getaway…
            </span>
          </span>
        </div>

        <div className="p-3 sm:p-4">
          <div className="relative flex gap-3 rounded-[12px] bg-caravan-moss p-3 pr-8 sm:gap-4 xl:pr-10">
            <span
              className="aspect-square w-[86px] shrink-0 rounded-[8px] border-2 border-caravan-cream bg-cover sm:w-[110px]"
              style={{
                backgroundImage: "url(/media/caravan-home.png)",
                backgroundSize: "762% auto",
                backgroundPosition: "9.4% 41.6%",
              }}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="font-bricolage text-[26px] font-bold leading-none tracking-[-0.02em] text-caravan-cream xl:text-[30px]">
                Bangkok
              </span>
              <span className="text-[13px] leading-none text-caravan-cream">Thailand</span>
              <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-2.5 rounded-[8px] bg-caravan-olive px-3 py-2.5">
                <Rating label="Overall" filled={5} tier="$" open={open} delay={0} />
                <Rating label="Your Filters" filled={5} tier="$$" open={open} delay={140} />
              </div>
            </div>
            <span className="absolute right-0 top-1/2 grid h-8 w-8 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-caravan-orange sm:h-10 sm:w-10">
              <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden>
                <path
                  d="M9 5 L16 12 L9 19"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-caravan-cream"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
