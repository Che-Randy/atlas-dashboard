"use client";

import { scoreOptions, statusOptions } from "@/lib/product-query";
import { ChevronDownIcon, SearchIcon, SlidersIcon } from "@/components/ui/icons";
import { useUrlFilters } from "@/components/ui/use-url-filters";

// Search + filters for the Products page. The URL logic is shared with the
// Re-optimization page through useUrlFilters().
export function ProductFilters() {
  const f = useUrlFilters();

  return (
    <div
      // data-pending lets the table (a sibling) dim itself with CSS
      data-pending={f.isPending ? "" : undefined}
      className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white p-[7px] shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
    >
      <label className="relative min-w-36 flex-1">
        <span className="sr-only">Search products</span>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-[11px] -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={f.text}
          onChange={(e) => f.setSearch(e.target.value)}
          placeholder="Search products by name or SKU..."
          className="w-full rounded-md border border-slate-200 bg-slate-50 py-[9px] pr-[9px] pl-[29px] text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none"
        />
      </label>

      <div className="flex items-center gap-2">
        <FilterSelect
          label="Status"
          value={f.get("status", "all")}
          options={statusOptions}
          highlight
          onChange={(v) => f.setFilter("status", v)}
        />
        <FilterSelect label="Score" value={f.get("score", "any")} options={scoreOptions} onChange={(v) => f.setFilter("score", v)} />
        {/* In the design but its behaviour isn't specified yet */}
        <button
          type="button"
          title="More filters (coming soon)"
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-[11px] py-[7px] text-xs leading-4 font-medium text-slate-600 hover:bg-slate-50"
        >
          <SlidersIcon className="size-3" />
          Filter
        </button>
      </div>
    </div>
  );
}

// A real <select> (accessible, works with the keyboard and on phones),
// styled to look like the "Status: All ▾" pill in the design.
export function FilterSelect({
  label,
  value,
  options,
  highlight,
  variant = "tinted",
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  highlight?: boolean;
  variant?: "tinted" | "white"; // grey pill (Products) or white box (Re-optimization)
  onChange: (value: string) => void;
}) {
  const box = variant === "white" ? "bg-white" : "bg-slate-50";
  const labelColor = variant === "white" ? "text-slate-700" : "text-slate-400";
  return (
    <label className={`relative flex items-center gap-1.5 rounded-lg border border-slate-200 ${box} py-[7px] pr-[11px] pl-[11px] text-xs leading-4 focus-within:border-brand`}>
      <span className={`font-medium ${labelColor}`}>{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`cursor-pointer appearance-none bg-transparent pr-3.5 field-sizing-content focus:outline-none ${
          highlight ? "font-semibold text-brand" : variant === "white" ? "font-medium text-slate-700" : "font-semibold text-slate-700"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-[11px] h-[5px] w-2 text-slate-400" />
    </label>
  );
}
