import type { Metadata } from 'next'
import { PageHero, Section } from '@/components/site/blocks'
import { CoursesPanel } from '@/components/site/courses-panel'

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Focused paid courses from The Trader Foundry: a full trading strategies course and a 2-month Advanced Option Selling Mentorship on our prop floor.',
}

export default function CoursesPage() {
  return (
    <>
      <PageHero
        label="Courses"
        title="Focused programs for specific skills."
        lead="Paid courses for people who want a specific skill. Choose a course and send an enquiry to get the next batch details."
      />
      <Section tone="light">
        <CoursesPanel />
      </Section>
    </>
  )
}
