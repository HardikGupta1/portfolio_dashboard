"use client";
import { useState } from "react";
import type { Sector } from "@/types/portfolio";
import { fmt, fmtPct, fmtInr } from "@/lib/utils";
import StockTable from "./StockTable";

export default function SectorBlock({ sector }: { sector: Sector }) {
  const [open, setOpen] = useState(true);
  const isGain = sector.totalGainLoss >= 0;

  return (
    <div className="border border-[#1e2540] rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#161b2e] hover:bg-[#1a2035] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-[3px] h-5 rounded-full" style={{ background: sector.color }} />
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: sector.color }}>
            {sector.name}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">{sector.stocks.length} stocks</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] text-slate-500 uppercase tracking-wide">Invested</p>
            <p className="font-mono text-[12px] font-semibold text-slate-200">₹{fmt(sector.totalInvestment)}</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[9px] text-slate-500 uppercase tracking-wide">Present</p>
            <p className="font-mono text-[12px] font-semibold text-slate-200">₹{fmt(sector.totalPresentValue)}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-slate-500 uppercase tracking-wide">P&L</p>
            <p className={`font-mono text-[12px] font-bold ${isGain ? "text-emerald-400" : "text-red-400"}`}>
              {isGain ? "+" : "-"}{fmtInr(sector.totalGainLoss)}{" "}
              <span className="text-[10px]">({fmtPct(sector.gainLossPct)})</span>
            </p>
          </div>
          <span className={`text-slate-400 text-sm transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
        </div>
      </button>
      {open && <StockTable stocks={sector.stocks} totalInvestment={sector.totalInvestment} />}
    </div>
  );
}
