import type {
  CatalogStats,
  EngineMetrics,
  Product,
  ProductListQuery,
  QueueItem,
  QueueQuery,
  QueueStatus,
  RegenerationJob,
  ReoptStats,
  ScorePoint,
  SeoProfile,
} from "@/lib/types";
import type { AtlasDataSource } from "./source";

// In-memory stand-in for Firestore. The first products and all numbers
// come from the Figma design; the rest are invented so search, filters and
// pagination have something to work with. Delete this file once
// firebase-source.ts exists (see docs/FIREBASE.md).

// --- Dates --------------------------------------------------------------

// Mock dates are fixed, counted back from this day, so every build gives
// the same data. Real Firestore data will have real timestamps.
const MOCK_TODAY_UTC = Date.UTC(2026, 9, 28); // 28 Oct 2026 (months start at 0)
const DAY_MS = 86_400_000;

/** e.g. at(3, "14:20") → ISO string for 3 days before MOCK_TODAY at 14:20 UTC */
function at(daysAgo: number, timeUtc: string) {
  const [h, m] = timeUtc.split(":").map(Number);
  return new Date(MOCK_TODAY_UTC - daysAgo * DAY_MS + (h * 60 + m) * 60_000).toISOString();
}

// --- Products (Firestore: products/{id}) --------------------------------

// Kept in the Figma's order so the screens match the design.
const products: Product[] = [
  { id: "iphone-13-pro", name: "iPhone 13 Pro", sku: "APL-13P-SLV", category: "Phones", score: 91, status: "optimized", processedAt: at(0, "09:45") },
  { id: "hp-elitebook-840", name: "HP EliteBook 840", sku: "HPE-840-G8", category: "Computers", score: 74, status: "needs-reopt", processedAt: at(38, "11:10") },
  { id: "nike-air-max", name: "Nike Air Max", sku: "NK-AM90-BLK", category: "Fashion", score: 88, status: "optimized", processedAt: at(1, "16:30") },
  { id: "samsung-galaxy-s23", name: "Samsung Galaxy S23", sku: "SM-S23-256", category: "Phones", score: 72, status: "processing", processedAt: at(0, "08:05") },
  { id: "canon-eos-camera", name: "Canon EOS Camera", sku: "CN-EOS-R50", category: "Electronics", score: 67, status: "needs-reopt", processedAt: at(42, "13:00") },
  { id: "macbook-air-m3", name: "MacBook Air M3", sku: "APL-MBA-M3", category: "Computers", score: 94, status: "optimized", processedAt: at(0, "07:20") },
  { id: "sony-wh-1000xm5", name: "Sony WH-1000XM5", sku: "SNY-WH5-BLK", category: "Audio", score: 89, status: "optimized", processedAt: at(2, "10:15") },
  { id: "dell-xps-13", name: "Dell XPS 13", sku: "DEL-XPS13-9340", category: "Computers", score: 81, status: "optimized", processedAt: at(5, "15:40") },
  { id: "adidas-ultraboost", name: "Adidas Ultraboost 23", sku: "ADS-UB23-WHT", category: "Fashion", score: 70, status: "needs-reopt", processedAt: at(51, "09:00") },
  { id: "ipad-air-5", name: "iPad Air (5th Gen)", sku: "APL-IPA5-BLU", category: "Tablets", score: 92, status: "optimized", processedAt: at(1, "12:25") },
  { id: "jbl-flip-6", name: "JBL Flip 6", sku: "JBL-FLP6-RED", category: "Audio", score: 77, status: "processing", processedAt: at(0, "06:50") },
  { id: "tecno-camon-20", name: "Tecno Camon 20", sku: "TCN-CM20-GRN", category: "Phones", score: 63, status: "needs-reopt", processedAt: at(60, "14:35") },
  { id: "lg-oled-c3", name: 'LG OLED C3 55"', sku: "LG-C3-55", category: "Electronics", score: 86, status: "optimized", processedAt: at(3, "17:05") },
  { id: "infinix-hot-40", name: "Infinix Hot 40", sku: "INF-H40-BLK", category: "Phones", score: 79, status: "processing", processedAt: at(0, "05:30") },
  { id: "lenovo-thinkpad-x1", name: "Lenovo ThinkPad X1", sku: "LNV-X1C-G11", category: "Computers", score: 90, status: "optimized", processedAt: at(4, "08:45") },
  { id: "puma-rs-x", name: "Puma RS-X", sku: "PMA-RSX-GRY", category: "Fashion", score: 58, status: "needs-reopt", processedAt: at(73, "10:00") },
  { id: "samsung-galaxy-tab-s9", name: "Samsung Galaxy Tab S9", sku: "SM-TS9-128", category: "Tablets", score: 84, status: "optimized", processedAt: at(6, "13:55") },
  { id: "airpods-pro-2", name: "AirPods Pro 2", sku: "APL-APP2-WHT", category: "Audio", score: 93, status: "optimized", processedAt: at(0, "04:15") },
  { id: "hisense-55a6", name: "Hisense 55A6 TV", sku: "HSN-55A6", category: "Electronics", score: 71, status: "needs-reopt", processedAt: at(45, "16:20") },
  { id: "gopro-hero-12", name: "GoPro HERO12", sku: "GPR-H12-BLK", category: "Electronics", score: 87, status: "optimized", processedAt: at(2, "09:35") },
  { id: "xiaomi-redmi-note-13", name: "Xiaomi Redmi Note 13", sku: "XMI-RN13-BLU", category: "Phones", score: 76, status: "processing", processedAt: at(0, "03:40") },
  { id: "asus-rog-zephyrus", name: "ASUS ROG Zephyrus G14", sku: "ASU-G14-2024", category: "Computers", score: 83, status: "optimized", processedAt: at(8, "11:50") },
  { id: "levis-501", name: "Levi's 501 Jeans", sku: "LVS-501-IND", category: "Fashion", score: 66, status: "needs-reopt", processedAt: at(39, "12:00") },
];

// --- Aggregates (Firestore: stats/catalog, stats/engine, scoreHistory) ---

const catalogStats: CatalogStats = {
  totalProducts: 12480,
  avgScore: 86,
  optimalCount: 11920,
  activeJobs: 18,
  needsAttention: 124,
};

const scoreTrend: ScorePoint[] = [
  { label: "Week 1", score: 74 },
  { label: "Week 2", score: 78 },
  { label: "Week 3", score: 82 },
  { label: "Week 4 (Current)", score: 86 },
];

const engineMetrics: EngineMetrics = {
  cacheHitRate: 0.82,
  avgProcessingSeconds: 4.8,
  processingTargetSeconds: 10,
  costPerProductUsd: 0.03,
  costBudgetUsd: 0.05,
};

const reoptStats: ReoptStats = { stale: 124, scheduled: 85, processing: 12 };

// --- SEO profiles (Firestore: seoProfiles/{productId}) ------------------

const iphoneSeo: SeoProfile = {
  productId: "iphone-13-pro",
  ref: "#PRD-88219",
  categoryPath: "Phones & Electronics",
  indexable: true,
  httpStatus: 200,
  seoTitle: "iPhone 13 Pro 256GB Smartphone",
  slug: "/iphone-13-pro-256gb",
  focusKeyword: "iPhone 13 Pro 256GB",
  metaDescription:
    "Explore the iPhone 13 Pro 256GB smartphone, featuring an advanced camera system, powerful performance, and a premium design.",
  secondaryKeywords: ["iPhone 13 Pro price", "Apple 256GB phone", "Sierra Blue iPhone", "Pro camera smartphone"],
  entityKeywords: ["Apple A15 Bionic", "Super Retina XDR", "iOS Smartphone"],
  searchIntent: { label: "Commercial / Transactional", note: "High purchase propensity" },
  aiSummary:
    "The Apple iPhone 13 Pro 256GB features a durable surgical-grade stainless steel band, Super Retina XDR display with ProMotion 120Hz, and a triple 12MP pro camera system with Macro capability. Engineered with the A15 Bionic chip for superior multitasking and extended battery longevity.",
  imageAlt: "Apple iPhone 13 Pro 256GB Sierra Blue front and back camera preview on neutral white background",
  jsonLd: {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: "iPhone 13 Pro 256GB Smartphone",
    image: "https://iconzapp.com/cdn/products/iphone-13-pro.jpg",
    description:
      "Explore the iPhone 13 Pro 256GB smartphone, featuring an advanced camera system, powerful performance, and a premium design.",
    sku: "IPH-13P-256",
    mpn: "MLVG3LL/A",
    brand: { "@type": "Brand", name: "Apple" },
    offers: {
      "@type": "Offer",
      url: "https://iconzapp.com/p/iphone-13-pro-256gb",
      priceCurrency: "XAF",
      price: "450000",
      availability: "https://schema.org/InStock",
    },
  },
  openGraph: {
    title: "iPhone 13 Pro 256GB Smartphone",
    description: "Explore the iPhone 13 Pro 256GB smartphone, featuring an advanced camera system.",
  },
  twitter: { card: "summary_large_image", title: "iPhone 13 Pro 256GB | iConz" },
  canonicalUrl: "https://iconzapp.com/p/iphone-13-pro-256gb",
  robots: ["index", "follow"],
  robotsExtra: "max-snippet:-1",
  faqs: [
    {
      question: "What is the battery health and capacity of the iPhone 13 Pro?",
      answer:
        "The iPhone 13 Pro features a 3,095 mAh battery offering up to 22 hours of video playback with MagSafe 15W wireless charging.",
    },
    {
      question: "Does the iPhone 13 Pro support 5G connectivity?",
      answer: "Yes. The iPhone 13 Pro supports 5G (sub-6 GHz) as well as 4G LTE networks.",
    },
    {
      question: "Is this model compatible with local Cameroon carriers?",
      answer: "Yes. This unlocked model works with MTN Cameroon, Orange Cameroon and other GSM carriers.",
    },
  ],
  generation: {
    engine: "Atlas Engine v4.2-prod",
    confidence: 0.984,
    modelVersion: "atlas-seo-multimodal-v2.8",
    promptVersion: "ecom-product-seo-v5.12",
    semanticHash: "sha256:7f9b8c2d1e04a56b89c72e3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a",
  },
};

// A repeatable fake hash, so each product always shows the same value
function fakeHash(input: string) {
  let h = 2166136261;
  let out = "";
  for (let round = 0; out.length < 64; round++) {
    for (const ch of input + round) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    out += (h >>> 0).toString(16).padStart(8, "0");
  }
  return `sha256:${out.slice(0, 64)}`;
}

// Believable SEO content for products that aren't in the design
function generatedSeo(p: Product, index: number): SeoProfile {
  const brand = p.name.split(" ")[0];
  const slug = `/${p.id}`;
  const meta = `Shop the ${p.name} on iConz. Genuine ${p.category.toLowerCase()} with fast delivery across Cameroon, secure payment and warranty support.`;
  return {
    productId: p.id,
    ref: `#PRD-${88220 + index * 37}`,
    categoryPath: p.category,
    indexable: true,
    httpStatus: 200,
    seoTitle: `${p.name} | Buy Online in Cameroon`,
    slug,
    focusKeyword: p.name,
    metaDescription: meta,
    secondaryKeywords: [`${p.name} price`, `${brand} ${p.category.toLowerCase()}`, `buy ${p.name} Cameroon`],
    entityKeywords: [brand, p.category],
    searchIntent: { label: "Commercial / Transactional", note: "High purchase propensity" },
    aiSummary: `The ${p.name} is a popular choice in iConz's ${p.category.toLowerCase()} catalogue. This summary is generated from the product listing and will be refined on the next optimization run.`,
    imageAlt: `${p.name} product photo on a neutral white background`,
    jsonLd: {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: p.name,
      sku: p.sku,
      description: meta,
      brand: { "@type": "Brand", name: brand },
      offers: {
        "@type": "Offer",
        url: `https://iconzapp.com/p${slug}`,
        priceCurrency: "XAF",
        availability: "https://schema.org/InStock",
      },
    },
    openGraph: { title: p.name, description: meta.slice(0, 90) + "…" },
    twitter: { card: "summary_large_image", title: `${p.name} | iConz` },
    canonicalUrl: `https://iconzapp.com/p${slug}`,
    robots: ["index", "follow"],
    robotsExtra: "max-snippet:-1",
    faqs: [
      { question: `Is the ${p.name} genuine?`, answer: "Yes. All products sold on iConz come from verified sellers and include warranty support." },
      { question: "How long does delivery take?", answer: "Delivery usually takes 1–3 days in Douala and Yaoundé, and 3–7 days elsewhere in Cameroon." },
    ],
    generation: {
      engine: "Atlas Engine v4.2-prod",
      confidence: (90 + (p.score % 9) + 0.4) / 100,
      modelVersion: "atlas-seo-multimodal-v2.8",
      promptVersion: "ecom-product-seo-v5.12",
      semanticHash: fakeHash(p.id),
    },
  };
}

const seoProfiles = new Map<string, SeoProfile>(
  products.map((p, i) => [p.id, p.id === iphoneSeo.productId ? iphoneSeo : generatedSeo(p, i)]),
);

// --- Filtering (what Firestore queries will do later) -------------------

function matchesScore(score: number, filter: ProductListQuery["score"]) {
  if (filter === "high") return score >= 90;
  if (filter === "mid") return score >= 75 && score < 90;
  if (filter === "low") return score < 75;
  return true;
}


// --- Regeneration jobs (Firestore: regenerationJobs/{jobId}) ------------
//
// Simulates the background AI job. In production a Cloud Function would
// pick up the job document, call the AI, then write the result back.
// Here a job simply finishes JOB_DURATION_MS after it starts.
//
// Demo rule: the HP EliteBook (the product shown in the Figma) fails on its
// first attempt, so the "Failed" and "Try Again" screens can be seen.

const JOB_DURATION_MS = 3500;
const FAIL_FIRST_ATTEMPT = new Set(["hp-elitebook-840"]);

const jobs = new Map<string, RegenerationJob>();
const attempts = new Map<string, number>();
const statusBeforeJob = new Map<string, Product["status"]>();
let jobCounter = 0;

// A better score, capped below 100: 74 → 92 (+18), as in the design
function improvedScore(score: number) {
  return Math.min(98, score + Math.max(8, Math.round((95 - score) * 0.85)));
}

// Called whenever a job is read: if enough time has passed, finish it.
function settle(job: RegenerationJob): RegenerationJob {
  if (job.status !== "running" || Date.now() - Date.parse(job.requestedAt) < JOB_DURATION_MS) return job;

  const product = products.find((p) => p.id === job.productId)!;
  const attempt = attempts.get(job.productId) ?? 1;
  const finishedAt = new Date().toISOString();
  let done: RegenerationJob;

  if (FAIL_FIRST_ATTEMPT.has(job.productId) && attempt === 1) {
    product.status = statusBeforeJob.get(job.productId) ?? "needs-reopt";
    done = { ...job, status: "failed", finishedAt, error: "The automated pipeline encountered an issue." };
  } else {
    product.score = improvedScore(job.previousScore);
    product.status = "optimized";
    product.processedAt = finishedAt;
    done = { ...job, status: "succeeded", finishedAt, newScore: product.score };
  }
  jobs.set(job.id, done);
  return done;
}

// --- Re-optimization queue ------------------------------------------------
// Firestore: a query on products ordered by queue priority. Stale products
// get a scheduled next run; in Firestore that would be a stored
// `nextRunAt` field written by the scheduler.

const queueOrder: Record<QueueStatus, number> = { stale: 0, active: 1, current: 2 };

function toQueueItem(p: Product, index: number): QueueItem {
  const queueStatus: QueueStatus = p.status === "needs-reopt" ? "stale" : p.status === "processing" ? "active" : "current";
  return {
    product: p,
    queueStatus,
    // Scheduled 1–5 days after the mock "today", at 02:00 UTC (a quiet hour)
    nextRunAt: queueStatus === "stale" ? at(-((index % 5) + 1), "02:00") : null,
  };
}

function matchesOptimized(processedAt: string, filter: QueueQuery["optimized"], asOf: string) {
  if (filter === "all") return true;
  const days = (Date.parse(asOf) - Date.parse(processedAt.slice(0, 10))) / DAY_MS;
  if (filter === "7d") return days <= 7;
  if (filter === "30d") return days <= 30;
  return days > 30; // "older"
}

// --- The data source ----------------------------------------------------

export const mockSource: AtlasDataSource = {
  async getCatalogStats() {
    return catalogStats;
  },

  async getScoreTrend() {
    return scoreTrend;
  },

  async getEngineMetrics() {
    return engineMetrics;
  },

  // Firestore: orderBy("processedAt", "desc").limit(limit).
  // The mock keeps the design's order instead so the dashboard matches the Figma.
  async listRecentProducts(limit) {
    return products.slice(0, limit);
  },

  async listProducts(query) {
    const needle = query.q.toLowerCase();
    const filtered = products.filter(
      (p) =>
        (!needle ||
          p.name.toLowerCase().includes(needle) ||
          p.sku.toLowerCase().includes(needle) ||
          p.category.toLowerCase().includes(needle)) &&
        (query.status === "all" || p.status === query.status) &&
        matchesScore(p.score, query.score),
    );

    const total = filtered.length;
    const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
    const page = Math.min(query.page, pageCount); // ?page=99 shows the last page
    const start = (page - 1) * query.pageSize;
    return { rows: filtered.slice(start, start + query.pageSize), total, page, pageCount };
  },

  async listProductIds() {
    return products.map((p) => p.id);
  },

  async getProductDetail(id) {
    const product = products.find((p) => p.id === id);
    const seo = seoProfiles.get(id);
    return product && seo ? { product, seo } : null;
  },

  async getReoptStats() {
    return reoptStats;
  },

  async listReoptQueue(query) {
    const needle = query.q.toLowerCase();
    const items = products
      .map(toQueueItem)
      .filter(
        (item) =>
          (!needle || item.product.name.toLowerCase().includes(needle) || item.product.sku.toLowerCase().includes(needle)) &&
          (query.status === "all" || item.queueStatus === query.status) &&
          matchesOptimized(item.product.processedAt, query.optimized, query.asOf),
      )
      // Stale first, then active, then current (stable, so design order is kept)
      .sort((a, b) => queueOrder[a.queueStatus] - queueOrder[b.queueStatus]);

    const total = items.length;
    const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
    const page = Math.min(query.page, pageCount);
    const start = (page - 1) * query.pageSize;
    return { rows: items.slice(start, start + query.pageSize), total, page, pageCount };
  },

  async startRegeneration(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) throw new Error("Product not found");

    // Already running? Return that job instead of starting a second one.
    const existing = [...jobs.values()].find((j) => j.productId === productId && j.status === "running");
    if (existing) return settle(existing);

    attempts.set(productId, (attempts.get(productId) ?? 0) + 1);
    statusBeforeJob.set(productId, product.status);
    product.status = "processing";

    const job: RegenerationJob = {
      id: `job_${++jobCounter}_${productId}`,
      productId,
      status: "running",
      requestedAt: new Date().toISOString(),
      previousScore: product.score,
    };
    jobs.set(job.id, job);
    return job;
  },

  async getRegenerationJob(jobId) {
    const job = jobs.get(jobId);
    return job ? settle(job) : null;
  },
};
