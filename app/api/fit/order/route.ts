import { batchesFor, ENROLL_FORM, getTier, isTierId, priceFor } from '@/lib/fit'
import { fail, json, readJson } from '@/lib/server/http'
import { saveLead } from '@/lib/server/leads'
import { OtpNotConfigured, readVerifiedToken } from '@/lib/server/otp'
import { createOrder, PaymentsNotConfigured, publicKeyId } from '@/lib/server/razorpay'
import { ageOn, clean, cleanUtm, isEmail } from '@/lib/validate'

// Validates the enrollment form, then creates a Razorpay order for the tier's fee + GST.
// The amount is always computed here from the tier, never taken from the browser.
export async function POST(req: Request) {
  const b = await readJson(req)
  if (!b) return fail('Invalid request')

  let mobile: string | null
  try {
    mobile = readVerifiedToken(b.token)
  } catch (err) {
    console.error('[fit/order]', err)
    return fail('Enrollment is not available right now. Please WhatsApp us.', 503)
  }
  if (!mobile) return fail('Please verify your mobile number with OTP again.', 401)

  if (!isTierId(b.tier)) return fail('Choose a tier.')
  const tier = getTier(b.tier)

  const form = {
    name: clean(b.name, 100),
    email: clean(b.email, 120).toLowerCase(),
    city: clean(b.city, 80),
    dob: clean(b.dob, 10),
    occupation: clean(b.occupation, 100),
    experience: clean(b.experience, 40),
    nism: clean(b.nism, 60),
    batch: clean(b.batch, 60),
  }
  if (!form.name) return fail('Enter your full name.')
  if (!isEmail(form.email)) return fail('Enter a valid email address.')
  if (!form.city) return fail('Enter your city.')
  if (!form.occupation) return fail('Enter your occupation.')
  const age = ageOn(form.dob)
  if (age === null) return fail('Enter a valid date of birth.')
  if (age < 18) return fail('You must be 18 or older to enroll.')
  if (!ENROLL_FORM.experience.includes(form.experience)) return fail('Choose your trading experience.')
  if (!ENROLL_FORM.nism.includes(form.nism)) return fail('Choose your NISM Series VIII status.')
  const batch = batchesFor(tier.id).find((x) => x.id === form.batch)
  if (!batch) return fail('Choose a batch.')
  const consents = Array.isArray(b.consents) ? b.consents : []
  if (consents.length !== ENROLL_FORM.consents.length || !consents.every((c) => c === true)) {
    return fail('Please tick all the consent boxes.')
  }

  const utm = cleanUtm(b.utm)
  const price = priceFor(tier.id)
  const notes = {
    tier: tier.name,
    name: form.name,
    mobile,
    email: form.email,
    city: form.city,
    dob: form.dob,
    occupation: form.occupation,
    experience: form.experience,
    nism: form.nism,
    batch: batch.label,
    utm_source: utm.utm_source ?? '',
    utm_medium: utm.utm_medium ?? '',
    utm_campaign: utm.utm_campaign ?? '',
    utm_content: utm.utm_content ?? '',
  }

  let order
  try {
    order = await createOrder(price.total, `fit-${tier.id}-${Date.now()}`, notes)
  } catch (err) {
    console.error('[fit/order]', err)
    if (err instanceof PaymentsNotConfigured) return fail('Online payment is not available yet. Please WhatsApp us to enroll.', 503)
    if (err instanceof OtpNotConfigured) return fail('Enrollment is not available right now. Please WhatsApp us.', 503)
    return fail('We could not start the payment. Please try again.', 502)
  }

  try {
    await saveLead({
      type: 'fit-enrollment-started',
      razorpay_order_id: order.id,
      tier_id: tier.id,
      fee: price.base,
      gst: price.gst,
      total: price.total,
      ...notes,
      ...utm,
    })
  } catch (err) {
    console.error('[fit/order] could not save enrollment lead', err)
  }

  return json({
    ok: true,
    orderId: order.id,
    amount: order.amount, // paise
    currency: order.currency,
    keyId: publicKeyId(),
    tierName: tier.name,
    total: price.total,
    mobile,
  })
}
