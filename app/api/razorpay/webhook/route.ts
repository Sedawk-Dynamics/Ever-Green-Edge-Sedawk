import { json } from '@/lib/server/http'
import { saveLead } from '@/lib/server/leads'
import { verifyWebhookSignature } from '@/lib/server/razorpay'

// Razorpay Dashboard → Webhooks: point to https://<domain>/api/razorpay/webhook,
// subscribe to "order.paid", and set the same secret as RAZORPAY_WEBHOOK_SECRET.
// This is the reliable payment record: it fires even if the visitor closes the tab.
export async function POST(req: Request) {
  const raw = await req.text()

  let valid = false
  try {
    valid = verifyWebhookSignature(raw, req.headers.get('x-razorpay-signature'))
  } catch (err) {
    console.error('[razorpay/webhook]', err)
    return json({ ok: false }, 503)
  }
  if (!valid) return json({ ok: false }, 400)

  type Entity = { id?: string; amount?: number; amount_paid?: number; notes?: Record<string, string> }
  let event: { event?: string; payload?: { order?: { entity?: Entity }; payment?: { entity?: Entity } } }
  try {
    event = JSON.parse(raw)
  } catch {
    return json({ ok: false }, 400)
  }

  if (event.event === 'order.paid') {
    const order = event.payload?.order?.entity ?? {}
    const payment = event.payload?.payment?.entity ?? {}
    try {
      await saveLead({
        type: 'fit-payment',
        source: 'razorpay-webhook',
        razorpay_order_id: order.id ?? '',
        razorpay_payment_id: payment.id ?? '',
        amount_paid: (order.amount_paid ?? payment.amount ?? 0) / 100,
        ...(order.notes ?? {}),
      })
    } catch (err) {
      console.error('[razorpay/webhook] could not save payment record', err)
      // Non-2xx makes Razorpay retry later, so the record is not lost.
      return json({ ok: false }, 502)
    }
  }

  return json({ ok: true })
}
