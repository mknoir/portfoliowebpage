'use client'

import { Hero } from '@/sections/Hero'
import { AboutPreview } from '@/sections/AboutPreview'
import { Projects } from '@/sections/Projects'
import { Contact } from '@/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <Projects />
      <Contact />
    </>
  )
}
