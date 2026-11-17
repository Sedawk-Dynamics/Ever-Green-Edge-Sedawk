import type { Metadata } from 'next'
import { LegalPage } from '@/components/site/legal-page'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      paragraphs={[
        'The full Privacy Policy is being finalised and will be published here before launch.',
      ]}
    />
  )
}
