"use client";

import ImageSlot from "../ImageSlot";
import ProjectLink from "./ProjectLink";
import type { Project } from "../../lib/projects";

export default function IndexView({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
      {projects.map((p) => (
        <ProjectLink
          key={p.slug}
          project={p}
          className="group flex flex-col border-b border-r border-line p-3 transition-colors duration-150 hover:bg-surface"
        >
          <div className="flex items-start justify-between gap-2 font-label text-label uppercase">
            <span className="truncate opacity-60">{p.company}</span>
            <span className="shrink-0 truncate opacity-60">{p.tags[0]}</span>
          </div>

          <div className="relative my-4 flex-1">
            <div className="relative mx-auto aspect-[4/3] w-full">
              <ImageSlot
                src={p.src}
                placeholder={p.title}
                fit="contain"
                className="h-full w-full"
              />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate font-label text-label font-bold uppercase">{p.title}</span>
            <span className="shrink-0 font-label text-label uppercase opacity-60">
              {p.date || "date TBC"}
            </span>
          </div>
        </ProjectLink>
      ))}
    </div>
  );
}
