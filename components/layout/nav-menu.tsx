"use client";

// "use client" is needed because this component uses useState and onClick.
// Everything else in the top bar is a server component.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/atlas", label: "Dashboard" },
  { href: "/atlas/seo-intelligence/products", label: "Products" },
  { href: "/atlas/seo-intelligence/re-optimization", label: "Re-optimization" },
];

export function NavMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="grid size-5 place-items-center rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.25)] hover:bg-tint"
      >
        <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
          <path d="M1.5 3h9M1.5 6h9M1.5 9h9" stroke="#0b1c30" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setOpen(false)} />
          <nav className="absolute inset-y-0 left-0 flex w-64 flex-col gap-1 bg-white p-4 shadow-xl">
            <p className="mb-2 px-2 text-[11px] font-semibold tracking-[0.55px] text-muted uppercase">
              Atlas
            </p>
            {links.map((link) => {
              const active =
                link.href === "/atlas" ? pathname === "/atlas" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-2 py-2 text-sm font-medium ${
                    active ? "bg-tint text-brand" : "text-ink hover:bg-tint/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
