"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid gap-6 py-6 kicker sm:grid-cols-3 sm:items-center sm:px-7">
      <span data-hole className="w-fit tabular-nums" suppressHydrationWarning>
        {time}
      </span>
      <span data-hole className="w-fit sm:mx-auto">© 2026 Maeve Chen</span>
      <div className="flex flex-row flex-wrap gap-x-5 gap-y-2 sm:justify-end">
        <a
          data-hole
          href="mailto:maevechn@mit.edu"
          className="w-fit border-b border-current/40 pb-0.5 normal-case tracking-normal"
        >
          maevechn@mit.edu
        </a>
        <a
          data-hole
          href="mailto:maevejunejuly@gmail.com"
          className="w-fit border-b border-current/40 pb-0.5 normal-case tracking-normal"
        >
          maevejunejuly@gmail.com
        </a>
      </div>
    </div>
  );
}
