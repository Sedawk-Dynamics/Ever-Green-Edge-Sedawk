import { parseQuotes } from '@/lib/market'

// Live data slot for the straddle ticker. Only used when NEXT_PUBLIC_MARKET_FEED=live.
// MARKET_FEED_URL must return JSON: an array of StraddleQuote (see lib/market.ts), from an
// exchange-licensed vendor, at least 15 minutes delayed. For a specific vendor's API, a small
// adapter that maps its response to that shape goes here.
export async function GET() {
  const url = process.env.MARKET_FEED_URL
  if (!url) return Response.json({ ok: false, error: 'No licensed market data feed configured' }, { status: 503 })

  try {
    const res = await fetch(url, {
      headers: process.env.MARKET_FEED_TOKEN ? { Authorization: `Bearer ${process.env.MARKET_FEED_TOKEN}` } : {},
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`Feed responded ${res.status}`)
    const quotes = parseQuotes(await res.json())
    if (!quotes) throw new Error('Feed returned an unexpected shape')
    return Response.json({ ok: true, quotes, asOf: new Date().toISOString() }, { headers: { 'Cache-Control': 'public, s-maxage=60' } })
  } catch (err) {
    console.error('[market/straddles]', err)
    return Response.json({ ok: false, error: 'Market data unavailable' }, { status: 502 })
  }
}
