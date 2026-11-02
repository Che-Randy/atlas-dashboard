import type { ReactNode } from "react";

// The white bordered box used for almost every block in Atlas.
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-lg border border-line bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${className}`}
    >
      {children}
    </section>
  );
}

// Bold title + small grey subtitle at the top of a card
export function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-sm leading-5 font-bold text-ink">{title}</h2>
      {subtitle && <p className="text-[11px] leading-5 text-muted">{subtitle}</p>}
    </div>
  );
}
