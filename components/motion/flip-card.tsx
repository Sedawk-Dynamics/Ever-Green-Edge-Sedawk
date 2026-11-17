'use client'

import { motion } from 'framer-motion'
import { RotateCw } from 'lucide-react'
import { useState, type KeyboardEvent, type PointerEvent } from 'react'
import { cn } from '@/lib/utils'

/**
 * 3D "front flip" card: tips forward over its horizontal axis to reveal the back.
 *
 * Hover is detected on the OUTER frame, which never rotates. (If the rotating card
 * listened for hover itself, it would turn edge-on mid-flip, the pointer would
 * "leave" it, and it would get stuck flickering half-way.)
 *
 * Mouse: flips on hover. Touch: flips on tap. Keyboard: Tab to focus, Enter/Space.
 * Both faces share one grid cell, so the card is always as tall as its taller face.
 */
export function FlipCard({
  index,
  title,
  text,
  className,
}: {
  index: number
  title: string
  text: string
  className?: string
}) {
  const [flipped, setFlipped] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  const onEnter = (e: PointerEvent) => e.pointerType === 'mouse' && setFlipped(true)
  const onLeave = (e: PointerEvent) => e.pointerType === 'mouse' && setFlipped(false)
  const onTap = (e: PointerEvent) => e.pointerType !== 'mouse' && setFlipped((f) => !f)
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setFlipped((f) => !f)
    }
  }

  const face =
    'col-start-1 row-start-1 flex flex-col rounded-lg border p-7 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]'

  return (
    // Static hit area + perspective. This element never moves.
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${title}. ${flipped ? 'Showing details' : 'Show details'}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onPointerUp={onTap}
      onKeyDown={onKeyDown}
      className={cn(
        'h-full cursor-pointer rounded-lg [perspective:1600px] outline-none focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal',
        className,
      )}
    >
      {/* Rotating card. pointer-events-none so it can never steal hover from the frame. */}
      <motion.div
        initial={false}
        animate={{ rotateX: flipped ? -180 : 0 }}
        transition={{ duration: 0.7, ease: [0.45, 0.05, 0.25, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="pointer-events-none grid h-full min-h-[230px]"
      >
        {/* Front */}
        <div className={cn(face, 'border-line bg-surface')}>
          <div className="flex items-start justify-between">
            <span className="font-mono text-sm text-lavender">{num}</span>
            <RotateCw className="size-4 text-mist/60" aria-hidden />
          </div>
          <h3 className="mt-auto pt-10 text-2xl leading-tight font-semibold text-balance">{title}</h3>
        </div>

        {/* Back, pre-rotated so it reads correctly once the card has flipped */}
        <div
          className={cn(face, 'border-lavender/40 bg-[linear-gradient(160deg,rgb(185_168_255/0.16),rgb(36_37_44)_60%)]')}
          style={{ transform: 'rotateX(180deg)' }}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-lavender">{num}</span>
            <span className="text-sm font-medium text-paper/90">{title}</span>
          </div>
          <p className="mt-auto pt-6 text-base leading-relaxed text-paper/85">{text}</p>
        </div>
      </motion.div>
    </div>
  )
}
