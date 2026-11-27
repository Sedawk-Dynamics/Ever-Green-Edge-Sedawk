// Server only. Minimal Razorpay Orders integration over its REST API (no SDK needed).
// Env: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET (for /api/razorpay/webhook)
// Docs: https://razorpay.com/docs/payments/server-integration/

import { createHmac, timingSafeEqual } from 'node:crypto'

export class PaymentsNotConfigured extends Error {}

function keys() {
  const id = process.env.RAZORPAY_KEY_ID
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!id || !secret) throw new PaymentsNotConfigured('Razorpay keys are not configured')
  return { id, secret, auth: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}` }
}

export const publicKeyId = () => keys().id

export type RazorpayOrder = {
  id: string
  amount: number // paise
  amount_paid: number
  currency: string
  receipt: string
  status: 'created' | 'attempted' | 'paid'
  notes: Record<string, string>
}

/** `amountRupees` is computed on the server from the tier. Notes: max 15 keys, 256 chars each. */
export async function createOrder(amountRupees: number, receipt: string, notes: Record<string, string>) {
  const k = keys()
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: k.auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: Math.round(amountRupees * 100),
      currency: 'INR',
      receipt: receipt.slice(0, 40),
      notes: Object.fromEntries(Object.entries(notes).slice(0, 15).map(([key, v]) => [key, String(v).slice(0, 256)])),
    }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Razorpay order failed (${res.status}): ${await res.text()}`)
  return (await res.json()) as RazorpayOrder
}

export async function fetchOrder(orderId: string) {
  const k = keys()
  const res = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: k.auth },
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`Razorpay fetch order failed (${res.status})`)
  return (await res.json()) as RazorpayOrder
}

function safeEqualHex(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

/** Checkout handler signature: HMAC-SHA256(order_id + "|" + payment_id, key_secret). */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const expected = createHmac('sha256', keys().secret).update(`${orderId}|${paymentId}`).digest('hex')
  return safeEqualHex(expected, String(signature ?? ''))
}

/** Webhook signature: HMAC-SHA256(raw request body, webhook secret). */
export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) throw new PaymentsNotConfigured('RAZORPAY_WEBHOOK_SECRET is not configured')
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  return safeEqualHex(expected, String(signature ?? ''))
}
