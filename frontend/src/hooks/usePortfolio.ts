"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { RAW_PORTFOLIO, TOTAL_INVESTMENT } from "@/lib/portfolioData";
import type { Sector, Stock, PortfolioSummary, StockLiveData } from "@/types/portfolio";

const REFRESH_INTERVAL = 15_000;

function computeStock(raw: Omit<Stock, "portfolioPct">, live: StockLiveData | undefined, totalInv: number): Stock {
  const cmp = live?.cmp ?? raw.cmp;
  const presentValue = cmp != null ? cmp * raw.qty : null;
  const gainLoss = presentValue != null ? presentValue - raw.investment : null;
  const gainLossPct = gainLoss != null ? (gainLoss / raw.investment) * 100 : null;
  return {
    ...raw, cmp, presentValue, gainLoss, gainLossPct,
    pe: live?.pe ?? raw.pe,
    latestEarnings: live?.latestEarnings ?? raw.latestEarnings,
    portfolioPct: (raw.investment / totalInv) * 100,
    loading: false, error: live?.error ?? null,
  };
}

function buildSectors(liveMap: Map<string, StockLiveData>): Sector[] {
  return RAW_PORTFOLIO.map((rawSector) => {
    const stocks = rawSector.stocks.map((s) => computeStock(s, liveMap.get(s.exchange), TOTAL_INVESTMENT));
    const totalInvestment = stocks.reduce((a, s) => a + s.investment, 0);
    const totalPresentValue = stocks.reduce((a, s) => a + (s.presentValue ?? s.investment), 0);
    const totalGainLoss = totalPresentValue - totalInvestment;
    return { ...rawSector, stocks, totalInvestment, totalPresentValue, totalGainLoss, gainLossPct: (totalGainLoss / totalInvestment) * 100 };
  });
}

function buildSummary(sectors: Sector[]): PortfolioSummary {
  const allStocks = sectors.flatMap((s) => s.stocks);
  const totalPresentValue = sectors.reduce((a, s) => a + s.totalPresentValue, 0);
  const totalGainLoss = totalPresentValue - TOTAL_INVESTMENT;
  return {
    totalInvestment: TOTAL_INVESTMENT, totalPresentValue, totalGainLoss,
    gainLossPct: (totalGainLoss / TOTAL_INVESTMENT) * 100,
    gainers: allStocks.filter((s) => (s.gainLoss ?? 0) > 0).length,
    losers: allStocks.filter((s) => (s.gainLoss ?? 0) < 0).length,
    totalStocks: allStocks.length,
  };
}

export function usePortfolio() {
  const [sectors, setSectors] = useState<Sector[]>(() => buildSectors(new Map()));
  const [summary, setSummary] = useState<PortfolioSummary>(() => buildSummary(buildSectors(new Map())));
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLiveData = useCallback(async () => {
    try {
      const res = await fetch("/api/stocks");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const liveMap = new Map<string, StockLiveData>((json.data as StockLiveData[]).map((d) => [d.exchange, d]));
      const newSectors = buildSectors(liveMap);
      setSectors(newSectors);
      setSummary(buildSummary(newSectors));
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(`Failed to fetch live data: ${e}`);
    } finally {
      setLoading(false);
      setCountdown(REFRESH_INTERVAL / 1000);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    timerRef.current = setInterval(fetchLiveData, REFRESH_INTERVAL);
    countdownRef.current = setInterval(() => setCountdown((c) => (c <= 1 ? REFRESH_INTERVAL / 1000 : c - 1)), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [fetchLiveData]);

  return { sectors, summary, loading, error, lastUpdated, countdown, refresh: fetchLiveData };
}
