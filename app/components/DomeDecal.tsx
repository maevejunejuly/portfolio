import { DOME } from "../lib/dome-pixels";

export default function DomeDecal({ className = "" }: { className?: string }) {
  const rects: React.ReactElement[] = [];

  DOME.rows.forEach((runs, y) => {
    let x = 0;
    runs.forEach((len, i) => {
      if (i % 2 === 1 && len > 0) rects.push(<rect key={`${y}-${x}`} x={x} y={y} width={len} height={1} />);
      x += len;
    });
  });

  return (
    <svg
      viewBox={`0 0 ${DOME.w} ${DOME.h}`}
      className={className}
      aria-hidden
      focusable="false"
      shapeRendering="crispEdges"
    >
      <g fill="currentColor">{rects}</g>
    </svg>
  );
}
