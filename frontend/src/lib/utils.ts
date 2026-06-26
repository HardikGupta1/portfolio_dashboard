export function fmt(n: number | null | undefined, decimals = 0): string {
  if (n == null || isNaN(n)) return "—";
  return n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtPct(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "—";
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}

export function fmtInr(n: number | null | undefined, decimals = 0): string {
  if (n == null || isNaN(n)) return "—";
  return "₹" + fmt(Math.abs(n), decimals);
}

export function clx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
