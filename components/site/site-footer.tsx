import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { SITE } from '@/lib/site'
import { FacebookIcon, InstagramIcon, WhatsAppBrandIcon } from './brand-icons'

const siteLinks = [
  { href: '/about', label: 'About' },
  { href: '/tdp', label: 'TDP' },
  { href: '/courses', label: 'Courses' },
  { href: '/contact', label: 'Contact' },
]

const socials = [
  { label: 'Instagram', href: SITE.socials.instagram, Icon: InstagramIcon },
  { label: 'Facebook', href: SITE.socials.facebook, Icon: FacebookIcon },
  { label: 'WhatsApp Community', href: SITE.socials.whatsappGroup, Icon: WhatsAppBrandIcon },
]

const legalLinks = [
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-use', label: 'Terms of Use' },
  { href: '/refund-policy', label: 'Refund Policy' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-5">
          {/* items-start stops the flex column stretching the logo to full width (that was distorting it). */}
          <Link href="/" aria-label="The Trader Foundry home" className="block">
            <Image src="/images/logo-tf-light.png" alt="The Trader Foundry" width={87} height={48} className="h-12 w-auto" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-mist">
            A professional trader development firm in Pune. Trained, tested and backed.
          </p>
          <ul className="flex flex-wrap gap-2.5" aria-label="Follow The Trader Foundry">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-10 items-center gap-2.5 rounded-md border border-line px-3.5 text-sm text-paper transition-colors hover:border-paper/40 hover:bg-charcoal"
                >
                  <s.Icon className="size-[18px] transition-transform group-hover:scale-110" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Explore" className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-lavender">Explore</p>
          <ul className="flex flex-col gap-2.5">
            {siteLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-paper/80 hover:text-paper">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-lavender">Contact</p>
          <ul className="flex flex-col gap-3 text-sm text-paper/80">
            <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-lavender" aria-hidden />{SITE.address}</li>
            <li className="flex gap-2.5"><Phone className="size-4 shrink-0 text-lavender" aria-hidden /><a href={`tel:${SITE.phoneTel}`} className="hover:text-paper">{SITE.phoneDisplay}</a></li>
            <li className="flex gap-2.5"><Mail className="size-4 shrink-0 text-lavender" aria-hidden /><a href={`mailto:${SITE.email}`} className="hover:text-paper">{SITE.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-xs leading-relaxed text-mist">
          <p>{SITE.disclaimerShort}</p>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-paper">{l.label}</Link>
                </li>
              ))}
            </ul>
            <p>© {new Date().getFullYear()} The Trader Foundry. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
