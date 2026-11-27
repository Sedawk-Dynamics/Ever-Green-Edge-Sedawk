// Straddle ticker data, shared by the browser strip and the /api/market/straddles route.
//
// Today the strip shows ILLUSTRATIVE numbers (clearly labelled): fixed sample levels that drift
// gently in the browser. Real numbers must come from an exchange-licensed data vendor, shown at
// least 15 minutes delayed (FIT brief: never scrape NSE or copy another site's data).
// To go live: set MARKET_FEED_URL (server) and NEXT_PUBLIC_MARKET_FEED=live — see .env.example.

export type StraddleQuote = {
  symbol: string // display name, e.g. "NIFTY"
  price: number // index level
  changePct: number // vs previous close
  atm: number // at-the-money strike
  premium: number // ATM CE + PE combined, ₹ per unit
  iv: number // implied volatility, %
  dte: number // calendar days to expiry
}

type Instrument = { symbol: string; step: number; price: number; prevClose: number; iv: number; dte: number }

// Sample starting points for the illustrative strip. Not market data.
export const ILLUSTRATIVE_INSTRUMENTS: Instrument[] = [
  { symbol: 'NIFTY', step: 50, price: 24612.4, prevClose: 24509.45, iv: 12.8, dte: 4 },
  { symbol: 'BANKNIFTY', step: 100, price: 53180.1, prevClose: 53291.8, iv: 13.9, dte: 25 },
  { symbol: 'FINNIFTY', step: 50, price: 24168.35, prevClose: 24120.1, iv: 13.2, dte: 25 },
  { symbol: 'MIDCPNIFTY', step: 25, price: 12804.55, prevClose: 12851.2, iv: 15.6, dte: 25 },
  { symbol: 'SENSEX', step: 100, price: 81412.35, prevClose: 81062.9, iv: 12.5, dte: 6 },
  { symbol: 'BANKEX', step: 100, price: 60920.75, prevClose: 61104.3, iv: 14.1, dte: 27 },
]

export const atmFor = (price: number, step: number) => Math.round(price / step) * step

/** ATM straddle ≈ 0.8 · S · σ · √T (Brenner–Subrahmanyam). Keeps the sample numbers consistent. */
export const straddlePremium = (price: number, ivPct: number, dte: number) => 0.8 * price * (ivPct / 100) * Math.sqrt(Math.max(dte, 0.5) / 365)

export function quoteFor(i: Instrument): StraddleQuote {
  return {
    symbol: i.symbol,
    price: i.price,
    changePct: ((i.price - i.prevClose) / i.prevClose) * 100,
    atm: atmFor(i.price, i.step),
    premium: straddlePremium(i.price, i.iv, i.dte),
    iv: i.iv,
    dte: i.dte,
  }
}

/** Validates quotes coming from a live feed, so a bad payload can never break the page. */
export function parseQuotes(input: unknown): StraddleQuote[] | null {
  if (!Array.isArray(input)) return null
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null)
  const out: StraddleQuote[] = []
  for (const row of input.slice(0, 20)) {
    if (!row || typeof row !== 'object') return null
    const r = row as Record<string, unknown>
    const q = {
      symbol: typeof r.symbol === 'string' ? r.symbol.slice(0, 20) : null,
      price: num(r.price),
      changePct: num(r.changePct),
      atm: num(r.atm),
      premium: num(r.premium),
      iv: num(r.iv),
      dte: num(r.dte),
    }
    if (Object.values(q).some((v) => v === null)) return null
    out.push(q as StraddleQuote)
  }
  return out.length ? out : null
}
