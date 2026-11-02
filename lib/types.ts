// The shapes of all Atlas data, shared by pages, components and the data
// layer. These mirror the Firestore documents described in docs/FIREBASE.md.
//
// Rules that keep the Firebase switch painless:
// - Dates are ISO strings ("2026-10-28T09:45:00.000Z"), never Firestore
//   Timestamps or Date objects. The Firebase source converts Timestamps to
//   ISO strings, so components never see a Firebase type.
// - Store raw values (0.82, 4.8, 200) and let the UI format them
//   ("82%", "4.8s", "Yes (200 OK)").
// - Only plain JSON-friendly values, so data can pass from server to
//   client components and be cached.

export type ProductStatus = "optimized" | "needs-reopt" | "processing";

export type Product = {
  id: string; // Firestore document id, also used in the URL
  name: string;
  sku: string;
  category: string;
  score: number; // 0–100
  status: ProductStatus;
  processedAt: string; // ISO date of the last AI run
};

// Catalog-wide counters. In Firestore these live in one document
// (stats/catalog) kept up to date by a Cloud Function, because counting
// 12,000+ documents on every page view would be slow and expensive.
export type CatalogStats = {
  totalProducts: number;
  avgScore: number;
  optimalCount: number; // products with a passing score
  activeJobs: number; // AI jobs running right now
  needsAttention: number; // score below 75
};

export type ScorePoint = {
  label: string; // "Week 1", or a date once real history exists
  score: number;
};

export type EngineMetrics = {
  cacheHitRate: number; // 0–1
  avgProcessingSeconds: number;
  processingTargetSeconds: number; // used to size the progress bar
  costPerProductUsd: number;
  costBudgetUsd: number;
};

export type FaqEntry = { question: string; answer: string };

// Everything Atlas generated for one product (the Product detail page).
// Firestore: seoProfiles/{productId}
export type SeoProfile = {
  productId: string;
  ref: string; // internal number, e.g. "#PRD-88219"
  categoryPath: string;
  imageUrl?: string;
  indexable: boolean;
  httpStatus: number;

  seoTitle: string;
  slug: string;
  focusKeyword: string;
  metaDescription: string;

  secondaryKeywords: string[];
  entityKeywords: string[];
  searchIntent: { label: string; note: string };

  aiSummary: string;
  imageAlt: string;

  jsonLd: Record<string, unknown>;

  openGraph: { title: string; description: string };
  twitter: { card: string; title: string };
  canonicalUrl: string;
  robots: string[];
  robotsExtra: string;

  faqs: FaqEntry[];

  generation: {
    engine: string;
    confidence: number; // 0–1
    modelVersion: string;
    promptVersion: string;
    semanticHash: string;
  };
};

// What the Product detail page needs: the product plus its SEO profile
export type ProductDetail = { product: Product; seo: SeoProfile };

// --- Products list query ----------------------------------------------

export type StatusFilter = "all" | ProductStatus;
export type ScoreFilter = "any" | "high" | "mid" | "low";

export type ProductListQuery = {
  q: string;
  status: StatusFilter;
  score: ScoreFilter;
  page: number;
  pageSize: number;
};

export type ProductListResult = {
  rows: Product[];
  total: number;
  page: number;
  pageCount: number;
};

// --- SEO regeneration jobs ----------------------------------------------

// Regenerating SEO takes time (an AI call), so it runs as a background
// job. Firestore: regenerationJobs/{jobId}, processed by a Cloud Function.
export type RegenerationJobStatus = "running" | "succeeded" | "failed";

export type RegenerationJob = {
  id: string;
  productId: string;
  status: RegenerationJobStatus;
  requestedAt: string; // ISO
  finishedAt?: string; // ISO, set when succeeded or failed
  previousScore: number;
  newScore?: number; // set when succeeded
  error?: string; // set when failed
};

// What server actions return. Errors come back as values instead of being
// thrown, because Next.js hides thrown error messages in production.
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

// --- Re-optimization queue ----------------------------------------------

// Where a product is in the re-optimization cycle:
//   stale   = SEO is out of date; a run is scheduled
//   active  = a run is in progress right now
//   current = SEO is up to date; nothing scheduled
export type QueueStatus = "stale" | "active" | "current";

export type QueueItem = {
  product: Product;
  queueStatus: QueueStatus;
  nextRunAt: string | null; // ISO; when the scheduler will pick it up (stale only)
};

// Firestore: stats/reoptimization (kept up to date by a Cloud Function)
export type ReoptStats = {
  stale: number; // need review
  scheduled: number; // in pipeline
  processing: number; // active runs
};

export type OptimizedFilter = "all" | "7d" | "30d" | "older";

export type QueueQuery = {
  q: string;
  status: "all" | QueueStatus;
  optimized: OptimizedFilter; // when the product was last optimized
  asOf: string; // "YYYY-MM-DD": today's date, for the "Optimized" filter
  page: number;
  pageSize: number;
};

export type QueueListResult = {
  rows: QueueItem[];
  total: number;
  page: number;
  pageCount: number;
};
