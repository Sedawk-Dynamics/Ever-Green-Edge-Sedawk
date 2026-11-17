import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { TEAM } from '@/lib/site'
import { GlowOrbs, Reveal, SplitHeadline, Stagger, StaggerItem, SpotlightCard } from '@/components/motion/primitives'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-lavender', className)}>
      <span aria-hidden className="h-px w-8 bg-lavender" />
      {children}
    </p>
  )
}

export function Section({
  children,
  className,
  id,
  label,
  title,
  intro,
}: {
  children?: ReactNode
  className?: string
  id?: string
  label?: string
  title?: string
  intro?: string
}) {
  return (
    <section id={id} className={cn('mx-auto max-w-6xl px-5 py-20 lg:py-28', className)}>
      {(label || title || intro) && (
        <Reveal className="mb-14 flex max-w-3xl flex-col gap-5">
          {label && <Eyebrow>{label}</Eyebrow>}
          {title && <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">{title}</h2>}
          {intro && <p className="text-lg leading-relaxed text-mist text-pretty">{intro}</p>}
        </Reveal>
      )}
      {children}
    </section>
  )
}

export function PageHero({ label, title, lead }: { label: string; title: string; lead?: string }) {
  return (
    <div className="relative isolate overflow-hidden border-b border-line">
      <GlowOrbs />
      <div className="bg-grid-dark absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" aria-hidden />
      <div className="mx-auto max-w-6xl px-5 pt-36 pb-20 lg:pt-44 lg:pb-24">
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

export function TeamCards() {
  return (
    <Stagger as="ul" className="grid gap-5 md:grid-cols-3">
      {TEAM.map((p) => (
        <StaggerItem as="li" key={p.name}>
          <SpotlightCard className="flex h-full flex-col gap-4 rounded-lg border border-line bg-surface p-7 transition-colors hover:border-lavender/40">
            <span className="flex size-14 items-center justify-center rounded-full border border-lavender/40 font-mono text-sm text-lavender">
              {p.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)}
            </span>
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
