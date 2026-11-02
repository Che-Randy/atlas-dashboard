import type { ProductListQuery, ScoreFilter, StatusFilter } from "./types";

// Turns the Products page URL (?q=iphone&status=optimized&score=high&page=2)
// into a ProductListQuery, and back again. No data lives here; the actual
// filtering happens in the data layer (lib/data).

export const PAGE_SIZE = 5;

export const statusOptions: readonly { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "optimized", label: "Optimized" },
  { value: "needs-reopt", label: "Action Req." },
  { value: "processing", label: "Processing" },
];

export const scoreOptions: readonly { value: ScoreFilter; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "high", label: "90+" },
  { value: "mid", label: "75–89" },
  { value: "low", label: "Below 75" },
];

type RawSearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

// URLs can contain anything, so every value is checked and falls back to a
// safe default instead of crashing on ?status=banana or ?page=-4.
export function parseProductQuery(sp: RawSearchParams): ProductListQuery {
  const status = first(sp.status);
  const score = first(sp.score);
  const page = Number.parseInt(first(sp.page), 10);
  return {
    q: first(sp.q).trim().slice(0, 100),
    status: statusOptions.find((o) => o.value === status)?.value ?? "all",
    score: scoreOptions.find((o) => o.value === score)?.value ?? "any",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: PAGE_SIZE,
  };
}

// Builds a link to the same page with some params changed, dropping
// defaults so URLs stay short (no "?status=all&score=any&page=1").
export function productsHref(query: ProductListQuery, changes: Partial<ProductListQuery>) {
  const next = { ...query, ...changes };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.status !== "all") params.set("status", next.status);
  if (next.score !== "any") params.set("score", next.score);
  if (next.page > 1) params.set("page", String(next.page));
  const qs = params.toString();
  return `/atlas/seo-intelligence/products${qs ? `?${qs}` : ""}`;
}
