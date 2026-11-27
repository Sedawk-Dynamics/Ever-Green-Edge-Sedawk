'use client'

import { motion, type Variants } from 'framer-motion'
import { BriefcaseBusiness, ChartCandlestick, ClipboardCheck, GraduationCap } from 'lucide-react'
import { FIT } from '@/lib/fit'
import { cn } from '@/lib/utils'

/*
 * "How FIT works" — 4 numbered step cards.
 * Colour deepens step by step (light lavender tint → solid violet for "Get hired") to show
 * progression, staying inside the brand palette (the FIT brief keeps green/red for market moves).
 * Animation: cards tilt up into place one after another; on each, a rail segment draws along the
 * top edge and across the gap to the next card (together, a progress line through the badges),
 * the badge spins in, then icon and text follow. Hover: lift, lavender glow, light sweep.
 */

const ICONS = [GraduationCap, ClipboardCheck, ChartCandlestick, BriefcaseBusiness]

// Background per step. Built from theme tokens, so it works in light and dark bands.
const BACKGROUNDS = [
  'linear-gradient(160deg, color-mix(in oklab, var(--lavender) 10%, var(--surface)), var(--surface) 75%)',
  'linear-gradient(160deg, color-mix(in oklab, var(--lavender) 18%, var(--surface)), var(--surface) 80%)',
  'linear-gradient(160deg, color-mix(in oklab, var(--lavender) 30%, var(--surface)), color-mix(in oklab, var(--lavender) 8%, var(--surface)))',
  'linear-gradient(150deg, var(--lavender), var(--lavender-deep))',
]
const BORDERS = ['border-lavender/20', 'border-lavender/30', 'border-lavender/45', 'border-transparent']

const spring = { type: 'spring', stiffness: 110, damping: 17 } as const

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.28, delayChildren: 0.15 } },
}
const card: Variants = {
  hidden: { opacity: 0, y: 48, rotateX: 14 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { ...spring, delayChildren: 0.1, staggerChildren: 0.08 } },
}
const badge: Variants = {
  hidden: { scale: 0, rotate: -120 },
  show: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 16 } },
}
const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}
// Rail segment along a card's top edge, then the connector across the gap to the next card.
const segment: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } },
}
const connector: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.2, ease: 'linear', delay: 0.45 } },
}

export function FitSteps() {
  return (
    <motion.ol
      variants={list}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      style={{ perspective: 1200 }}
      className="relative grid gap-x-4 gap-y-10 pt-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {FIT.steps.map((s, i) => {
        const Icon = ICONS[i]
        const final = i === FIT.steps.length - 1
        return (
          <motion.li
            key={s.title}
            variants={card}
            whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            style={{ background: BACKGROUNDS[i] }}
            className={cn(
              'group relative flex flex-col rounded-xl border px-6 pt-10 pb-7 shadow-sm transition-shadow duration-300',
              'hover:shadow-[0_24px_48px_-16px_rgb(109_88_224/0.45)]',
              BORDERS[i],
            )}
          >
            {/* Light sweep on hover, plus this card's segment of the progress rail */}
            <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
              <motion.span variants={segment} className={cn('absolute inset-x-0 top-0 h-0.5 origin-left', final ? 'bg-white/60' : 'bg-lavender')} />
              <span
                className={cn(
                  'absolute inset-y-0 -left-1/2 w-1/2 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[400%]',
                  final ? 'via-white/25' : 'via-white/60',
                )}
              />
            </span>

            {/* Rail connector across the gap to the next card (desktop row only) */}
            {!final && (
              <motion.span aria-hidden variants={connector} className="absolute top-0 -right-[17px] hidden h-0.5 w-[17px] origin-left bg-lavender lg:block" />
            )}

            {/* Number badge sitting on the rail */}
            <motion.span
              variants={badge}
              className={cn(
                'absolute -top-6 left-6 z-20 flex size-12 items-center justify-center rounded-full font-mono text-base font-medium ring-4 ring-charcoal transition-[scale] duration-300 group-hover:scale-110',
                final ? 'bg-lavender-deep text-charcoal' : 'border-2 border-lavender bg-surface text-lavender',
              )}
            >
              {i + 1}
            </motion.span>

            <motion.span
              variants={rise}
              className={cn(
                'flex size-11 items-center justify-center rounded-lg transition-[scale,rotate] duration-300 group-hover:-rotate-6 group-hover:scale-110',
                final ? 'bg-white/15 text-charcoal' : 'bg-lavender/12 text-lavender',
              )}
            >
              <Icon className="size-5" aria-hidden />
            </motion.span>
            <motion.h3 variants={rise} className={cn('mt-5 text-xl font-semibold', final ? 'text-charcoal' : 'text-paper')}>
              {s.title}
            </motion.h3>
            <motion.p variants={rise} className={cn('mt-2 text-sm leading-relaxed', final ? 'text-charcoal/90' : 'text-mist')}>
              {s.text}
            </motion.p>
          </motion.li>
        )
      })}
    </motion.ol>
  )
}
