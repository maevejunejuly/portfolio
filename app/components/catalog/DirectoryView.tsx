"use client";

import { useState } from "react";
import ImageSlot from "../ImageSlot";
import ProjectLink from "./ProjectLink";
import type { Project } from "../../lib/projects";

export default function DirectoryView({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const shown = projects[Math.min(active, projects.length - 1)];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <div>
        {projects.map((p, i) => (
          <ProjectLink
            key={p.slug}
            project={p}
            className="group flex items-center justify-between gap-4 border-b border-line py-3 transition-colors duration-150 hover:bg-inv-bg hover:text-inv-fg"
          >
            <div
              className="flex min-w-0 flex-1 items-center justify-between gap-4"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="truncate font-display text-[clamp(20px,3vw,34px)] leading-none tracking-display">
                {p.title}
              </span>
              <div className="flex shrink-0 items-baseline gap-4 font-label text-label uppercase">
                <span className="hidden opacity-60 sm:inline">{p.company}</span>
                <span className="opacity-60">{p.date || "—"}</span>
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </ProjectLink>
        ))}
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        {shown && (
          <div className="border border-line p-4">
            <div className="relative aspect-[4/3] w-full">
              <ImageSlot src={shown.src} placeholder={shown.title} className="h-full w-full" />
            </div>
            <p className="mt-4 font-label text-label uppercase opacity-55">
              {shown.company} · {shown.date || "date TBC"}
            </p>
            <h2 className="mt-1 font-display text-card-title">{shown.title}</h2>
            <p className="mt-2 text-dek opacity-75 [text-wrap:pretty]">{shown.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {shown.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-2 py-0.5 font-label text-label uppercase opacity-70"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
