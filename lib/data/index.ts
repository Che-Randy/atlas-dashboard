import { cacheTag } from "next/cache";
import type { ProductListQuery, QueueQuery } from "@/lib/types";
import type { AtlasDataSource } from "./source";
import { mockSource } from "./mock-source";

// THE ONLY FILE PAGES IMPORT DATA FROM.
//
// To connect Firebase, write lib/data/firebase-source.ts implementing
// AtlasDataSource, then change this one line:
const source: AtlasDataSource = mockSource;

// Every read below is cached with "use cache", so Firestore isn't queried
// on every page view, and tagged with cacheTag so a Server Action can
// refresh exactly the data it changed, e.g. updateTag(tags.product(id))
// after regenerating that product's SEO.
export const tags = {
  stats: "stats",
  products: "products",
  product: (id: string) => `product:${id}`,
};

export async function getCatalogStats() {
  "use cache";
  cacheTag(tags.stats);
  return source.getCatalogStats();
}

export async function getScoreTrend() {
  "use cache";
  cacheTag(tags.stats);
  return source.getScoreTrend();
}

export async function getEngineMetrics() {
  "use cache";
  cacheTag(tags.stats);
  return source.getEngineMetrics();
}

export async function listRecentProducts(limit = 4) {
  "use cache";
  cacheTag(tags.products);
  return source.listRecentProducts(limit);
}

export async function listProducts(query: ProductListQuery) {
  "use cache";
  cacheTag(tags.products);
  return source.listProducts(query);
}

export async function listProductIds() {
  "use cache";
  cacheTag(tags.products);
  return source.listProductIds();
}

export async function getProductDetail(id: string) {
  "use cache";
  cacheTag(tags.products, tags.product(id));
  return source.getProductDetail(id);
}

export async function getReoptStats() {
  "use cache";
  cacheTag(tags.stats);
  return source.getReoptStats();
}

export async function listReoptQueue(query: QueueQuery) {
  "use cache";
  cacheTag(tags.products); // refreshed by the same updateTag calls as products
  return source.listReoptQueue(query);
}

// --- Writes and live reads (never cached) -------------------------------
// Pages don't call these directly; the server actions in lib/actions.ts do,
// after checking the input (and, later, that the user is an admin).

export function startRegeneration(productId: string) {
  return source.startRegeneration(productId);
}

export function getRegenerationJob(jobId: string) {
  return source.getRegenerationJob(jobId);
}
