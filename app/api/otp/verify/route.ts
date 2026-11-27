import { isTierId } from '@/lib/fit'
import { fail, json, readJson } from '@/lib/server/http'
import { saveLead } from '@/lib/server/leads'
import { checkOtp, issueVerifiedToken, OtpNotConfigured } from '@/lib/server/otp'
import { clean, cleanUtm, normalizeIndianMobile } from '@/lib/validate'

export async function POST(req: Request) {
  const body = await readJson(req)
  if (!body) return fail('Invalid request')

  const mobile = normalizeIndianMobile(clean(body.mobile, 20))
  const code = clean(body.code, 10)
  const name = clean(body.name, 100)
  if (!mobile) return fail('Enter a valid 10-digit Indian mobile number.')
  if (!name) return fail('Enter your full name.')

  let approved = false
  try {
    approved = await checkOtp(mobile, code)
  } catch (err) {
    console.error('[otp/verify]', err)
    if (err instanceof OtpNotConfigured) return fail('OTP is not available right now. Please WhatsApp us to enroll.', 503)
    return fail('We could not check the OTP. Please try again.', 502)
  }
  if (!approved) return fail('That code is incorrect or has expired.')

  // Brief: save partial leads (name + mobile) after OTP so the team can follow up on drop-offs.
  // A failure here must not block the visitor, so it is logged rather than returned.
  try {
    await saveLead({ type: 'fit-otp-verified', name, mobile, tier: isTierId(body.tier) ? body.tier : '', ...cleanUtm(body.utm) })
  } catch (err) {
    console.error('[otp/verify] could not save partial lead', err)
  }

  return json({ ok: true, token: issueVerifiedToken(mobile), mobile })
}
