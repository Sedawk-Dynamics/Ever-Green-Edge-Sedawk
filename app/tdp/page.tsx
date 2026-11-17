import type { Metadata } from 'next'
import { ApplyForm } from '@/components/site/forms'
import { PageHero, Section } from '@/components/site/blocks'
import { Faq, Timeline } from '@/components/site/interactive'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/primitives'
import { FAQ } from '@/lib/site'
import { TDP } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Trader Development Program (TDP)',
  description:
    'TDP is a free, 6-month, full-time deep mentorship program for a small selected cohort. Apply for a seat.',
}

export default function TdpPage() {
  return (
    <>
      <PageHero
        label="Flagship program"
        title="Trader Development Program (TDP)"
        lead={TDP.tagline}
      />

      <Section>
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

      <Section label="How it works" title="Six steps from application to firm capital." className="border-t border-line">
        <Timeline steps={TDP.steps} />
        <p className="mx-auto mt-16 max-w-3xl text-center text-sm leading-relaxed text-mist">
          Top performers get the opportunity to trade firm capital from our office. Allocation of firm capital is at
          the firm&apos;s sole discretion, based on performance and risk evaluation, and is not guaranteed.
        </p>
      </Section>

      <Section
        id="apply"
        label="Apply"
        title="Apply for TDP."
        intro="Fill in the form below. Every applicant is screened and interviewed. Seats are limited to 10–12 per cohort."
        className="border-t border-line"
      >
        <Reveal>
          <div className="rounded-lg border border-line bg-surface p-6 md:p-10">
            <ApplyForm />
          </div>
        </Reveal>
      </Section>

      <Section label="FAQ" title="Before you apply." className="border-t border-line">
        <Reveal>
          <Faq items={FAQ.slice(0, 5)} />
        </Reveal>
      </Section>
    </>
  )
}
