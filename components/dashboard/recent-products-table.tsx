import Link from "next/link";
import type { Product } from "@/lib/types";
import { RelativeTime } from "@/components/ui/relative-time";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

const th = "px-2 pt-[7.75px] pb-[8.25px] text-[11px] leading-4 font-semibold text-muted whitespace-nowrap";

export function RecentProductsTable({ products }: { products: Product[] }) {
  return (
    <Card className="flex flex-col gap-3 p-[17px]">
      <CardHeader title="Recent Product Processing" subtitle="Latest evaluated catalog listings" />

      {/* overflow-x-auto lets the table scroll sideways on very narrow phones */}
      <div className="overflow-x-auto rounded border border-line">
        <table className="w-full min-w-[420px] text-left">
          <thead className="border-b border-line bg-tint">
            <tr>
              <th className={`${th} pl-2.5`}>Product</th>
              <th className={`${th} text-center`}>Score</th>
              <th className={th}>Status</th>
              <th className={th}>Processed</th>
              <th className={`${th} pr-2.5 text-right`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-line first:border-t-0">
                <td className="py-[8.5px] pr-2 pl-2.5">
                  <p className="text-xs leading-4 font-semibold text-ink">{p.name}</p>
                  <p className="font-mono text-[10px] leading-4 text-muted">{p.sku}</p>
                </td>
                <td className="px-2 text-center whitespace-nowrap">
                  <span className="font-mono text-xs font-semibold text-ink">{p.score}</span>
                  <span className="text-[10px] text-muted">/100</span>
                </td>
                <td className="px-2">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-2 text-[11px] leading-4 whitespace-nowrap text-muted">
                  <RelativeTime iso={p.processedAt} />
                </td>
                <td className="px-2.5 text-right">
                  <Link
                    href={`/atlas/seo-intelligence/products/${p.id}`}
                    className="text-xs font-semibold text-brand hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
