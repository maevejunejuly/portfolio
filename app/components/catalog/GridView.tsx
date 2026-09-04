"use client";

import ImageSlot from "../ImageSlot";
import ProjectLink from "./ProjectLink";
import type { Project } from "../../lib/projects";

export default function GridView({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
      {projects.map((p) => (
        <ProjectLink key={p.slug} project={p} className="group flex flex-col">
          <div className="relative aspect-[4/3] w-full">
            <ImageSlot
              src={p.cover}
              placeholder={p.title}
              fit="contain"
              className="h-full w-full"
            />
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="truncate font-bold">{p.title}</span>
            <span className="shrink-0 opacity-55">{p.year}</span>
          </div>
        </ProjectLink>
      ))}
    </div>
  );
}
