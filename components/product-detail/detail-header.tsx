import Link from "next/link";
import type { Product } from "@/lib/types";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ArrowLeftIcon, RefreshIcon } from "@/components/ui/icons";
import { DetailStatusBadge } from "./detail-status-badge";
import { RegenerateButton } from "@/components/regenerate/regenerate-button";

// Figma: "Sub-Navbar / Breadcrumb & Primary Actions"
export function DetailHeader({ product }: { product: Product }) {
  return (
    // -mx-4 -mt-4 stretches this grey strip to the edges of the page area
    <div className="-mx-4 -mt-4 flex flex-col gap-1.5 border-b border-slate-200 bg-slate-50 px-4 pt-2.5 pb-[11px]">
      <div className="flex items-center justify-between gap-3">
        <Breadcrumbs
          variant="chevron"
          items={[
            { label: "SEO Intelligence", href: "/atlas/seo-intelligence/products" },
            { label: "Products", href: "/atlas/seo-intelligence/products" },
            { label: product.name },
          ]}
        />
        <Link
          href="/atlas/seo-intelligence/products"
          className="flex shrink-0 items-center gap-1 rounded border border-slate-200 bg-white px-[11px] py-[5px] text-[11px] leading-[16.5px] font-bold text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeftIcon className="h-[7px] w-2" />
          Back to Products
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-sm leading-5 font-bold text-slate-900">Product SEO Intelligence</h1>
            <DetailStatusBadge status={product.status} />
          </div>
          <p className="text-[10px] leading-[15px] text-slate-500">
            Inspect generated SEO object, keyword signals &amp; metadata
          </p>
        </div>
        <RegenerateButton
          product={product}
          className="flex items-center gap-1.5 rounded bg-brand px-3 py-1.5 text-[11px] leading-[16.5px] font-bold text-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-brand-dark"
        >
          <RefreshIcon className="size-[10px]" />
          Regenerate SEO
        </RegenerateButton>
      </div>
    </div>
  );
}
