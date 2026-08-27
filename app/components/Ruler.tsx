export default function Ruler({ className = "" }: { className?: string }) {
  const ticks = Array.from({ length: 121 });
  return (
    <div className={`select-none ${className}`} aria-hidden>
      <svg viewBox="0 0 1200 22" className="h-5 w-full" preserveAspectRatio="none">
        <g stroke="currentColor" strokeWidth="1">
          {ticks.map((_, i) => {
            const major = i % 10 === 0;
            const mid = i % 5 === 0;
            return (
              <line
                key={i}
                x1={i * 10}
                x2={i * 10}
                y1={22}
                y2={major ? 4 : mid ? 11 : 15}
                opacity={major ? 0.75 : mid ? 0.45 : 0.28}
              />
            );
          })}
          <line x1="0" y1="21.5" x2="1200" y2="21.5" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
