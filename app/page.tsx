import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Eyebrow, Section, TeamCards } from '@/components/site/blocks'
import { Comparison, Faq, ProgramTabs, Timeline } from '@/components/site/interactive'
import { TrackCarousel } from '@/components/motion/carousel'
import { MarketChart } from '@/components/site/market-chart'
import { FlipCard } from '@/components/motion/flip-card'
import {
  CountUp,
  GlowOrbs,
  Marquee,
  Reveal,
  SplitHeadline,
  Stagger,
  StaggerItem,
} from '@/components/motion/primitives'
import { buttonVariants } from '@/components/ui/button'
import { FAQ, GALLERY, PRINCIPLES, SETS_APART, SITE, TDP } from '@/lib/site'
import { cn } from '@/lib/utils'

export default function Home() {
  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <div className="relative isolate overflow-hidden">
        <GlowOrbs />
        <div className="bg-grid-dark absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" aria-hidden />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-36 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pt-44 lg:pb-24">
          <div className="flex flex-col gap-7">
            <Reveal y={12}>
              <Eyebrow>Professional trader development · Pune</Eyebrow>
            </Reveal>
            <h1 className="text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              <SplitHeadline text="Where traders are" />{' '}
              <SplitHeadline text="forged." className="text-lavender" delay={0.4} />
            </h1>
            <Reveal delay={0.5}>
              <p className="max-w-xl text-lg leading-relaxed text-mist text-pretty">{SITE.heroSub}</p>
            </Reveal>
            <Reveal delay={0.65} className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link href="/tdp#apply" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
                Apply for TDP <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link href="/courses" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Explore courses
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.3} y={40} className="min-w-0">
            <MarketChart />
          </Reveal>
        </div>

        {/* Stats strip */}
        <div className="mx-auto max-w-6xl px-5 pb-16">
          <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4">
            {[
              { value: <CountUp to={6} />, label: 'Months of full-time mentorship' },
              { value: <>₹0</>, label: 'Program fees for TDP' },
              { value: <>10–<CountUp to={12} /></>, label: 'Seats per cohort' },
              { value: <>₹0</>, label: 'Of your own money at risk' },
            ].map((s) => (
              <StaggerItem key={s.label} className="flex flex-col gap-1 bg-surface/80 p-6 backdrop-blur">
                <span className="text-4xl font-semibold text-paper md:text-5xl">{s.value}</span>
                <span className="text-sm text-mist">{s.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      {/* --------------------------------------------------------- Marquee */}
      <div className="border-y border-line py-5">
        <Marquee duration={35}>
          {PRINCIPLES.map((p) => (
            <span key={p} className="flex items-center gap-8 px-4 font-mono text-sm tracking-[0.18em] whitespace-nowrap text-paper/70 uppercase">
              {p}
              <span aria-hidden className="size-1.5 rotate-45 bg-lavender" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* ---------------------------------------------- What sets us apart */}
      <Section>
        <Reveal className="mb-14 flex max-w-3xl flex-col gap-5">
          <Eyebrow>What sets us apart</Eyebrow>
          <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
            Trading is a profession. Professionals are trained, measured and backed.
          </h2>
        </Reveal>
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SETS_APART.map((c, i) => (
            <StaggerItem as="li" key={c.title}>
              <FlipCard index={i} title={c.title} text={c.text} />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* -------------------------------------------------------- Programs */}
      <Section id="programs" className="border-t border-line">
        <Reveal className="mb-10 flex max-w-3xl flex-col gap-5">
          <Eyebrow>Programs</Eyebrow>
          <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
            One flagship program. Two focused courses.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <ProgramTabs />
        </Reveal>
      </Section>

      {/* ------------------------------------------------ The key difference */}
      <Section className="border-t border-line">
        <Reveal className="mb-12 flex max-w-3xl flex-col gap-5">
          <Eyebrow>The difference</Eyebrow>
          <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
            We are not selling challenges. We are selecting traders.
          </h2>
          <p className="text-lg leading-relaxed text-mist">
            Funded-account firms make money when people buy challenges. Our flagship is free and selection-based.
          </p>
        </Reveal>
        <Comparison />
      </Section>

      {/* --------------------------------------------------- How TDP works */}
      <Section className="border-t border-line">
        <Reveal className="mb-16 flex max-w-3xl flex-col gap-5 md:mx-auto md:items-center md:text-center">
          <Eyebrow>How TDP works</Eyebrow>
          <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
            From application to firm capital, in six steps.
          </h2>
        </Reveal>
        <Timeline steps={TDP.steps} />
        <Reveal className="mt-16 flex justify-center">
          <Link href="/tdp#apply" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
            Apply for TDP <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Reveal>
      </Section>

      {/* ------------------------------------------------------------ Gallery */}
      <Section className="border-t border-line">
        <Reveal className="mb-12 flex max-w-3xl flex-col gap-5">
          <Eyebrow>Inside the desk</Eyebrow>
          <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
            Learn where the trading happens.
          </h2>
          <p className="text-lg leading-relaxed text-mist">Our trading floor in Bavdhan, Pune. Drag or swipe to browse.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <TrackCarousel slides={GALLERY} />
        </Reveal>
      </Section>

      {/* --------------------------------------------------------------- Team */}
      <Section className="border-t border-line">
        <Reveal className="mb-12 flex max-w-3xl flex-col gap-5">
          <Eyebrow>Team</Eyebrow>
          <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
            Practising traders, not course presenters.
          </h2>
          <p className="text-lg leading-relaxed text-mist">
            A small, focused team of 5–6 people runs The Trader Foundry from our Pune office, backed by practising
            traders who mentor every cohort.
          </p>
        </Reveal>
        <TeamCards />
        <Link href="/about#team" className="group mt-8 inline-flex items-center gap-2 text-sm text-lavender">
          Meet the full team <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </Section>

      {/* ---------------------------------------------------------------- FAQ */}
      <Section className="border-t border-line">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="flex flex-col gap-5">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">Questions, answered plainly.</h2>
            <p className="text-mist">
              Anything else? <Link href="/contact" className="text-lavender hover:underline">Get in touch</Link> or message us on WhatsApp.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Faq items={FAQ} />
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-xl border border-lavender/30 bg-surface p-8 md:p-16">
            <GlowOrbs />
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                  Serious about trading as a career?
                </h2>
                <p className="mt-4 text-lg text-mist">
                  Selection, not sales. TDP has zero fees, and you never put your own money at risk.
                </p>
              </div>
              <Link href="/tdp#apply" className={cn(buttonVariants({ size: 'lg' }), 'group shrink-0')}>
                Apply for TDP <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
