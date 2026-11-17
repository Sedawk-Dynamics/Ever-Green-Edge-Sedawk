import type { Metadata } from 'next'
import { LegalPage } from '@/components/site/legal-page'

export const metadata: Metadata = { title: 'Refund Policy' }

export default function Page() {
  return (
    <LegalPage
      title="Refund Policy"
      paragraphs={[
        'The full Refund Policy is being finalised and will be published here before launch.',
      ]}
    />
  )
}
