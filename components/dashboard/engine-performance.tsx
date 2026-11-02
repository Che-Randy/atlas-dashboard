import type { EngineMetrics } from "@/lib/types";
import { formatPercent, formatSeconds, formatUsd, toPercent } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/card";

export function EnginePerformance({ metrics: m }: { metrics: EngineMetrics }) {
  // Raw numbers from the data layer → the three rows in the design
  const rows = [
    { label: "Cache Hit Rate", caption: "High efficiency", value: formatPercent(m.cacheHitRate), percent: m.cacheHitRate * 100, highlight: true },
    { label: "Avg Processing Time", caption: "Per product", value: formatSeconds(m.avgProcessingSeconds), percent: toPercent(m.avgProcessingSeconds, m.processingTargetSeconds) },
    {
      label: "AI Cost per Product",
      caption: m.costPerProductUsd <= m.costBudgetUsd ? "Well within budget cap" : "Over budget cap",
      value: formatUsd(m.costPerProductUsd),
      percent: toPercent(m.costPerProductUsd, m.costBudgetUsd),
    },
  ];

  return (
    <Card className="flex flex-col gap-3 p-[17px]">
      <CardHeader title="Engine Performance" subtitle="System efficiency & resource telemetry" />

      <div className="flex flex-col gap-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1.5 rounded bg-tint/40 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs leading-4 font-semibold text-[#1e293b]">{row.label}</p>
                <p className="text-[11px] leading-5 text-muted">{row.caption}</p>
              </div>
              <p className={`font-mono text-base leading-6 font-semibold ${row.highlight ? "text-brand" : "text-[#1e293b]"}`}>
                {row.value}
              </p>
            </div>
            {/* Progress bar: the inner div's width is the percentage */}
            <div className="h-2 overflow-hidden rounded-xl bg-line">
              <div className="h-full rounded-xl bg-brand" style={{ width: `${row.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
