# 📈 Portfolio Dashboard

Dynamic stock portfolio tracker built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Node.js**.

Live prices fetched from Yahoo Finance (unofficial) every 15 seconds. P/E and EPS via `yahoo-finance2`.

---

## 🗂 Project Structure

```
portfolio-dashboard/
├── frontend/         ← Next.js app (UI + /api/stocks route)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/stocks/route.ts   ← serverless API (Yahoo Finance)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              ← main dashboard
│   │   ├── components/
│   │   │   ├── SummaryCards.tsx
│   │   │   ├── SectorBlock.tsx
│   │   │   ├── StockTable.tsx        ← TanStack Table
│   │   │   └── PortfolioChart.tsx    ← Recharts pie
│   │   ├── hooks/
│   │   │   └── usePortfolio.ts       ← auto-refresh every 15s
│   │   ├── lib/
│   │   │   ├── portfolioData.ts      ← your holdings (edit here)
│   │   │   └── utils.ts
│   │   └── types/portfolio.ts
│   └── package.json
└── backend/          ← Standalone Node.js (optional, for Railway/Render)
    ├── src/index.ts
    └── package.json
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm / yarn

### Step 1 — Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/portfolio-dashboard.git
cd portfolio-dashboard/frontend
npm install
```

### Step 2 — Run dev server

```bash
npm run dev
# Open http://localhost:3000
```

That's it! The Next.js API route handles Yahoo Finance internally — no separate backend needed for local dev.

---

## ⚙️ Update Your Holdings

Edit `frontend/src/lib/portfolioData.ts`:

```ts
// Change purchase price, qty, or add new stocks
{ id: 1, name: "HDFC Bank", exchange: "HDFCBANK", purchasePrice: 1490, qty: 50, ... }
```

Also update `SYMBOL_MAP` at the bottom of the file to map exchange codes → Yahoo Finance tickers.

---

## 🌐 Deployment

### Option A — Vercel (Recommended, Free)

Vercel hosts Next.js natively. The `/api/stocks` route becomes a serverless function.

```bash
# Install Vercel CLI
npm i -g vercel

# From the frontend directory
cd frontend
vercel

# Follow prompts:
# - Link to your Vercel account
# - Set root directory to "frontend"
# - Framework: Next.js (auto-detected)
```

Or use the dashboard:
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Click Deploy ✅

### Option B — Railway (Backend)

If you want the standalone Node.js backend deployed:

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set **Root Directory** to `backend`
3. Add env variable: `PORT=4000`
4. Railway auto-detects Node.js and runs `npm start`

Then update `frontend/.env.local`:
```
BACKEND_URL=https://your-railway-url.up.railway.app
```

### Option C — Render (Free tier)

1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo
3. Root Directory: `backend`
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`

---

## 🔄 How Live Refresh Works

```
Browser → every 15s → GET /api/stocks
Next.js API Route → Yahoo Finance (yahoo-finance2)
                  → Cache 15s (in-memory)
                  → Return { cmp, pe, eps } per stock
Browser ← update CMP, Present Value, Gain/Loss
```

- `usePortfolio` hook manages `setInterval` and React state
- Cache prevents Yahoo Finance rate-limiting
- Falls back to spreadsheet values if API fails

---

## 📊 Features

- ✅ Portfolio table with all 26 stocks across 6 sectors
- ✅ Live CMP refresh every 15 seconds
- ✅ Green/Red Gain-Loss with color coding
- ✅ Sector grouping with expandable rows
- ✅ Sortable columns (click any header)
- ✅ Sector allocation pie chart
- ✅ Stage-2 and Exit badges
- ✅ Responsive layout
- ✅ Error handling with fallback values
- ✅ 15s cache to avoid rate limits

---

## ⚠️ Disclaimer

Yahoo Finance and Google Finance do not have official public APIs.
This project uses the unofficial `yahoo-finance2` library. Data may occasionally be delayed or unavailable. Not financial advice.

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Table | TanStack Table v8 |
| Charts | Recharts |
| Data | yahoo-finance2 |
| Caching | In-memory (NodeCache) |
| Deploy | Vercel / Railway |
