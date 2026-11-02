# Connecting Atlas to Firebase

The UI is finished against mock data. This guide covers what to change when
the Firestore database is ready. **No page or component needs to change.**
Only the data layer in `lib/data/` does.

## How data flows today

```
page.tsx  ──►  lib/data/index.ts  ──►  lib/data/mock-source.ts
(UI)           (cached functions)       (in-memory fake data)
```

- `lib/types.ts`: the shape of every piece of data (`Product`, `SeoProfile`, …).
- `lib/data/source.ts`: the `AtlasDataSource` interface, the list of functions a data source must provide.
- `lib/data/mock-source.ts`: today's implementation.
- `lib/data/index.ts`: the **only** file pages import from. It wraps each read in `"use cache"` + `cacheTag`, so Firestore isn't queried on every page view.

## Switching to Firebase

1. Install the Admin SDK: `npm install firebase-admin`
2. Copy `.env.example` to `.env.local` and fill in the `FIREBASE_*` values.
3. Create `lib/data/firebase-source.ts` that exports an object implementing `AtlasDataSource` (see the example below).
4. In `lib/data/index.ts`, change one line:
   ```ts
   const source: AtlasDataSource = firebaseSource; // was: mockSource
   ```
5. Delete `mock-source.ts` once everything works.

Reads happen in **server components**, so use the **Admin SDK** on the server. Credentials stay on the server, and Security Rules don't need to allow public reads.

## Firestore collections

The fields match the TypeScript types in `lib/types.ts`. Dates are Firestore `Timestamp`s in the database and get converted to ISO strings in the data source.

| Collection | Document id | Fields (type in `lib/types.ts`) | Used by |
|---|---|---|---|
| `products` | product id (e.g. `iphone-13-pro`) | `Product`: name, sku, category, score, status, processedAt, plus `nextRunAt` (set by the scheduler) | Dashboard, Products, Re-optimization queue |
| `seoProfiles` | same product id | `SeoProfile`: everything on the detail page | Product detail page |
| `stats` | `catalog` | `CatalogStats`: totalProducts, avgScore, optimalCount, activeJobs, needsAttention | Summary cards |
| `stats` | `reoptimization` | `ReoptStats`: stale, scheduled, processing | Re-optimization cards |
| `stats` | `engine` | `EngineMetrics`: cacheHitRate, avgProcessingSeconds, … | Engine Performance |
| `scoreHistory` | e.g. `2026-W43` | `ScorePoint` + `weekStart` Timestamp for ordering | SEO Performance chart |
| `regenerationJobs` | auto id | `RegenerationJob`: productId, status, requestedAt, finishedAt, previousScore, newScore, error | Regenerate SEO dialog |

**Why a `stats` document instead of counting?** Counting 12,000+ products on every page view would be slow and costly. A Cloud Function should update `stats/catalog` whenever a product changes.

## Example: one function in `firebase-source.ts`

```ts
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import type { Product, SeoProfile } from "@/lib/types";
import type { AtlasDataSource } from "./source";

const db = getFirestore(); // after initializeApp() with the env credentials

function toProduct(id: string, d: FirebaseFirestore.DocumentData): Product {
  return {
    id,
    name: d.name,
    sku: d.sku,
    category: d.category,
    score: d.score,
    status: d.status,
    processedAt: (d.processedAt as Timestamp).toDate().toISOString(), // Timestamp → ISO
  };
}

export const firebaseSource: AtlasDataSource = {
  async getProductDetail(id) {
    const [p, s] = await Promise.all([
      db.collection("products").doc(id).get(),
      db.collection("seoProfiles").doc(id).get(),
    ]);
    if (!p.exists || !s.exists) return null;
    return { product: toProduct(p.id, p.data()!), seo: { productId: id, ...s.data() } as SeoProfile };
  },
  // …the other functions from AtlasDataSource
};
```

## Regenerate SEO (writes)

The dialog calls two Server Actions in `lib/actions.ts`:

1. `startSeoRegeneration(productId)` calls `source.startRegeneration()`. With Firebase: create a `regenerationJobs` document (`status: "running"`), set the product's `status` to `"processing"`, and return the job.
2. `checkSeoRegeneration(jobId)` is polled every 1.5 s and calls `source.getRegenerationJob()`. With Firebase: read the job document.

A **Cloud Function** triggered by the new job document does the real work: call the AI, write the new `seoProfiles/{id}`, update the product's `score`, `status` and `processedAt`, then set the job to `"succeeded"` or `"failed"` with an `error`.

When a job finishes, the action calls `updateTag(...)`, so cached pages show the new score straight away. Add an admin check (Firebase Auth) at the `FIREBASE:` comment in `lib/actions.ts`: Server Actions are public endpoints.

Polling is simple and works everywhere. A later improvement is a live Firestore listener (`onSnapshot`) on the job document from the browser.

## Things to decide before going live

These come from how Firestore works, and are worth raising with the team:

1. **Search.** Firestore has no full-text search. The mock searches inside names, SKUs and categories. Options: prefix search on a lowercase `nameLower` field (cheap, only matches the start of names), or the Firebase "Search with Algolia/Typesense" extension (full search, extra cost).
2. **Pagination.** Firestore pages with cursors ("start after this document"), not page numbers. Jumping to page 40 reads and bills every document before it. Options: keep numbered pages for small filtered results, or switch to Prev/Next or "Load more" with cursors.
3. **Filtered totals.** "Showing 1–5 of 7" needs a count. Use Firestore's `count()` aggregation query, which is cheap.
4. **Indexes.** Filtering by status *and* score needs a composite index. Firestore prints a link to create it the first time the query runs.
5. **Freshness.** Cached reads refresh every 15 minutes (the `default` cache profile). After a write, Server Actions call `updateTag(...)` with the tags in `lib/data/index.ts` so the change shows immediately.

## Hosting

Firebase **App Hosting** runs full Next.js apps (server components, caching, Server Actions). Classic Firebase Hosting with a static export would **not** work, because the Products page filters on the server. Check App Hosting's supported Next.js versions before deploying.
