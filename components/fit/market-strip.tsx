'use client'

import { useEffect, useRef, useState } from 'react'
import { NSE_HOLIDAYS } from '@/lib/fit'
import { cn } from '@/lib/utils'

/*
 * Thin market strip above the homepage hero (brief, "Landing page order" #1).
 * - Index prices come from TradingView's licensed ticker-tape widget. We never build our own feed.
 * - The "NSE Open / Closed" pill is only a clock on IST market hours (no market data).
 */

const SYMBOLS = [
  { proName: 'NSE:NIFTY', title: 'NIFTY 50' },
  { proName: 'NSE:BANKNIFTY', title: 'BANK NIFTY' },
  { proName: 'BSE:SENSEX', title: 'SENSEX' },
  { proName: 'NSE:INDIAVIX', title: 'India VIX' },
]

const STRIP_H = 'h-[46px]'

export function MarketStrip() {
  return (
    <div className="border-b border-line bg-charcoal/90">
      <div className={cn('flex items-center', STRIP_H)}>
        <NseStatus />
        <TickerTape />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ NSE clock pill */

function istParts(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return { weekday: get('weekday'), date: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

export function isNseOpen(now = new Date()) {
  const { weekday, date, minutes } = istParts(now)
  if (weekday === 'Sat' || weekday === 'Sun' || NSE_HOLIDAYS.includes(date)) return false
  return minutes >= 9 * 60 + 15 && minutes < 15 * 60 + 30
}

function NseStatus() {
  // Unknown until mounted, so the server HTML never disagrees with the visitor's clock.
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    const update = () => setOpen(isNseOpen())
    update()
    const id = window.setInterval(update, 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="flex h-full shrink-0 items-center border-r border-line px-3 sm:px-4">
      <span
        className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[10px] tracking-wider whitespace-nowrap text-paper/85 uppercase sm:text-[11px]"
        aria-live="polite"
      >
        <span className="relative flex size-1.5">
          {open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-lavender opacity-70 motion-reduce:hidden" />}
          <span className={cn('relative inline-flex size-1.5 rounded-full', open ? 'bg-lavender' : 'bg-mist/60')} />
        </span>
        <span>
          NSE {open === null ? '' : open ? 'Open' : 'Closed'}
          <span className="hidden sm:inline"> · 09:15–15:30 IST</span>
        </span>
      </span>
    </div>
  )
}

/* ----------------------------------------------------- TradingView ticker tape */

function TickerTape() {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const host = ref.current
    if (!host) return
    let cancelled = false
    let observer: MutationObserver | undefined

    // Load only after the page (and the hero) has finished loading, so the
    // third-party widget never competes with the first screen on 4G.
    const inject = () => {
      if (cancelled || host.querySelector('script')) return
      observer = new MutationObserver(() => {
        const frame = host.querySelector('iframe')
        if (frame) {
          frame.addEventListener('load', () => setReady(true), { once: true })
          observer?.disconnect()
        }
      })
      observer.observe(host, { childList: true, subtree: true })

      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
      script.async = true
      script.type = 'text/javascript'
      script.innerHTML = JSON.stringify({
        symbols: SYMBOLS,
        showSymbolLogo: false,
        isTransparent: true,
        displayMode: 'compact',
        colorTheme: 'dark',
        locale: 'en',
      })
      host.appendChild(script)
    }

    const whenIdle = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
      if (ric) ric(inject, { timeout: 2500 })
      else window.setTimeout(inject, 1200)
    }

    if (document.readyState === 'complete') whenIdle()
    else window.addEventListener('load', whenIdle, { once: true })

    return () => {
      cancelled = true
      observer?.disconnect()
      window.removeEventListener('load', whenIdle)
    }
  }, [])

  return (
    <div className="relative flex h-full min-w-0 flex-1 items-center overflow-hidden">
      {/* Placeholder labels until the widget has loaded (no prices are invented). */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center gap-8 px-4 font-mono text-[11px] tracking-wider whitespace-nowrap text-paper/45 uppercase transition-opacity duration-500',
          ready && 'opacity-0',
        )}
      >
        {SYMBOLS.map((s) => (
          <span key={s.proName}>{s.title}</span>
        ))}
      </div>
      <div ref={ref} className={cn('tradingview-widget-container w-full transition-opacity duration-500', ready ? 'opacity-100' : 'opacity-0')}>
        <div className="tradingview-widget-container__widget" />
      </div>
      <a
        href="https://www.tradingview.com/"
        target="_blank"
        rel="noopener nofollow"
        className="relative hidden h-full shrink-0 items-center border-l border-line bg-charcoal px-3 font-mono text-[10px] tracking-wider text-mist uppercase hover:text-paper md:flex"
      >
        Data: TradingView
      </a>
    </div>
  )
}
