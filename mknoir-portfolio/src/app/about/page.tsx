import type { Metadata } from 'next'
import { About } from '@/sections/About'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meet Mickey Makhija: a scientist exploring the connections between biology, robotics, intelligence, and the systems we build.',
}

export default function AboutPage() {
  return <About />
}
