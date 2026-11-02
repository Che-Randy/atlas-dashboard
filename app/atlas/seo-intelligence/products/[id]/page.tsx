import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductDetail, listProductIds } from "@/lib/data";
import { DetailHeader } from "@/components/product-detail/detail-header";
import { ProductOverviewCard } from "@/components/product-detail/product-overview-card";
import { GeneratedSeoData } from "@/components/product-detail/generated-seo-data";
import { GenerationDetails, StatusFooter } from "@/components/product-detail/generation-details";

// URL: /atlas/seo-intelligence/products/[id]
// The folder name [id] makes this a dynamic route: one file serves
// /products/iphone-13-pro, /products/nike-air-max, and so on.

// Tells Next.js which ids exist, so it can build these pages ahead of
// time. With Cache Components this must return at least one id. Once the
// catalog is in Firestore (12,000+ products) you'd prerender only the
// most visited ones here; the rest are built on first visit, then cached.
export async function generateStaticParams() {
  const ids = await listProductIds();
  return ids.map((id) => ({ id }));
}

// The browser tab title, e.g. "iPhone 13 Pro · Atlas"
export async function generateMetadata({ params }: PageProps<"/atlas/seo-intelligence/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const detail = await getProductDetail(id);
  return { title: detail ? detail.product.name : "Product not found" };
}

export default async function ProductDetailPage({ params }: PageProps<"/atlas/seo-intelligence/products/[id]">) {
  const { id } = await params;
  const detail = await getProductDetail(id);

  // Unknown id → show not-found.tsx
  if (!detail) notFound();
  const { product, seo } = detail;

  return (
    <div className="flex flex-col gap-3.5">
      <DetailHeader product={product} />

      {/* Phones: one column in the Figma order.
          Wide screens: SEO data on the left, product card + generation details on the right. */}
      <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[auto_1fr] lg:items-start">
        <div className="lg:col-start-2 lg:row-start-1">
          <ProductOverviewCard product={product} seo={seo} />
        </div>
        <div className="min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <GeneratedSeoData seo={seo} />
        </div>
        <div className="lg:col-start-2 lg:row-start-2">
          <GenerationDetails product={product} seo={seo} />
        </div>
      </div>

      <StatusFooter />
    </div>
  );
}
