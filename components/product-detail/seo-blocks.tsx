import type { ReactNode } from "react";

// Small building blocks reused across the six SEO sections.

// "🌐 BASIC SEO ELEMENTS" with an optional note on the right
export function SectionHeading({ icon, title, aside }: { icon: ReactNode; title: string; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="flex items-center gap-1 text-[10px] leading-[15px] font-bold tracking-[0.5px] text-slate-500 uppercase">
        <span className="shrink-0 [&>svg]:size-[9px]">{icon}</span>
        {title}
      </h3>
      {aside}
    </div>
  );
}

// The light grey box holding one field (label on top, value below)
export function Field({
  label,
  meta,
  children,
  className = "",
}: {
  label: ReactNode;
  meta?: ReactNode; // small grey text on the right, e.g. "32 / 60 chars"
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-0.5 rounded border border-slate-200 bg-slate-50/70 p-[9px] ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] leading-[15px] text-slate-500">{label}</p>
        {meta && <p className="font-mono text-[9px] leading-[13.5px] whitespace-nowrap text-slate-400">{meta}</p>}
      </div>
      {children}
    </div>
  );
}

const chipStyles = {
  plain: "bg-white border-slate-200 text-slate-700",
  entity: "bg-indigo-50 border-indigo-200 text-indigo-700",
};

export function Chip({ children, tone = "plain" }: { children: ReactNode; tone?: keyof typeof chipStyles }) {
  return (
    <span className={`rounded border px-[7px] py-[3px] text-[10px] leading-[15px] ${chipStyles[tone]}`}>{children}</span>
  );
}

// "/ 160 chars" counter that turns amber when over the limit
export function CharCount({ text, limit }: { text: string; limit: number }) {
  const over = text.length > limit;
  return (
    <span className={over ? "text-amber-600" : undefined}>
      {text.length} / {limit} chars
    </span>
  );
}

export function Divider() {
  return <hr className="border-slate-200" />;
}
