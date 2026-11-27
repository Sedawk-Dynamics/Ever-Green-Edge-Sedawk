import type { Metadata } from 'next'
import Image from 'next/image'
import { MentorCards, PageHero, Section, TeamCards } from '@/components/site/blocks'
import { PhotoMarquee } from '@/components/motion/photo-marquee'
import { Reveal, SpotlightCard } from '@/components/motion/primitives'
import { GALLERY } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'The Trader Foundry was built by practising traders inside a working trading desk. Our mission, vision and team.',
}

export default function AboutPage() {
  return (
    <>
      <PageHero label="About" title="Built by traders, on a working trading desk." />

      <Section tone="light">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              We are not a course company that teaches from slides.
            </h2>
            {/* Placeholder visual (generic desk, not our office) — swap for a real photo when available. */}
            <div className="group relative mt-10 aspect-[4/3] overflow-hidden rounded-xl border border-line shadow-xl shadow-black/15">
              <Image
                src="/images/trading-desk.jpg"
                alt="Multi-screen trading desk showing market charts"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 rounded-sm bg-black/55 px-2 py-0.5 font-mono text-[10px] tracking-widest text-white/80 uppercase backdrop-blur">
                Representative image
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-6 text-lg leading-relaxed text-mist text-pretty">
            <p>
              The Trader Foundry was built by practising traders, inside a working trading desk. Our mentors trade the
              markets every day, and our trainees learn on the same desk, with the same discipline, risk rules and
              routines.
            </p>
            <p>
              Our flagship Trader Development Program (TDP) is a 6-month deep mentorship program, worth ₹2 lakh and free
              for the first 10 students, for a small, selected cohort. Trainees who prove consistent, disciplined performance get the opportunity to trade firm
              capital from our office. Trainees put none of their own money at risk.
            </p>
            <p>
              Alongside TDP, we run FIT — the Funded Indian Trader Program — and focused courses for people who want
              specific skills: a complete trading strategies course and an Advanced Option Selling Mentorship with our
              prop-floor traders.
            </p>
            <p className="text-paper">
              One idea runs through everything we do: trading is a profession, and professionals are trained, measured
              and backed.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <SpotlightCard className="h-full rounded-lg border border-line bg-surface p-8 md:p-10">
              <p className="font-mono text-xs tracking-[0.2em] text-lavender uppercase">Mission</p>
              <p className="mt-5 text-xl leading-relaxed text-paper text-pretty">
                To turn disciplined, committed individuals into professional traders through hands-on mentorship, strict
                risk management and a clear path to trading firm capital, without asking them to risk their own money.
              </p>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={0.12}>
            <SpotlightCard className="h-full rounded-lg border border-line bg-surface p-8 md:p-10">
              <p className="font-mono text-xs tracking-[0.2em] text-lavender uppercase">Vision</p>
              <p className="mt-5 text-xl leading-relaxed text-paper text-pretty">
                To become India&apos;s most trusted foundry for professional traders: the place where talent is measured on
                merit, backed with capital, and where trading is respected as a disciplined career.
              </p>
            </SpotlightCard>
          </Reveal>
        </div>
      </Section>

      <Section
        id="team"
        label="Team"
        title="The people behind The Trader Foundry."
        intro="A small, focused team of 5–6 people runs The Trader Foundry from our Pune office, backed by practising traders who mentor every cohort."
        tone="light"
      >
        <TeamCards />
      </Section>

      <Section
        id="mentors"
        label="Our Mentors"
        title="Full-time traders who mentor every cohort."
        intro="Our mentors trade live markets every day from our prop floor, and teach from that experience."
        tone="light"
        className="border-t border-line"
      >
        <MentorCards />
      </Section>

      <Section label="The desk" title="Inside our Pune office.">
        <PhotoMarquee slides={GALLERY} label="Photos of our Pune office" />
      </Section>
    </>
  )
}
