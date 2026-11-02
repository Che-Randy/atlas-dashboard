import type { OptimizedFilter, QueueQuery, QueueStatus } from "./types";

// Turns the Re-optimization page URL (?q=…&status=stale&optimized=30d&page=2)
// into a QueueQuery, and back again. Same pattern as product-query.ts.

export const QUEUE_PAGE_SIZE = 5;

export const queueStatusOptions: readonly { value: "all" | QueueStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "stale", label: "Stale" },
  { value: "active", label: "Active" },
  { value: "current", label: "Current" },
];

export const optimizedOptions: readonly { value: OptimizedFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "older", label: "Over 30 days ago" },
];

type RawSearchParams = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** `today` is "YYYY-MM-DD"; it's passed in because reading the clock is only allowed at request time. */
export function parseQueueQuery(sp: RawSearchParams, today: string): QueueQuery {
  const status = first(sp.status);
  const optimized = first(sp.optimized);
  const page = Number.parseInt(first(sp.page), 10);
  return {
    q: first(sp.q).trim().slice(0, 100),
    status: queueStatusOptions.find((o) => o.value === status)?.value ?? "all",
    optimized: optimizedOptions.find((o) => o.value === optimized)?.value ?? "all",
    asOf: today,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: QUEUE_PAGE_SIZE,
  };
}

export function queueHref(query: QueueQuery, changes: Partial<QueueQuery>) {
  const next = { ...query, ...changes };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.status !== "all") params.set("status", next.status);
  if (next.optimized !== "all") params.set("optimized", next.optimized);
  if (next.page > 1) params.set("page", String(next.page));
  const qs = params.toString();
  return `/atlas/seo-intelligence/re-optimization${qs ? `?${qs}` : ""}`;
}
