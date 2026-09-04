"use client";

import { TYPES, TOPICS, type Topic, type Type } from "../../lib/projects";

export type View = "grid" | "list" | "float";

export const VIEWS: View[] = ["grid", "list", "float"];

const titleCase = (s: string) => s[0].toUpperCase() + s.slice(1);

function Group<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly T[];
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  return (
    <div className="flex flex-col items-start">
      <span className="kicker font-bold">{label}</span>
      <button
        type="button"
        onClick={() => onChange([])}
        className={`filter-opt ${selected.length === 0 ? "font-bold" : ""}`}
      >
        All
      </button>
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() =>
              onChange(on ? selected.filter((x) => x !== o) : [...selected, o])
            }
            className={`filter-opt ${on ? "font-bold" : ""}`}
          >
            {titleCase(o)}
          </button>
        );
      })}
    </div>
  );
}

export default function Filters({
  view,
  type,
  topic,
  onChange,
}: {
  view: View;
  type: Type[];
  topic: Topic[];
  onChange: (next: { view?: View; type?: Type[]; topic?: Topic[] }) => void;
}) {
  return (
    <div data-chrome className="overlay-invert chrome relative z-30 flex w-fit flex-col gap-6 md:w-auto md:sticky md:top-24 md:self-start">
      <div className="flex flex-col items-start">
        <span className="kicker font-bold">View</span>
        {VIEWS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange({ view: v })}
            className={`filter-opt ${view === v ? "font-bold" : ""}`}
          >
            {titleCase(v)}
          </button>
        ))}
      </div>

      <Group
        label="Type"
        options={TYPES}
        selected={type}
        onChange={(t) => onChange({ type: t })}
      />
      <Group
        label="Topic"
        options={TOPICS}
        selected={topic}
        onChange={(t) => onChange({ topic: t })}
      />
    </div>
  );
}
