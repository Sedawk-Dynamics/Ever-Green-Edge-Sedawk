'use client'

import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useScroll,
  useSpring,
  type Variants,
} from 'framer-motion'
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const ease = [0.22, 1, 0.36, 1] as const

/** Honours the visitor's OS "reduce motion" setting for every animation on the site. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

/** Fades + lifts its children into view once, when scrolled to. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

/** Staggers direct <StaggerItem> children as the group enters the viewport. */
export function Stagger({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' }) {
  const Comp = as === 'ul' ? motion.ul : as === 'ol' ? motion.ol : motion.div
  return (
    <Comp className={className} variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
      {children}
    </Comp>
  )
}

export function StaggerItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const Comp = as === 'li' ? motion.li : motion.div
  return (
    <Comp className={className} variants={staggerChild}>
      {children}
    </Comp>
  )
}

/** Splits a headline into words that slide up one after another. */
export function SplitHeadline({ text, className, delay = 0.1 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease, delay: delay + i * 0.08 }}
          >
            {w}
            {i < words.length - 1 && ' '}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** Counts from 0 to `to` when scrolled into view. */
export function CountUp({ to, prefix = '', suffix = '', duration = 1.6 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration, ease, onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value}
      {suffix}
    </span>
  )
}

/** Endless horizontal ticker. Content is duplicated so the loop is seamless. */
export function Marquee({ children, duration = 40, className }: { children: ReactNode; duration?: number; className?: string }) {
  return (
    <div className={cn('relative flex overflow-hidden', className)}>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-charcoal to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-charcoal to-transparent" />
      <motion.div
        className="flex w-max shrink-0 items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  )
}

/** Thin lavender bar at the top of the page showing scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-lavender" />
}

/** Card with a soft lavender spotlight that follows the cursor, plus a hover lift. */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  const [bg, setBg] = useState('')

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    setBg(`radial-gradient(260px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgb(185 168 255 / 0.14), transparent 70%)`)
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => setBg('')}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease }}
      className={cn('relative overflow-hidden', className)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 transition-opacity duration-300" style={{ background: bg }} />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

/** Slow-drifting lavender glow orbs for hero backgrounds. */
export function GlowOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-40 right-[-10%] size-[520px] rounded-full bg-lavender/20 blur-[120px]"
        animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-20%] left-[-10%] size-[420px] rounded-full bg-lavender-deep/15 blur-[120px]"
        animate={{ x: [0, 70, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
