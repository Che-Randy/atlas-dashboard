import Link from "next/link";

// Which page numbers to show: always the first and last, plus the
// current page and its neighbours, with "…" for the gaps.
function pageList(page: number, pageCount: number): (number | "…")[] {
  const wanted = new Set([1, pageCount, page - 1, page, page + 1]);
  const pages = [...wanted].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

// Plain <Link>s, not buttons: each page is a real URL, so pagination
// works without JavaScript and every page can be bookmarked.
// `hrefFor` builds the link for a page number, so any list can reuse this.
export function Pagination({ page, pageCount, hrefFor }: { page: number; pageCount: number; hrefFor: (page: number) => string }) {
  const edge = "rounded-md border border-slate-200 bg-white px-[9px] py-[3px] text-xs leading-4 font-medium";
  const num = "grid size-7 place-items-center rounded-md text-xs leading-4";

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={`${edge} text-slate-700 hover:bg-slate-50`}>
          Prev
        </Link>
      ) : (
        <span className={`${edge} text-slate-400 opacity-60`}>Prev</span>
      )}

      {pageList(page, pageCount).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-xs text-slate-400">
            ...
          </span>
        ) : p === page ? (
          <span key={p} aria-current="page" className={`${num} bg-brand font-bold text-white`}>
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            className={`${num} border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50`}
          >
            {p}
          </Link>
        ),
      )}

      {page < pageCount ? (
        <Link href={hrefFor(page + 1)} className={`${edge} text-slate-700 hover:bg-slate-50`}>
          Next
        </Link>
      ) : (
        <span className={`${edge} text-slate-400 opacity-60`}>Next</span>
      )}
    </nav>
  );
}
