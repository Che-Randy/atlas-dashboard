import Link from "next/link";
import { listProducts } from "@/lib/data";
import type { ProductListQuery } from "@/lib/types";
import { formatCount } from "@/lib/format";
import { RelativeTime } from "@/components/ui/relative-time";
import { BoltIcon } from "@/components/ui/icons";
import { RegenerateButton } from "@/components/regenerate/regenerate-button";
import { ScorePill, StatusPill } from "./product-pills";
import { TableActions } from "./table-actions";
import { Pagination } from "@/components/ui/pagination";
import { productsHref } from "@/lib/product-query";

const th = "px-2 py-1.5 text-[9px] leading-[13.5px] font-bold tracking-[0.45px] text-slate-500 uppercase whitespace-nowrap";

// Async server component: asks the data layer for one page of results
// and sends finished HTML. No product data is shipped as JavaScript.
export async function ProductsTable({ query }: { query: ProductListQuery }) {
  const { rows, total, page, pageCount } = await listProducts(query);
  const from = total === 0 ? 0 : (page - 1) * query.pageSize + 1;
  const to = Math.min(page * query.pageSize, total);

  return (
    // group-has-data-pending: while the filter bar (a sibling inside the
    // same .group) is waiting for the server, fade the table out a little
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-opacity group-has-data-pending:opacity-50">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 pt-2.5 pb-[11px]">
        <div className="flex items-center gap-2.5">
          <h2 className="font-hanken text-sm leading-5 font-bold tracking-[-0.35px] text-slate-900">
            Product SEO Intelligence
          </h2>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-[9px] py-[3px] text-[10px] leading-[15px] font-semibold text-slate-600">
            {formatCount(total)} items
          </span>
        </div>
        <TableActions rows={rows} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[460px]">
          <thead className="border-b border-slate-200 bg-slate-50/80">
            <tr>
              <th className={`${th} pl-2.5 text-left`}>Product</th>
              <th className={`${th} text-center`}>Score</th>
              <th className={`${th} text-center`}>Status</th>
              <th className={`${th} text-center`}>Processed</th>
              <th className={`${th} pr-2.5 text-right`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const needsFix = p.status === "needs-reopt";
              const href = `/atlas/seo-intelligence/products/${p.id}`;
              return (
                <tr
                  key={p.id}
                  // rows needing attention get a faint warm tint, as in the design
                  className={`border-t border-slate-100 first:border-t-0 ${
                    needsFix ? (p.score < 70 ? "bg-rose-50/20" : "bg-amber-50/20") : ""
                  }`}
                >
                  <td className="py-[7px] pr-2 pl-2.5">
                    <p className="text-[11px] leading-[13.75px] font-semibold text-slate-900">{p.name}</p>
                    <p className="flex items-center gap-1 text-[9px] leading-[13.5px] text-slate-500">
                      <span className="font-mono text-slate-600">{p.sku}</span>
                      <span>•</span>
                      <span>{p.category}</span>
                    </p>
                  </td>
                  <td className="px-2 text-center">
                    <ScorePill score={p.score} status={p.status} />
                  </td>
                  <td className="px-2 text-center">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-2 text-center text-[10px] leading-[15px] whitespace-nowrap text-slate-500">
                    <RelativeTime iso={p.processedAt} />
                  </td>
                  <td className="py-[7px] pr-2.5 pl-2">
                    <div className="flex items-center justify-end gap-1">
                      {needsFix && (
                        <RegenerateButton
                          product={p}
                          className="flex items-center gap-0.5 rounded bg-brand px-1.5 py-0.5 text-[10px] leading-[15px] font-semibold text-white hover:bg-brand-dark"
                        >
                          <BoltIcon className="h-[9px] w-[7px]" />
                          Fix
                        </RegenerateButton>
                      )}
                      <Link
                        href={href}
                        className={`rounded bg-slate-100 py-0.5 text-[10px] leading-[15px] font-semibold hover:bg-slate-200 ${
                          needsFix ? "px-1.5 text-slate-700" : "px-2 text-brand"
                        }`}
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-xs text-slate-500">
                  No products match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50/70 px-4 pt-[11px] pb-2.5">
        <p className="text-xs leading-4 text-slate-500">
          {total === 0
            ? "No products to show"
            : `Showing ${from}–${to} of ${formatCount(total)} products`}
        </p>
        <Pagination page={page} pageCount={pageCount} hrefFor={(n) => productsHref(query, { page: n })} />
      </div>
    </div>
  );
}

// Shown while the server works out the results on a first visit
export function ProductsTableSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200/80 bg-white">
      <div className="h-[51px] border-b border-slate-200" />
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-t border-slate-100 px-3 py-3 first:border-t-0">
          <div className="h-6 flex-1 rounded bg-slate-100" />
          <div className="h-4 w-12 rounded bg-slate-100" />
          <div className="h-4 w-16 rounded bg-slate-100" />
        </div>
      ))}
      <div className="h-[49px] border-t border-slate-200 bg-slate-50/70" />
    </div>
  );
}
