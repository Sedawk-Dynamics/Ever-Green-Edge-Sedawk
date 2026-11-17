'use client'

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { ArrowRight, Check, Minus, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ease } from '@/components/motion/primitives'
import { COURSES, TDP } from '@/lib/site'
import { cn } from '@/lib/utils'

/* ---------------------------------------------------------------- Programs tabs */

export function ProgramTabs() {
  const tabs = [
    { id: 'tdp', label: 'Flagship · TDP' },
    ...COURSES.map((c) => ({ id: c.id, label: c.name.replace(' Automation', '') })),
  ]
  const [active, setActive] = useState('tdp')
  const course = COURSES.find((c) => c.id === active)

  return (
    <div>
      <div role="tablist" aria-label="Programs" className="flex flex-wrap gap-1 rounded-lg border border-line bg-surface p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active === t.id}
            aria-controls="program-panel"
            onClick={() => setActive(t.id)}
            className={cn(
              'relative flex-1 rounded-md px-4 py-3 text-sm whitespace-nowrap transition-colors',
              active === t.id ? 'text-charcoal' : 'text-paper/70 hover:text-paper',
            )}
          >
            {active === t.id && (
              <motion.span layoutId="program-tab" className="absolute inset-0 rounded-md bg-lavender" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <div id="program-panel" role="tabpanel" className="relative mt-6 min-h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease }}
            className="grid gap-8 rounded-lg border border-line bg-surface p-7 md:p-10 lg:grid-cols-[1.3fr_1fr]"
          >
            {active === 'tdp' ? (
              <>
                <div className="flex flex-col gap-5">
                  <p className="font-mono text-xs tracking-wider text-lavender uppercase">Free · Selection-based · In person</p>
                  <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">Trader Development Program</h3>
                  <p className="text-lg text-paper/90">{TDP.tagline}</p>
                  <p className="leading-relaxed text-mist">
                    Full-time, 6-month deep mentorship for 10–12 selected trainees, on our Pune desk, under professional
                    risk rules. You never put your own money at risk.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <Link href="/tdp#apply" className={buttonVariants()}>
                      Apply for TDP <ArrowRight className="size-4" aria-hidden />
                    </Link>
                    <Link href="/tdp" className={buttonVariants({ variant: 'outline' })}>
                      Program details
                    </Link>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-lg border border-line bg-line">
                  {TDP.details.slice(0, 4).map((d, i) => (
                    <motion.div
                      key={d.label}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease }}
                      className="flex flex-col gap-1 bg-charcoal p-5"
                    >
                      <dt className="text-xs text-mist">{d.label}</dt>
                      <dd className="text-lg font-medium">{d.value}</dd>
                    </motion.div>
                  ))}
                </dl>
              </>
            ) : course ? (
              <>
                <div className="flex flex-col gap-5">
                  <p className="font-mono text-xs tracking-wider text-lavender uppercase">Paid course · {course.duration}</p>
                  <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">{course.name}</h3>
                  <p className="leading-relaxed text-mist">{course.copy}</p>
                  <Link href={`/courses#${course.id}`} className={cn(buttonVariants(), 'mt-2 w-fit')}>
                    Know More <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
                <div className="flex flex-col justify-center gap-4 self-start rounded-lg border border-line bg-charcoal p-6">
                  <p className="text-xs text-mist">Duration</p>
                  <p className="text-2xl font-medium">{course.duration}</p>
                  <p className="text-xs text-mist">Mentored by practising traders from our desk.</p>
                </div>
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------- Scroll-drawn timeline */

export function Timeline({ steps }: { steps: { title: string; text: string }[] }) {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <ol ref={ref} className="relative ml-3 flex flex-col gap-12 md:ml-0">
      <span aria-hidden className="absolute top-2 bottom-2 left-0 w-px bg-line md:left-1/2" />
      <motion.span aria-hidden style={{ height }} className="absolute top-2 left-0 w-px origin-top bg-lavender md:left-1/2" />
      {steps.map((s, i) => {
        const right = i % 2 === 1
        return (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, x: right ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
            className={cn('relative pl-10 md:w-1/2 md:pl-0', right ? 'md:ml-auto md:pl-14' : 'md:pr-14 md:text-right')}
          >
            <span
              aria-hidden
              className={cn(
                'absolute top-1 left-0 flex size-7 -translate-x-1/2 items-center justify-center rounded-full border border-lavender bg-charcoal font-mono text-[11px] text-lavender',
                right ? 'md:left-0' : 'md:right-0 md:left-auto md:translate-x-1/2',
              )}
            >
              {i + 1}
            </span>
            <h3 className="text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-mist">{s.text}</p>
          </motion.li>
        )
      })}
    </ol>
  )
}

/* ---------------------------------------------------------------- Comparison */

const COMPARE = [
  { k: 'How you get in', them: 'Buy an evaluation challenge', us: 'Application, screening and interview' },
  { k: 'Cost to you', them: 'A fee for every challenge attempt', us: 'Zero fees' },
  { k: 'Your own money at risk', them: 'Your challenge fees', us: 'None' },
  { k: 'Mentorship', them: 'Not the core product', us: '6 months, one-on-one and small groups, by practising traders' },
  { k: 'Where you trade', them: 'Remote, on your own', us: 'From our Pune office, alongside a working desk' },
  { k: 'Path to capital', them: 'Pass a paid challenge', us: 'Opportunity to trade firm capital, based on consistency and risk discipline' },
]

export function Comparison() {
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="grid grid-cols-[1fr_1fr] bg-surface text-sm md:grid-cols-[0.9fr_1fr_1.2fr]">
        <div className="hidden p-5 md:block" />
        <div className="border-l border-line p-5 text-mist md:border-l">Typical challenge-fee model</div>
        <div className="relative border-l border-line p-5 font-medium text-lavender">
          The Trader Foundry
          <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-lavender" />
        </div>
      </div>
      {COMPARE.map((row, i) => (
        <motion.div
          key={row.k}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: i * 0.06, duration: 0.5, ease }}
          className="grid grid-cols-[1fr_1fr] border-t border-line text-sm md:grid-cols-[0.9fr_1fr_1.2fr]"
        >
          <div className="col-span-2 bg-charcoal px-5 pt-4 font-medium md:col-span-1 md:py-5">{row.k}</div>
          <div className="flex items-start gap-2 p-5 text-mist md:border-l md:border-line">
            <Minus className="mt-0.5 size-4 shrink-0 text-mist/60" aria-hidden />
            {row.them}
          </div>
          <div className="flex items-start gap-2 border-l border-line bg-lavender/[0.04] p-5 text-paper">
            <Check className="mt-0.5 size-4 shrink-0 text-lavender" aria-hidden />
            {row.us}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- FAQ accordion */

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <li key={it.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-medium transition-colors hover:text-lavender md:text-lg"
            >
              {it.q}
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3, ease }} className="shrink-0 text-lavender">
                <Plus className="size-5" aria-hidden />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 leading-relaxed text-mist">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
