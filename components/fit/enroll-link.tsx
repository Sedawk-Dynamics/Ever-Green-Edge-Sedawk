'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { buttonVariants, type ButtonVariantProps } from '@/components/ui/button'
import type { TierId } from '@/lib/fit'
import { track } from '@/lib/track'
import { cn } from '@/lib/utils'

/** "Enroll Now" → /fit/enroll (optionally with a tier pre-selected). Tracks the click as a conversion. */
export function EnrollLink({
  tier,
  location,
  className,
  children = 'Enroll Now',
  arrow = true,
  ...variants
}: {
  tier?: TierId
  /** Where on the site the button is, for analytics (e.g. "home-hero", "fit-tier-card"). */
  location: string
  className?: string
  children?: ReactNode
  arrow?: boolean
} & ButtonVariantProps) {
  return (
    <Link
      href={tier ? `/fit/enroll?tier=${tier}` : '/fit/enroll'}
      onClick={() => track({ name: 'enroll_click', location, tier })}
      className={cn(buttonVariants(variants), 'group', className)}
    >
      {children}
      {arrow && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />}
    </Link>
  )
}
