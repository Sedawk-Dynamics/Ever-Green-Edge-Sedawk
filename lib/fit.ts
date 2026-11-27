// FIT — Funded Indian Trader Program. Single source of truth for FIT copy, tiers and pricing.
// Copy below is taken from the "Website Brief — FIT Program Category" (Nov 18, 2026). Use it as written.
//
// COMPLIANCE — never use on any FIT page: "guaranteed job", "challenge", "funded account",
// "pay ₹X get ₹Y", income figures, P&L screenshots, "risk-free", "SEBI approved", trading tips.

export const FIT = {
  name: 'FIT — Funded Indian Trader Program',
  shortName: 'FIT',
  hero: {
    eyebrow: 'FIT — Funded Indian Trader Program',
    headline: 'Turn your trading skill into a career — trade our capital, not yours.',
    sub: '2-day live training with practising desk traders, a free evaluation, and a path to being hired as an employee trader trading up to ₹50 lakh of firm capital.',
  },
  page: {
    headline: 'FIT — Funded Indian Trader Program',
    sub: 'Train with practising traders, clear our evaluation, and get hired as an employee trader trading the firm’s own capital.',
  },
  enrollHeading: 'Enroll in FIT — choose your tier',
  trust: [
    'No evaluation fee',
    'Never deposit your own money',
    'Real firm capital, not a demo',
    'Mentored by practising traders',
  ],
  steps: [
    { title: 'Train', text: '2-day live online seminar for your tier. The seminar fee is the only fee you pay.' },
    { title: 'Evaluate', text: 'Written and practical assessment. No evaluation fee.' },
    { title: 'Live trial', text: 'Trade firm capital on our terminal for up to 2–3 months under strict risk limits.' },
    {
      title: 'Get hired',
      text: 'Candidates who complete the full evaluation are hired as employee traders: monthly stipend plus profit share on the account they trade.',
    },
  ],
  tiersNote:
    'Capital access is set by evaluation and risk criteria, not by the fee. Proven desk traders can scale up to ₹1 crore.',
} as const

// Exact wording from the brief. Show directly under every Enroll Now button.
export const FIT_SHORT_DISCLAIMER =
  'Selection is merit-based. The seminar fee is for training only and does not guarantee a trader role or capital. You never deposit or risk your own money for trading. Trading in securities involves risk.'

// OPEN ITEM: registered company name and address (brief, "To be supplied by the team").
// Bracketed placeholders are deliberate so they cannot go live unnoticed.
export const COMPANY = {
  // From the brochure image ("An integrated product of Evergreen Edge LLP") — confirm before launch.
  registeredName: 'Evergreen Edge LLP',
  registeredAddress: '[address]',
  grievanceContact: '[grievance contact]',
}

// Full disclaimer — bottom of /fit and /fit/enroll.
export const FIT_FULL_DISCLAIMER = `FIT is operated by ${COMPANY.registeredName}, ${COMPANY.registeredAddress}. The training seminar is an educational course and does not include investment advice, research or trading tips; the company is not a SEBI-registered investment adviser or research analyst. There is no evaluation fee. Capital limits are maximum ceilings for selected traders, set by the company’s risk criteria and not purchased through the fee. Selected traders are employees and trade the company’s own capital through a SEBI-registered stockbroker. Past performance does not indicate future results. Trading in securities and derivatives involves substantial risk.`

export type TierId = 'foundation' | 'directional' | 'derivatives' | 'advanced'

// OPEN ITEM: brief asks the team to confirm the Tier 1 and Tier 4 names.
export const FIT_TIERS: {
  id: TierId
  tier: number
  name: string
  seminar: string
  includes: string
  fee: number // ₹, before GST unless FIT_GST.included is true
  capital: string
}[] = [
  { id: 'foundation', tier: 1, name: 'Foundation Trader', seminar: '2 days, live online', includes: 'Training, terminal tools, tier risk rules, NISM certification support', fee: 7500, capital: 'Up to ₹5 lakh' },
  { id: 'directional', tier: 2, name: 'Directional Technical Analyst', seminar: '2 days, live online', includes: 'Training, terminal tools, tier risk rules, NISM certification support', fee: 14500, capital: 'Up to ₹10 lakh' },
  { id: 'derivatives', tier: 3, name: 'Derivatives Strategist', seminar: '2 days, live online', includes: 'Training, terminal tools, tier risk rules, NISM certification support', fee: 31000, capital: 'Up to ₹25 lakh' },
  { id: 'advanced', tier: 4, name: 'Advanced Options & Quant Trader', seminar: '2 days, live online', includes: 'Training, terminal tools, tier risk rules, NISM certification support', fee: 51500, capital: 'Up to ₹50 lakh' },
]

export const isTierId = (v: unknown): v is TierId => FIT_TIERS.some((t) => t.id === v)
export const getTier = (id: TierId) => FIT_TIERS.find((t) => t.id === id)!

// OPEN ITEM: brief asks whether fees are inclusive of GST or + GST.
// Default assumes "+ GST" at 18%. If fees already include GST, set `included: true`.
export const FIT_GST = { rate: 0.18, included: false }

/** Amounts in whole rupees. The server recomputes this; never trust a client-sent amount. */
export function priceFor(id: TierId) {
  const fee = getTier(id).fee
  if (FIT_GST.included) {
    const base = Math.round(fee / (1 + FIT_GST.rate))
    return { base, gst: fee - base, total: fee }
  }
  const gst = Math.round(fee * FIT_GST.rate)
  return { base: fee, gst, total: fee + gst }
}

// OPEN ITEM: seminar batch dates and timings (brief, "To be supplied by the team").
// Add batches here; leave `tiers` out to offer a batch to every tier.
// e.g. { id: '2026-12-13', label: 'Sat 13 – Sun 14 Dec 2026 · 10:00 AM – 5:00 PM IST' }
export const FIT_BATCHES: { id: string; label: string; tiers?: TierId[] }[] = []
export const NEXT_AVAILABLE_BATCH = { id: 'next-available', label: 'Next available batch (our team will confirm the date)' }

export function batchesFor(id: TierId) {
  const list = FIT_BATCHES.filter((b) => !b.tiers || b.tiers.includes(id))
  return list.length ? list : [NEXT_AVAILABLE_BATCH]
}

// FAQ answers restate facts from the brief — keep it that way.
export const FIT_FAQ = [
  {
    q: 'Is this a job guarantee?',
    a: 'No. Selection is merit-based. The seminar fee is for training only and does not guarantee a trader role or capital.',
  },
  {
    q: 'Do I deposit my own money?',
    a: 'No, never. You never deposit or risk your own money for trading.',
  },
  {
    q: 'Is there an evaluation fee?',
    a: 'No. There is no evaluation fee. The seminar fee is the only fee you pay.',
  },
  {
    q: 'How long is the live trial?',
    a: 'Up to 2–3 months, trading firm capital on our terminal under strict risk limits.',
  },
  {
    q: 'How are traders paid?',
    a: 'Candidates who are hired as employee traders receive a monthly stipend plus profit share on the account they trade, as per their offer letter.',
  },
  {
    q: 'Do you give tips?',
    a: 'No. The company does not give investment advice, research or trading tips.',
  },
]

// "Our programs" — 3 cards on the homepage.
export const PROGRAMS = {
  fit: {
    name: 'FIT — Funded Indian Trader',
    line: '2-day live online seminar, free evaluation, path to an employee trader role on firm capital',
    format: '4 tiers, online',
    fee: '₹7,500 – ₹51,500',
  },
  tdp: {
    name: 'TDP — Trader Development Program',
    line: '6-month full-time mentorship at our Pune office; top performers trade firm capital',
    format: '10–12 seats, screening + interview',
    fee: 'Free for the first 10 students',
    worth: '₹2,00,000',
  },
  optionSelling: {
    name: 'Advanced Option Selling Mentorship',
    line: 'Learn option selling from 3–4 full-time prop-floor traders, then trade alongside them on our floor',
    format: '2 months: month 1 theory & strategies on weekends, month 2 live practice on our prop floor on weekdays',
    fee: 'Enquire for fee',
  },
}

export const GET_TRADERS = {
  badge: 'Coming Soon',
  headline: 'Get Traders',
  line: 'Something new is on the way.',
}

export const ENROLL_FORM = {
  experience: ['None', 'Under 1 year', '1–3 years', '3+ years'],
  nism: ['Certified (NISM Series VIII)', 'Preparing / exam booked', 'Not started'],
  consents: [
    'I am paying for an educational training seminar, not for a job or for trading capital.',
    'Selection as a trader is merit-based and not guaranteed.',
    'The company does not give investment advice or trading tips.',
    'I am 18 or older and agree to the Terms, Refund Policy and Privacy Policy.',
    'I agree to be contacted by call, SMS, email and WhatsApp.',
  ],
}

// NSE trading holidays (YYYY-MM-DD, IST). The "NSE Open / Closed" pill is only a clock;
// add the exchange's published holiday list here so it shows Closed on those days.
export const NSE_HOLIDAYS: string[] = []

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
