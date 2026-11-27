'use client'

import { useEffect, useState } from 'react'
import { ILLUSTRATIVE_INSTRUMENTS, parseQuotes, quoteFor, type StraddleQuote } from '@/lib/market'
import { cn } from '@/lib/utils'

/*
 * Moving straddle ticker below the header: index, price, % change, ATM strike,
 * ATM straddle premium, IV and days to expiry, scrolling continuously.
 *
 * ILLUSTRATIVE by default (sample numbers drifting gently, labelled as such). With
 * NEXT_PUBLIC_MARKET_FEED=live it polls /api/market/straddles (licensed, delayed feed)
 * and labels itself "Delayed data · for education only", per the FIT brief.
 */

const LIVE = process.env.NEXT_PUBLIC_MARKET_FEED === 'live'
const UP = 'text-[#22c55e]' // green/red only for market up/down (brief)
const DOWN = 'text-[#f43f5e]'

const fmtPrice = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmt2 = (n: number) => n.toFixed(2)

type Row = StraddleQuote & { tick?: 'up' | 'down' }

function useQuotes() {
  const [instruments, setInstruments] = useState(ILLUSTRATIVE_INSTRUMENTS)
  const [live, setLive] = useState<StraddleQuote[] | null>(null)
  const [ticks, setTicks] = useState<Record<string, 'up' | 'down'>>({})

  // Illustrative mode: nudge one or two instruments every ~1.4s so the strip feels alive.
  useEffect(() => {
    if (LIVE || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setInstruments((prev) => {
        const next = prev.slice()
        const changed: Record<string, 'up' | 'down'> = {}
        const count = Math.random() < 0.5 ? 1 : 2
        for (let k = 0; k < count; k++) {
          const i = Math.floor(Math.random() * next.length)
          const cur = next[i]
          const delta = cur.price * (Math.random() - 0.48) * 0.0009
          next[i] = { ...cur, price: cur.price + delta, iv: Math.min(30, Math.max(8, cur.iv + (Math.random() - 0.5) * 0.06)) }
          changed[cur.symbol] = delta >= 0 ? 'up' : 'down'
        }
        setTicks(changed)
        return next
      })
    }, 1400)
    return () => window.clearInterval(id)
  }, [])

  // Live mode: poll the licensed feed once a minute; keep the last good data on errors.
  useEffect(() => {
    if (!LIVE) return
    let stop = false
    const load = async () => {
      try {
        const res = await fetch('/api/market/straddles')
        const data = await res.json()
        const quotes = parseQuotes(data?.quotes)
        if (!stop && quotes) setLive(quotes)
      } catch {
        // keep showing the last good data
      }
    }
    load()
    const id = window.setInterval(load, 60_000)
    return () => {
      stop = true
      window.clearInterval(id)
    }
  }, [])

  const rows: Row[] = (live ?? instruments.map(quoteFor)).map((q) => ({ ...q, tick: ticks[q.symbol] }))
  return { rows, isLive: !!live }
}

function Pill({ q }: { q: Row }) {
  const up = q.changePct >= 0
  return (
    <li className="flex shrink-0 items-center gap-3 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-[13px] whitespace-nowrap">
      <span className="font-semibold tracking-wide text-paper">{q.symbol}</span>
      <span
        className={cn(
          'rounded px-1 font-medium tabular-nums transition-colors duration-500',
          up ? UP : DOWN,
          q.tick === 'up' && 'bg-[#22c55e]/15',
          q.tick === 'down' && 'bg-[#f43f5e]/15',
        )}
      >
        {fmtPrice.format(q.price)}
      </span>
      <span className={cn('font-medium tabular-nums', up ? UP : DOWN)}>
        {up ? '+' : ''}
        {fmt2(q.changePct)} %
      </span>
      <span aria-hidden className="h-4 w-px bg-line" />
      <span className="font-mono text-[11px] text-mist">ATM</span>
      <span className="font-semibold text-paper tabular-nums">{q.atm}</span>
      <span className="text-paper tabular-nums">{fmt2(q.premium)}</span>
      <span className="text-mist tabular-nums">{fmt2(q.iv)}%</span>
      <span className="text-mist tabular-nums">{Math.round(q.dte)}d</span>
    </li>
  )
}

export function StraddleTicker() {
  const { rows, isLive } = useQuotes()
  const label = isLive ? 'Delayed data · for education only' : 'Illustrative · not live prices'

  return (
    <div className="ticker relative z-40 flex h-11 items-center border-b border-line bg-[#141519]" aria-label={`Straddle watch: ${label}`} role="region">
      <span className="flex h-full shrink-0 flex-col items-start justify-center border-r border-line px-3 font-mono uppercase sm:px-4">
        <span className="text-[11px] font-medium tracking-[0.2em] text-lavender">Watch</span>
        {/* Small screens: the label lives here so it never covers the page below. */}
        <span className="text-[8px] leading-tight tracking-widest text-mist sm:hidden">{isLive ? 'Delayed' : 'Illustrative'}</span>
      </span>

      <div className="relative h-full min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
        <div className="animate-ticker flex h-full w-max items-center">
          {/* Two identical sets so the loop is seamless; the copy is hidden from screen readers. */}
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex h-full items-center gap-3 pr-3">
              {rows.map((q) => (
                <Pill key={q.symbol} q={q} />
              ))}
            </ul>
          ))}
        </div>
      </div>

      <span
        title={isLive ? 'Delayed market data from a licensed vendor. For education only.' : 'Sample numbers for illustration. Not live market prices.'}
        className="hidden h-full shrink-0 items-center border-l border-line px-4 font-mono text-[10px] tracking-widest text-lavender uppercase sm:flex"
      >
        {isLive ? 'Delayed · education only' : 'Illustrative'}
      </span>
    </div>
  )
}
