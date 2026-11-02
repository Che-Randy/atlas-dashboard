import type { Product, ProductStatus } from "@/lib/types";

// Score pill colour follows the design: blue while the product is still
// processing, otherwise green ≥ 80, amber 70–79, red below 70.
export function ScorePill({ score, status }: Pick<Product, "score" | "status">) {
  const style =
    status === "processing"
      ? "bg-sky-50 border-brand text-[#0061a6]"
      : score >= 80
        ? "bg-emerald-50 border-emerald-200/60 text-emerald-700"
        : score >= 70
          ? "bg-amber-50 border-amber-200/70 text-amber-700"
          : "bg-rose-50 border-rose-200/60 text-rose-700";

  return (
    <span className={`inline-flex rounded border px-[7px] py-[3px] text-[10px] leading-[15px] font-semibold whitespace-nowrap ${style}`}>
      {score}/100
    </span>
  );
}

const statusStyles: Record<ProductStatus, { label: string; pill: string; dot: string }> = {
  optimized: { label: "Optimized", pill: "bg-emerald-50 border-emerald-200/60 text-emerald-700", dot: "bg-emerald-600" },
  "needs-reopt": { label: "Action Req.", pill: "bg-rose-50 border-rose-200/60 text-rose-700", dot: "bg-rose-600" },
  processing: { label: "Processing", pill: "bg-sky-50 border-sky-200/60 text-sky-700", dot: "bg-sky-500" },
};

export function StatusPill({ status }: { status: ProductStatus }) {
  const s = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-[7px] py-[3px] text-[9px] leading-[13.5px] font-medium whitespace-nowrap ${s.pill}`}>
      <span className={`size-1 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
