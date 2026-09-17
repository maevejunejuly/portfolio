"use client";

export type Definition = {
  headword: string;
  roman: string;
  pos: string;
  senses: string[];
};

export default function DefinitionPopup({
  def,
  open,
  onClose,
}: {
  def: Definition;
  open: boolean;
  onClose?: () => void;
}) {
  return (
    <div
      role="note"
      aria-hidden={!open}
      className="w-[260px] rounded-2xl border border-swaralu-ink bg-swaralu-paper p-3 transition-all duration-300 ease-smooth"
      style={{
        boxShadow: "5px 5px 0 var(--swaralu-ink)",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.97)",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p
            lang="te"
            className="m-0 font-telugu text-[26px] leading-[1.2] text-swaralu-ink"
          >
            {def.headword}
          </p>
          <p className="m-0 font-mono text-[12px] leading-[1.3] text-swaralu-muted">{def.roman}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close definition"
            tabIndex={open ? 0 : -1}
            className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-swaralu-ink text-[13px] leading-none text-swaralu-ink"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mb-3 border-t border-dashed border-swaralu-rule" />

      <p className="m-0 mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-swaralu-muted">
        {def.pos}
      </p>
      <ol className="m-0 mb-2.5 list-decimal pl-4 text-[14px] leading-[1.45] text-swaralu-ink">
        {def.senses.map((s, i) => (
          <li key={i} className="mb-0.5">
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
