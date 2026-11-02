import type { Metadata } from "next";
import { getCatalogStats, getEngineMetrics, getScoreTrend, listRecentProducts } from "@/lib/data";
import { formatCount } from "@/lib/format";
import { StatCard } from "@/components/ui/stat-card";
import { ScoreChart } from "@/components/dashboard/score-chart";
import { EnginePerformance } from "@/components/dashboard/engine-performance";
import { RecentProductsTable } from "@/components/dashboard/recent-products-table";

export const metadata: Metadata = { title: "Dashboard" };

// URL: /atlas
// The page loads its data from lib/data and passes it to components as
// props. Components never fetch, so they don't care where data comes from.
export default async function DashboardPage() {
  // Start all four requests at once instead of one after another
  const [stats, trend, engine, recent] = await Promise.all([
    getCatalogStats(),
    getScoreTrend(),
    getEngineMetrics(),
    listRecentProducts(4),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-0.5">
        <h1 className="text-xl leading-7 font-bold tracking-[-0.5px] text-ink">AI Product Intelligence</h1>
        <p className="text-xs leading-4 text-muted">
          Monitor SEO optimization, product processing, and AI engine performance.
        </p>
      </header>

      {/* 2 columns on phones (as in Figma), 4 on wide screens */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard label="Products Processed" value={formatCount(stats.totalProducts)} caption="Total catalog items" />
        <StatCard label="Avg SEO Score" value={String(stats.avgScore)} suffix="/ 100" caption="Target benchmark > 80" />
        <StatCard label="Processing Now" value={formatCount(stats.activeJobs)} caption="Active background queue" tone="brand" />
        <StatCard label="Needs Re-opt" value={formatCount(stats.needsAttention)} caption="Flagged below score 75" tone="danger" />
      </div>

      {/* Stacked on phones, side by side on wide screens */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ScoreChart trend={trend} />
        <EnginePerformance metrics={engine} />
      </div>

      <RecentProductsTable products={recent} />
    </div>
  );
}
