import Link from "next/link";

// Shown when page.tsx calls notFound(), e.g. /products/does-not-exist.
// It renders inside the Atlas layout, so the top bar stays.
export default function ProductNotFound() {
  return (
    <div className="mx-auto mt-12 flex max-w-sm flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-8 text-center">
      <p className="font-hanken text-4xl font-bold text-slate-300">404</p>
      <h1 className="text-sm font-bold text-slate-900">Product not found</h1>
      <p className="text-xs text-slate-500">This product doesn&apos;t exist or hasn&apos;t been indexed by Atlas yet.</p>
      <Link
        href="/atlas/seo-intelligence/products"
        className="rounded bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-dark"
      >
        Back to Products
      </Link>
    </div>
  );
}
