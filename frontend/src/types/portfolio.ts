export interface Stock {
  id: number;
  name: string;
  exchange: string;
  purchasePrice: number;
  qty: number;
  investment: number;
  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  gainLossPct: number | null;
  pe: number | null;
  latestEarnings: number | null;
  portfolioPct: number;
  stage2: "Yes" | "No" | "NA";
  action: string | null;
  loading: boolean;
  error: string | null;
}

export interface Sector {
  name: string;
  color: string;
  stocks: Stock[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  gainLossPct: number;
}

export interface PortfolioSummary {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  gainLossPct: number;
  gainers: number;
  losers: number;
  totalStocks: number;
}

export interface StockLiveData {
  exchange: string;
  cmp: number | null;
  pe: number | null;
  latestEarnings: number | null;
  error?: string;
}
