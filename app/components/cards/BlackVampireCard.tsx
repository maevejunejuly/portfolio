"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const VIDEO_ID = "tyj3BLw83-0";
const TITLE = "What makes a black vampire?";
const CHANNEL = "maevejunejuly";
const CHANNEL_URL = "https://www.youtube.com/@maevejunejuly";
const PROJECT_URL = "/catalog/black-vampire";
const PUBLISHED = "2026-05-14T19:37:52-07:00";
const LENGTH = 2042;

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

function ago(iso: string) {
  const s = (new Date(iso).getTime() - Date.now()) / 1000;
  const [unit, size] = UNITS.find(([, v]) => Math.abs(s) >= v) ?? UNITS[UNITS.length - 1];
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round(s / size),
    unit,
  );
}

function timestamp(total: number) {
  const parts = [Math.floor(total / 60), total % 60];
  if (total >= 3600) parts.unshift(Math.floor(total / 3600), Math.floor((total % 3600) / 60));
  return parts.map((n, i) => (i ? String(n).padStart(2, "0") : n)).join(":");
}

export default function BlackVampireCard() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="card-box relative font-roboto">
      <Link
        href={PROJECT_URL}
        aria-label={TITLE}
        className="absolute inset-0 z-0 rounded-card"
      />

      <div className="relative z-10 aspect-video w-full overflow-hidden rounded-xl bg-inv-bg">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
            title={TITLE}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${TITLE}`}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src="/media/black-vampire-poster.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 90vw, 420px"
              className="object-cover"
            />
            <span className="absolute bottom-2 right-2 rounded-[4px] bg-black/80 px-1 py-[3px] text-[12px] font-medium leading-[12px] text-white">
              {timestamp(LENGTH)}
            </span>
          </button>
        )}
      </div>

      <div className="mt-3 flex gap-3">
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noreferrer"
          className="relative z-10 shrink-0"
        >
          <Image
            src="/media/maevejunejuly-avatar.jpg"
            alt={CHANNEL}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full"
          />
        </a>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[14px] font-medium leading-[20px] text-yt-text">
            {TITLE}
          </h3>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 mt-1 block w-fit text-[12px] leading-[18px] text-yt-meta hover:text-yt-text"
          >
            {CHANNEL}
          </a>
          <p className="text-[12px] leading-[18px] text-yt-meta">{ago(PUBLISHED)}</p>
        </div>

        <span aria-hidden className="-mr-1 mt-1 h-6 w-6 shrink-0">
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-yt-text">
            <path d="M12 16.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-6a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-6a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
          </svg>
        </span>
      </div>
    </div>
  );
}
