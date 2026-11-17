import { PageHero, Section } from '@/components/site/blocks'

export function LegalPage({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <>
      <PageHero label="Legal" title={title} />
      <Section>
        <div className="flex max-w-3xl flex-col gap-5 text-base leading-relaxed text-mist">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>
    </>
  )
}
