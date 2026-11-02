import Link from "next/link";
import { Fragment } from "react";
import { ChevronRightIcon } from "./icons";

type Crumb = { label: string; href?: string };

// "Atlas / SEO Intelligence / …". The last crumb is the current page,
// so it's highlighted and not a link.
// variant="chevron" is the smaller grey style used on the product page.
export function Breadcrumbs({ items, variant = "slash" }: { items: Crumb[]; variant?: "slash" | "chevron" }) {
  if (variant === "chevron") {
    return (
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-[11px] leading-[16.5px]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={item.label}>
              {i > 0 && <ChevronRightIcon className="h-[7px] w-1 shrink-0 text-slate-400" />}
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined} className="max-w-[110px] truncate font-bold text-slate-900">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="whitespace-nowrap text-slate-500 hover:text-slate-900">
                  {item.label}
                </Link>
              )}
            </Fragment>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs leading-4">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={item.label}>
            {i > 0 && <span className="font-medium text-slate-300">/</span>}
            {last || !item.href ? (
              <span aria-current={last ? "page" : undefined} className="font-semibold text-brand">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="font-medium text-slate-500 hover:text-ink">
                {item.label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
