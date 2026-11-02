import type { ProductStatus } from "@/lib/types";
import { AlertIcon, CheckCircleIcon, RefreshIcon } from "@/components/ui/icons";

const styles = {
  optimized: { label: "Optimized", className: "bg-emerald-50 border-emerald-200 text-emerald-700", Icon: CheckCircleIcon },
  "needs-reopt": { label: "Action Req.", className: "bg-rose-50 border-rose-200 text-rose-700", Icon: AlertIcon },
  processing: { label: "Processing", className: "bg-sky-50 border-sky-200 text-sky-700", Icon: RefreshIcon },
} satisfies Record<ProductStatus, unknown>;

// Square-cornered status badge with an icon, used on the product page.
// size="sm" is the smaller one inside the product card.
export function DetailStatusBadge({ status, size = "md" }: { status: ProductStatus; size?: "sm" | "md" }) {
  const { label, className, Icon } = styles[status];
  const sm = size === "sm";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border font-bold whitespace-nowrap ${className} ${
        sm ? "px-1.5 py-px text-[9px] leading-[13.5px]" : "px-[7px] py-[3px] text-[10px] leading-[15px]"
      }`}
    >
      <Icon className={sm ? "size-2" : "size-[9px]"} />
      {label}
    </span>
  );
}
