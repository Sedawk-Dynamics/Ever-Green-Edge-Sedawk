import Link from 'next/link'
import { ArrowRight, BadgeCheck, Landmark, Users, Wallet } from 'lucide-react'
import { cardHover, Eyebrow } from '@/components/site/blocks'
import { GlowOrbs, Reveal, Stagger, StaggerItem } from '@/components/motion/primitives'
import { buttonVariants } from '@/components/ui/button'
import { DeskTexture } from './desk-texture'
import { ShortDisclaimer } from './disclaimers'
import { EnrollLink } from './enroll-link'
import { OptionSellingEnquiry } from './lead-forms'
import { StraddleChart } from './straddle-chart'
import { FIT, FIT_GST, FIT_TIERS, inr, PROGRAMS } from '@/lib/fit'
import { SETS_APART } from '@/lib/site'
import { cn } from '@/lib/utils'

const TRUST_ICONS = [BadgeCheck, Wallet, Landmark, Users]

export function TrustStrip({ className }: { className?: string }) {
  return (
    <ul className={cn('grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4', className)}>
      {FIT.trust.map((t, i) => {
        const Icon = TRUST_ICONS[i]
        return (
          <li key={t} className="flex items-start gap-2.5 text-sm leading-snug text-paper/85">
            <Icon className="mt-0.5 size-4 shrink-0 text-lavender" aria-hidden />
            {t}
          </li>
        )
      })}
    </ul>
  )
}

/* ------------------------------------------------------------------ Home hero */

// Rendered without entrance animations so the headline paints immediately (brief: hero < 2s on 4G).
export function FitHomeHero() {
  return (
    <div className="relative isolate overflow-hidden">
      <GlowOrbs />
      <DeskTexture />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-10 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pt-14 lg:pb-20">
        <div className="flex min-w-0 flex-col gap-6">
          <Eyebrow>{FIT.hero.eyebrow}</Eyebrow>
          <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {FIT.hero.headline}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-mist text-pretty">{FIT.hero.sub}</p>
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <EnrollLink location="home-hero" size="lg" />
              <a href="#tiers" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                See the 4 tiers
              </a>
              <Link href="/fit" className="group inline-flex items-center gap-2 px-2 text-sm text-lavender hover:underline">
                Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
            <ShortDisclaimer />
          </div>
          <TrustStrip className="border-t border-line pt-6" />
        </div>
        <div className="min-w-0">
          <StraddleChart />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ /fit hero */

export function FitPageHero() {
  return (
    <div className="relative isolate overflow-hidden border-b border-line">
      <GlowOrbs />
      <DeskTexture />
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-16 lg:pt-20 lg:pb-20">
        <Eyebrow>Program category</Eyebrow>
        <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-6xl">{FIT.page.headline}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist text-pretty">{FIT.page.sub}</p>
        <div className="mt-8 flex flex-col gap-3">
          <EnrollLink location="fit-hero" size="lg" className="w-full sm:w-fit" />
          <ShortDisclaimer />
        </div>
        <TrustStrip className="mt-10 max-w-4xl border-t border-line pt-6 lg:grid-cols-4" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ How it works */

// Animated, coloured step cards live in their own client component.
export { FitSteps } from './fit-steps'

/* ------------------------------------------------------------------ Tier cards */

export function TierCards({ location }: { location: string }) {
  return (
    <>
      <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FIT_TIERS.map((t) => (
          <StaggerItem as="li" key={t.id} className={cn('flex flex-col rounded-lg border border-line bg-surface p-6', cardHover)}>
            <p className="font-mono text-xs tracking-wider text-lavender uppercase">Tier {t.tier}</p>
            <h3 className="mt-3 text-xl leading-tight font-semibold text-balance">{t.name}</h3>
            <dl className="mt-5 flex flex-1 flex-col gap-4 text-sm">
              <div>
                <dt className="text-xs text-mist">Seminar</dt>
                <dd className="mt-1 text-paper">{t.seminar}</dd>
              </div>
              <div>
                <dt className="text-xs text-mist">Includes</dt>
                <dd className="mt-1 text-paper/90">{t.includes}</dd>
              </div>
              <div>
                <dt className="text-xs text-mist">Fee</dt>
                <dd className="mt-1 text-2xl font-semibold text-paper">
                  {inr(t.fee)}
                  <span className="ml-1.5 text-xs font-normal text-mist">{FIT_GST.included ? 'incl. GST' : '+ GST'}</span>
                </dd>
              </div>
              <div className="mt-auto border-t border-line pt-4">
                <dt className="text-xs text-mist">Eligible firm capital, if selected</dt>
                <dd className="mt-1 font-medium text-lavender">{t.capital}</dd>
              </div>
            </dl>
            <EnrollLink tier={t.id} location={location} className="mt-6 w-full" />
          </StaggerItem>
        ))}
      </Stagger>
      <Reveal className="mt-6 flex flex-col gap-3">
        <p className="text-sm text-paper/90 italic">{FIT.tiersNote}</p>
        <ShortDisclaimer className="max-w-3xl" />
      </Reveal>
    </>
  )
}

/* ------------------------------------------------------------------ Our programs */

function ProgramCard({ name, line, format, fee, children }: { name: string; line: string; format: string; fee: React.ReactNode; children: React.ReactNode }) {
  return (
    <StaggerItem as="li" className={cn('flex h-full flex-col rounded-lg border border-line bg-surface p-7', cardHover)}>
      <h3 className="text-2xl leading-tight font-semibold text-balance">{name}</h3>
      <p className="mt-3 leading-relaxed text-mist">{line}</p>
      <dl className="mt-6 flex flex-1 flex-col gap-4 border-t border-line pt-5 text-sm">
        <div>
          <dt className="text-xs text-mist">Format</dt>
          <dd className="mt-1 text-paper">{format}</dd>
        </div>
        <div>
          <dt className="text-xs text-mist">Fee</dt>
          <dd className="mt-1 text-paper">{fee}</dd>
        </div>
      </dl>
      <div className="mt-7">{children}</div>
    </StaggerItem>
  )
}

export function ProgramsGrid() {
  const { fit, tdp, optionSelling } = PROGRAMS
  return (
    <Stagger as="ul" className="grid gap-4 lg:grid-cols-3">
      <ProgramCard {...fit}>
        <div className="flex flex-wrap items-center gap-3">
          <EnrollLink location="home-programs" />
          <Link href="/fit" className="px-2 text-sm text-lavender hover:underline">
            Learn more
          </Link>
        </div>
        <ShortDisclaimer className="mt-3" />
      </ProgramCard>
      <ProgramCard
        {...tdp}
        fee={
          <>
            <s className="mr-2 text-mist">Worth {tdp.worth}</s>
            <span className="font-semibold text-lavender">{tdp.fee}</span>
          </>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/tdp#apply" className={buttonVariants()}>
            Apply Now
          </Link>
          <Link href="/tdp" className={cn(buttonVariants({ variant: 'outline' }), 'group')}>
            Full TDP details <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
        <p className="mt-3 text-xs text-mist">Selection by screening and interview.</p>
      </ProgramCard>
      <ProgramCard {...optionSelling}>
        <OptionSellingEnquiry />
      </ProgramCard>
    </Stagger>
  )
}

/* ------------------------------------------------------------------ Final band */

export function FinalEnrollBand({ location }: { location: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-xl border border-lavender/30 bg-surface p-8 md:p-14">
          <GlowOrbs />
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs tracking-[0.2em] text-lavender uppercase">{FIT.name}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance md:text-5xl">Turn your trading skill into a career.</h2>
              <p className="mt-4 text-lg text-mist">
                2-day live training, a free evaluation, and a path to an employee trader role on firm capital.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 md:max-w-xs">
              <EnrollLink location={location} size="lg" />
              <ShortDisclaimer />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------ What sets us apart */

// Static cards (no flip): smooth staggered entrance on scroll, plus a hover lift, an accent
// bar that draws across the top, and the number badge filling with lavender.
export function WhatSetsUsApart() {
  return (
    <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SETS_APART.map((c, i) => (
        <StaggerItem
          as="li"
          key={c.title}
          className={cn('group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface p-7', cardHover)}
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-lavender transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
          <span className="flex size-10 items-center justify-center rounded-full border border-lavender/50 font-mono text-sm text-lavender transition-colors duration-300 group-hover:bg-lavender group-hover:text-charcoal">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-6 text-xl leading-tight font-semibold text-balance">{c.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-mist">{c.text}</p>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
