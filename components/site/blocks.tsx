import Image from 'next/image'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { MENTORS, TEAM } from '@/lib/site'
import { GlowOrbs, Reveal, SplitHeadline, Stagger, StaggerItem, SpotlightCard } from '@/components/motion/primitives'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-lavender', className)}>
      <span aria-hidden className="h-px w-8 bg-lavender" />
      {children}
    </p>
  )
}

/** Hover treatment shared by content cards: soft lift, lavender edge, shadow. */
export const cardHover =
  'transition-[translate,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-lavender/60 hover:shadow-xl hover:shadow-black/10'

/**
 * Full-width band with a centred content column. `tone="light"` switches the band to the
 * light palette (soft white background, charcoal text) — the site alternates dark and light.
 */
export function Section({
  children,
  className,
  id,
  label,
  title,
  intro,
  tone = 'dark',
}: {
  children?: ReactNode
  className?: string
  id?: string
  label?: string
  title?: string
  intro?: string
  tone?: 'dark' | 'light'
}) {
  return (
    <section id={id} className={cn('bg-charcoal text-paper', tone === 'light' && 'theme-light', className)}>
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
        {(label || title || intro) && (
          <Reveal className="mb-12 flex max-w-3xl flex-col gap-5">
            {label && <Eyebrow>{label}</Eyebrow>}
            {title && <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">{title}</h2>}
            {intro && <p className="text-lg leading-relaxed text-mist text-pretty">{intro}</p>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}

export function PageHero({ label, title, lead }: { label: string; title: string; lead?: string }) {
  return (
    <div className="relative isolate overflow-hidden border-b border-line">
      <GlowOrbs />
      <div className="bg-grid-dark absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" aria-hidden />
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-16 lg:pt-20 lg:pb-20">
        <Reveal y={12}>
          <Eyebrow>{label}</Eyebrow>
        </Reveal>
        <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl">
          <SplitHeadline text={title} />
        </h1>
        {lead && (
          <Reveal delay={0.4}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist text-pretty">{lead}</p>
          </Reveal>
        )}
      </div>
    </div>
  )
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

export function TeamCards() {
  return (
    <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:max-w-4xl">
      {TEAM.map((p) => (
        <StaggerItem as="li" key={p.name}>
          <SpotlightCard className="flex h-full flex-col gap-4 rounded-lg border border-line bg-surface p-7 transition-colors hover:border-lavender/50">
            <span className="flex size-14 items-center justify-center rounded-full border border-lavender/40 font-mono text-sm text-lavender">{initials(p.name)}</span>
            <div className="mt-4">
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <p className="mt-1 font-mono text-xs tracking-wider text-lavender uppercase">{p.role}</p>
            </div>
            {p.bio && <p className="mt-3 text-sm leading-relaxed text-mist">{p.bio}</p>}
          </SpotlightCard>
        </StaggerItem>
      ))}
    </Stagger>
  )
}

/** "Our Mentors" — photo, name and role, with their experience listed below the profile. */
export function MentorCards() {
  return (
    <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {MENTORS.map((m) => (
        <StaggerItem as="li" key={m.name} className={cn('flex h-full flex-col rounded-lg border border-line bg-surface p-7', cardHover)}>
          <div className="flex items-center gap-4">
            <Image src={m.image} alt={m.sample ? '' : `Photo of ${m.name}`} width={64} height={64} className="size-16 shrink-0 rounded-full border border-line object-cover" />
            <div className="min-w-0">
              <h3 className="text-lg leading-tight font-semibold">{m.name}</h3>
              <p className="mt-1 font-mono text-xs tracking-wider text-lavender uppercase">{m.role}</p>
            </div>
          </div>
          <ul className="mt-6 flex flex-col gap-2.5 border-t border-line pt-5 text-sm leading-relaxed text-mist">
            {m.experience.map((e) => (
              <li key={e} className="flex gap-2.5">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rotate-45 bg-lavender" />
                {e}
              </li>
            ))}
          </ul>
          {m.sample && (
            <p className="mt-6 w-fit rounded-sm border border-line px-2 py-0.5 font-mono text-[10px] tracking-widest text-mist uppercase">Sample profile</p>
          )}
        </StaggerItem>
      ))}
    </Stagger>
  )
}
