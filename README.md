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
| `app/` | Pages: Home, About, TDP, Courses, Contact and legal pages |
| `components/site/` | Header, footer, forms, market chart, WhatsApp button |
| `components/motion/` | Animation building blocks: reveals, carousels, flip cards, counters |
| `public/images/` | Logo and web-optimised gallery photos |

## Before launch

- Forms open the visitor's email app (no backend yet). Connect a real form endpoint.
- Privacy Policy, Terms of Use and Refund Policy pages need final text.
- The hero market chart shows **simulated** data and is labelled as such.
