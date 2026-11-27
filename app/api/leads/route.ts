import { fail, json, readJson } from '@/lib/server/http'
import { saveLead } from '@/lib/server/leads'
import { clean, cleanUtm, normalizeIndianMobile } from '@/lib/validate'

// Short lead forms: "Get Traders — Notify Me" and "Advanced Option Selling — Enquire Now".
const TYPES = ['get-traders-notify', 'option-selling-enquiry'] as const
type Type = (typeof TYPES)[number]

export async function POST(req: Request) {
  const b = await readJson(req)
  if (!b) return fail('Invalid request')

  // Honeypot: real visitors never see or fill this field.
  if (clean(b.website)) return json({ ok: true })

  const type = b.type as Type
  if (!TYPES.includes(type)) return fail('Invalid request')

  const name = clean(b.name, 100)
  const mobile = normalizeIndianMobile(clean(b.mobile, 20))
  const city = clean(b.city, 80)
  if (!name) return fail('Enter your name.')
  if (!mobile) return fail('Enter a valid 10-digit Indian mobile number.')
  if (type === 'option-selling-enquiry' && !city) return fail('Enter your city.')

  try {
    await saveLead({ type, name, mobile, ...(city ? { city } : {}), ...cleanUtm(b.utm) })
    return json({ ok: true })
  } catch (err) {
    console.error('[leads]', err)
    return fail('We could not save your details. Please message us on WhatsApp instead.', 502)
  }
}
