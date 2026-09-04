"use client";

import { useState } from "react";
import ImageSlot from "../ImageSlot";
import ProjectLink from "./ProjectLink";
import type { Project } from "../../lib/projects";

export default function ListView({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const shown = projects[Math.min(active, projects.length - 1)];

  return (
    <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <div>
        {projects.map((p, i) => (
          <ProjectLink
            key={p.slug}
            project={p}
            className="flex items-center gap-3 leading-[1.15]"
          >
            <span
              className="flex items-center gap-3"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="text-[clamp(24px,3.2vw,42px)] tracking-display">
                {p.title}
              </span>
              {(p.coverSmall ?? p.cover) && (
                <span className="relative h-[0.9em] w-[1.3em] shrink-0 self-center text-[clamp(24px,3.2vw,42px)]">
                  <ImageSlot src={p.coverSmall ?? p.cover} placeholder="" />
                </span>
              )}
              {p.year && <span className="shrink-0 opacity-55">{p.year}</span>}
            </span>
          </ProjectLink>
        ))}
      </div>

      <aside className="hidden xl:sticky xl:top-6 xl:block xl:self-start">
        {shown && (
          <div className="relative aspect-[4/3] w-full">
            <ImageSlot src={shown.cover} placeholder={shown.title} fit="contain" />
          </div>
        )}
      </aside>
    </div>
  );
}
