import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import yahooFinance from "yahoo-finance2";
import NodeCache from "node-cache";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS || 15);
const cache = new NodeCache({ stdTTL: CACHE_TTL });

app.use(cors());
app.use(express.json());

// NSE exchange code → Yahoo Finance ticker
const SYMBOL_MAP: Record<string, string> = {
  HDFCBANK: "HDFCBANK.NS",   BAJFINANCE: "BAJFINANCE.NS",
  "532174": "ICICIBANK.NS",  "544252": "BAJAJHFL.NS",
  "511577": "SAVANIFINANCIALS.NS", AFFLE: "AFFLE.NS",
  LTIM: "LTIM.NS",           "542651": "KPITTECH.NS",
  "544028": "TATATECH.NS",   "544107": "BLSE.NS",
  "532790": "TANLA.NS",      DMART: "DMART.NS",
  "532540": "TATACONSUM.NS", "500331": "PIDILITIND.NS",
  "500400": "TATAPOWER.NS",  "542323": "KPIGREEN.NS",
  "532667": "SUZLON.NS",     "542851": "GENSOL.NS",
  "543517": "HARIOMPIPE.NS", ASTRAL: "ASTRAL.NS",
  "542652": "POLYCAB.NS",    "543318": "CLEANSCI.NS",
  "506401": "DEEPAKNTR.NS",  "541557": "FINEORG.NS",
  "533282": "GRAVITA.NS",    "540719": "SBILIFE.NS",
};

async function fetchStockData(exchange: string) {
  const ticker = SYMBOL_MAP[exchange];
  if (!ticker) return { exchange, cmp: null, pe: null, latestEarnings: null, error: "Unknown symbol" };

  try {
    const [quote, summary] = await Promise.all([
      yahooFinance.quote(ticker),
      yahooFinance.quoteSummary(ticker, { modules: ["defaultKeyStatistics"] }).catch(() => null),
    ]);
    return {
      exchange,
      cmp: quote.regularMarketPrice ?? null,
      pe: quote.trailingPE ?? null,
      latestEarnings: summary?.defaultKeyStatistics?.trailingEps ?? null,
      error: null,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { exchange, cmp: null, pe: null, latestEarnings: null, error: msg };
  }
}

// GET /api/stocks?symbols=HDFCBANK,BAJFINANCE,...
app.get("/api/stocks", async (req, res) => {
  try {
    const symbolsParam = req.query.symbols as string;
    const exchanges = symbolsParam
      ? symbolsParam.split(",").map((s) => s.trim()).filter(Boolean)
      : Object.keys(SYMBOL_MAP);

    // Check cache
    const cacheKey = exchanges.sort().join(",");
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ data: cached, timestamp: new Date().toISOString(), cached: true });

    // Fetch all in parallel
    const results = await Promise.all(exchanges.map(fetchStockData));
    cache.set(cacheKey, results);

    res.json({ data: results, timestamp: new Date().toISOString(), cached: false });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", detail: String(err) });
  }
});

// GET /api/stocks/:exchange — single stock
app.get("/api/stocks/:exchange", async (req, res) => {
  const { exchange } = req.params;
  const cacheKey = `single_${exchange}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json({ ...cached as object, cached: true });

  const data = await fetchStockData(exchange);
  cache.set(cacheKey, data);
  res.json({ ...data, cached: false });
});

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
