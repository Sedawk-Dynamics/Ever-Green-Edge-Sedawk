'use client'

import { useState, type FormEvent } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { ALSO_OFFERED, COURSES, SITE } from '@/lib/site'
import { cn } from '@/lib/utils'

// NOTE: no backend is connected yet. Submitting opens the visitor's email app
// with the details filled in, addressed to SITE.email. Replace `send` with a
// real endpoint (form handler, CRM, etc.) before launch.
function send(subject: string, lines: [string, string][]) {
  const body = lines.map(([k, v]) => `${k}: ${v || '-'}`).join('\n')
  window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const field =
  'w-full rounded-md border border-line bg-charcoal px-4 py-3 text-sm text-paper placeholder:text-mist/60 focus:border-lavender focus:outline-none focus:ring-1 focus:ring-lavender'
const label = 'flex flex-col gap-2 text-sm text-paper/90'

const EXPERIENCE = ['None', 'Under 1 year', '1–3 years', '3+ years']

export function ApplyForm() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const g = (k: string) => String(f.get(k) ?? '')
    send('TDP application', [
      ['Full name', g('name')],
      ['Phone', g('phone')],
      ['Email', g('email')],
      ['City', g('city')],
      ['Age', g('age')],
      ['Education', g('education')],
      ['Current occupation', g('occupation')],
      ['Trading experience', g('experience')],
      ['Markets traded', g('markets')],
      ['Why do you want to become a professional trader?', g('why')],
      ['Available for 6 months full-time', g('availability')],
    ])
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-lavender/40 bg-surface p-8">
        <h3 className="text-2xl font-semibold">Thank you.</h3>
        <p className="mt-3 text-mist">
          Your email app should have opened with your application. Press send to complete it. We will review every
          application and be in touch.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
      <label className={label}>Full name *<input required name="name" className={field} autoComplete="name" /></label>
      <label className={label}>Phone *<input required name="phone" type="tel" className={field} autoComplete="tel" /></label>
      <label className={label}>Email *<input required name="email" type="email" className={field} autoComplete="email" /></label>
      <label className={label}>City *<input required name="city" className={field} autoComplete="address-level2" /></label>
      <label className={label}>Age *<input required name="age" type="number" min={16} max={80} className={field} /></label>
      <label className={label}>Education *<input required name="education" className={field} /></label>
      <label className={label}>Current occupation *<input required name="occupation" className={field} /></label>
      <label className={label}>
        Trading experience *
        <select required name="experience" defaultValue="" className={field}>
          <option value="" disabled>Select one</option>
          {EXPERIENCE.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </label>
      <label className={cn(label, 'md:col-span-2')}>Markets traded *<input required name="markets" placeholder="e.g. NIFTY options, equities, FX" className={field} /></label>
      <label className={cn(label, 'md:col-span-2')}>
        Why do you want to become a professional trader? *
        <textarea required name="why" rows={4} maxLength={600} className={field} />
      </label>
      <fieldset className={cn(label, 'md:col-span-2')}>
        <legend className="mb-2">Are you available for 6 months full-time? *</legend>
        <div className="flex gap-6">
          <label className="flex items-center gap-2"><input required type="radio" name="availability" value="Yes" className="accent-lavender" /> Yes</label>
          <label className="flex items-center gap-2"><input required type="radio" name="availability" value="No" className="accent-lavender" /> No</label>
        </div>
      </fieldset>
      <div className="md:col-span-2 flex flex-col gap-4 pt-2">
        <button type="submit" className={cn(buttonVariants({ size: 'lg' }), 'w-full md:w-fit')}>
          Submit application
        </button>
        <p className="text-xs leading-relaxed text-mist">
          TDP is free and selection-based. Every applicant is screened and interviewed before any seat is offered.
        </p>
      </div>
    </form>
  )
}

export function EnquiryForm({ defaultCourse, id }: { defaultCourse?: string; id?: string }) {
  const [sent, setSent] = useState(false)
  const options = [...COURSES.map((c) => c.name), ...ALSO_OFFERED.map((o) => o.name), 'General enquiry']
  const initial = defaultCourse && options.includes(defaultCourse) ? defaultCourse : options[0]

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const g = (k: string) => String(f.get(k) ?? '')
    send(`Enquiry: ${g('course')}`, [
      ['Name', g('name')],
      ['Phone', g('phone')],
      ['Email', g('email')],
      ['Course interested in', g('course')],
      ['Preferred batch', g('batch')],
    ])
    setSent(true)
  }

  if (sent) {
    return (
      <div id={id} className="rounded-lg border border-lavender/40 bg-surface p-8">
        <h3 className="text-2xl font-semibold">Thank you.</h3>
        <p className="mt-3 text-mist">Your email app should have opened with your enquiry. Press send to complete it.</p>
      </div>
    )
  }

  return (
    <form id={id} onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
      <label className={label}>Name *<input required name="name" className={field} autoComplete="name" /></label>
      <label className={label}>Phone *<input required name="phone" type="tel" className={field} autoComplete="tel" /></label>
      <label className={label}>Email *<input required name="email" type="email" className={field} autoComplete="email" /></label>
      <label className={label}>
        Course interested in *
        <select required name="course" defaultValue={initial} className={field}>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </label>
      <label className={cn(label, 'md:col-span-2')}>Preferred batch<input name="batch" placeholder="e.g. weekend, next available" className={field} /></label>
      <div className="md:col-span-2">
        <button type="submit" className={cn(buttonVariants(), 'w-full md:w-fit')}>Send enquiry</button>
      </div>
    </form>
  )
}
