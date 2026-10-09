import type { Metadata } from 'next'
import ExperienceSection from '@/sections/ExperienceSection'

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Mickey Makhija’s experience across molecular biology, gene therapy, laboratory automation, and computational biology.',
}

export default function ExperiencePage() {
  return <ExperienceSection />
}
