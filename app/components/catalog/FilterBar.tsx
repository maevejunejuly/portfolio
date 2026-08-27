"use client";

import { allTags, type Category, type SortKey } from "../../lib/projects";

export type View = "index" | "directory" | "board";

export const VIEWS: { key: View; label: string }[] = [
  { key: "index", label: "Index" },
  { key: "directory", label: "Directory" },
  { key: "board", label: "Board" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "title", label: "Title" },
  { key: "company", label: "Company" },
];

const chip =
  "rounded-full border px-3 py-1 font-label text-label uppercase transition-colors duration-150";

export default function FilterBar({
  view,
  category,
  tags,
  sort,
  count,
  total,
  onChange,
}: {
  view: View;
  category: Category | null;
  tags: string[];
  sort: SortKey;
  count: number;
  total: number;
  onChange: (next: {
    view?: View;
    category?: Category | null;
    tags?: string[];
    sort?: SortKey;
  }) => void;
}) {
  const toggleTag = (t: string) =>
    onChange({ tags: tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t] });

  return (
    <div className="border-y border-line">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-3">
        <div className="flex items-center gap-2">
          <span className="font-label text-label uppercase opacity-45">Category</span>
          {([null, "engineering", "creative"] as const).map((c) => (
            <button
              key={c ?? "all"}
              type="button"
              onClick={() => onChange({ category: c })}
              aria-pressed={category === c}
              className={`${chip} ${
                category === c
                  ? "border-fg bg-inv-bg text-inv-fg"
                  : "border-line hover:border-fg"
              }`}
            >
              {c ?? "All"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-label text-label uppercase opacity-45">Sort</span>
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onChange({ sort: s.key })}
              aria-pressed={sort === s.key}
              className={`${chip} ${
                sort === s.key ? "border-fg bg-inv-bg text-inv-fg" : "border-line hover:border-fg"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="font-label text-label uppercase opacity-45">
            {count === total ? `${total} projects` : `${count} of ${total}`}
          </span>
          <div className="flex overflow-hidden rounded-full border border-fg">
            {VIEWS.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => onChange({ view: v.key })}
                aria-pressed={view === v.key}
                className={`px-3 py-1 font-label text-label uppercase transition-colors duration-150 ${
                  view === v.key ? "bg-inv-bg text-inv-fg" : "hover:bg-surface"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line py-3">
        <span className="font-label text-label uppercase opacity-45">Tags</span>
        {allTags.map((t) => {
          const on = tags.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              aria-pressed={on}
              className={`${chip} ${on ? "border-fg bg-inv-bg text-inv-fg" : "border-line hover:border-fg"}`}
            >
              {on ? "✕ " : ""}
              {t}
            </button>
          );
        })}
        {(tags.length > 0 || category) && (
          <button
            type="button"
            onClick={() => onChange({ tags: [], category: null })}
            className="ml-1 font-label text-label uppercase underline underline-offset-4 opacity-60 hover:opacity-100"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
