import type { Metadata } from "next";
import { Suspense } from "react";
import { getCatalogStats } from "@/lib/data";
import { formatCount, formatPercent } from "@/lib/format";
import { parseProductQuery } from "@/lib/product-query";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { MetricCard } from "@/components/ui/metric-card";
import { ArchiveIcon } from "@/components/ui/icons";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductsTable, ProductsTableSkeleton } from "@/components/products/products-table";

export const metadata: Metadata = { title: "Products" };

// URL: /atlas/seo-intelligence/products?q=…&status=…&score=…&page=…
//
// In Next.js 16, `searchParams` is a Promise. The page itself stays
// synchronous so the heading and cards are sent immediately; only the
// part that needs the URL waits for it, inside <Suspense>.
export default function ProductsPage({ searchParams }: PageProps<"/atlas/seo-intelligence/products">) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <Breadcrumbs items={[{ label: "Atlas", href: "/atlas" }, { label: "SEO Intelligence" }]} />
        <span className="flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-[11px] py-[3px] text-xs leading-4 font-medium text-brand">
          <span className="size-1.5 rounded-full bg-brand" />
          Phase 1: Product Index
        </span>
      </div>

      <header className="flex flex-col gap-px">
        <h1 className="font-hanken text-base leading-[22px] font-bold tracking-[-0.4px] text-slate-900">
          SEO Intelligence — Products
        </h1>
        <p className="text-[11px] leading-[15px] text-slate-500">
          View and inspect AI-generated SEO intelligence for iConz marketplace products.
        </p>
      </header>

      <SummaryCards />

      {/* "group" lets the table react to the filters' data-pending flag */}
      <div className="group flex flex-col gap-2.5">
        <Suspense fallback={<ProductsTableSkeleton />}>
          {searchParams.then((sp) => {
            const query = parseProductQuery(sp);
            return (
              <>
                <ProductFilters />
                <ProductsTable query={query} />
              </>
            );
          })}
        </Suspense>
      </div>
    </div>
  );
}

// Its own async component so the page above can stay synchronous.
// getCatalogStats is cached, so this is part of the instant static shell.
async function SummaryCards() {
  const stats = await getCatalogStats();
  return (
    // The Figma layer is literally named "Clean 4-column responsive grid"
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      <MetricCard
        label="Total Products"
        value={formatCount(stats.totalProducts)}
        caption="Catalog index"
        icon={<ArchiveIcon className="size-[13px] text-slate-400" />}
      />
      <MetricCard
        label="Optimal Score"
        value={formatCount(stats.optimalCount)}
        caption={`${formatPercent(stats.optimalCount / stats.totalProducts, 1)} scored`}
        tone="success"
      />
      <MetricCard label="Active Queue" value={formatCount(stats.activeJobs)} caption="Active AI jobs" tone="brand" />
      <MetricCard label="Needs Attention" value={formatCount(stats.needsAttention)} caption="Score < 75" tone="danger" />
    </div>
  );
}
