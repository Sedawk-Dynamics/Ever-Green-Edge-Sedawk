// Subtle background texture for FIT heroes: option-chain grid lines + faint candlesticks.
// Deterministic (seeded), so server and browser render the same SVG. Purely decorative.

const W = 1200
const H = 640

function seeded(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const candles = (() => {
  const r = seeded(7)
  const out: { x: number; o: number; c: number; h: number; l: number }[] = []
  let p = 430
  for (let i = 0; i < 46; i++) {
    const o = p
    p = Math.min(560, Math.max(120, p - 4 + (r() - 0.5) * 46))
    out.push({ x: 20 + i * 26, o, c: p, h: Math.min(o, p) - 6 - r() * 16, l: Math.max(o, p) + 6 + r() * 16 })
  }
  return out
})()

const ROWS = Array.from({ length: Math.floor(H / 32) }, (_, i) => 16 + i * 32)
// Option-chain columns: CE side | strike | PE side.
const COLS = [140, 260, 380, 500, 600, 700, 820, 940, 1060]

export function DeskTexture({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 -z-20 h-full w-full [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_75%)] ${className}`}
    >
      <g stroke="var(--lavender)" strokeOpacity="0.07">
        {ROWS.map((y) => (
          <line key={y} x1="0" x2={W} y1={y} y2={y} />
        ))}
        {COLS.map((x) => (
          <line key={x} x1={x} x2={x} y1="0" y2={H} strokeOpacity={x === 600 ? 0.16 : 0.07} />
        ))}
      </g>
      <g opacity="0.13">
        {candles.map((c) => {
          const up = c.c <= c.o // SVG y grows downward
          return (
            <g key={c.x}>
              <line x1={c.x} x2={c.x} y1={c.h} y2={c.l} stroke="var(--paper)" strokeWidth="1" />
              <rect
                x={c.x - 6}
                y={Math.min(c.o, c.c)}
                width="12"
                height={Math.max(2, Math.abs(c.o - c.c))}
                fill={up ? 'var(--lavender)' : 'transparent'}
                stroke={up ? 'none' : 'var(--paper)'}
              />
            </g>
          )
        })}
      </g>
    </svg>
  )
}
