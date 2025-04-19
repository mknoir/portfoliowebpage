'use client'

import React, { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'

/* ---------- tag‑colour map ---------- */
const tagColors: Record<string, string> = {
  AI: 'bg-accentPrimary text-background',
  Automation: 'bg-accentPrimary text-background',
  Founder: 'bg-gray-700 text-white',
  Biotech: 'bg-gray-600 text-white',
  'Molecular Biology': 'bg-gray-500 text-white',
  'Gene Expression': 'bg-gray-500 text-white',
  'Gene Therapy': 'bg-gray-700 text-white',
  Bioreactors: 'bg-gray-700 text-white',
  AAV: 'bg-gray-600 text-white',
  Diagnostics: 'bg-gray-600 text-white',
  PCR: 'bg-gray-500 text-white',
  Education: 'bg-gray-500 text-white',
  default: 'bg-gray-700 text-white',
}

/* ---------- data types ---------- */
interface Experience {
  company: string
  logo: string
  role: string
  period: string
  description: string
  tags: string[]
}

/* ---------- data ---------- */
const experiences: Experience[] = [
  {
    company: 'Cornucopia Biosciences Inc.',
    logo: '/logos/cornucopia.svg',
    role: 'Founder & Lead Biotech Automation Researcher',
    period: '2025 — Present',
    description:
      'Designing the future of molecular research with AI‑powered automation. Currently in stealth — reach out to learn more.',
    tags: ['AI', 'Automation', 'Founder', 'Biotech'],
  },
  {
    company: 'Amgen',
    logo: '/logos/amgen.svg',
    role: 'Associate Scientist',
    period: '2023 — Present',
    description:
      'Optimising high‑throughput molecular assays for cardiometabolic disease. Automated iPSC workflows and built gene‑expression data pipelines.',
    tags: ['Automation', 'Molecular Biology', 'iPSC', 'Gene Expression'],
  },
  {
    company: 'BioMarin Pharmaceutical Inc.',
    logo: '/logos/biomarin.svg',
    role: 'Research Associate II, Gene Therapy',
    period: 'Jan 2023 — Jun 2023',
    description:
      'Scaled AAV production to 50 L bioreactors and built real‑time dashboards to speed decision‑making.',
    tags: ['Gene Therapy', 'Bioreactors', 'AAV', 'Data Integration'],
  },
  {
    company: 'Optimized Foods',
    logo: '/logos/optimized.svg',
    role: 'Research Associate',
    period: 'Sep 2022 — Jan 2023',
    description:
      'Created cell‑cultured caviar, improving flavour, texture and yield through process optimisation.',
    tags: ['Cell Culture', 'Process Optimization', 'Food Tech'],
  },
  {
    company: 'Cepheid (Danaher)',
    logo: '/logos/cepheid.svg',
    role: 'Research & Innovation Core Intern',
    period: 'Jun 2022 — Sep 2022',
    description:
      'Optimised sample‑prep and PCR protocols for a multiplex diagnostic assay targeting emerging diseases.',
    tags: ['Diagnostics', 'PCR', 'Sample Prep'],
  },
  {
    company: 'UC Davis',
    logo: '/logos/ucdavis.svg',
    role: 'Lab Associate & Teaching Assistant',
    period: 'Aug 2021 — Jun 2022',
    description:
      'Taught sequencing analysis and improved student lab‑report accuracy by 20 %.',
    tags: ['Education', 'Lab Techniques', 'Protein Purification'],
  },
]

/* ---------- component ---------- */
export default function ExperienceSection() {
  const controls = useAnimation()
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const top = lineRef.current?.getBoundingClientRect().top ?? 0
      if (top < window.innerHeight * 0.75) controls.start({ height: '100%' })
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [controls])

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-16 text-center text-4xl font-bold text-foreground">
          Work & Experience
        </h2>

        {/* timeline container */}
        <div className="relative">
          {/* vertical line */}
          <motion.div
            ref={lineRef}
            initial={{ height: 0 }}
            animate={controls}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute left-[1.15rem] top-0 w-1 origin-top bg-accentPrimary"
          />

          {/* cards */}
          <div className="space-y-16 md:snap-y md:snap-mandatory">
            {experiences.map((exp, idx) => (
              <motion.article
              key={exp.company}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
              className="
                relative pl-14
                rounded-2xl                /* softer corners          */
                border-card
                bg-surface/80 backdrop-blur-sm /* translucent surface    */
                shadow-lg hover:shadow-xl  /* soft elevation          */
                transition hover:scale-[1.015]
                md:snap-start
              "
            >
              {/* dot */}
              <div className="absolute left-[0.4rem] top-3 h-4 w-4 -translate-x-1/2 rounded-full bg-accentPrimary ring-2 ring-background" />
            
              {/* header */}
              <header className="flex flex-wrap items-center gap-4 p-5 pb-2">
                <div className="logo-frame">
                  <Image
                    src={exp.logo}
                    alt={`${exp.company} logo`}
                    fill
                    className="object-contain"
                    priority={idx === 0}
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                  {exp.role} @ {exp.company}
                </h3>
              </header>
            
              {/* period & description */}
              <div className="px-5 pb-5">
                <span className="text-sm text-textMuted">{exp.period}</span>
                {/* 🔄 allow full‑width wrap */}
                <p className="mt-2 text-foreground leading-relaxed max-w-none">
                  {exp.description}
                </p>
            
                {/* tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {exp.tags.map(tag => (
                    <span
                      key={tag}
                      className={`rounded-full px-2 py-1 text-xs ${tagColors[tag] ?? tagColors.default}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>            
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
