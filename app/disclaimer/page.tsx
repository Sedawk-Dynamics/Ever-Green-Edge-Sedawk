import type { Metadata } from 'next'
import { LegalPage } from '@/components/site/legal-page'
import { SITE } from '@/lib/site'

export const metadata: Metadata = { title: 'Disclaimer' }

export default function Page() {
  return <LegalPage title="Disclaimer" paragraphs={[SITE.disclaimerShort]} />
}
