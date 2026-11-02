import type { ProductStatus } from "@/lib/types";

const styles: Record<ProductStatus, { label: string; className: string }> = {
  optimized: {
    label: "Optimized",
    className: "bg-[#ecfdf5] border-[#a7f3d0]/60 text-[#047857]",
  },
  "needs-reopt": {
    label: "Needs Re-opt",
    className: "bg-[#fffbeb] border-[#fde68a]/60 text-[#b45309]",
  },
  processing: {
    label: "Processing",
    className: "bg-[#eff6ff] border-[#bfdbfe]/60 text-brand",
  },
};

// The coloured pill in the Status column
export function StatusBadge({ status }: { status: ProductStatus }) {
  const { label, className } = styles[status];
  return (
    <span
      className={`inline-flex items-center rounded-xl border px-[7px] py-[3px] text-[10px] leading-4 font-semibold whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}
