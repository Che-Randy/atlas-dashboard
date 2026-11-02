import Link from "next/link";
import { listReoptQueue } from "@/lib/data";
import { queueHref } from "@/lib/reopt-query";
import { formatCount } from "@/lib/format";
import type { QueueItem, QueueQuery, QueueStatus } from "@/lib/types";
import { ClockIcon } from "@/components/ui/icons";
import { Pagination } from "@/components/ui/pagination";
import { RelativeTime } from "@/components/ui/relative-time";
import { ScorePill } from "@/components/products/product-pills";
import { RegenerateButton } from "@/components/regenerate/regenerate-button";
import { AutoRefresh } from "./auto-refresh";

const th = "px-1 py-2 text-[10px] leading-4 font-bold tracking-[0.5px] text-slate-500 uppercase whitespace-nowrap";

// Figma: "Re-optimization Queue Table Card"
export async function QueueTable({ query }: { query: QueueQuery }) {
  const { rows, total, page, pageCount } = await listReoptQueue(query);
  const from = total === 0 ? 0 : (page - 1) * query.pageSize + 1;
  const to = Math.min(page * query.pageSize, total);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-opacity group-has-data-pending:opacity-50">
      <div className="flex items-center justify-between border-b border-slate-100 px-3.5 pt-2.5 pb-[11px]">
        <div className="flex items-center gap-2">
          <h2 className="font-hanken text-xs leading-4 font-bold tracking-[-0.3px] text-slate-900">Re-optimization Queue</h2>
          <span className="rounded bg-slate-100 px-1.5 text-[10px] leading-[15px] font-semibold text-slate-600">
            {formatCount(total)} items
          </span>
        </div>
        <AutoRefresh />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[476px] font-hanken">
          <thead className="border-b border-slate-100 bg-slate-50/80">
            <tr>
              <th className={`${th} pr-1 pl-3 text-left`}>Product</th>
              <th className={`${th} text-center`}>Score</th>
              <th className={`${th} text-center`}>Last</th>
              <th className={`${th} text-center`}>Status</th>
              <th className={`${th} text-center`}>Next Run</th>
              <th className={`${th} pr-3 text-right`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <Row key={item.product.id} item={item} />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-xs text-slate-500">
                  Nothing in the queue matches these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/80 px-3 pt-[9px] pb-2">
        <p className="font-hanken text-[11px] leading-[16.5px] text-slate-500">
          {total === 0 ? "No items to show" : `Showing ${from}–${to} of ${formatCount(total)} items`}
        </p>
        <Pagination page={page} pageCount={pageCount} hrefFor={(n) => queueHref(query, { page: n })} />
      </div>
    </div>
  );
}

function Row({ item }: { item: QueueItem }) {
  const { product: p, queueStatus } = item;
  const href = `/atlas/seo-intelligence/products/${p.id}`;
  return (
    <tr className={`border-t border-slate-100 first:border-t-0 ${queueStatus === "active" ? "bg-indigo-50/20" : ""}`}>
      <td className="max-w-[140px] py-2.5 pr-1 pl-3">
        <p className="truncate text-xs leading-4 font-bold text-slate-900">{p.name}</p>
        <p className="font-mono text-[10px] leading-4 text-slate-400">{p.sku}</p>
      </td>
      <td className="px-1 text-center">
        <ScorePill score={p.score} status={p.status} />
      </td>
      <td className="px-1 text-center text-[11px] leading-4 whitespace-nowrap text-slate-500">
        <RelativeTime iso={p.processedAt} />
      </td>
      <td className="px-1 text-center">
        <QueuePill status={queueStatus} />
      </td>
      <td className="px-1 text-center text-[11px] leading-4 whitespace-nowrap">
        <NextRun item={item} />
      </td>
      <td className="py-2.5 pr-3 pl-1">
        <div className="flex items-center justify-end gap-1">
          {queueStatus === "stale" && (
            // Runs now instead of waiting for the schedule: opens the shared Regenerate SEO dialog
            <RegenerateButton
              product={p}
              className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] leading-4 font-semibold text-brand hover:bg-brand/20"
            >
              Re-run
            </RegenerateButton>
          )}
          {queueStatus === "active" && <span className="px-1.5 text-[10px] leading-4 text-slate-400 italic">Running</span>}
          <Link href={href} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] leading-4 font-medium text-slate-700 hover:bg-slate-200">
            View
          </Link>
        </div>
      </td>
    </tr>
  );
}

const pillStyles: Record<QueueStatus, { label: string; pill: string; dot: string }> = {
  stale: { label: "Stale", pill: "border-amber-200 bg-amber-100/80 text-amber-800", dot: "bg-amber-500" },
  active: { label: "Active", pill: "border-indigo-200 bg-indigo-100 text-indigo-800", dot: "bg-indigo-600" },
  current: { label: "Current", pill: "border-emerald-200 bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" },
};

function QueuePill({ status }: { status: QueueStatus }) {
  const s = pillStyles[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-[7px] py-[3px] text-[10px] leading-4 font-semibold whitespace-nowrap ${s.pill}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function NextRun({ item }: { item: QueueItem }) {
  if (item.queueStatus === "active") return <span className="font-medium text-indigo-700">In progress</span>;
  if (!item.nextRunAt) return <span className="text-slate-400">None</span>;
  // The full date is in the tooltip; the column is too narrow for it
  const when = new Date(item.nextRunAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
  return (
    <span className="inline-flex items-center gap-1 font-medium text-blue-700" title={`Scheduled for ${when} UTC`}>
      <ClockIcon className="size-3" />
      Sched.
    </span>
  );
}
