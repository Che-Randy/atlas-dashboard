"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Product } from "@/lib/types";
import { DownloadIcon, RefreshIcon } from "@/components/ui/icons";

// The two icon buttons in the table header.
export function TableActions({ rows }: { rows: Product[] }) {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();

  // Builds a CSV of the rows currently shown and downloads it
  function exportCsv() {
    const header = ["Name", "SKU", "Category", "Score", "Status", "Processed At"];
    const lines = rows.map((r) => [r.name, r.sku, r.category, r.score, r.status, r.processedAt]);
    const csv = [header, ...lines]
      .map((cols) => cols.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "atlas-products.csv" });
    a.click();
    URL.revokeObjectURL(url);
  }

  const btn = "grid size-6 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900";

  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={exportCsv} className={btn} aria-label="Export as CSV" title="Export as CSV">
        <DownloadIcon className="size-3" />
      </button>
      <button
        type="button"
        // router.refresh() asks the server to re-render this page with fresh data
        onClick={() => startTransition(() => router.refresh())}
        className={btn}
        aria-label="Refresh"
        title="Refresh"
      >
        <RefreshIcon className={`size-3 ${refreshing ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
}
