import { fail, json, readJson } from '@/lib/server/http'
import { saveLead } from '@/lib/server/leads'
import { fetchOrder, PaymentsNotConfigured, verifyPaymentSignature } from '@/lib/server/razorpay'
import { clean } from '@/lib/validate'

// Called by the browser after Razorpay Checkout succeeds. Verifies the signature,
// then records the payment. /api/razorpay/webhook records it too, in case the
// visitor closes the tab before this runs — dedupe on razorpay_payment_id.
export async function POST(req: Request) {
  const b = await readJson(req)
  if (!b) return fail('Invalid request')

  const orderId = clean(b.razorpay_order_id, 60)
  const paymentId = clean(b.razorpay_payment_id, 60)
  const signature = clean(b.razorpay_signature, 200)
  if (!orderId || !paymentId || !signature) return fail('Missing payment details.')

  try {
    if (!verifyPaymentSignature(orderId, paymentId, signature)) return fail('Payment could not be verified.', 400)
    const order = await fetchOrder(orderId)

    try {
      await saveLead({
        type: 'fit-payment',
        source: 'browser',
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        amount_paid: order.amount_paid / 100,
        ...order.notes,
      })
    } catch (err) {
      console.error('[fit/confirm] could not save payment record', err)
    }

    return json({ ok: true, paymentId, orderId, tierName: order.notes.tier ?? '', amountPaid: order.amount_paid / 100 || order.amount / 100 })
  } catch (err) {
    console.error('[fit/confirm]', err)
    if (err instanceof PaymentsNotConfigured) return fail('Payments are not configured.', 503)
    return fail('We received your payment but could not confirm it here. Our team will contact you.', 502)
  }
}
