import type { Metadata } from 'next'
import { Section } from '@/components/site/blocks'
import { Faq } from '@/components/site/interactive'
import { Reveal } from '@/components/motion/primitives'
import { FullDisclaimer, ShortDisclaimer } from '@/components/fit/disclaimers'
import { EnrollLink } from '@/components/fit/enroll-link'
import { FitPageHero, FitSteps, TierCards } from '@/components/fit/sections'
import { StickyEnrollBar } from '@/components/fit/sticky-enroll'
import { FIT, FIT_FAQ } from '@/lib/fit'

export const metadata: Metadata = {
  title: 'FIT — Funded Indian Trader Program',
  description: FIT.page.sub,
  openGraph: { title: 'FIT — Funded Indian Trader Program', description: FIT.hero.sub },
}

export default function FitPage() {
  return (
    <>
      <FitPageHero />

      <Section tone="light" label="FIT" title="How it works">
        <FitSteps />
      </Section>

      <Section id="tiers" label="4 tiers" title="Choose your tier">
        <TierCards location="fit-tier-card" />
      </Section>

      <Section tone="light" label="FAQ" title="Before you enroll.">
        <Reveal>
          <Faq items={FIT_FAQ} />
        </Reveal>
      </Section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col items-start gap-3">
          <EnrollLink location="fit-bottom" size="lg" className="w-full sm:w-fit" />
          <ShortDisclaimer />
        </div>
      </section>

      <FullDisclaimer />
      <StickyEnrollBar />
    </>
  )
}
