"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Filters, { VIEWS, type View } from "../components/catalog/Filters";
import GridView from "../components/catalog/GridView";
import ListView from "../components/catalog/ListView";
import FloatView from "../components/catalog/FloatView";
import {
  TYPES,
  TOPICS,
  TYPE_GROUPS,
  type Project,
  type Topic,
  type Type,
} from "../lib/projects";

function read<T extends string>(
  params: URLSearchParams,
  key: string,
  allowed: readonly T[],
): T[] {
  const raw: string[] = params
    .getAll(key)
    .flatMap((v) => v.split(","))
    .flatMap((v) => TYPE_GROUPS[v] ?? [v]);
  return allowed.filter((a) => raw.includes(a));
}

export default function CatalogClient({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const viewParam = params.get("view") as View | null;
  const view: View = viewParam && VIEWS.includes(viewParam) ? viewParam : "grid";
  const type = useMemo(() => read(params, "type", TYPES), [params]);
  const topic = useMemo(() => read(params, "topic", TOPICS), [params]);

  const shown = useMemo(
    () =>
      projects.filter(
        (p) =>
          (type.length === 0 || type.some((t) => p.type.includes(t))) &&
          (topic.length === 0 || topic.some((t) => p.topic.includes(t))),
      ),
    [projects, type, topic],
  );

  const onChange = useCallback(
    (next: { view?: View; type?: Type[]; topic?: Topic[] }) => {
      const q = new URLSearchParams();
      const v = next.view ?? view;
      const ty = next.type ?? type;
      const to = next.topic ?? topic;

      if (v !== "grid") q.set("view", v);
      if (ty.length) q.set("type", ty.join(","));
      if (to.length) q.set("topic", to.join(","));

      const qs = q.toString();
      router.replace(qs ? `/catalog?${qs}` : "/catalog", { scroll: false });
    },
    [router, view, type, topic],
  );

  return (
    <div className="grid grid-cols-1 gap-8 py-6 md:grid-cols-[minmax(0,120px)_minmax(0,1fr)]">
      <Filters view={view} type={type} topic={topic} onChange={onChange} />

      {view === "grid" ? (
        <GridView projects={shown} />
      ) : view === "list" ? (
        <ListView projects={shown} />
      ) : (
        <FloatView projects={shown} />
      )}
    </div>
  );
}
