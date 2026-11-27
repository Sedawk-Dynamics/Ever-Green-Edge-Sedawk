import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ApplyForm } from '@/components/site/forms'
import { cardHover, PageHero, Section } from '@/components/site/blocks'
import { Faq, Timeline } from '@/components/site/interactive'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/primitives'
import { buttonVariants } from '@/components/ui/button'
import { FAQ, TDP } from '@/lib/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Trader Development Program (TDP)',
  description:
    'TDP is a 6-month, full-time deep mentorship worth ₹2 lakh, free for the first 10 students. Small selected cohort, path to trading firm capital.',
}

export default function TdpPage() {
  return (
    <>
      <PageHero label="Flagship · Full-time mentorship" title="Trader Development Program (TDP)" lead={TDP.tagline} />

      {/* Price + key facts (brochure card) */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-lavender/30 bg-surface p-7 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-xs tracking-[0.2em] text-lavender uppercase">Flagship · Full-time mentorship</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Trader Development Program (TDP)</h2>
              </div>
              <div className="md:text-right">
                <p className="text-mist">
                  <s>Worth {TDP.worth}</s>
                </p>
                <p className="mt-1 text-4xl font-semibold text-lavender">Free</p>
                <p className="mt-1 text-sm text-paper/85">for the first 10 students</p>
              </div>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4">
              {TDP.stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1 bg-charcoal p-5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-3xl font-semibold text-paper">{s.value}</dd>
                  <dd className="text-sm text-mist">{s.label}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 max-w-3xl leading-relaxed text-paper/90">{TDP.why}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#apply" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
                Apply for TDP <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </a>
              <a href="#journey" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                See the TDP journey
              </a>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* About the program */}
      <Section tone="light" label="The program" title="Deep mentorship on a working trading desk.">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal>
            <p className="text-lg leading-relaxed text-mist text-pretty">{TDP.copy}</p>
          </Reveal>
          <Stagger className="divide-y divide-line self-start rounded-lg border border-line bg-surface">
            {TDP.details.map((d) => (
              <StaggerItem key={d.label} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:justify-between sm:gap-6">
                <span className="text-sm text-mist">{d.label}</span>
                <span className="text-sm text-paper sm:text-right">{d.value}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Journey */}
      <Section id="journey" label="The TDP journey" title="Five stages, from screening to firm capital.">
        <Timeline steps={TDP.steps} />
        <p className="mx-auto mt-16 max-w-3xl text-center text-sm leading-relaxed text-mist">
          Top performers get the opportunity to trade firm capital from our office. Allocation of firm capital is at
          the firm&apos;s sole discretion, based on performance and risk evaluation, and is not guaranteed.
        </p>
      </Section>

      {/* Every trainee gets / Also offered */}
      <Section tone="light">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          {[
            { title: 'Every trainee gets', items: TDP.everyTraineeGets },
            { title: 'Also offered', items: TDP.alsoOffered },
          ].map((col) => (
            <Reveal key={col.title}>
              <h2 className="border-b-2 border-paper pb-3 font-mono text-sm tracking-[0.18em] uppercase">{col.title}</h2>
              <ul className="divide-y divide-line">
                {col.items.map((it) => (
                  <li key={it.strong} className="py-4 text-paper/90">
                    <strong className="font-semibold text-paper">{it.strong}</strong> · {it.rest}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link href="/courses" className={cn(buttonVariants({ variant: 'outline' }), cardHover)}>
            See our paid courses
          </Link>
        </Reveal>
      </Section>

      <Section
        id="apply"
        label="Apply"
        title="Apply for TDP."
        intro="Fill in the form below. Every applicant is screened and interviewed. Seats are limited to 10–12 per cohort, and TDP is free for the first 10 students."
      >
        <Reveal>
          <div className="rounded-lg border border-line bg-surface p-6 md:p-10">
            <ApplyForm />
          </div>
        </Reveal>
      </Section>

      <Section tone="light" label="FAQ" title="Before you apply.">
        <Reveal>
          <Faq items={FAQ.slice(0, 5)} />
        </Reveal>
      </Section>
    </>
  )
}
