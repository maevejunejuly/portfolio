"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Wordmark() {
  const pathname = usePathname();
  const params = useSearchParams();
  const inProjects = pathname.startsWith("/catalog");
  const inverted = pathname === "/catalog" && (params.get("view") ?? "grid") === "grid";

  return (
    <header
      data-chrome
      className={`pointer-events-none z-50 mx-auto flex max-w-[1760px] justify-center px-4 pt-4 text-overlay sm:px-7 ${
        inProjects ? "sticky top-0" : "relative"
      } ${inverted ? "mix-blend-difference" : ""}`}
    >
      <Link
        href="/catalog"
        className="pointer-events-auto absolute left-4 top-4 outline-none sm:left-7"
      >
        Projects
      </Link>
      <Link href="/" aria-label="Maevejunejuly — home" className="pointer-events-auto block w-full max-w-[500px] px-16 outline-none sm:px-0">
        <svg viewBox="0 0 1000 96" className="w-full font-display" aria-hidden>
          <text
            x="0"
            y="88"
            textLength="1000"
            lengthAdjust="spacing"
            fontSize="108"
            fontFamily="var(--font-display), sans-serif"
            fill="currentColor"
          >
            MAEVEJUNEJULY
          </text>
        </svg>
      </Link>
      <Link
        href="/about"
        className="pointer-events-auto absolute right-4 top-4 outline-none sm:right-7"
      >
        About
      </Link>
    </header>
  );
}
