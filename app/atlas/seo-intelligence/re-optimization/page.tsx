import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { getReoptStats } from "@/lib/data";
import { formatCount } from "@/lib/format";
import { parseQueueQuery } from "@/lib/reopt-query";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ClockIcon } from "@/components/ui/icons";
import { QueueFilters } from "@/components/reoptimization/queue-filters";
import { QueueTable } from "@/components/reoptimization/queue-table";
import { ProductsTableSkeleton } from "@/components/products/products-table";

export const metadata: Metadata = { title: "Re-optimization" };

// URL: /atlas/seo-intelligence/re-optimization?q=…&status=…&optimized=…&page=…
// Same structure as the Products page: the heading, cards and note are sent
// straight away; the filters and table wait for the URL inside <Suspense>.
export default function ReoptimizationPage({ searchParams }: PageProps<"/atlas/seo-intelligence/re-optimization">) {
  return (
    <div className="flex flex-col gap-4 font-hanken">
      <header className="flex flex-col gap-1.5">
        <Breadcrumbs
          items={[
            { label: "Atlas", href: "/atlas" },
            { label: "SEO Intelligence", href: "/atlas/seo-intelligence/products" },
            { label: "Re-optimization" },
          ]}
        />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg leading-[22.5px] font-extrabold tracking-[-0.45px] text-slate-900">Re-optimization Management</h1>
          <p className="text-xs leading-[16.5px] text-slate-500">
            Monitor products that need refreshed SEO data and track scheduled re-optimization.
          </p>
        </div>
      </header>

      <SummaryCards />

      <div className="group flex flex-col gap-4">
        <Suspense fallback={<ProductsTableSkeleton />}>
          {searchParams.then((sp) => {
            // Reading the clock is fine here: this code runs per request,
            // after the URL is known (never during the build).
            const today = new Date().toISOString().slice(0, 10);
            const query = parseQueueQuery(sp, today);
            return (
              <>
                <QueueFilters />
                <QueueTable query={query} />
              </>
            );
          })}
        </Suspense>
      </div>

      {/* Figma: "Information & Policy Note Card" */}
      <aside className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 p-[13px]">
        <ClockIcon className="mt-0.5 size-4 shrink-0 text-brand" />
        <p className="text-[11px] leading-[17.9px] text-slate-600">
          <b className="font-bold text-slate-800">Automated Pipeline Notice:</b> Automatic scheduled re-optimization
          periodically executes in batches according to queue priority. Manually triggering a run immediately pushes the
          product to the active generation pipeline.
        </p>
      </aside>
    </div>
  );
}

async function SummaryCards() {
  const stats = await getReoptStats();
  return (
    // Figma: "Summary Metrics Row (3 cards requested)"
    <div className="grid grid-cols-3 gap-2.5">
      <TintCard
        label="Stale Products"
        value={stats.stale}
        caption="Need review"
        className="border-amber-200/80 bg-amber-50/50"
        labelColor="text-amber-800"
        captionColor="text-amber-700"
        dot="bg-amber-500"
      />
      <TintCard
        label="Scheduled"
        value={stats.scheduled}
        caption="In pipeline"
        className="border-blue-200/80 bg-blue-50/50"
        labelColor="text-blue-800"
        captionColor="text-blue-700"
        dot="bg-blue-500"
      />
      <TintCard
        label="Processing"
        value={stats.processing}
        caption="Active runs"
        className="border-indigo-200/80 bg-indigo-50/50"
        labelColor="text-indigo-800"
        captionColor="text-indigo-700"
        dot="bg-indigo-500"
      />
    </div>
  );
}

function TintCard(props: {
  label: string;
  value: number;
  caption: ReactNode;
  className: string;
  labelColor: string;
  captionColor: string;
  dot: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col justify-between gap-1 rounded-xl border p-[13px] ${props.className}`}>
      <div className="flex items-center justify-between gap-1">
        <p className={`truncate text-[11px] leading-[16.5px] font-semibold ${props.labelColor}`}>{props.label}</p>
        <span className={`size-2 shrink-0 rounded-full ${props.dot}`} />
      </div>
      <p className="flex flex-wrap items-baseline gap-x-1.5">
        <span className="text-xl leading-7 font-extrabold tracking-[-0.5px] text-slate-900">{formatCount(props.value)}</span>
        <span className={`text-[10px] leading-[15px] font-medium ${props.captionColor}`}>{props.caption}</span>
      </p>
    </div>
  );
}
