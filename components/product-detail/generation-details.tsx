import type { ProductDetail } from "@/lib/types";
import { formatPercent } from "@/lib/format";
import { ChipIcon } from "@/components/ui/icons";

// Figma: "Section: Optimization Metadata (Generation Details)"
export function GenerationDetails({ product, seo }: ProductDetail) {
  const g = seo.generation;
  const box = "flex min-w-0 flex-col gap-0.5 rounded border border-slate-200/80 bg-slate-50 px-[9px] pt-2 pb-[9px]";
  const label = "text-[9px] leading-[13.5px] text-slate-400";

  return (
    <section className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-[13px]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-xs leading-4 font-bold text-slate-900">
          <ChipIcon className="size-[11px] text-slate-600" />
          Generation Details
        </h2>
        <p className="font-mono text-[9px] leading-[13.5px] text-slate-400">{g.engine}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className={box}>
          <p className={label}>Optimization Score</p>
          <p className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-xs leading-4 font-bold text-slate-800">{product.score} / 100</span>
            <span className="text-[9px] font-bold text-emerald-600">• High Accuracy</span>
          </p>
        </div>
        <div className={box}>
          <p className={label}>AI Confidence</p>
          <p className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-xs leading-4 font-bold text-slate-800">{formatPercent(g.confidence, 1)}</span>
            <span className="text-[9px] font-bold text-brand">• Verified Tokens</span>
          </p>
        </div>
        <div className={box}>
          <p className={label}>Model Version</p>
          <p className="truncate font-mono text-[10px] leading-[15px] font-bold text-slate-700">{g.modelVersion}</p>
        </div>
        <div className={box}>
          <p className={label}>Prompt Version</p>
          <p className="truncate font-mono text-[10px] leading-[15px] font-bold text-slate-700">{g.promptVersion}</p>
        </div>
      </div>

      <div className={box}>
        <div className="flex items-center justify-between">
          <p className={label}>Semantic Hash</p>
          <p className="text-[9px] leading-[13.5px] font-bold text-emerald-600">Integrity Verified</p>
        </div>
        <p className="truncate font-mono text-[9px] leading-[13.5px] text-slate-600" title={g.semanticHash}>
          {g.semanticHash}
        </p>
      </div>
    </section>
  );
}

// Figma: "Footer - Persistent Bottom Status Desk"
export function StatusFooter() {
  return (
    <footer className="-mx-4 -mb-8 mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-2 text-[10px] leading-[15px]">
      <p className="flex items-center gap-1.5 text-slate-700">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Atlas SEO Intelligence Desk
        <span className="text-slate-300">•</span>
        <span className="text-slate-400">Gateway Connected</span>
      </p>
      <p className="font-mono text-slate-400">© 2026 iConz Project Atlas</p>
    </footer>
  );
}
