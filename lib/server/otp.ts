// Server only. Mobile OTP via Twilio Verify, which handles code generation, expiry,
// retries and per-number rate limits for us. Swap this file for another provider
// (MSG91, 2Factor, etc.) if preferred — only `sendOtp` and `checkOtp` are used.
//
// Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID
// Local development without Twilio: the code is always 123456 (never in production).

import { createHmac, timingSafeEqual } from 'node:crypto'

const DEV_CODE = '123456'

function twilio() {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const service = process.env.TWILIO_VERIFY_SERVICE_SID
  if (!sid || !token || !service) return null
  return { auth: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`, base: `https://verify.twilio.com/v2/Services/${service}` }
}

const devMode = () => !twilio() && process.env.NODE_ENV !== 'production'

export class OtpNotConfigured extends Error {}

/** `mobile` must already be normalised to +91XXXXXXXXXX. */
export async function sendOtp(mobile: string) {
  const t = twilio()
  if (!t) {
    if (devMode()) {
      console.info(`[otp] DEV MODE — no SMS sent. Use code ${DEV_CODE} for ${mobile}`)
      return
    }
    throw new OtpNotConfigured('OTP provider is not configured')
  }
  const res = await fetch(`${t.base}/Verifications`, {
    method: 'POST',
    headers: { Authorization: t.auth, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: mobile, Channel: 'sms' }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Twilio Verify send failed (${res.status})`)
}

export async function checkOtp(mobile: string, code: string): Promise<boolean> {
  if (!/^\d{4,8}$/.test(code)) return false
  const t = twilio()
  if (!t) {
    if (devMode()) return code === DEV_CODE
    throw new OtpNotConfigured('OTP provider is not configured')
  }
  const res = await fetch(`${t.base}/VerificationCheck`, {
    method: 'POST',
    headers: { Authorization: t.auth, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: mobile, Code: code }),
    signal: AbortSignal.timeout(10000),
  })
  // Twilio answers 404 once a verification has expired or been used up.
  if (res.status === 404) return false
  if (!res.ok) throw new Error(`Twilio Verify check failed (${res.status})`)
  const data = (await res.json()) as { status?: string }
  return data.status === 'approved'
}

/* ------------------------------------------------------------------------------
 * After a successful OTP check the browser receives a short-lived signed token
 * proving the mobile was verified. The payment route requires it, so the number
 * on every paid enrollment is a verified one. Env: OTP_TOKEN_SECRET (long random string).
 * ---------------------------------------------------------------------------- */

const TOKEN_TTL_MS = 3 * 60 * 60 * 1000 // 3 hours to finish the form and pay

function secret() {
  const s = process.env.OTP_TOKEN_SECRET
  if (s) return s
  if (process.env.NODE_ENV !== 'production') return 'dev-only-otp-token-secret'
  throw new OtpNotConfigured('OTP_TOKEN_SECRET is not configured')
}

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

export function issueVerifiedToken(mobile: string) {
  const payload = `${mobile}.${Date.now() + TOKEN_TTL_MS}`
  return `${payload}.${sign(payload)}`
}

/** Returns the verified mobile, or null if the token is missing, forged or expired. */
export function readVerifiedToken(token: unknown): string | null {
  const parts = String(token ?? '').split('.')
  if (parts.length !== 3) return null
  const [mobile, exp, sig] = parts
  const expected = Buffer.from(sign(`${mobile}.${exp}`))
  const given = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  if (!(Number(exp) > Date.now())) return null
  return mobile
}
