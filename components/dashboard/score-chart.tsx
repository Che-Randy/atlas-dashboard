import type { ScorePoint } from "@/lib/types";
import { Card, CardHeader } from "@/components/ui/card";

// Chart geometry, measured from the Figma "SVG" layer (418 × 160).
const W = 418;
const H = 160;
const X0 = 29; // where gridlines start
const X1 = 404; // where gridlines end
const Y_MIN = 60;
const Y_MAX = 100;
const TOP = 18.3; // y of the "100" gridline
const BOTTOM = 150.9; // y of the "60" gridline
const FIRST_X = 54.5;
const STEP_X = 104.5;

const y = (score: number) => BOTTOM - ((score - Y_MIN) / (Y_MAX - Y_MIN)) * (BOTTOM - TOP);
const ticks = [100, 90, 80, 70, 60];

// A static SVG needs no JavaScript in the browser, so this stays a
// server component. Swap in a chart library later if you need tooltips.
export function ScoreChart({ trend }: { trend: ScorePoint[] }) {
  const points = trend.map((d, i) => ({ ...d, x: FIRST_X + i * STEP_X, y: y(d.score) }));
  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `M${points[0].x},${BOTTOM} L${line.replaceAll(" ", " L")} L${points.at(-1)!.x},${BOTTOM} Z`;
  const lastIndex = points.length - 1;

  return (
    <Card className="flex flex-col gap-3 p-[17px]">
      <CardHeader title="SEO Performance" subtitle="Average optimization score trajectory over time" />

      <div className="flex flex-col gap-2 rounded bg-tint/40 p-3">
        <div className="flex items-center justify-between text-[11px] leading-5 font-medium">
          <span className="text-muted">Score Trajectory</span>
          <span className="flex items-center gap-1.5 text-ink">
            <span className="size-2 rounded-full bg-brand" />
            Average Score
          </span>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Average SEO score: ${trend.map((d) => `${d.label} ${d.score}`).join(", ")}`}>
          <defs>
            <linearGradient id="score-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3399cc" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3399cc" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line x1={X0} x2={X1} y1={y(t)} y2={y(t)} stroke="#e5eeff" strokeDasharray="3 3" />
              <text x={X0 - 4} y={y(t)} dy="0.35em" textAnchor="end" fontSize="10.3" fill="#747686">
                {t}
              </text>
            </g>
          ))}

          <path d={area} fill="url(#score-fill)" />
          <polyline points={line} fill="none" stroke="#3399cc" strokeWidth="2" strokeLinejoin="round" />

          {points.map((p, i) => {
            const last = i === lastIndex;
            return (
              <g key={p.label}>
                <circle cx={p.x} cy={p.y} r={last ? 4.5 : 3.6} fill="#3399cc" stroke="white" strokeWidth="1.5" />
                <text
                  x={p.x + 4}
                  y={p.y - 9}
                  fontSize={last ? 12.6 : 11.4}
                  fontWeight="700"
                  fill={last ? "#1c6585" : "#0b1c30"}
                  className="font-mono"
                >
                  {p.score}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex justify-between px-4 text-[11px] leading-5">
          {trend.map((d, i) => (
            <span key={d.label} className={i === lastIndex ? "font-semibold text-brand" : "text-muted"}>
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
