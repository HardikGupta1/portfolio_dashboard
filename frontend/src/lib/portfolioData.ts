import type { Stock, Sector } from "@/types/portfolio";

type RawSector = { name: string; color: string; stocks: Omit<Stock, "portfolioPct">[] };

export const RAW_PORTFOLIO: RawSector[] = [
  {
    name: "Financial Sector", color: "#3b82f6",
    stocks: [
      { id: 1,  name: "HDFC Bank",          exchange: "HDFCBANK",   purchasePrice: 1490, qty: 50,   investment: 74500,  cmp: 1700.15, presentValue: null, gainLoss: null, gainLossPct: null, pe: 18.69, latestEarnings: 91.02,  stage2: "Yes", action: null,        loading: false, error: null },
      { id: 2,  name: "Bajaj Finance",       exchange: "BAJFINANCE", purchasePrice: 6466, qty: 15,   investment: 96990,  cmp: 8419.6,  presentValue: null, gainLoss: null, gainLossPct: null, pe: 32.63, latestEarnings: 257.8,  stage2: "No",  action: "Exit",      loading: false, error: null },
      { id: 3,  name: "ICICI Bank",          exchange: "532174",     purchasePrice: 780,  qty: 84,   investment: 65520,  cmp: 1215.5,  presentValue: null, gainLoss: null, gainLossPct: null, pe: 17.68, latestEarnings: 68.72,  stage2: "Yes", action: null,        loading: false, error: null },
      { id: 4,  name: "Bajaj Housing",       exchange: "544252",     purchasePrice: 130,  qty: 504,  investment: 65520,  cmp: 112.85,  presentValue: null, gainLoss: null, gainLossPct: null, pe: 85.72, latestEarnings: 2.53,   stage2: "NA",  action: null,        loading: false, error: null },
      { id: 5,  name: "Savani Financials",   exchange: "511577",     purchasePrice: 24,   qty: 1080, investment: 25920,  cmp: 14.86,   presentValue: null, gainLoss: null, gainLossPct: null, pe: null,  latestEarnings: null,   stage2: "NA",  action: null,        loading: false, error: null },
    ],
  },
  {
    name: "Tech Sector", color: "#8b5cf6",
    stocks: [
      { id: 6,  name: "Affle India",         exchange: "AFFLE",      purchasePrice: 1151, qty: 50,   investment: 57550,  cmp: 1459.6,  presentValue: null, gainLoss: null, gainLossPct: null, pe: 55.53, latestEarnings: 26.11,  stage2: "Yes", action: null,        loading: false, error: null },
      { id: 7,  name: "LTI Mindtree",        exchange: "LTIM",       purchasePrice: 4775, qty: 16,   investment: 76400,  cmp: 4793.8,  presentValue: null, gainLoss: null, gainLossPct: null, pe: 34.69, latestEarnings: 145.92, stage2: "No",  action: null,        loading: false, error: null },
      { id: 8,  name: "KPIT Tech",           exchange: "542651",     purchasePrice: 672,  qty: 61,   investment: 40992,  cmp: 1293.1,  presentValue: null, gainLoss: null, gainLossPct: null, pe: 46.57, latestEarnings: 27.77,  stage2: "No",  action: "Must Exit", loading: false, error: null },
      { id: 9,  name: "Tata Tech",           exchange: "544028",     purchasePrice: 1072, qty: 63,   investment: 67536,  cmp: 662,     presentValue: null, gainLoss: null, gainLossPct: null, pe: 41.68, latestEarnings: 15.88,  stage2: "No",  action: "Must Exit", loading: false, error: null },
      { id: 10, name: "BLS E-Services",      exchange: "544107",     purchasePrice: 232,  qty: 191,  investment: 44312,  cmp: 152.9,   presentValue: null, gainLoss: null, gainLossPct: null, pe: 26.3,  latestEarnings: 5.8,    stage2: "Yes", action: null,        loading: false, error: null },
      { id: 11, name: "Tanla",               exchange: "532790",     purchasePrice: 1134, qty: 45,   investment: 51030,  cmp: 449.5,   presentValue: null, gainLoss: null, gainLossPct: null, pe: 11.64, latestEarnings: 39.48,  stage2: "No",  action: null,        loading: false, error: null },
    ],
  },
  {
    name: "Consumer", color: "#f59e0b",
    stocks: [
      { id: 12, name: "Dmart",               exchange: "DMART",      purchasePrice: 3777, qty: 27,   investment: 101979, cmp: 3451.1,  presentValue: null, gainLoss: null, gainLossPct: null, pe: 82.63, latestEarnings: 41.75,  stage2: "No",  action: "Must Exit", loading: false, error: null },
      { id: 13, name: "Tata Consumer",       exchange: "532540",     purchasePrice: 845,  qty: 90,   investment: 76050,  cmp: 961.1,   presentValue: null, gainLoss: null, gainLossPct: null, pe: 26.56, latestEarnings: 134.77, stage2: "No",  action: null,        loading: false, error: null },
      { id: 14, name: "Pidilite",            exchange: "500331",     purchasePrice: 2376, qty: 36,   investment: 85536,  cmp: 2730,    presentValue: null, gainLoss: null, gainLossPct: null, pe: 71.13, latestEarnings: 38.36,  stage2: "No",  action: "Must Exit", loading: false, error: null },
    ],
  },
  {
    name: "Power", color: "#10b981",
    stocks: [
      { id: 15, name: "Tata Power",          exchange: "500400",     purchasePrice: 224,  qty: 225,  investment: 50400,  cmp: 351,     presentValue: null, gainLoss: null, gainLossPct: null, pe: 29.36, latestEarnings: 11.94,  stage2: "No",  action: null,        loading: false, error: null },
      { id: 16, name: "KPI Green",           exchange: "542323",     purchasePrice: 875,  qty: 50,   investment: 43750,  cmp: 402.4,   presentValue: null, gainLoss: null, gainLossPct: null, pe: 29.26, latestEarnings: 13.75,  stage2: "No",  action: "Must Exit", loading: false, error: null },
      { id: 17, name: "Suzlon",              exchange: "532667",     purchasePrice: 44,   qty: 450,  investment: 19800,  cmp: 51.36,   presentValue: null, gainLoss: null, gainLossPct: null, pe: 61.25, latestEarnings: 0.84,   stage2: "No",  action: "Must Exit", loading: false, error: null },
      { id: 18, name: "Gensol",              exchange: "542851",     purchasePrice: 998,  qty: 45,   investment: 44910,  cmp: 372.6,   presentValue: null, gainLoss: null, gainLossPct: null, pe: 39.51, latestEarnings: 5.57,   stage2: "No",  action: "Must Exit", loading: false, error: null },
    ],
  },
  {
    name: "Pipe Sector", color: "#ec4899",
    stocks: [
      { id: 19, name: "Hariom Pipes",        exchange: "543517",     purchasePrice: 580,  qty: 60,   investment: 34800,  cmp: 355.75,  presentValue: null, gainLoss: null, gainLossPct: null, pe: 17.98, latestEarnings: 19.78,  stage2: "No",  action: "Must Exit", loading: false, error: null },
      { id: 20, name: "Astral",              exchange: "ASTRAL",     purchasePrice: 1517, qty: 56,   investment: 84952,  cmp: 1317.6,  presentValue: null, gainLoss: null, gainLossPct: null, pe: 67.13, latestEarnings: 19.59,  stage2: "No",  action: null,        loading: false, error: null },
      { id: 21, name: "Polycab",             exchange: "542652",     purchasePrice: 2818, qty: 28,   investment: 78904,  cmp: 5000,    presentValue: null, gainLoss: null, gainLossPct: null, pe: 40.91, latestEarnings: 121.97, stage2: "Yes", action: null,        loading: false, error: null },
    ],
  },
  {
    name: "Others", color: "#64748b",
    stocks: [
      { id: 22, name: "Clean Science",       exchange: "543318",     purchasePrice: 1610, qty: 32,   investment: 51520,  cmp: 1237.45, presentValue: null, gainLoss: null, gainLossPct: null, pe: 50.37, latestEarnings: 24.52,  stage2: "No",  action: "Must Exit", loading: false, error: null },
      { id: 23, name: "Deepak Nitrite",      exchange: "506401",     purchasePrice: 2248, qty: 27,   investment: 60696,  cmp: 1927.9,  presentValue: null, gainLoss: null, gainLossPct: null, pe: 41.86, latestEarnings: 37.26,  stage2: "No",  action: null,        loading: false, error: null },
      { id: 24, name: "Fine Organic",        exchange: "541557",     purchasePrice: 4284, qty: 16,   investment: 68544,  cmp: 3743,    presentValue: null, gainLoss: null, gainLossPct: null, pe: 41.86, latestEarnings: 37.26,  stage2: "No",  action: null,        loading: false, error: null },
      { id: 25, name: "Gravita",             exchange: "533282",     purchasePrice: 2037, qty: 8,    investment: 16296,  cmp: 1614.2,  presentValue: null, gainLoss: null, gainLossPct: null, pe: 41.86, latestEarnings: 37.26,  stage2: "No",  action: null,        loading: false, error: null },
      { id: 26, name: "SBI Life",            exchange: "540719",     purchasePrice: 1197, qty: 49,   investment: 58653,  cmp: 1405.45, presentValue: null, gainLoss: null, gainLossPct: null, pe: null,  latestEarnings: -5.82,  stage2: "No",  action: "Must Exit", loading: false, error: null },
    ],
  },
];

// NSE symbol → Yahoo Finance ticker
export const SYMBOL_MAP: Record<string, string> = {
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

export const TOTAL_INVESTMENT = RAW_PORTFOLIO.reduce(
  (acc, s) => acc + s.stocks.reduce((a, st) => a + st.investment, 0), 0
);
