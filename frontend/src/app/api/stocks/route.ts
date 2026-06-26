import { NextResponse } from "next/server";
import { RAW_PORTFOLIO, SYMBOL_MAP } from "@/lib/portfolioData";

// In-memory cache — 15s TTL
let cacheStore: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 15_000;

interface StockResult {
  exchange: string;
  cmp: number | null;
  pe: number | null;
  latestEarnings: number | null;
  error: string | null;
}

async function fetchSingleStock(exchange: string): Promise<StockResult> {
  const ticker = SYMBOL_MAP[exchange];
  if (!ticker) return { exchange, cmp: null, pe: null, latestEarnings: null, error: "No ticker mapped" };

  try {
    // Dynamic import avoids the webpack issue with @std/testing/mock at build time
    const yahooFinance = (await import("yahoo-finance2")).default;

    const quote = await yahooFinance.quote(ticker, {}, { validateResult: false });
    let eps: number | null = null;
    try {
      const summary = await yahooFinance.quoteSummary(ticker, { modules: ["defaultKeyStatistics"] }, { validateResult: false });
      eps = (summary?.defaultKeyStatistics?.trailingEps as number) ?? null;
    } catch {
      // eps not critical
    }

    return {
      exchange,
      cmp: (quote.regularMarketPrice as number) ?? null,
      pe: (quote.trailingPE as number) ?? null,
      latestEarnings: eps,
      error: null,
    };
  } catch (err: unknown) {
    return { exchange, cmp: null, pe: null, latestEarnings: null, error: String(err) };
  }
}

export async function GET() {
  // Serve cache if fresh
  if (cacheStore && Date.now() - cacheStore.timestamp < CACHE_TTL) {
    return NextResponse.json({ data: cacheStore.data, timestamp: new Date().toISOString(), cached: true });
  }

  const allExchanges = RAW_PORTFOLIO.flatMap((s) => s.stocks.map((st) => st.exchange));
  const results = await Promise.allSettled(allExchanges.map(fetchSingleStock));

  const data: StockResult[] = results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : { exchange: allExchanges[i], cmp: null, pe: null, latestEarnings: null, error: "fetch failed" }
  );

  cacheStore = { data, timestamp: Date.now() };
  return NextResponse.json({ data, timestamp: new Date().toISOString(), cached: false });
}
