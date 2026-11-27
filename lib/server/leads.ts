// Server only. Sends every lead / enrollment / payment record to one webhook
// (e.g. a Google Sheets Apps Script, Zapier, Make or your CRM). Set LEADS_WEBHOOK_URL.
// Each record carries `type` so the receiving side can route it, and payment
// records carry `razorpay_payment_id` so duplicates (browser + webhook) can be merged.

export type LeadRecord = {
  type:
    | 'fit-otp-verified' // partial lead: name + mobile, saved right after OTP
    | 'fit-enrollment-started' // full form submitted, payment order created
    | 'fit-payment' // payment verified
    | 'get-traders-notify'
    | 'option-selling-enquiry'
  [key: string]: unknown
}

export async function saveLead(record: LeadRecord) {
  const url = process.env.LEADS_WEBHOOK_URL
  const body = { ...record, received_at: new Date().toISOString() }

  if (!url) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[leads] LEADS_WEBHOOK_URL not set — lead logged locally only:', body)
      return
    }
    throw new Error('LEADS_WEBHOOK_URL is not configured')
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.LEADS_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.LEADS_WEBHOOK_TOKEN}` } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Lead webhook responded ${res.status}`)
}
