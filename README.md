# Ever-Green-Edge-Sedawk

Website for **The Trader Foundry**, a professional trader development firm in Pune.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Framer Motion.

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
```

## Where things live

| Path | What |
| --- | --- |
| `lib/site.ts` | All brand facts and copy: address, phone, socials, TDP details, courses, team, FAQ |
| `lib/fit.ts` | FIT program copy, tiers, fees, GST, batch dates, FAQ, disclaimers, company details |
| `components/fit/` | FIT hero, straddle chart, market strip, tier cards, enrollment flow, lead forms |
| `app/fit/`, `app/api/` | FIT pages and the server routes for OTP, leads and Razorpay payments |
| `app/` | Pages: Home, About, TDP, Courses, Contact and legal pages |
| `components/site/` | Header, footer, forms, market chart, WhatsApp button |
| `components/motion/` | Animation building blocks: reveals, carousels, flip cards, counters |
| `public/images/` | Logo and web-optimised gallery photos |

## FIT setup

Copy `.env.example` to `.env.local` and fill it in (same keys in the hosting dashboard).
Locally, without keys, the OTP code is `123456` and leads are printed to the terminal.

FIT compliance (from the brief): never use "guaranteed job", "challenge", "funded account",
"pay ₹X get ₹Y", income figures, P&L screenshots, "risk-free", "SEBI approved" or trading tips
on the homepage, `/fit` or `/fit/enroll`.

## Before launch

- Fill the open items in `lib/fit.ts`: registered company name, address, grievance contact,
  GST treatment (`FIT_GST`), Tier 1 / Tier 4 names, batch dates (`FIT_BATCHES`), NSE holidays.
- Add the environment variables in `.env.example` (OTP, Razorpay, leads webhook, GA4, Meta Pixel).

- Forms open the visitor's email app (no backend yet). Connect a real form endpoint.
- Privacy Policy, Terms of Use and Refund Policy pages need final text.
- The hero market chart shows **simulated** data and is labelled as such.
