"use client";

import { useState } from "react";
import Image from "next/image";

const VIDEO_ID = "tyj3BLw83-0";

export default function BlackVampireCard() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-[3px] border-2 border-fg bg-inv-bg">
      <div className="relative aspect-video w-full">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
            title="Black Vampire Media"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Play Black Vampire Media"
            className="absolute inset-0 h-full w-full cursor-pointer outline-none"
          >
            <Image
              src="/media/black-vampire-poster.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 90vw, 420px"
              className="object-cover transition-all duration-500 ease-smooth group-hover:scale-[1.03] group-hover:saturate-[1.15]"
            />
            <span
              aria-hidden
              className="absolute inset-0 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='.5'/></svg>\")",
              }}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-bg/85 transition-transform duration-300 ease-smooth group-hover:scale-110"
            >
              <span className="ml-1 block h-0 w-0 border-y-[9px] border-l-[15px] border-y-transparent border-l-bg/90" />
            </span>
          </button>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-3 px-3 py-2.5 font-label text-label uppercase text-inv-fg">
        <span className="font-bold">Black Vampire Media</span>
        <span className="opacity-55">Video</span>
      </div>
    </div>
  );
}
