import type { Metadata } from 'next'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { WhatsAppIcon } from '@/components/site/whatsapp-icon'
import { EnquiryForm } from '@/components/site/forms'
import { PageHero, Section } from '@/components/site/blocks'
import { buttonVariants } from '@/components/ui/button'
import { Reveal } from '@/components/motion/primitives'
import { SITE } from '@/lib/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Visit The Trader Foundry in Bavdhan, Pune. Call, WhatsApp or send an enquiry.',
}

export default function ContactPage() {
  return (
    <>
      <PageHero label="Contact" title="Visit us in Pune, or get in touch." />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <Reveal className="flex flex-col gap-6">
            <ul className="flex flex-col gap-6 rounded-lg border border-line bg-surface p-7">
              <li className="flex gap-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-lavender" aria-hidden />
                <div>
                  <p className="text-sm text-mist">Address</p>
                  <p className="mt-1 text-paper">{SITE.address}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Clock className="mt-0.5 size-5 shrink-0 text-lavender" aria-hidden />
                <div>
                  <p className="text-sm text-mist">Office hours</p>
                  <p className="mt-1 text-paper">{SITE.hours}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Phone className="mt-0.5 size-5 shrink-0 text-lavender" aria-hidden />
                <div>
                  <p className="text-sm text-mist">Phone</p>
                  <a href={`tel:${SITE.phoneTel}`} className="mt-1 block text-paper hover:text-lavender">{SITE.phoneDisplay}</a>
                </div>
              </li>
              <li className="flex gap-4">
                <Mail className="mt-0.5 size-5 shrink-0 text-lavender" aria-hidden />
                <div>
                  <p className="text-sm text-mist">Email</p>
                  <a href={`mailto:${SITE.email}`} className="mt-1 block text-paper hover:text-lavender">{SITE.email}</a>
                </div>
              </li>
            </ul>
            <div className="grid gap-3 sm:grid-cols-2">
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), 'h-12')}>
                <WhatsAppIcon className="size-4" /> WhatsApp us
              </a>
              <a href={`tel:${SITE.phoneTel}`} className={cn(buttonVariants({ variant: 'outline' }), 'h-12')}>
                <Phone className="size-4" aria-hidden /> Call now
              </a>
            </div>
            <p className="text-sm text-mist">Visits are by appointment. Please call or WhatsApp before you come.</p>
          </Reveal>

          <Reveal delay={0.15} className="overflow-hidden rounded-lg border border-line">
            <iframe
              title="Map showing The Trader Foundry office in Bavdhan, Pune"
              src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.addressQuery)}&output=embed`}
              className="h-full min-h-[360px] w-full border-0 grayscale-[30%] invert-[.92] hue-rotate-180"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </Section>

      <Section label="Enquiry" title="Send us a message." className="border-t border-line">
        <div className="rounded-lg border border-line bg-surface p-6 md:p-10">
          <EnquiryForm />
        </div>
      </Section>
    </>
  )
}
