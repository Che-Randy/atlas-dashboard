import Image from "next/image";
import type { ProductDetail } from "@/lib/types";
import { formatHttp, scoreLabel } from "@/lib/format";
import { RelativeTime } from "@/components/ui/relative-time";
import { LayersIcon } from "@/components/ui/icons";
import { DetailStatusBadge } from "./detail-status-badge";

const labelStyle = {
  Excellent: "text-emerald-600 bg-emerald-50 border-emerald-200/60",
  Good: "text-emerald-600 bg-emerald-50 border-emerald-200/60",
  Fair: "text-amber-700 bg-amber-50 border-amber-200/70",
  Poor: "text-rose-700 bg-rose-50 border-rose-200/60",
};

// Figma: "Product Header Overview Card with Score Widget"
export function ProductOverviewCard({ product, seo }: ProductDetail) {
  const label = scoreLabel(product.score);

  return (
    <section className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-[13px]">
      <div className="flex min-w-0 items-center gap-2.5">
        {/* Product photo, or a placeholder when there isn't one yet */}
        <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
          {seo.imageUrl ? (
            <Image src={seo.imageUrl} alt={seo.imageAlt} fill sizes="48px" className="object-cover" />
          ) : (
            <span className="grid size-full place-items-center text-slate-300" aria-label="No product photo yet">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="9" cy="10" r="2" />
                <path d="m21 17-5-5-9 8" />
              </svg>
            </span>
          )}
          <span className="absolute right-0 bottom-0 bg-slate-900/70 px-1 font-mono text-[8px] leading-3 text-white">1/1</span>
        </div>

        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-xs leading-4 font-bold text-slate-900">{product.name}</h2>
            <span className="shrink-0 rounded border border-slate-200 bg-slate-50 px-[5px] py-px font-mono text-[9px] leading-[13.5px] text-slate-400">
              {seo.ref}
            </span>
          </div>
          <p className="flex flex-wrap items-center gap-x-1.5 text-[10px] leading-[15px] text-slate-500">
            <span className="flex items-center gap-1">
              <LayersIcon className="size-[9px]" />
              {seo.categoryPath}
            </span>
            <span>•</span>
            <span>
              Last Optimized: <RelativeTime iso={product.processedAt} variant="datetime" />
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[9px] leading-[13.5px] text-slate-500">
            <span className="flex items-center gap-2">
              Status:
              <DetailStatusBadge status={product.status} size="sm" />
            </span>
            <span className="text-base leading-6 text-slate-300 lg:hidden">|</span>
            <span>
              Indexable: <b className="font-bold text-slate-700">{formatHttp(seo.indexable, seo.httpStatus)}</b>
            </span>
          </div>
        </div>
      </div>

      <div className="flex min-w-[76px] shrink-0 flex-col items-center rounded-md border border-blue-200/80 bg-[linear-gradient(139deg,#eff6ff_0%,rgba(238,242,255,0.5)_100%)] px-[11px] pt-1.5 pb-[9px]">
        <p className="text-[9px] leading-[13.5px] font-bold tracking-[0.45px] text-brand uppercase">SEO Score</p>
        <p className="flex items-baseline gap-0.5 whitespace-nowrap">
          <span className="text-lg leading-[18px] font-bold text-slate-900">{product.score}</span>
          <span className="text-[10px] text-slate-500">/100</span>
        </p>
        <span className={`mt-1 rounded border px-[5px] py-px text-[8px] leading-3 font-bold ${labelStyle[label]}`}>
          {label}
        </span>
      </div>
    </section>
  );
}
