"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Sector } from "@/types/portfolio";
import { fmt } from "@/lib/utils";

export default function PortfolioChart({ sectors }: { sectors: Sector[] }) {
  const data = sectors.map((s) => ({ name: s.name, value: s.totalInvestment, color: s.color }));
  return (
    <div className="bg-[#111520] border border-[#1e2540] rounded-lg p-4">
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3">Sector Allocation</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip formatter={(v: number) => [`₹${fmt(v)}`, "Invested"]} contentStyle={{ background: "#161b2e", border: "1px solid #1e2540", borderRadius: 6, fontSize: 11 }} />
          <Legend formatter={(v) => <span style={{ fontSize: 10, color: "#94a3b8" }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
