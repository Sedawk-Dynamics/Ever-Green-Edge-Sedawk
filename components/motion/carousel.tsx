'use client'

import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ease } from './primitives'

type Slide = { src: string; alt: string; caption?: string }

const wrap = (n: number, len: number) => ((n % len) + len) % len

/**
 * Full-bleed image carousel: crossfade + slow Ken Burns zoom, swipe/drag,
 * arrows, dots and autoplay that pauses on hover/focus.
 */
export function ImageCarousel({
  slides,
  interval = 5000,
  className,
  priority = false,
  sizes = '100vw',
}: {
  slides: Slide[]
  interval?: number
  className?: string
  priority?: boolean
  sizes?: string
}) {
  const [[index, dir], setState] = useState<[number, number]>([0, 1])
  const [paused, setPaused] = useState(false)
  const i = wrap(index, slides.length)

  const go = useCallback((d: number) => setState(([n]) => [n + d, d]), [])

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => go(1), interval)
    return () => window.clearInterval(id)
  }, [paused, interval, go, index])

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
  }

  return (
    <div
      className={cn('group relative overflow-hidden', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Photos of The Trader Foundry office"
    >
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={index}
          custom={dir}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.8, ease }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${slides.length}`}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: interval / 1000 + 1, ease: 'linear' }}
          >
            <Image src={slides[i].src} alt={slides[i].alt} fill priority={priority && i === 0} sizes={sizes} className="pointer-events-none object-cover select-none" draggable={false} />
          </motion.div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
          {slides[i].caption && (
            <p className="absolute bottom-5 left-5 font-mono text-xs tracking-[0.2em] text-paper/90 uppercase">{slides[i].caption}</p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute right-4 bottom-4 z-10 flex items-center gap-2">
        <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="flex size-9 items-center justify-center rounded-full border border-paper/25 bg-charcoal/60 text-paper backdrop-blur transition hover:border-lavender hover:text-lavender">
          <ChevronLeft className="size-4" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next photo" className="flex size-9 items-center justify-center rounded-full border border-paper/25 bg-charcoal/60 text-paper backdrop-blur transition hover:border-lavender hover:text-lavender">
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {slides.map((s, n) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setState(([cur]) => [cur + (n - wrap(cur, slides.length)), n > i ? 1 : -1])}
            aria-label={`Show photo ${n + 1}`}
            aria-current={n === i}
            className="relative h-1 w-8 overflow-hidden rounded-full bg-paper/25"
          >
            {n === i && (
              <motion.span
                key={`${index}-${paused}`}
                className="absolute inset-y-0 left-0 bg-lavender"
                initial={{ width: paused ? '100%' : '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: paused ? 0 : interval / 1000, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Horizontal track carousel: shows several cards at once, drag to scroll,
 * arrows step one card at a time, autoplay loops back to the start.
 */
export function TrackCarousel({
  slides,
  interval = 4000,
}: {
  slides: (Slide & { w: number; h: number })[]
  interval?: number
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [perView, setPerView] = useState(1)

  useEffect(() => {
    const update = () => setPerView(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const max = Math.max(0, slides.length - perView)
  const clamped = Math.min(index, max)

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => setIndex((n) => (n >= max ? 0 : n + 1)), interval)
    return () => window.clearInterval(id)
  }, [paused, max, interval])

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -50) setIndex((n) => Math.min(max, n + 1))
    else if (info.offset.x > 50) setIndex((n) => Math.max(0, n - 1))
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Gallery of The Trader Foundry trading floor"
    >
      <div className="overflow-hidden">
        <motion.ul
          className="flex cursor-grab active:cursor-grabbing"
          animate={{ x: `-${(clamped * 100) / perView}%` }}
          transition={{ duration: 0.8, ease }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={onDragEnd}
        >
          {slides.map((s, n) => (
            <li key={s.src} className="shrink-0 px-2" style={{ width: `${100 / perView}%` }} aria-hidden={n < clamped || n >= clamped + perView}>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-surface">
                <Image src={s.src} alt={s.alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="pointer-events-none object-cover transition-transform duration-700 select-none group-hover:scale-105" draggable={false} />
              </div>
            </li>
          ))}
        </motion.ul>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 px-2">
        <div className="flex gap-1.5">
          {Array.from({ length: max + 1 }).map((_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setIndex(n)}
              aria-label={`Go to slide ${n + 1}`}
              aria-current={n === clamped}
              className={cn('h-1.5 rounded-full transition-all duration-500', n === clamped ? 'w-8 bg-lavender' : 'w-3 bg-paper/25 hover:bg-paper/50')}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setIndex((n) => Math.max(0, n - 1))} disabled={clamped === 0} aria-label="Previous" className="flex size-10 items-center justify-center rounded-full border border-line text-paper transition hover:border-lavender hover:text-lavender disabled:opacity-30">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" onClick={() => setIndex((n) => Math.min(max, n + 1))} disabled={clamped === max} aria-label="Next" className="flex size-10 items-center justify-center rounded-full border border-line text-paper transition hover:border-lavender hover:text-lavender disabled:opacity-30">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
