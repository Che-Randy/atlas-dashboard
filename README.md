# Atlas · iConz SEO Intelligence Dashboard

Admin dashboard for Project Atlas, the AI engine that generates SEO content for iConz marketplace products. Built with **Next.js 16 (App Router)**, **TypeScript** and **Tailwind CSS v4** from the Project Atlas Figma designs.

> **Status:** UI only, running on mock data. Firebase (Firestore) will be connected later. See [docs/FIREBASE.md](docs/FIREBASE.md).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000 (redirects to /atlas)
```

Other scripts: `npm run build` (production build), `npm start` (serve the build), `npm run lint`.

## Pages

| URL | Page |
|---|---|
| `/atlas` | Dashboard: stats, score chart, engine metrics, recent products |
| `/atlas/seo-intelligence/products` | Products: search, filters and pagination, kept in the URL |
| `/atlas/seo-intelligence/products/[id]` | Product detail: generated SEO data, JSON-LD, FAQ, Regenerate SEO |
| `/atlas/seo-intelligence/re-optimization` | Re-optimization queue: stale / active / current, Re-run, auto-refresh |

## Project structure

```
app/                     Routes (folders = URLs)
  atlas/layout.tsx       Shared top bar around every Atlas page
components/
  ui/                    Reusable pieces (cards, badges, icons, RelativeTime)
  dashboard/ products/ product-detail/   Page-specific components
lib/
  types.ts               Shapes of all data (mirror Firestore documents)
  data/                  The data layer: the ONLY place pages get data from
    index.ts             Cached read functions ("use cache" + cacheTag)
    source.ts            AtlasDataSource interface
    mock-source.ts       Mock implementation (replace with Firebase)
  format.ts              Number/date display helpers
  product-query.ts       Products page URL ⇄ query
  reopt-query.ts         Re-optimization page URL ⇄ query
  actions.ts             Server Actions (writes): Regenerate SEO
docs/FIREBASE.md         How to connect Firestore
```

## Conventions

- **Pages fetch, components display.** Pages call `lib/data` and pass results down as props, so components don't know where data comes from.
- **Server components by default.** `"use client"` only where the browser is needed (filters, menu, copy button, relative dates).
- **Raw data, formatted in the UI.** The data layer stores `0.82` and ISO dates; `lib/format.ts` and `<RelativeTime>` turn them into "82%" and "Today".
- **Design tokens** (colors, fonts) live in `app/globals.css`.
