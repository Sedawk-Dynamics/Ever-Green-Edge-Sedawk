'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ease } from '@/components/motion/primitives'

/*
 * Animated, upward-trending SENSEX-style chart for the hero.
 * All numbers are SIMULATED (seeded random walk) and labelled as such in the UI.
 * Initial data is deterministic so server and client render identically.
 */

type Candle = { o: number; h: number; l: number; c: number; v: number }

const COUNT = 36
const TICKS_PER_CANDLE = 3
const TICK_MS = 850
const W = 560
const PRICE_H = 230
const VOL_TOP = 244
const VOL_H = 46
const AXIS_W = 62 // right-hand price axis

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Upward drift with realistic pullbacks.
const step = (p: number, r: () => number, drift = 9, vol = 38) => p + drift + (r() - 0.47) * vol * 2

function buildInitial(): Candle[] {
  const r = mulberry32(11)
  const out: Candle[] = []
  let p = 80240
  for (let i = 0; i < COUNT; i++) {
    const o = p
    let h = o
    let l = o
    for (let t = 0; t < TICKS_PER_CANDLE; t++) {
      p = step(p, r, 14)
      h = Math.max(h, p)
      l = Math.min(l, p)
    }
    out.push({ o, h: h + r() * 18, l: l - r() * 18, c: p, v: 30 + r() * 70 })
  }
  return out
}

const INITIAL = buildInitial()

const TAPE_INIT = [
  { s: 'SENSEX', p: 81412.35, c: 0.62 },
  { s: 'NIFTY 50', p: 24603.1, c: 0.58 },
  { s: 'BANK NIFTY', p: 53180.45, c: 0.41 },
  { s: 'NIFTY IT', p: 41250.8, c: -0.22 },
  { s: 'NIFTY MIDCAP', p: 57840.6, c: 0.73 },
  { s: 'INDIA VIX', p: 13.42, c: -1.15 },
]

const inr = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmt = (n: number) => inr.format(n)

function useSimulatedMarket(enabled: boolean) {
  const [state, setState] = useState({ candles: INITIAL, tape: TAPE_INIT, tick: 0 })

  useEffect(() => {
    if (!enabled) return
    const r = mulberry32(Date.now() % 100000)
    const id = window.setInterval(() => {
      setState((prev) => {
        const tick = prev.tick + 1
        const candles = prev.candles.slice()
        const last = candles[candles.length - 1]
        const next = step(last.c, r, 7, 42)
        if (tick % TICKS_PER_CANDLE === 0) {
          candles.shift()
          candles.push({ o: last.c, h: Math.max(last.c, next), l: Math.min(last.c, next), c: next, v: 25 + r() * 75 })
        } else {
          candles[candles.length - 1] = { ...last, c: next, h: Math.max(last.h, next), l: Math.min(last.l, next), v: last.v + r() * 6 }
        }
        const tape = prev.tape.map((t) => {
          const d = (r() - 0.45) * t.p * 0.0006
          return { ...t, p: t.p + d, c: t.c + (d / t.p) * 100 }
        })
        return { candles, tape, tick }
      })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [enabled])

  return state
}

function Flash({ value, up }: { value: string; up: boolean }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ y: up ? 10 : -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: up ? -10 : 10, opacity: 0 }}
        transition={{ duration: 0.25, ease }}
        className="inline-block tabular-nums"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )
}

export function MarketChart() {
  const reduce = useReducedMotion()
  const { candles, tape } = useSimulatedMarket(!reduce)

  const highs = candles.map((c) => c.h)
  const lows = candles.map((c) => c.l)
  const max = Math.max(...highs)
  const min = Math.min(...lows)
  const pad = (max - min) * 0.1
  const plotW = W - AXIS_W
  const y = (v: number) => PRICE_H - ((v - (min - pad)) / (max - min + pad * 2)) * PRICE_H
  const slot = plotW / candles.length
  const maxVol = Math.max(...candles.map((c) => c.v))

  const pts = candles.map((c, i) => [i * slot + slot / 2, y(c.c)] as const)
  const line = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${PRICE_H} L${pts[0][0].toFixed(1)} ${PRICE_H} Z`

  const first = candles[0]
  const last = candles[candles.length - 1]
  const lastY = y(last.c)
  const change = last.c - first.o
  const changePct = (change / first.o) * 100
  const up = change >= 0
  const tickUp = last.c >= last.o
  const axis = [0.1, 0.35, 0.6, 0.85].map((f) => ({ py: PRICE_H * f, v: max + pad - f * (max - min + pad * 2) }))

  return (
    <div
      role="img"
      aria-label="Animated simulated SENSEX-style chart trending upward. Demonstration data only, not live market prices."
      className="relative overflow-hidden rounded-xl border border-line bg-surface/80 shadow-2xl shadow-black/50 backdrop-blur"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-lavender opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-lavender" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.18em] text-paper/70 uppercase">Market desk</span>
        </div>
        <span className="rounded-sm border border-lavender/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-lavender uppercase">
          Simulated
        </span>
      </div>

      {/* Index ticker */}
      <div className="relative overflow-hidden border-b border-line bg-charcoal/60 py-2">
        <motion.div
          className="flex w-max gap-7 font-mono text-[11px] whitespace-nowrap uppercase"
          animate={reduce ? undefined : { x: ['0%', '-50%'] }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
        >
          {[...tape, ...tape].map((t, i) => (
            <span key={`${t.s}-${i}`} className="flex items-center gap-2" aria-hidden={i >= tape.length}>
              <span className="text-paper/60">{t.s}</span>
              <span className="text-paper tabular-nums">{fmt(t.p)}</span>
              <span className={t.c >= 0 ? 'text-lavender' : 'text-mist'}>
                {t.c >= 0 ? '▲' : '▼'} {Math.abs(t.c).toFixed(2)}%
              </span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Price header */}
      <div className="flex items-end justify-between gap-4 px-5 pt-5">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-mist uppercase">BSE SENSEX · 1m</p>
          <p className="mt-1 font-mono text-3xl font-medium text-paper md:text-4xl">
            <Flash value={fmt(last.c)} up={tickUp} />
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`flex items-center gap-1 font-mono text-sm tabular-nums ${up ? 'text-lavender' : 'text-mist'}`}>
            {up ? <ArrowUpRight className="size-4" aria-hidden /> : <ArrowDownRight className="size-4" aria-hidden />}
            {up ? '+' : ''}
            {fmt(change)} ({up ? '+' : ''}
            {changePct.toFixed(2)}%)
          </span>
          <span className="font-mono text-[10px] tracking-wider text-mist uppercase">Session</span>
        </div>
      </div>

      {/* Chart */}
      <div className="px-3 pt-3 pb-1">
        <svg viewBox={`0 0 ${W} ${VOL_TOP + VOL_H}`} className="h-auto w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="mc-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--lavender)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--lavender)" stopOpacity="0" />
            </linearGradient>
            <clipPath id="mc-reveal">
              <motion.rect
                x="0"
                y="-20"
                height={VOL_TOP + VOL_H + 40}
                initial={{ width: 0 }}
                animate={{ width: W }}
                transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1], delay: 0.5 }}
              />
            </clipPath>
          </defs>

          {/* grid + axis labels */}
          {axis.map((a) => (
            <g key={a.py}>
              <line x1="0" x2={plotW} y1={a.py} y2={a.py} stroke="var(--paper)" strokeOpacity="0.06" strokeDasharray="3 5" />
              <text x={plotW + 8} y={a.py + 3} fill="var(--mist)" fontSize="10" fontFamily="var(--font-plex-mono)">
                {Math.round(a.v).toLocaleString('en-IN')}
              </text>
            </g>
          ))}

          <g clipPath="url(#mc-reveal)">
            <path d={area} fill="url(#mc-area)" />
            {candles.map((c, i) => {
              const x = i * slot + slot / 2
              const isUp = c.c >= c.o
              const top = y(Math.max(c.o, c.c))
              const bodyH = Math.max(1.5, Math.abs(y(c.o) - y(c.c)))
              const volH = (c.v / maxVol) * VOL_H
              return (
                <g key={i}>
                  <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={isUp ? 'var(--lavender)' : 'var(--mist)'} strokeOpacity={isUp ? 0.9 : 0.5} />
                  <rect
                    x={x - slot * 0.32}
                    y={top}
                    width={slot * 0.64}
                    height={bodyH}
                    rx="1"
                    fill={isUp ? 'var(--lavender)' : 'var(--charcoal)'}
                    fillOpacity={isUp ? 0.85 : 1}
                    stroke={isUp ? 'none' : 'var(--mist)'}
                    strokeOpacity="0.6"
                  />
                  <rect x={x - slot * 0.32} y={VOL_TOP + VOL_H - volH} width={slot * 0.64} height={volH} fill="var(--lavender)" fillOpacity={isUp ? 0.3 : 0.12} />
                </g>
              )
            })}
            <path d={line} fill="none" stroke="var(--paper)" strokeWidth="1.6" strokeOpacity="0.85" strokeLinejoin="round" />
          </g>

          {/* last-price line, pulsing dot and price tag */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 0.5 }}>
            <line x1="0" x2={plotW} y1={lastY} y2={lastY} stroke="var(--lavender)" strokeOpacity="0.55" strokeDasharray="2 4" />
            <motion.circle
              cx={pts[pts.length - 1][0]}
              cy={lastY}
              fill="var(--lavender)"
              animate={reduce ? { r: 4 } : { r: [4, 10, 4], opacity: [0.9, 0.15, 0.9] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <circle cx={pts[pts.length - 1][0]} cy={lastY} r="3" fill="var(--paper)" />
            <rect x={plotW + 2} y={lastY - 9} width={AXIS_W - 4} height="18" rx="3" fill="var(--lavender)" />
            <text x={plotW + 8} y={lastY + 4} fill="var(--charcoal)" fontSize="10" fontWeight="600" fontFamily="var(--font-plex-mono)">
              {Math.round(last.c).toLocaleString('en-IN')}
            </text>
          </motion.g>
        </svg>
      </div>

      {/* Session timeline + stats */}
      <div className="flex justify-between px-5 pb-3 font-mono text-[10px] text-mist">
        <span>09:15</span>
        <span>11:00</span>
        <span>13:00</span>
        <span>15:30</span>
      </div>
      <div className="grid grid-cols-4 gap-px border-t border-line bg-line">
        {[
          { k: 'Open', v: first.o },
          { k: 'High', v: max },
          { k: 'Low', v: min },
          { k: 'Last', v: last.c },
        ].map((s) => (
          <div key={s.k} className="flex flex-col gap-0.5 bg-surface px-3 py-2.5 sm:px-4">
            <span className="font-mono text-[10px] tracking-widest text-mist uppercase">{s.k}</span>
            <span className="font-mono text-xs text-paper tabular-nums sm:text-sm">{Math.round(s.v).toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
      <p className="border-t border-line px-5 py-2 font-mono text-[10px] tracking-widest text-mist uppercase">
        Simulated data · not live market prices
      </p>
    </div>
  )
}
