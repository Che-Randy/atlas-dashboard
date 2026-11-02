import { Card } from "./card";

export type Tone = "default" | "brand" | "danger";

const valueColor: Record<Tone, string> = {
  default: "text-ink",
  brand: "text-brand",
  danger: "text-danger",
};

type StatCardProps = {
  label: string;
  value: string;
  suffix?: string;
  caption: string;
  tone?: Tone;
};

// Figma: "Summary Cards (2x2 Grid)" on the dashboard
export function StatCard({ label, value, suffix, caption, tone = "default" }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-1.5 p-[13px]">
      <p className="text-[11px] leading-5 font-semibold tracking-[0.55px] text-muted uppercase">
        {label}
      </p>
      <div>
        <p className="flex items-baseline gap-1">
          <span className={`font-mono text-2xl leading-8 font-semibold tracking-[-0.6px] ${valueColor[tone]}`}>
            {value}
          </span>
          {suffix && <span className="text-xs font-medium text-muted">{suffix}</span>}
        </p>
        <p className="pt-0.5 text-[11px] leading-5 text-muted">{caption}</p>
      </div>
    </Card>
  );
}
