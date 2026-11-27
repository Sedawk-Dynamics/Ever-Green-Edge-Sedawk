import type { Metadata } from 'next'
import { Eyebrow } from '@/components/site/blocks'
import { FullDisclaimer } from '@/components/fit/disclaimers'
import { EnrollFlow } from '@/components/fit/enroll-flow'
import { FIT, isTierId } from '@/lib/fit'

export const metadata: Metadata = {
  title: 'Enroll in FIT',
  description: 'Choose your FIT tier, verify your mobile and enroll in the 2-day live online seminar.',
  robots: { index: false, follow: true },
}

export default async function FitEnrollPage({ searchParams }: { searchParams: Promise<{ tier?: string | string[] }> }) {
  const { tier } = await searchParams
  const initialTier = isTierId(tier) ? tier : null

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-12 pb-10 lg:pt-16">
        <Eyebrow>{FIT.name}</Eyebrow>
        <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl">{FIT.enrollHeading}</h1>
      </div>
      <div className="theme-light bg-charcoal text-paper">
        <div className="mx-auto max-w-6xl px-5 py-12 lg:py-16">
          <EnrollFlow initialTier={initialTier} />
        </div>
      </div>
      <div className="pt-16">
        <FullDisclaimer />
      </div>
    </>
  )
}
