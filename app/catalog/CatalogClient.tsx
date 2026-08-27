"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterBar, { VIEWS, type View } from "../components/catalog/FilterBar";
import IndexView from "../components/catalog/IndexView";
import DirectoryView from "../components/catalog/DirectoryView";
import BoardView from "../components/catalog/BoardView";
import {
  filterProjects,
  projects,
  resolveToken,
  type Category,
  type SortKey,
} from "../lib/projects";

const isView = (v: string | null): v is View => VIEWS.some((x) => x.key === v);
const isSort = (v: string | null): v is SortKey =>
  v === "date" || v === "title" || v === "company";

export default function CatalogClient() {
  const router = useRouter();
  const params = useSearchParams();

  const viewParam = params.get("view");
  const sortParam = params.get("sort");
  const view: View = isView(viewParam) ? viewParam : "index";
  const sort: SortKey = isSort(sortParam) ? sortParam : "date";

  const { category, tags, slug } = useMemo(() => {
    const raw = params.getAll("tag").flatMap((t) => t.split(",")).filter(Boolean);
    let category: Category | null = null;
    const tags: string[] = [];
    let slug: string | null = null;
    for (const token of raw) {
      const r = resolveToken(token);
      if (r.category) category = r.category;
      if (r.slug) slug = r.slug;
      tags.push(...r.tags);
    }
    const explicit = params.get("category");
    if (explicit === "engineering" || explicit === "creative") category = explicit;
    return { category, tags, slug };
  }, [params]);

  const shown = useMemo(() => {
    const base = slug ? projects.filter((p) => p.slug === slug) : projects;
    return filterProjects(base, { category, tags, sort });
  }, [category, tags, sort, slug]);

  const onChange = useCallback(
    (next: { view?: View; category?: Category | null; tags?: string[]; sort?: SortKey }) => {
      const q = new URLSearchParams();
      const v = next.view ?? view;
      const s = next.sort ?? sort;
      const c = next.category !== undefined ? next.category : category;
      const t = next.tags ?? tags;

      if (v !== "index") q.set("view", v);
      if (s !== "date") q.set("sort", s);
      if (c) q.set("category", c);
      for (const tag of t) q.append("tag", tag);

      const qs = q.toString();
      router.replace(qs ? `/catalog?${qs}` : "/catalog", { scroll: false });
    },
    [router, view, sort, category, tags],
  );

  return (
    <>
      <FilterBar
        view={view}
        category={category}
        tags={tags}
        sort={sort}
        count={shown.length}
        total={projects.length}
        onChange={onChange}
      />

      {slug && (
        <p className="py-3 font-label text-label uppercase opacity-60">
          Showing one project ·{" "}
          <button
            type="button"
            onClick={() => router.replace("/catalog", { scroll: false })}
            className="underline underline-offset-4"
          >
            show everything
          </button>
        </p>
      )}

      <div className="py-8">
        {shown.length === 0 ? (
          <p className="py-16 text-center font-label text-label uppercase opacity-50">
            Nothing matches those filters.
          </p>
        ) : view === "index" ? (
          <IndexView projects={shown} />
        ) : view === "directory" ? (
          <DirectoryView projects={shown} />
        ) : (
          <BoardView projects={shown} />
        )}
      </div>
    </>
  );
}
