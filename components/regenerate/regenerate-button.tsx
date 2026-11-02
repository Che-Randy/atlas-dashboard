"use client";

import type { ReactNode } from "react";
import { useRegenerateSeo, type RegenerateTarget } from "./regenerate-provider";

// A button that opens the Regenerate SEO dialog for one product. It's a
// tiny client component, so server components (like the products table)
// can use it without becoming client components themselves.
export function RegenerateButton({
  product,
  className,
  children,
}: {
  product: RegenerateTarget;
  className?: string;
  children: ReactNode;
}) {
  const { open } = useRegenerateSeo();
  return (
    <button
      type="button"
      className={className}
      // Only send what the dialog needs, not the whole product
      onClick={() => open({ id: product.id, name: product.name, sku: product.sku, score: product.score, status: product.status })}
    >
      {children}
    </button>
  );
}
