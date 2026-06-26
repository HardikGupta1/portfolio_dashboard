"use client";
import { useMemo } from "react";
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  flexRender, createColumnHelper, type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import type { Stock } from "@/types/portfolio";
import { fmt, fmtPct, fmtInr } from "@/lib/utils";

const col = createColumnHelper<Stock>();

export default function StockTable({ stocks, totalInvestment }: { stocks: Stock[]; totalInvestment: number }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(() => [
    col.accessor("name", {
      header: "Stock",
      cell: (info) => {
        const s = info.row.original;
        return (
          <div>
            <span className="font-sans font-medium text-slate-100 text-[12px]">{info.getValue()}</span>
            {s.action && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                {s.action}
              </span>
            )}
            {s.stage2 === "Yes" && (
              <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                S2
              </span>
            )}
          </div>
        );
      },
    }),
    col.accessor("exchange", {
      header: "NSE/BSE",
      cell: (info) => (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
          {info.getValue()}
        </span>
      ),
    }),
    col.accessor("purchasePrice",  { header: "Buy ₹",      cell: (i) => <span className="font-mono text-[11px]">{fmt(i.getValue(), 2)}</span> }),
    col.accessor("qty",            { header: "Qty",         cell: (i) => <span className="font-mono text-[11px]">{i.getValue()}</span> }),
    col.accessor("investment",     { header: "Invested",    cell: (i) => <span className="font-mono text-[11px]">₹{fmt(i.getValue())}</span> }),
    col.accessor("portfolioPct",   { header: "Port %",      cell: (i) => <span className="font-mono text-[11px] text-slate-400">{i.getValue().toFixed(2)}%</span> }),
    col.accessor("cmp",            { header: "CMP ₹",       cell: (i) => <span className="font-mono text-[11px] text-blue-300">{fmt(i.getValue(), 2)}</span> }),
    col.accessor("presentValue",   { header: "Pres. Value", cell: (i) => <span className="font-mono text-[11px]">₹{fmt(i.getValue() ?? undefined)}</span> }),
    col.accessor("gainLoss", {
      header: "Gain/Loss",
      cell: (info) => {
        const v = info.getValue();
        const isGain = (v ?? 0) >= 0;
        return (
          <span className={`font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded ${isGain ? "text-emerald-400 bg-emerald-500/8" : "text-red-400 bg-red-500/8"}`}>
            {v != null ? `${isGain ? "+" : "-"}₹${fmt(Math.abs(v))}` : "—"}
          </span>
        );
      },
    }),
    col.accessor("gainLossPct", {
      header: "G/L %",
      cell: (info) => {
        const v = info.getValue();
        const isGain = (v ?? 0) >= 0;
        return <span className={`font-mono text-[11px] ${isGain ? "text-emerald-400" : "text-red-400"}`}>{fmtPct(v)}</span>;
      },
    }),
    col.accessor("pe",             { header: "P/E",         cell: (i) => <span className="font-mono text-[11px] text-slate-400">{fmt(i.getValue() ?? undefined, 2)}</span> }),
    col.accessor("latestEarnings", { header: "EPS",         cell: (i) => <span className="font-mono text-[11px] text-slate-400">{fmt(i.getValue() ?? undefined, 2)}</span> }),
  ], []);

  const table = useReactTable({ data: stocks, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  onClick={h.column.getToggleSortingHandler()}
                  className="px-3 py-2 text-right first:text-left nth-[2]:text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-[#111520] border-b border-[#1e2540] whitespace-nowrap cursor-pointer hover:text-slate-300 select-none"
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {{ asc: " ↑", desc: " ↓" }[h.column.getIsSorted() as string] ?? ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-blue-500/[0.03] border-b border-[#1e2540]/50 last:border-b-0">
              {row.getVisibleCells().map((cell, ci) => (
                <td key={cell.id} className={`px-3 py-2.5 ${ci === 0 ? "text-left" : ci === 1 ? "text-left" : "text-right"} whitespace-nowrap`}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
