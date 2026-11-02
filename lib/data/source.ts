import type {
  CatalogStats,
  EngineMetrics,
  Product,
  ProductDetail,
  ProductListQuery,
  ProductListResult,
  QueueListResult,
  QueueQuery,
  RegenerationJob,
  ReoptStats,
  ScorePoint,
} from "@/lib/types";

// The contract every data source must follow. Today mock-source.ts
// implements it with in-memory data; later a firebase-source.ts will
// implement the same functions with Firestore queries. Because pages only
// talk to lib/data/index.ts, nothing in the UI changes when we switch.
export interface AtlasDataSource {
  getCatalogStats(): Promise<CatalogStats>;
  getScoreTrend(): Promise<ScorePoint[]>;
  getEngineMetrics(): Promise<EngineMetrics>;

  listRecentProducts(limit: number): Promise<Product[]>;
  listProducts(query: ProductListQuery): Promise<ProductListResult>;
  listProductIds(): Promise<string[]>;
  getProductDetail(id: string): Promise<ProductDetail | null>;

  getReoptStats(): Promise<ReoptStats>;
  listReoptQueue(query: QueueQuery): Promise<QueueListResult>;

  // Writes. Never cached: they change data or read a job's live status.
  startRegeneration(productId: string): Promise<RegenerationJob>;
  getRegenerationJob(jobId: string): Promise<RegenerationJob | null>;
}
