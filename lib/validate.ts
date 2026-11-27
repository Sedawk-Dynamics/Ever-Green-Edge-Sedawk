// Shared by the browser (instant feedback) and the API routes (the real check).

/** Accepts "98765 43210", "+91 98765-43210", "09876543210" etc. Returns "+919876543210" or null. */
export function normalizeIndianMobile(input: string): string | null {
  const digits = String(input ?? '').replace(/\D/g, '')
  const ten = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits.length === 11 && digits.startsWith('0') ? digits.slice(1) : digits
  return /^[6-9]\d{9}$/.test(ten) ? `+91${ten}` : null
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v ?? '').trim())

/** Age in whole years on `today` for an ISO date (YYYY-MM-DD). Null if the date is invalid. */
export function ageOn(dob: string, today = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dob ?? ''))
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(Date.UTC(y, mo - 1, d))
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null
  let age = today.getUTCFullYear() - y
  const beforeBirthday = today.getUTCMonth() + 1 < mo || (today.getUTCMonth() + 1 === mo && today.getUTCDate() < d)
  if (beforeBirthday) age--
  return age
}

/** Latest date of birth (YYYY-MM-DD) that is 18 or older today. */
export function latestAdultDob(today = new Date()) {
  const d = new Date(Date.UTC(today.getUTCFullYear() - 18, today.getUTCMonth(), today.getUTCDate()))
  return d.toISOString().slice(0, 10)
}

export const clean = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max)

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
export type Utm = Partial<Record<(typeof UTM_KEYS)[number] | 'landing_page' | 'referrer', string>>

export function cleanUtm(input: unknown): Utm {
  const out: Utm = {}
  if (!input || typeof input !== 'object') return out
  const src = input as Record<string, unknown>
  for (const k of [...UTM_KEYS, 'landing_page', 'referrer'] as const) {
    const v = clean(src[k], 200)
    if (v) out[k] = v
  }
  return out
}
