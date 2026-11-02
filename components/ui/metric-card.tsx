import type { ReactNode } from "react";

// The summary cards on the SEO Intelligence pages. They're styled
// differently from the dashboard's StatCard in the Figma (rounder corners,
// Hanken Grotesk numbers, a dot or icon top-right), so they get their own
// component instead of piling options onto StatCard.

const tones = {
  default: { value: "text-slate-900", dot: "" },
  success: { value: "text-emerald-600", dot: "bg-emerald-500" },
  brand: { value: "text-brand", dot: "bg-brand/75" },
  danger: { value: "text-rose-600", dot: "bg-rose-500" },
} as const;

type MetricCardProps = {
  label: string;
  value: string;
  caption: string;
  tone?: keyof typeof tones;
  icon?: ReactNode; // shown instead of the coloured dot
};

export function MetricCard({ label, value, caption, tone = "default", icon }: MetricCardProps) {
  const t = tones[tone];
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-slate-200/80 bg-white p-[13px] shadow-[0_1px_1.5px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[11px] leading-[16.5px] font-semibold tracking-[0.55px] text-slate-500 uppercase">
          {label}
        </p>
        {icon ?? (t.dot && <span className={`size-2 shrink-0 rounded-full ${t.dot}`} />)}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className={`font-hanken text-xl leading-5 font-bold ${t.value}`}>{value}</p>
        <p className="text-[11px] leading-[16.5px] text-slate-500">{caption}</p>
      </div>
    </div>
  );
}
