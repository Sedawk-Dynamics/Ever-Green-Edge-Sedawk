// Browser-side conversion tracking (GA4 + Meta Pixel) and UTM capture.
// Both trackers are optional: if their IDs are not set, these calls do nothing.

import { UTM_KEYS, type Utm } from '@/lib/validate'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

type Conversion =
  | { name: 'enroll_click'; location: string; tier?: string }
  | { name: 'form_start'; tier?: string }
  | { name: 'lead'; lead_type: string; tier?: string }
  | { name: 'begin_checkout'; tier: string; value: number }
  | { name: 'purchase'; tier: string; value: number; transaction_id: string }

export function track(e: Conversion) {
  if (typeof window === 'undefined') return
  const { gtag, fbq } = window
  try {
    switch (e.name) {
      case 'enroll_click':
        gtag?.('event', 'enroll_click', { location: e.location, tier: e.tier })
        fbq?.('trackCustom', 'EnrollNowClick', { location: e.location, tier: e.tier })
        break
      case 'form_start':
        gtag?.('event', 'enroll_form_start', { tier: e.tier })
        fbq?.('trackCustom', 'EnrollFormStart', { tier: e.tier })
        break
      case 'lead':
        gtag?.('event', 'generate_lead', { lead_type: e.lead_type, tier: e.tier })
        fbq?.('track', 'Lead', { content_name: e.lead_type })
        break
      case 'begin_checkout':
        gtag?.('event', 'begin_checkout', { currency: 'INR', value: e.value, items: [{ item_name: e.tier }] })
        fbq?.('track', 'InitiateCheckout', { currency: 'INR', value: e.value, content_name: e.tier })
        break
      case 'purchase':
        gtag?.('event', 'purchase', { currency: 'INR', value: e.value, transaction_id: e.transaction_id, items: [{ item_name: e.tier }] })
        fbq?.('track', 'Purchase', { currency: 'INR', value: e.value, content_name: e.tier }, { eventID: e.transaction_id })
        break
    }
  } catch {
    // Tracking must never break the page.
  }
}

const UTM_STORE = 'tf_utm'

/** Remembers the latest ad / reel that brought the visitor (last UTM-tagged visit). */
export function captureUtm() {
  try {
    const params = new URLSearchParams(window.location.search)
    if (!UTM_KEYS.some((k) => params.get(k))) return
    const utm: Utm = { landing_page: window.location.pathname, referrer: document.referrer || '' }
    for (const k of UTM_KEYS) {
      const v = params.get(k)
      if (v) utm[k] = v.slice(0, 200)
    }
    localStorage.setItem(UTM_STORE, JSON.stringify(utm))
  } catch {
    // Storage can be blocked (private mode); UTM is best-effort.
  }
}

export function getUtm(): Utm {
  try {
    return JSON.parse(localStorage.getItem(UTM_STORE) ?? '{}') as Utm
  } catch {
    return {}
  }
}
