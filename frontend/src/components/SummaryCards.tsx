"use client";
import type { PortfolioSummary } from "@/types/portfolio";
import { fmt, fmtPct, fmtInr } from "@/lib/utils";

export default function SummaryCards({ summary }: { summary: PortfolioSummary }) {
  const isGain = summary.totalGainLoss >= 0;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#1e2540]">
      {[
        { label: "Total Invested", value: `₹${fmt(summary.totalInvestment)}`, sub: `${summary.totalStocks} holdings`, color: "text-slate-300" },
        { label: "Present Value",  value: `₹${fmt(summary.totalPresentValue)}`, sub: "Live prices", color: "text-slate-300" },
        { label: "Total P&L",      value: `${isGain ? "+" : "-"}${fmtInr(summary.totalGainLoss)}`, sub: fmtPct(summary.gainLossPct), color: isGain ? "text-emerald-400" : "text-red-400" },
        { label: "Winners / Losers", value: summary.gainers + " vs " + summary.losers, sub: `${summary.totalStocks - summary.gainers - summary.losers} flat`, color: "text-slate-300" },
      ].map((card, i) => (
        <div key={i} className="bg-[#111520] px-5 py-4 border-r border-[#1e2540] last:border-r-0">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">{card.label}</p>
          <p className={`font-mono text-xl font-bold ${card.color}`}>{card.value}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
