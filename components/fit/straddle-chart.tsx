'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { ILLUSTRATIVE_INSTRUMENTS, atmFor } from '@/lib/market'
import { cn } from '@/lib/utils'

/*
 * Hero visual: an ILLUSTRATIVE intraday ATM straddle chart (CE + PE combined), in the style of
 * straddle-chart sites. All numbers are simulated (seeded, so server and browser match) and the
 * card is labelled "Illustrative" — no market data is used (FIT brief: never scrape NSE).
 * The session "plays" forward: a new 5-minute point appears every ~1.2s, then it loops.
 * Hover shows a crosshair with time, straddle, CE and PE.
 */

const TABS = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'SENSEX'] as const
type Tab = (typeof TABS)[number]

const N = 76 // 09:15 → 15:30 in 5-minute steps
const START = 46 // points visible on load (≈ 13:00)
const W = 560
const H = 250
const PAD = { l: 8, r: 58, t: 14, b: 26 }
const plotW = W - PAD.l - PAD.r
const plotH = H - PAD.t - PAD.b

const UP = '#22c55e' // green/red only for market up/down (brief)
const DOWN = '#f43f5e'

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Standard normal CDF (Abramowitz & Stegun 7.1.26).
function ncdf(z: number) {
  const t = 1 / (1 + 0.3275911 * (Math.abs(z) / Math.SQRT2))
  const erf = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2)
  return z >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf)
}

/** Black–Scholes call (r = 0); put by parity. */
function legs(s: number, k: number, iv: number, years: number) {
  const v = iv * Math.sqrt(years)
  const d1 = (Math.log(s / k) + 0.5 * v * v) / v
  const call = s * ncdf(d1) - k * ncdf(d1 - v)
  return { ce: call, pe: call - s + k }
}

const timeAt = (i: number) => {
  const m = 9 * 60 + 15 + i * 5
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

type Series = { strike: number; dte: number; spot: number[]; ce: number[]; pe: number[]; st: number[]; iv: number[] }

function buildSeries(symbol: Tab, seed: number): Series {
  const inst = ILLUSTRATIVE_INSTRUMENTS.find((i) => i.symbol === symbol)!
  const r = mulberry32(seed)
  let s = inst.prevClose * (1 + (r() - 0.5) * 0.004) // opening gap
  const strike = atmFor(s, inst.step)
  let iv = inst.iv / 100
  const out: Series = { strike, dte: inst.dte, spot: [], ce: [], pe: [], st: [], iv: [] }
  for (let i = 0; i < N; i++) {
    if (i > 0) {
      s *= 1 + (r() - 0.5) * 0.0024 + (r() < 0.04 ? (r() - 0.5) * 0.006 : 0) // drift + occasional jump
      iv = Math.max(0.07, iv + (r() - 0.5) * 0.0016 + (inst.iv / 100 - iv) * 0.05)
    }
    const years = Math.max(inst.dte - (i / (N - 1)) * (6.25 / 24), 0.05) / 365
    const { ce, pe } = legs(s, strike, iv, years)
    out.spot.push(s)
    out.ce.push(ce)
    out.pe.push(pe)
    out.st.push(ce + pe)
    out.iv.push(iv * 100)
  }
  return out
}

const fmt = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const path = (vals: number[], x: (i: number) => number, y: (v: number) => number) =>
  vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')

export function StraddleChart() {
  const reduce = useReducedMotion()
  const [tab, setTab] = useState<Tab>('NIFTY')
  const [visible, setVisible] = useState(START)
  const [hover, setHover] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const series = useMemo(() => buildSeries(tab, 17 + TABS.indexOf(tab) * 101), [tab])

  // "Play" the session forward; loop back after the close.
  useEffect(() => {
    setVisible(START)
    if (reduce) return
    let pause = 0
    const id = window.setInterval(() => {
      setVisible((v) => {
        if (v < N) return v + 1
        pause++
        if (pause > 3) {
          pause = 0
          return START
        }
        return v
      })
    }, 1200)
    return () => window.clearInterval(id)
  }, [tab, reduce])

  const n = visible
  const st = series.st.slice(0, n)
  const ce = series.ce.slice(0, n)
  const pe = series.pe.slice(0, n)
  const all = [...st, ...ce, ...pe]
  const lo = Math.min(...all)
  const hi = Math.max(...all)
  const pad = (hi - lo) * 0.12 || 1
  const yMin = Math.max(0, lo - pad)
  const yMax = hi + pad

  const x = (i: number) => PAD.l + (i / (N - 1)) * plotW
  const y = (v: number) => PAD.t + ((yMax - v) / (yMax - yMin)) * plotH

  const last = n - 1
  const lastSt = st[last]
  const change = lastSt - st[0]
  const changePct = (change / st[0]) * 100
  const up = change >= 0
  const spotChange = ((series.spot[last] - series.spot[0]) / series.spot[0]) * 100
  const ticks = Array.from({ length: 4 }, (_, k) => yMin + ((k + 0.5) / 4) * (yMax - yMin))

  const stPath = path(st, x, y)
  const area = `${stPath} L${x(last).toFixed(1)} ${PAD.t + plotH} L${x(0).toFixed(1)} ${PAD.t + plotH} Z`
  const hi_ = hover !== null && hover <= last ? hover : null

  function onMove(e: PointerEvent<SVGSVGElement>) {
    const box = svgRef.current?.getBoundingClientRect()
    if (!box) return
    const vx = ((e.clientX - box.left) / box.width) * W
    const i = Math.round(((vx - PAD.l) / plotW) * (N - 1))
    setHover(i >= 0 && i <= last ? i : null)
  }

  return (
    <figure
      className="relative overflow-hidden rounded-xl border border-line bg-surface/85 shadow-2xl shadow-black/50 backdrop-blur"
      aria-label={`Illustrative intraday ${tab} at-the-money straddle chart with simulated data. Not live prices.`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="truncate font-mono text-[11px] tracking-[0.16em] text-paper/80 uppercase">
          {tab} ATM straddle · {series.strike} CE + PE
        </p>
        <span className="shrink-0 rounded-sm border border-lavender/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-lavender uppercase">
          Illustrative
        </span>
      </div>

      {/* Index tabs */}
      <div role="tablist" aria-label="Index" className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              'shrink-0 rounded-md px-3 py-1 font-mono text-[11px] tracking-wider transition-colors',
              tab === t ? 'bg-lavender/15 text-lavender' : 'text-mist hover:bg-charcoal hover:text-paper',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Readout */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-5 pt-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-mist uppercase">Straddle premium · {timeAt(last)} IST</p>
          <p className="mt-1 flex items-baseline gap-3">
            <span className="font-mono text-3xl font-medium text-paper tabular-nums">{fmt.format(lastSt)}</span>
            <span className="font-mono text-sm tabular-nums" style={{ color: up ? UP : DOWN }}>
              {up ? '+' : ''}
              {fmt.format(change)} ({up ? '+' : ''}
              {changePct.toFixed(2)}%)
            </span>
          </p>
        </div>
        <dl className="flex gap-5 font-mono text-[11px] tabular-nums">
          <div>
            <dt className="text-mist">SPOT</dt>
            <dd className="mt-0.5" style={{ color: spotChange >= 0 ? UP : DOWN }}>
              {fmt.format(series.spot[last])}
            </dd>
          </div>
          <div>
            <dt className="text-mist">IV</dt>
            <dd className="mt-0.5 text-paper">{series.iv[last].toFixed(2)}%</dd>
          </div>
          <div>
            <dt className="text-mist">EXPIRY</dt>
            <dd className="mt-0.5 text-paper">{series.dte}d</dd>
          </div>
        </dl>
      </div>

      {/* Chart */}
      <div className="px-2 pt-2 sm:px-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-none"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          aria-hidden
        >
          <defs>
            <linearGradient id="sc-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--lavender)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--lavender)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid + right axis */}
          {ticks.map((v) => (
            <g key={v}>
              <line x1={PAD.l} x2={PAD.l + plotW} y1={y(v)} y2={y(v)} stroke="var(--paper)" strokeOpacity="0.06" strokeDasharray="3 5" />
              <text x={PAD.l + plotW + 8} y={y(v) + 3} fill="var(--mist)" fontSize="10" fontFamily="var(--font-plex-mono)">
                {v.toFixed(0)}
              </text>
            </g>
          ))}
          {[0, 21, 45, 75].map((i) => (
            <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === 75 ? 'end' : 'middle'} fill="var(--mist)" fontSize="10" fontFamily="var(--font-plex-mono)">
              {timeAt(i)}
            </text>
          ))}

          {/* CE and PE legs */}
          <path d={path(ce, x, y)} fill="none" stroke="var(--paper)" strokeOpacity="0.55" strokeWidth="1.2" strokeLinejoin="round" />
          <path d={path(pe, x, y)} fill="none" stroke="var(--mist)" strokeOpacity="0.75" strokeWidth="1.2" strokeDasharray="4 3" strokeLinejoin="round" />

          {/* Straddle (CE + PE) */}
          <path d={area} fill="url(#sc-area)" />
          <motion.path
            key={tab}
            d={stPath}
            fill="none"
            stroke="var(--lavender)"
            strokeWidth="2.2"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Last value: guide line, pulsing dot, price tag */}
          <line x1={PAD.l} x2={PAD.l + plotW} y1={y(lastSt)} y2={y(lastSt)} stroke="var(--lavender)" strokeOpacity="0.45" strokeDasharray="2 4" />
          <motion.circle
            cx={x(last)}
            cy={y(lastSt)}
            r={4}
            fill="var(--lavender)"
            animate={reduce ? { r: 4, opacity: 0.8 } : { r: [4, 10, 4], opacity: [0.8, 0.1, 0.8] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx={x(last)} cy={y(lastSt)} r="3.2" fill="var(--paper)" />
          <rect x={PAD.l + plotW + 2} y={y(lastSt) - 9} width={PAD.r - 4} height="18" rx="3" fill="var(--lavender)" />
          <text x={PAD.l + plotW + 7} y={y(lastSt) + 4} fill="var(--charcoal)" fontSize="10" fontWeight="600" fontFamily="var(--font-plex-mono)">
            {lastSt.toFixed(1)}
          </text>

          {/* Hover crosshair + tooltip */}
          {hi_ !== null && (
            <g pointerEvents="none">
              <line x1={x(hi_)} x2={x(hi_)} y1={PAD.t} y2={PAD.t + plotH} stroke="var(--paper)" strokeOpacity="0.35" />
              <circle cx={x(hi_)} cy={y(st[hi_])} r="3.5" fill="var(--lavender)" stroke="var(--paper)" strokeWidth="1" />
              {(() => {
                const bx = Math.min(Math.max(x(hi_) - 62, PAD.l), PAD.l + plotW - 124)
                return (
                  <g>
                    <rect x={bx} y={PAD.t} width="124" height="62" rx="5" fill="var(--charcoal)" fillOpacity="0.95" stroke="var(--line)" />
                    <text x={bx + 9} y={PAD.t + 15} fill="var(--mist)" fontSize="9.5" fontFamily="var(--font-plex-mono)">
                      {timeAt(hi_)} IST
                    </text>
                    <text x={bx + 9} y={PAD.t + 30} fill="var(--lavender)" fontSize="10" fontFamily="var(--font-plex-mono)">
                      STRADDLE {st[hi_].toFixed(2)}
                    </text>
                    <text x={bx + 9} y={PAD.t + 43} fill="var(--paper)" fontSize="10" fontFamily="var(--font-plex-mono)">
                      CE {ce[hi_].toFixed(2)}
                    </text>
                    <text x={bx + 9} y={PAD.t + 56} fill="var(--paper)" fontSize="10" fontFamily="var(--font-plex-mono)">
                      PE {pe[hi_].toFixed(2)}
                    </text>
                  </g>
                )
              })()}
            </g>
          )}
        </svg>
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-5 py-3 font-mono text-[10px] tracking-wider text-mist uppercase">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-5 rounded bg-lavender" /> Straddle (CE + PE)
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="w-5 border-t border-paper/60" /> CE
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="w-5 border-t border-dashed border-mist" /> PE
        </span>
        <span className="sm:ml-auto">5-min · 09:15–15:30 IST</span>
      </figcaption>
      <p className="border-t border-line px-5 py-2 font-mono text-[10px] tracking-widest text-mist uppercase">
        Illustrative · simulated data, not live prices or a recommendation
      </p>
    </figure>
  )
}
