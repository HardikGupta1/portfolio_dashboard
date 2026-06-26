"use client";
import { usePortfolio } from "@/hooks/usePortfolio";
import SummaryCards from "@/components/SummaryCards";
import SectorBlock from "@/components/SectorBlock";
import PortfolioChart from "@/components/PortfolioChart";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

export default function Home() {
  const { sectors, summary, loading, error, lastUpdated, countdown, refresh } = usePortfolio();

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-200">
      {/* Header */}
      <header className="border-b border-[#1e2540] bg-gradient-to-b from-[#0d1220] to-[#0a0d14] px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur">
        <div>
          <h1 className="text-[17px] font-bold tracking-tight text-white">Portfolio Dashboard</h1>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            NSE/BSE · Live prices every 15s
          </p>
        </div>
        <div className="flex items-center gap-4">
          {error ? (
            <div className="flex items-center gap-1.5 text-red-400 text-[11px] font-mono">
              <WifiOff size={12} /> <span>Offline</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <Wifi size={12} />
              <span>Next: {countdown}s</span>
            </div>
          )}
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#161b2e] border border-[#1e2540] text-slate-400 hover:text-white hover:border-blue-500/40 transition-all text-[11px] font-mono"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          {lastUpdated && (
            <span className="text-[10px] text-slate-600 font-mono hidden md:block">
              {lastUpdated.toLocaleTimeString("en-IN")}
            </span>
          )}
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="mx-4 mt-3 px-4 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono">
          ⚠ {error} — Showing last known values.
        </div>
      )}

      {/* Summary */}
      <SummaryCards summary={summary} />

      {/* Chart + Sector summary row */}
      <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <PortfolioChart sectors={sectors} />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 content-start">
          {sectors.map((s) => {
            const isGain = s.totalGainLoss >= 0;
            return (
              <div key={s.name} className="bg-[#111520] border border-[#1e2540] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.name}</span>
                </div>
                <p className={`font-mono text-[13px] font-bold ${isGain ? "text-emerald-400" : "text-red-400"}`}>
                  {isGain ? "+" : ""}₹{Math.round(s.totalGainLoss).toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">{s.gainLossPct.toFixed(2)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sectors */}
      <div className="px-4 pb-8">
        <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold mb-3">Holdings by Sector</p>
        {loading && sectors.every((s) => s.stocks.every((st) => st.cmp === st.cmp)) ? (
          <div className="text-center py-12 text-slate-600 font-mono text-sm animate-pulse">Loading live prices…</div>
        ) : (
          sectors.map((sector) => <SectorBlock key={sector.name} sector={sector} />)
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1e2540] px-6 py-3 text-[10px] text-slate-600 font-mono flex flex-wrap justify-between gap-2">
        <span>⚠ Data from Yahoo Finance (unofficial). Not financial advice.</span>
        <span>Built with Next.js 14 · TanStack Table · Recharts</span>
      </footer>
    </div>
  );
}
