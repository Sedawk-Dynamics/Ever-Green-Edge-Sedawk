'use client'

import { CircleCheck, LoaderCircle, Lock, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { WhatsAppIcon } from '@/components/site/whatsapp-icon'
import { buttonVariants } from '@/components/ui/button'
import { ShortDisclaimer } from './disclaimers'
import { fieldClass, labelClass } from './lead-forms'
import { batchesFor, ENROLL_FORM, FIT_BATCHES, FIT_GST, FIT_TIERS, getTier, inr, priceFor, type TierId } from '@/lib/fit'
import { SITE } from '@/lib/site'
import { getUtm, track } from '@/lib/track'
import { cn } from '@/lib/utils'
import { ageOn, latestAdultDob, normalizeIndianMobile } from '@/lib/validate'

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
type RazorpayInstance = { open(): void; on(event: 'payment.failed', cb: (r: { error?: { description?: string } }) => void): void }

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance
  }
}

function loadCheckout(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true)
  return new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.async = true
    s.onload = () => resolve(!!window.Razorpay)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

async function post<T>(url: string, body: unknown): Promise<T & { ok: boolean; error?: string; status: number }> {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const data = await res.json().catch(() => ({ ok: false, error: 'Something went wrong. Please try again.' }))
  return { ...data, ok: res.ok && data.ok, status: res.status }
}

const StepTitle = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <span className="flex items-center gap-3 text-xl font-semibold md:text-2xl">
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-lavender font-mono text-sm text-lavender">{n}</span>
    {children}
  </span>
)

export function EnrollFlow({ initialTier }: { initialTier: TierId | null }) {
  const [tier, setTier] = useState<TierId | null>(initialTier)
  const [batch, setBatch] = useState(() => (initialTier && batchesFor(initialTier).length === 1 ? batchesFor(initialTier)[0].id : ''))

  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'verified'>('idle')
  const [code, setCode] = useState('')
  const [token, setToken] = useState('')
  const [otpMsg, setOtpMsg] = useState<{ error: boolean; text: string } | null>(null)
  const [cooldown, setCooldown] = useState(0)

  const [dobError, setDobError] = useState('')
  const [consents, setConsents] = useState<boolean[]>(() => ENROLL_FORM.consents.map(() => false))

  const [phase, setPhase] = useState<'form' | 'creating' | 'paying' | 'confirming'>('form')
  const [error, setError] = useState('')
  const [done, setDone] = useState<{ tierName: string; amountPaid: number; paymentId: string } | null>(null)

  const started = useRef(false)
  const topRef = useRef<HTMLDivElement>(null)
  const maxDob = useMemo(() => latestAdultDob(), [])
  const price = tier ? priceFor(tier) : null
  const batches = tier ? batchesFor(tier) : []
  const busy = phase !== 'form'

  useEffect(() => {
    if (cooldown <= 0) return
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => window.clearTimeout(id)
  }, [cooldown])

  function chooseTier(id: TierId) {
    setTier(id)
    const list = batchesFor(id)
    setBatch((b) => (list.some((x) => x.id === b) ? b : list.length === 1 ? list[0].id : ''))
  }

  function onFormStart() {
    if (started.current) return
    started.current = true
    track({ name: 'form_start', tier: tier ?? undefined })
  }

  function changeMobile(v: string) {
    setMobile(v)
    if (otp !== 'idle') {
      setOtp('idle')
      setToken('')
      setCode('')
      setOtpMsg(null)
    }
  }

  async function sendOtp() {
    if (!name.trim()) return setOtpMsg({ error: true, text: 'Enter your full name first.' })
    const m = normalizeIndianMobile(mobile)
    if (!m) return setOtpMsg({ error: true, text: 'Enter a valid 10-digit Indian mobile number.' })
    setOtp('sending')
    setOtpMsg(null)
    const r = await post('/api/otp/send', { mobile: m, name })
    if (!r.ok) {
      setOtp('idle')
      return setOtpMsg({ error: true, text: r.error ?? 'We could not send the OTP.' })
    }
    setOtp('sent')
    setCooldown(30)
    setOtpMsg({ error: false, text: `We sent a code by SMS to ${m.replace('+91', '+91 ')}.` })
  }

  async function verifyOtp() {
    const m = normalizeIndianMobile(mobile)
    if (!m || !/^\d{4,8}$/.test(code)) return setOtpMsg({ error: true, text: 'Enter the code from the SMS.' })
    setOtp('verifying')
    const r = await post<{ token?: string }>('/api/otp/verify', { mobile: m, code, name, tier, utm: getUtm() })
    if (!r.ok || !r.token) {
      setOtp('sent')
      return setOtpMsg({ error: true, text: r.error ?? 'That code did not work.' })
    }
    setToken(r.token)
    setOtp('verified')
    setOtpMsg(null)
    track({ name: 'lead', lead_type: 'fit-otp-verified', tier: tier ?? undefined })
  }

  function checkDob(v: string) {
    const age = ageOn(v)
    setDobError(v && age !== null && age < 18 ? 'You must be 18 or older to enroll.' : '')
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    if (!tier || !price) {
      setError('Choose a tier in step 1.')
      return topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (otp !== 'verified' || !token) return setError('Verify your mobile number with OTP before paying.')
    const f = new FormData(e.currentTarget)
    const dob = String(f.get('dob') ?? '')
    const age = ageOn(dob)
    if (age === null) return setError('Enter a valid date of birth.')
    if (age < 18) return setError('You must be 18 or older to enroll.')
    if (!consents.every(Boolean)) return setError('Please tick all the consent boxes.')

    setPhase('creating')
    const order = await post<{ orderId: string; amount: number; currency: string; keyId: string; tierName: string; total: number; mobile: string }>('/api/fit/order', {
      token,
      tier,
      batch,
      name,
      email: f.get('email'),
      city: f.get('city'),
      dob,
      occupation: f.get('occupation'),
      experience: f.get('experience'),
      nism: f.get('nism'),
      consents,
      utm: getUtm(),
    })
    if (!order.ok) {
      setPhase('form')
      if (order.status === 401) {
        setOtp('idle')
        setToken('')
      }
      return setError(order.error ?? 'We could not start the payment.')
    }

    track({ name: 'begin_checkout', tier: order.tierName, value: order.total })
    if (!(await loadCheckout()) || !window.Razorpay) {
      setPhase('form')
      return setError('The payment window could not load. Check your connection and try again.')
    }

    setPhase('paying')
    const rzp = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: SITE.name,
      description: `FIT — ${order.tierName} · 2-day live online seminar`,
      prefill: { name, email: String(f.get('email') ?? ''), contact: order.mobile },
      theme: { color: '#b9a8ff' },
      modal: {
        ondismiss: () => {
          setPhase((p) => (p === 'paying' ? 'form' : p))
          setError((msg) => msg || 'Payment was not completed. You can try again.')
        },
      },
      handler: async (resp: RazorpayResponse) => {
        setPhase('confirming')
        setError('')
        const c = await post<{ tierName: string; amountPaid: number; paymentId: string }>('/api/fit/confirm', resp)
        track({ name: 'purchase', tier: order.tierName, value: order.total, transaction_id: resp.razorpay_payment_id })
        setDone({
          tierName: c.ok ? c.tierName || order.tierName : order.tierName,
          amountPaid: c.ok ? c.amountPaid : order.total,
          paymentId: resp.razorpay_payment_id,
        })
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      },
    })
    rzp.on('payment.failed', (r) => setError(r?.error?.description || 'The payment failed. No money was taken; please try again.'))
    rzp.open()
  }

  /* -------------------------------------------------------------- Confirmation */

  if (done) {
    return (
      <div ref={topRef} role="status" className="scroll-mt-28 rounded-xl border border-lavender/40 bg-surface p-8 md:p-12">
        <CircleCheck className="size-10 text-lavender" aria-hidden />
        <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">Payment received. You are enrolled.</h2>
        <p className="mt-3 text-lg text-mist">FIT — {done.tierName} · 2-day live online seminar</p>
        <dl className="mt-8 grid max-w-xl gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          <div className="bg-charcoal p-4">
            <dt className="text-xs text-mist">Amount paid</dt>
            <dd className="mt-1 text-lg font-medium">{inr(done.amountPaid)}</dd>
          </div>
          <div className="bg-charcoal p-4">
            <dt className="text-xs text-mist">Payment ID</dt>
            <dd className="mt-1 font-mono text-sm break-all">{done.paymentId}</dd>
          </div>
        </dl>
        <p className="mt-8 max-w-2xl leading-relaxed text-paper/90">
          We will send your seminar date, joining link and our contact number by email and WhatsApp. Your GST invoice will be emailed to you.
        </p>
        <p className="mt-3 text-mist">
          Questions? Call or WhatsApp{' '}
          <a href={`tel:${SITE.phoneTel}`} className="text-lavender hover:underline">
            {SITE.phoneDisplay}
          </a>
          .
        </p>
        <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: 'outline' }), 'mt-8')}>
          <WhatsAppIcon className="size-4" /> WhatsApp us
        </a>
      </div>
    )
  }

  /* ---------------------------------------------------------------------- Form */

  return (
    <form onSubmit={onSubmit} onFocusCapture={onFormStart} className="flex flex-col gap-8">
      {/* Step 1 — tier */}
      <div ref={topRef} className="scroll-mt-28 rounded-xl border border-line bg-surface p-6 md:p-8">
        <fieldset>
          <legend className="mb-6">
            <StepTitle n={1}>Choose your tier</StepTitle>
          </legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FIT_TIERS.map((t) => (
              <label
                key={t.id}
                className="relative flex cursor-pointer flex-col rounded-lg border border-line bg-charcoal p-5 transition-colors hover:border-lavender/50 has-[:checked]:border-lavender has-[:checked]:bg-lavender/[0.07] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-lavender"
              >
                <input type="radio" name="tier" value={t.id} checked={tier === t.id} onChange={() => chooseTier(t.id)} required disabled={busy} className="sr-only" />
                <span className="font-mono text-xs tracking-wider text-lavender uppercase">Tier {t.tier}</span>
                <span className="mt-2 font-semibold leading-snug">{t.name}</span>
                <span className="mt-4 text-xl font-semibold">
                  {inr(t.fee)}
                  <span className="ml-1 text-xs font-normal text-mist">{FIT_GST.included ? 'incl. GST' : '+ GST'}</span>
                </span>
                <span className="mt-1 text-xs text-mist">Eligible firm capital, if selected: {t.capital}</span>
                {tier === t.id && <CircleCheck className="absolute top-4 right-4 size-5 text-lavender" aria-hidden />}
              </label>
            ))}
          </div>
        </fieldset>

        <div aria-live="polite" className="mt-6 rounded-lg border border-line bg-charcoal p-5">
          {tier && price ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-mist">
                  Tier {getTier(tier).tier} · {getTier(tier).name}
                </p>
                <dl className="mt-3 flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-mist">Seminar fee</dt>
                    <dd>{inr(price.base)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-mist">GST ({Math.round(FIT_GST.rate * 100)}%)</dt>
                    <dd>{inr(price.gst)}</dd>
                  </div>
                  <div className="mt-1 flex justify-between gap-4 border-t border-line pt-2 text-base font-semibold">
                    <dt>Total</dt>
                    <dd>{inr(price.total)}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <p className="text-sm text-mist">Batch dates</p>
                {FIT_BATCHES.length && batches[0]?.id !== 'next-available' ? (
                  <ul className="mt-3 flex flex-col gap-1.5 text-sm">
                    {batches.map((b) => (
                      <li key={b.id}>{b.label}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm">New batch dates are being scheduled. Our team will confirm your date after enrollment.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-mist">Choose a tier to see the fee, GST and batch dates.</p>
          )}
        </div>
      </div>

      {/* Step 2 — details */}
      <fieldset disabled={busy} className="rounded-xl border border-line bg-surface p-6 md:p-8">
        <legend className="float-left mb-6 w-full">
          <StepTitle n={2}>Your details</StepTitle>
        </legend>
        <div className="clear-both grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Full name *
            <input required name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={100} className={fieldClass} />
          </label>

          <div className={labelClass}>
            <label htmlFor="enroll-mobile">Mobile (OTP verified) *</label>
            <div className="flex gap-2">
              <input
                id="enroll-mobile"
                required
                name="mobile"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="10-digit mobile"
                value={mobile}
                onChange={(e) => changeMobile(e.target.value)}
                readOnly={otp === 'verified'}
                maxLength={16}
                className={cn(fieldClass, otp === 'verified' && 'border-lavender/60')}
              />
              {otp === 'verified' ? (
                <span className="flex shrink-0 items-center gap-1.5 px-2 text-sm text-lavender">
                  <ShieldCheck className="size-4" aria-hidden /> Verified
                </span>
              ) : (
                <button type="button" onClick={sendOtp} disabled={otp === 'sending' || otp === 'verifying' || cooldown > 0} className={cn(buttonVariants({ variant: 'outline' }), 'h-auto shrink-0 px-4')}>
                  {otp === 'sending' && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
                  {otp === 'idle' || otp === 'sending' ? 'Send OTP' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
                </button>
              )}
            </div>
            {otp === 'verified' && (
              <button type="button" onClick={() => changeMobile(mobile)} className="w-fit text-xs text-mist underline hover:text-paper">
                Change number
              </button>
            )}
            {(otp === 'sent' || otp === 'verifying') && (
              <div className="flex gap-2">
                <input
                  aria-label="OTP code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter OTP"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  className={fieldClass}
                />
                <button type="button" onClick={verifyOtp} disabled={otp === 'verifying'} className={cn(buttonVariants(), 'h-auto shrink-0 px-5')}>
                  {otp === 'verifying' && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
                  Verify
                </button>
              </div>
            )}
            {otpMsg && (
              <p role={otpMsg.error ? 'alert' : 'status'} className={cn('text-xs', otpMsg.error ? 'text-paper' : 'text-mist')}>
                {otpMsg.text}
              </p>
            )}
          </div>

          <label className={labelClass}>
            Email *
            <input required name="email" type="email" autoComplete="email" maxLength={120} className={fieldClass} />
          </label>
          <label className={labelClass}>
            City *
            <input required name="city" autoComplete="address-level2" maxLength={80} className={fieldClass} />
          </label>
          <label className={labelClass}>
            Date of birth *
            <input required name="dob" type="date" max={maxDob} onChange={(e) => checkDob(e.target.value)} className={fieldClass} aria-invalid={!!dobError} />
            {dobError && (
              <span role="alert" className="text-xs text-paper">
                {dobError}
              </span>
            )}
          </label>
          <label className={labelClass}>
            Occupation *
            <input required name="occupation" maxLength={100} className={fieldClass} />
          </label>
          <label className={labelClass}>
            Trading experience *
            <select required name="experience" defaultValue="" className={fieldClass}>
              <option value="" disabled>
                Select one
              </option>
              {ENROLL_FORM.experience.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            NISM Series VIII status *
            <select required name="nism" defaultValue="" className={fieldClass}>
              <option value="" disabled>
                Select one
              </option>
              {ENROLL_FORM.nism.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className={cn(labelClass, 'md:col-span-2')}>
            Preferred batch date *
            <select required name="batch" value={batch} onChange={(e) => setBatch(e.target.value)} disabled={!tier} className={fieldClass}>
              <option value="" disabled>
                {tier ? 'Select a batch' : 'Choose a tier first'}
              </option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      {/* Step 3 — consent */}
      <fieldset disabled={busy} className="rounded-xl border border-line bg-surface p-6 md:p-8">
        <legend className="float-left mb-6 w-full">
          <StepTitle n={3}>Consent</StepTitle>
        </legend>
        <ul className="clear-both flex flex-col gap-4">
          {ENROLL_FORM.consents.map((c, i) => (
            <li key={c}>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-paper/90">
                <input
                  type="checkbox"
                  required
                  checked={consents[i]}
                  onChange={(e) => setConsents((prev) => prev.map((v, j) => (j === i ? e.target.checked : v)))}
                  className="mt-1 size-4 shrink-0 accent-lavender"
                />
                {c}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {/* Step 4 — pay */}
      <div className="rounded-xl border border-line bg-surface p-6 md:p-8">
        <StepTitle n={4}>Pay and enroll</StepTitle>
        <div className="mt-6 flex flex-col gap-3">
          {error && (
            <p role="alert" className="rounded-md border border-paper/30 bg-charcoal px-4 py-3 text-sm text-paper">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy || !!dobError} className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-fit')}>
            {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />}
            {phase === 'confirming' ? 'Confirming payment…' : price ? `Enroll Now — Pay ${inr(price.total)}` : 'Enroll Now'}
          </button>
          <ShortDisclaimer />
          <p className="text-xs text-mist">Secure payment by Razorpay (UPI, cards, net banking). A GST invoice is sent to your email. We never ask for PAN, Aadhaar or bank details on this form.</p>
        </div>
      </div>
    </form>
  )
}
