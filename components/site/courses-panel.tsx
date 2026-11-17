'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ease } from '@/components/motion/primitives'
import { buttonVariants } from '@/components/ui/button'
import { EnquiryForm } from '@/components/site/forms'
import { COURSES } from '@/lib/site'
import { cn } from '@/lib/utils'

// Course cards with "Know More" → opens the enquiry form pre-set to that course.
export function CoursesPanel() {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  function knowMore(name: string) {
    setSelected(name)
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        {COURSES.map((c, i) => (
          <motion.article
            id={c.id}
            key={c.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.7, ease, delay: i * 0.12 }}
            className={cn(
              'flex scroll-mt-28 flex-col rounded-lg border bg-surface p-8 transition-colors hover:border-lavender/50',
              selected === c.name ? 'border-lavender' : 'border-line',
            )}
          >
            <p className="font-mono text-xs tracking-wider text-lavender uppercase">Duration · {c.duration}</p>
            <h2 className="mt-4 text-2xl font-semibold text-balance md:text-3xl">{c.name}</h2>
            <p className="mt-4 flex-1 text-base leading-relaxed text-mist text-pretty">{c.copy}</p>
            <button
              type="button"
              onClick={() => knowMore(c.name)}
              className={cn(buttonVariants({ variant: 'outline' }), 'mt-8 w-fit')}
            >
              Know More
            </button>
          </motion.article>
        ))}
      </div>

      <div id="enquiry" className="mt-20 scroll-mt-28 rounded-lg border border-line bg-surface p-6 md:p-10">
        <h2 className="text-2xl font-semibold md:text-3xl">Enquire about a course</h2>
        <p className="mt-3 mb-8 text-mist">Tell us a little about you and we will get back to you with batch details.</p>
        <EnquiryForm key={selected ?? 'default'} defaultCourse={selected} />
      </div>
    </>
  )
}
