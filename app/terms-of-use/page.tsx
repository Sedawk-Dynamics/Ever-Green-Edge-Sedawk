import type { Metadata } from 'next'
import { LegalPage } from '@/components/site/legal-page'

export const metadata: Metadata = { title: 'Terms of Use' }

export default function Page() {
  return (
    <LegalPage
      title="Terms of Use"
      paragraphs={[
        'The full Terms of Use is being finalised and will be published here before launch.',
      ]}
    />
  )
}
