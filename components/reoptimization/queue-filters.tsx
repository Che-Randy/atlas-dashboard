"use client";

import { optimizedOptions, queueStatusOptions } from "@/lib/reopt-query";
import { SearchIcon } from "@/components/ui/icons";
import { useUrlFilters } from "@/components/ui/use-url-filters";
import { FilterSelect } from "@/components/products/product-filters";

// Figma: "Search & Filters Control Row" on the Re-optimization page
export function QueueFilters() {
  const f = useUrlFilters();

  return (
    <div
      data-pending={f.isPending ? "" : undefined}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 p-2.5"
    >
      <label className="relative min-w-40 flex-1">
        <span className="sr-only">Search products</span>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={f.text}
          onChange={(e) => f.setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-lg border border-slate-200 bg-white py-[7px] pr-[9px] pl-[33px] text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none"
        />
      </label>
      <div className="flex items-center gap-2">
        <FilterSelect variant="white" label="Status" value={f.get("status", "all")} options={queueStatusOptions} onChange={(v) => f.setFilter("status", v)} />
        <FilterSelect variant="white" label="Optimized" value={f.get("optimized", "all")} options={optimizedOptions} onChange={(v) => f.setFilter("optimized", v)} />
      </div>
    </div>
  );
}
