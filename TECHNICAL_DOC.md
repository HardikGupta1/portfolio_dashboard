# Technical Document — Portfolio Dashboard
### Octa Byte AI Pvt Ltd — Case Study Submission

---

## 1. Project Overview

A dynamic full-stack portfolio dashboard built with **Next.js 15**, **TypeScript**, and **Tailwind CSS** that displays real-time stock data for 26 NSE/BSE holdings across 6 sectors. Live prices are fetched from Yahoo Finance every 15 seconds with automatic UI refresh.


---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15.3.3 | React framework with App Router + built-in API routes |
| React | 18.3.1 | UI rendering |
| TypeScript | ^5 | Type safety across all components and hooks |
| Tailwind CSS | ^3.4 | Utility-first styling, dark theme |
| TanStack Table | ^8.17 | Headless sortable table for stock holdings |
| Recharts | ^2.12 | Pie chart for sector allocation visualization |
| Lucide React | ^0.383 | Icon library |

### Backend (Serverless via Next.js)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js Route Handler | 15.3.3 | `/api/stocks` — runs as serverless function on Vercel |
| yahoo-finance2 | 2.9.0 | Unofficial Yahoo Finance client (no API key needed) |
| In-memory Cache | native JS | 15-second TTL to prevent rate limiting |
| Promise.allSettled | native | Parallel fetch of all 26 stocks simultaneously |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Client)                    │
│                                                         │
│   usePortfolio Hook                                     │
│   ├── setInterval(15,000ms) ──► fetch("/api/stocks")   │
│   ├── computeStock()  → presentValue, gainLoss, %      │
│   ├── buildSectors()  → group by sector                │
│   └── React state    → triggers UI re-render           │
│                                                         │
│   Components                                            │
│   ├── SummaryCards   → total invested, P&L, winners    │
│   ├── PortfolioChart → Recharts pie (sector allocation)│
│   ├── SectorBlock    → collapsible sector with summary │
│   └── StockTable     → TanStack sortable table         │
└────────────────────────┬────────────────────────────────┘
                         │ GET /api/stocks (every 15s)
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js API Route Handler                   │
│              /src/app/api/stocks/route.ts               │
│                                                         │
│   1. Check in-memory cache (TTL = 15s)                 │
│      └── HIT  → return cached JSON instantly           │
│      └── MISS → fetch from Yahoo Finance               │
│                                                         │
│   2. Promise.allSettled(26 stocks in parallel)         │
│      └── yahoo-finance2.quote(ticker)    → CMP, P/E   │
│      └── yahoo-finance2.quoteSummary()   → EPS        │
│                                                         │
│   3. Store in cache → return JSON response             │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
                         ▼
              Yahoo Finance (Unofficial)
              ticker format: HDFCBANK.NS
```

---

## 4. Project Structure

```
portfolio-dashboard/
├── frontend/                          ← Main Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              ← Dashboard homepage
│   │   │   ├── layout.tsx            ← Root layout + metadata
│   │   │   ├── globals.css           ← Tailwind base + fonts
│   │   │   └── api/
│   │   │       └── stocks/
│   │   │           └── route.ts      ← Yahoo Finance API handler
│   │   ├── components/
│   │   │   ├── SummaryCards.tsx      ← Top 4 KPI cards
│   │   │   ├── SectorBlock.tsx       ← Collapsible sector row
│   │   │   ├── StockTable.tsx        ← TanStack sortable table
│   │   │   └── PortfolioChart.tsx    ← Recharts pie chart
│   │   ├── hooks/
│   │   │   └── usePortfolio.ts       ← Core data + refresh logic
│   │   ├── lib/
│   │   │   ├── portfolioData.ts      ← All 26 stocks + symbol map
│   │   │   └── utils.ts              ← fmt(), fmtPct(), fmtInr()
│   │   └── types/
│   │       └── portfolio.ts          ← TypeScript interfaces
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── backend/                           ← Standalone Express (optional)
│   └── src/index.ts                  ← Use for Railway/Render deploy
├── README.md                          ← Setup + deployment guide
├── TECHNICAL_DOC.md                   ← This file
└── vercel.json                        ← Vercel deployment config
```

---

## 5. Key Technical Challenges & Solutions

### Challenge 1 — No Official Yahoo Finance / Google Finance API

**Problem:** Both Yahoo Finance and Google Finance have no public official API. Any solution requires scraping or unofficial libraries that may change without notice.

**Solution:**
- Used `yahoo-finance2` npm library (v2.9.0 pinned for stability) — a well-maintained reverse-engineered client that calls Yahoo's internal JSON endpoints
- Pinned to v2.9.0 specifically because newer versions bundle Deno test files (`@std/testing/mock`) that break Next.js webpack bundling
- Added disclaimer in UI footer
- Fallback to spreadsheet baseline values if API fails — users always see data

---

### Challenge 2 — Rate Limiting

**Problem:** 26 stocks × refresh every 15 seconds = potential IP block from Yahoo Finance.

**Solution:**
```typescript
// In-memory cache with 15s TTL
let cacheStore: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 15_000;

if (cacheStore && Date.now() - cacheStore.timestamp < CACHE_TTL) {
  return NextResponse.json({ ...cacheStore.data, cached: true });
}
```
- All 26 stocks fetched in one batch per cycle
- Result cached server-side for 15 seconds
- Multiple browser tabs / users share the same cache — Yahoo Finance sees only 1 request per 15s

---

### Challenge 3 — Parallel Async Fetching (Performance)

**Problem:** Fetching 26 stocks sequentially = ~13 seconds wait (26 × 500ms).

**Solution:** `Promise.allSettled()` fires all requests simultaneously:
```typescript
const results = await Promise.allSettled(
  allExchanges.map((exchange) => fetchSingleStock(exchange))
);
// Total wait = ~500-800ms regardless of stock count
```
`allSettled` (not `all`) ensures one failed ticker doesn't cancel the rest.

---

### Challenge 4 — yahoo-finance2 + Next.js 15 Webpack Conflict

**Problem:** `yahoo-finance2` v2.11+ includes Deno test files that import `@std/testing/mock` — a module that doesn't exist in Node.js. This crashes Next.js webpack bundling:
```
Module not found: Can't resolve '@std/testing/mock'
```

**Solution (3-part fix):**
1. Pinned `yahoo-finance2` to `2.9.0` in `package.json`
2. Used `dynamic import()` in the API route — defers resolution to runtime, not build time
3. Added `turbopack: {}` in `next.config.js` to satisfy Next.js 15/16 Turbopack requirement

```typescript
// Dynamic import — not static, so webpack skips it at build time
const yf = (await import("yahoo-finance2")).default;
```

---

### Challenge 5 — React Version Conflict

**Problem:** `lucide-react@0.383.0` declares peer dependency `react@^16|^17|^18` — incompatible with React 19.

**Solution:** Pinned React to `18.3.1` in `package.json`:
```json
"react": "^18.3.1",
"react-dom": "^18.3.1"
```

---

### Challenge 6 — Data Transformation

**Problem:** Yahoo Finance returns raw quote objects. Dashboard needs computed fields.

**Solution:** `computeStock()` function in `usePortfolio.ts`:
```typescript
const presentValue  = cmp * qty
const gainLoss      = presentValue - investment
const gainLossPct   = (gainLoss / investment) * 100
const portfolioPct  = (investment / totalPortfolio) * 100
```
All computation happens client-side — keeps the API route lean.

---

### Challenge 7 — NSE/BSE Symbol Mapping

**Problem:** The portfolio uses BSE codes (e.g. `532174`) but Yahoo Finance needs NSE tickers with `.NS` suffix (e.g. `ICICIBANK.NS`).

**Solution:** Static mapping in `portfolioData.ts`:
```typescript
export const SYMBOL_MAP: Record<string, string> = {
  "HDFCBANK": "HDFCBANK.NS",
  "532174":   "ICICIBANK.NS",   // BSE code → NSE Yahoo ticker
  "DMART":    "DMART.NS",
  // ... all 26 stocks
};
```

---

### Challenge 8 — Performance / Unnecessary Re-renders

**Problem:** 26 stocks × 12 columns updating every 15s = expensive React reconciliation.

**Solution:**
- `useMemo` on TanStack Table column definitions — columns don't re-create on every render
- `useCallback` on `fetchLiveData` — stable reference across renders
- React's reconciler only patches DOM nodes whose values actually changed

---

## 6. Setup & Running Locally

### Prerequisites
- Node.js 18+
- npm

### Steps

```bash
# 1. Extract the zip
unzip portfolio-dashboard-v3.zip -d portfolio-dashboard

# 2. Go to frontend
cd portfolio-dashboard/frontend

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

No API keys required. `yahoo-finance2` is keyless.

---

## 7. Features Delivered

| Requirement | Status | Implementation |
|------------|--------|---------------|
| Portfolio table with all columns | ✅ | TanStack Table, `StockTable.tsx` |
| CMP from Yahoo Finance | ✅ | `yahoo-finance2.quote()` |
| P/E Ratio | ✅ | `quote.trailingPE` |
| Latest Earnings (EPS) | ✅ | `quoteSummary.defaultKeyStatistics.trailingEps` |
| Auto-refresh every 15s | ✅ | `setInterval` in `usePortfolio.ts` |
| Green/Red Gain-Loss coloring | ✅ | Tailwind `text-emerald-400` / `text-red-400` |
| Sector grouping with summaries | ✅ | `SectorBlock.tsx`, collapsible |
| Sector-level Total Investment | ✅ | Computed in `buildSectors()` |
| Sector-level Total Present Value | ✅ | Computed in `buildSectors()` |
| Sector-level Gain/Loss | ✅ | Computed in `buildSectors()` |
| Rate limit handling | ✅ | 15s server-side cache |
| Error handling | ✅ | `Promise.allSettled` + error banner |
| Responsive design | ✅ | Tailwind responsive classes |
| Sortable columns | ✅ | TanStack Table `getSortedRowModel` |
| Portfolio % per stock | ✅ | `investment / totalInvestment × 100` |
| Sector allocation chart | ✅ | Recharts `PieChart` |
| Exit / Must Exit badges | ✅ | Per-stock `action` field |
| Stage-2 badges | ✅ | Per-stock `stage2` field |

---

## 8. Known Limitations

- **Market Hours:** Live CMP only during NSE trading hours (9:15 AM – 3:30 PM IST). Outside hours, Yahoo Finance returns last closing price.
- **Unofficial API:** `yahoo-finance2` may break if Yahoo changes their internal endpoints. No SLA.
- **Cache Scope:** In-memory cache resets on server restart / cold start (Vercel serverless). First request after cold start fetches fresh data.
- **No WebSocket:** Uses `setInterval` polling. WebSocket upgrade is possible for lower latency.

---

*Built for Octa Byte AI Pvt Ltd Case Study — June 2026*