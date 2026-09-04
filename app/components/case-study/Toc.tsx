"use client";

import { useEffect, useState } from "react";

export default function Toc({
  sections,
}: {
  sections: { id: string; title: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );

    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="hidden flex-col items-start gap-2 md:flex">
      {sections.map(({ id, title }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`font-body text-label filter-opt whitespace-nowrap leading-snug ${active === id ? "font-bold" : ""}`}
        >
          {title}
        </a>
      ))}
    </nav>
  );
}
