import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Section, TeamCards } from '@/components/site/blocks'
import { Faq } from '@/components/site/interactive'
import { TrackCarousel } from '@/components/motion/carousel'
import { Reveal } from '@/components/motion/primitives'
import { GetTradersBand } from '@/components/fit/lead-forms'
import { FinalEnrollBand, FitHomeHero, FitSteps, ProgramsGrid, TierCards, WhatSetsUsApart } from '@/components/fit/sections'
import { FIT, FIT_FAQ } from '@/lib/fit'
import { GALLERY } from '@/lib/site'

export const metadata: Metadata = {
  description: FIT.hero.sub,
  openGraph: { title: 'FIT — Funded Indian Trader Program | The Trader Foundry', description: FIT.hero.headline },
}

// Landing page order from the FIT brief (market strip now sits above the header, site-wide):
// FIT hero → how FIT works → tier cards → our programs → Get Traders (coming soon) →
// what sets us apart → mentors → FAQ → final Enroll Now band. Bands alternate dark / light.
// FIT is the main customer-acquisition page, so its compliance rules apply to this whole page.
export default function Home() {
  return (
    <>
      <FitHomeHero />

      <Section tone="light" label="4 steps" title="How FIT works">
        <FitSteps />
      </Section>

      <Section id="tiers" label="4 tiers" title="Choose your tier">
        <TierCards location="home-tier-card" />
      </Section>

      <Section tone="light" label="Programs" title="Our programs">
        <ProgramsGrid />
      </Section>

      <GetTradersBand />

      <Section tone="light" label="What sets us apart" title="Trading is a profession. Professionals are trained, measured and backed.">
        <WhatSetsUsApart />
      </Section>

      <Section
        id="mentors"
        label="Mentors"
        title="Practising traders, not course presenters."
        intro="Our mentors trade live markets every day from our trading floor in Bavdhan, Pune."
      >
        <TeamCards />
        <Link href="/about#mentors" className="group mt-8 inline-flex items-center gap-2 text-sm text-lavender">
          Meet our mentors <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
        <Reveal delay={0.1} className="mt-14">
          <TrackCarousel slides={GALLERY} />
        </Reveal>
      </Section>

      <Section tone="light" label="FAQ" title="Questions, answered plainly.">
        <Reveal>
          <Faq items={FIT_FAQ} />
        </Reveal>
      </Section>

      <div className="pt-20 lg:pt-24">
        <FinalEnrollBand location="home-final-band" />
      </div>
    </>
  )
}
