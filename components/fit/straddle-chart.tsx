'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ease } from '@/components/motion/primitives'

/*
 * Hero visual, brief Option A: an ILLUSTRATIVE NIFTY ATM long straddle.
 * - Lavender V: payoff at expiry (CE + PE bought at the same strike).
 * - Soft curve behind it: the position's value before expiry (Black–Scholes, r = 0),
 *   gently animating as time value decays towards the V.
 * No market data is used. Every number here is a fixed teaching example.
 */

const STRIKE = 24600
const PREMIUM = 320 // combined CE + PE premium, ₹ per unit
const IV = 0.13
const S_MIN = 23800
const S_MAX = 25400
const PNL_MAX = 560
const PNL_MIN = -420

const W = 560
const H = 300
const PAD = { l: 16, r: 16, t: 18, b: 34 }
const N = 64

const x = (s: number) => PAD.l + ((s - S_MIN) / (S_MAX - S_MIN)) * (W - PAD.l - PAD.r)
const y = (v: number) => PAD.t + ((PNL_MAX - v) / (PNL_MAX - PNL_MIN)) * (H - PAD.t - PAD.b)

// Standard normal CDF (Abramowitz & Stegun 7.1.26).
function ncdf(z: number) {
  const t = 1 / (1 + 0.3275911 * (Math.abs(z) / Math.SQRT2))
  const erf = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2)
  return z >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf)
}

function straddleValue(s: number, days: number) {
  const t = days / 365
  const d1 = (Math.log(s / STRIKE) + 0.5 * IV * IV * t) / (IV * Math.sqrt(t))
  const d2 = d1 - IV * Math.sqrt(t)
  const call = s * ncdf(d1) - STRIKE * ncdf(d2)
  return 2 * call - s + STRIKE // put via put–call parity (r = 0)
}

const xs = Array.from({ length: N }, (_, i) => S_MIN + (i / (N - 1)) * (S_MAX - S_MIN))
const pts = (f: (s: number) => number) => xs.map((s) => `${x(s).toFixed(1)} ${y(f(s)).toFixed(1)}`)
const curve = (days: number) => `M${pts((s) => straddleValue(s, days) - PREMIUM).join(' L')}`
const area = (days: number) => `${curve(days)} L${x(S_MAX).toFixed(1)} ${y(PNL_MIN)} L${x(S_MIN).toFixed(1)} ${y(PNL_MIN)} Z`

const DAYS = [7, 5, 3.5, 2, 1]
const CURVES = DAYS.map(curve)
const AREAS = DAYS.map(area)
const PAYOFF = `M${x(S_MIN)} ${y(STRIKE - S_MIN - PREMIUM)} L${x(STRIKE)} ${y(-PREMIUM)} L${x(S_MAX)} ${y(S_MAX - STRIKE - PREMIUM)}`

const BE_LOW = STRIKE - PREMIUM
const BE_HIGH = STRIKE + PREMIUM
const fmt = (n: number) => n.toLocaleString('en-IN')

export function StraddleChart() {
  const reduce = useReducedMotion()
  const loop = { duration: 9, repeat: Infinity, repeatType: 'mirror' as const, ease: 'easeInOut' as const }

  return (
    <figure
      className="relative overflow-hidden rounded-xl border border-line bg-surface/85 shadow-2xl shadow-black/50 backdrop-blur"
      aria-label={`Illustrative NIFTY at-the-money straddle payoff. Strike ${fmt(STRIKE)}, combined premium ₹${PREMIUM}, breakevens ${fmt(BE_LOW)} and ${fmt(BE_HIGH)}. Teaching example, not live data.`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <div className="min-w-0">
          <p className="truncate font-mono text-[11px] tracking-[0.16em] text-paper/80 uppercase">NIFTY ATM straddle · {STRIKE} CE + PE</p>
        </div>
        <span className="shrink-0 rounded-sm border border-lavender/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-lavender uppercase">
          Illustrative
        </span>
      </div>

      <div className="px-2 pt-3 sm:px-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden>
          <defs>
            <linearGradient id="sc-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--lavender)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--lavender)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Option-chain style grid */}
          {[-300, 0, 300].map((v) => (
            <line key={v} x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="var(--paper)" strokeOpacity={v === 0 ? 0.28 : 0.06} strokeDasharray={v === 0 ? undefined : '3 5'} />
          ))}
          {[24000, 24300, 24900, 25200].map((s) => (
            <line key={s} x1={x(s)} x2={x(s)} y1={PAD.t} y2={H - PAD.b} stroke="var(--paper)" strokeOpacity="0.05" />
          ))}
          <text x={PAD.l + 4} y={y(0) - 8} fill="var(--mist)" fontSize="10" fontFamily="var(--font-plex-mono)">PROFIT</text>
          <text x={PAD.l + 4} y={y(0) + 16} fill="var(--mist)" fontSize="10" fontFamily="var(--font-plex-mono)">LOSS</text>

          {/* Value before expiry — softly animated, behind the payoff */}
          <motion.path
            d={AREAS[0]}
            fill="url(#sc-fill)"
            stroke="none"
            animate={reduce ? undefined : { d: AREAS }}
            transition={loop}
          />
          <motion.path
            d={CURVES[0]}
            fill="none"
            stroke="var(--paper)"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            strokeDasharray="5 4"
            animate={reduce ? undefined : { d: CURVES }}
            transition={loop}
          />

          {/* Strike */}
          <line x1={x(STRIKE)} x2={x(STRIKE)} y1={PAD.t} y2={H - PAD.b} stroke="var(--lavender)" strokeOpacity="0.45" strokeDasharray="2 4" />
          <text x={x(STRIKE)} y={H - 12} textAnchor="middle" fill="var(--lavender)" fontSize="10.5" fontFamily="var(--font-plex-mono)">
            STRIKE {fmt(STRIKE)}
          </text>

          {/* Payoff at expiry */}
          <motion.path
            d={PAYOFF}
            fill="none"
            stroke="var(--lavender)"
            strokeWidth="2.4"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease, delay: 0.2 }}
          />

          {/* Breakevens */}
          {[BE_LOW, BE_HIGH].map((s, i) => (
            <g key={s}>
              <circle cx={x(s)} cy={y(0)} r="4" fill="var(--charcoal)" stroke="var(--paper)" strokeWidth="1.5" />
              <text x={x(s) + (i ? 8 : -8)} y={y(0) + 20} textAnchor={i ? 'start' : 'end'} fill="var(--paper)" fontSize="10.5" fontFamily="var(--font-plex-mono)">
                BE {fmt(s)}
              </text>
            </g>
          ))}

          {/* Max loss at the strike = premium paid */}
          <circle cx={x(STRIKE)} cy={y(-PREMIUM)} r="3.5" fill="var(--lavender)" />
          <text x={x(STRIKE) + 10} y={y(-PREMIUM) + 4} fill="var(--mist)" fontSize="10" fontFamily="var(--font-plex-mono)">
            −₹{PREMIUM} premium
          </text>

          {/* NIFTY axis */}
          {[24000, 25200].map((s) => (
            <text key={s} x={x(s)} y={H - 12} textAnchor="middle" fill="var(--mist)" fontSize="10" fontFamily="var(--font-plex-mono)">
              {fmt(s)}
            </text>
          ))}
        </svg>
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-5 py-3 font-mono text-[10px] tracking-wider text-mist uppercase">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-5 rounded bg-lavender" /> At expiry
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="w-5 border-t border-dashed border-paper/60" /> Before expiry (time value)
        </span>
        <span className="sm:ml-auto">NIFTY at expiry →</span>
      </figcaption>
      <p className="border-t border-line px-5 py-2 font-mono text-[10px] tracking-widest text-mist uppercase">
        Illustrative · teaching example, not live data or a recommendation
      </p>
    </figure>
  )
}
