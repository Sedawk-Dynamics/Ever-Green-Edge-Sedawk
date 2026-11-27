import { fail, json, readJson } from '@/lib/server/http'
import { OtpNotConfigured, sendOtp } from '@/lib/server/otp'
import { clean, normalizeIndianMobile } from '@/lib/validate'

export async function POST(req: Request) {
  const body = await readJson(req)
  if (!body) return fail('Invalid request')

  const mobile = normalizeIndianMobile(clean(body.mobile, 20))
  if (!mobile) return fail('Enter a valid 10-digit Indian mobile number.')
  if (!clean(body.name, 100)) return fail('Enter your full name first.')

  try {
    await sendOtp(mobile)
    return json({ ok: true })
  } catch (err) {
    console.error('[otp/send]', err)
    if (err instanceof OtpNotConfigured) return fail('OTP is not available right now. Please WhatsApp us to enroll.', 503)
    return fail('We could not send the OTP. Please try again in a minute.', 502)
  }
}
