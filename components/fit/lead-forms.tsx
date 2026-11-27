'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CircleCheck, LoaderCircle } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { ease } from '@/components/motion/primitives'
import { WhatsAppIcon } from '@/components/site/whatsapp-icon'
import { buttonVariants } from '@/components/ui/button'
import { GET_TRADERS } from '@/lib/fit'
import { SITE } from '@/lib/site'
import { getUtm, track } from '@/lib/track'
import { cn } from '@/lib/utils'
import { normalizeIndianMobile } from '@/lib/validate'

export const fieldClass =
  'w-full rounded-md border border-line bg-charcoal px-4 py-3 text-sm text-paper placeholder:text-mist/60 focus:border-lavender focus:outline-none focus:ring-1 focus:ring-lavender disabled:opacity-60'
export const labelClass = 'flex flex-col gap-2 text-sm text-paper/90'

const waLink = (text: string) => `${SITE.whatsappUrl}?text=${encodeURIComponent(text)}`

type LeadType = 'get-traders-notify' | 'option-selling-enquiry'

function LeadForm({
  type,
  withCity,
  mobileLabel,
  submitLabel,
  success,
  whatsappText,
}: {
  type: LeadType
  withCity?: boolean
  mobileLabel: string
  submitLabel: string
  success: string
  whatsappText: string
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = {
      type,
      name: String(f.get('name') ?? ''),
      mobile: String(f.get('mobile') ?? ''),
      city: String(f.get('city') ?? ''),
      website: String(f.get('website') ?? ''),
      utm: getUtm(),
    }
    if (!normalizeIndianMobile(body.mobile)) {
      setError('Enter a valid 10-digit Indian mobile number.')
      return
    }
    setError('')
    setState('sending')
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      track({ name: 'lead', lead_type: type })
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setState('idle')
    }
  }

  if (state === 'done') {
    return (
      <p role="status" className="flex items-start gap-3 rounded-md border border-lavender/40 bg-charcoal p-4 text-sm text-paper">
        <CircleCheck className="mt-0.5 size-4 shrink-0 text-lavender" aria-hidden /> {success}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className={labelClass}>
        Name *
        <input required name="name" autoComplete="name" maxLength={100} className={fieldClass} />
      </label>
      <label className={labelClass}>
        {mobileLabel} *
        <input required name="mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" maxLength={16} className={fieldClass} />
      </label>
      {withCity && (
        <label className={labelClass}>
          City *
          <input required name="city" autoComplete="address-level2" maxLength={80} className={fieldClass} />
        </label>
      )}
      {/* Honeypot for bots — hidden from people and screen readers. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {error && (
        <p role="alert" className="text-sm text-paper">
          {error}{' '}
          <a href={waLink(whatsappText)} target="_blank" rel="noopener noreferrer" className="text-lavender underline">
            WhatsApp us
          </a>
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={state === 'sending'} className={buttonVariants()}>
          {state === 'sending' && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

function Expander({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
          <div className="pt-5">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Programs card — Advanced Option Selling Mentorship: Enquire Now → short form (name, mobile, city) + WhatsApp. */
export function OptionSellingEnquiry() {
  const [open, setOpen] = useState(false)
  const id = useId()
  const text = 'Hi, I would like to know the fee and next batch for the Advanced Option Selling Mentorship.'
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className={buttonVariants({ variant: 'outline' })}>
          Enquire Now
        </button>
        <a href={waLink(text)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'ghost' })}>
          <WhatsAppIcon className="size-4" /> WhatsApp
        </a>
      </div>
      <div id={id}>
        <Expander open={open}>
          <LeadForm
            type="option-selling-enquiry"
            withCity
            mobileLabel="Mobile"
            submitLabel="Send enquiry"
            success="Thank you. Our team will call you with the fee and next batch details."
            whatsappText={text}
          />
        </Expander>
      </div>
    </div>
  )
}

/** Homepage "Get Traders — Coming Soon" teaser band. No details until the team supplies them. */
export function GetTradersBand() {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="rounded-xl border border-dashed border-lavender/40 bg-surface/60 p-7 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-lavender/50 bg-lavender/10 px-3 py-1 font-mono text-[10px] tracking-widest text-lavender uppercase">
              {GET_TRADERS.badge}
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{GET_TRADERS.headline}</h2>
            <p className="mt-2 text-lg text-mist">{GET_TRADERS.line}</p>
          </div>
          <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'shrink-0')}>
            <Bell className="size-4" aria-hidden /> Notify Me
          </button>
        </div>
        <div id={id} className="max-w-md">
          <Expander open={open}>
            <LeadForm
              type="get-traders-notify"
              mobileLabel="Mobile / WhatsApp number"
              submitLabel="Notify me"
              success="Thank you. We will message you as soon as it launches."
              whatsappText="Hi, please notify me when Get Traders launches."
            />
          </Expander>
        </div>
      </div>
    </section>
  )
}
