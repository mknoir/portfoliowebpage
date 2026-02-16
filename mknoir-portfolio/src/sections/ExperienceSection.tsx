'use client'

import React, { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Experience {
  company: string
  logo: string
  role: string
  period: string
  description: string
  tags: string[]
}

const experiences: Experience[] = [
  {
    company: 'Amgen',
    logo: '/logos/amgen.svg',
    role: 'Associate Scientist / MLE',
    period: 'Jan 2025 — Jan 2026',
    description:
      'Transitioned to a hybrid Computational Biology / MLE role, exploring EGNNs, Transformers, and their applications in target triage. Also performed single-cell and single-nucleus RNA-seq analyses for project deep dives.',
    tags: ['Comp. Biology', 'Machine Learning', 'EGNN', 'Transformers', 'scRNA-seq'],
  },
  {
    company: 'Amgen',
    logo: '/logos/amgen.svg',
    role: 'Associate Scientist',
    period: 'Jun 2023 — Jan 2025',
    description:
      'Optimised high-throughput molecular assays for cardiometabolic disease. Automated iPSC workflows and built gene-expression data pipelines.',
    tags: ['Automation', 'Molecular Biology', 'iPSC', 'Gene Expression'],
  },
  {
    company: 'BioMarin Pharmaceutical Inc.',
    logo: '/logos/biomarin.svg',
    role: 'Research Associate II, Gene Therapy',
    period: 'Jan 2023 — Jun 2023',
    description:
      'Scaled AAV production to 50 L bioreactors and built real-time dashboards to speed decision-making.',
    tags: ['Gene Therapy', 'Bioreactors', 'AAV', 'Data Integration'],
  },
  {
    company: 'Optimized Foods',
    logo: '/logos/optimized.svg',
    role: 'Research Associate',
    period: 'Sep 2022 — Jan 2023',
    description:
      'Created cell-cultured caviar, improving flavour, texture and yield through process optimisation.',
    tags: ['Cell Culture', 'Process Optimization', 'Food Tech'],
  },
  {
    company: 'Cepheid (Danaher)',
    logo: '/logos/cepheid.svg',
    role: 'Research & Innovation Core Intern',
    period: 'Jun 2022 — Sep 2022',
    description:
      'Optimised sample-prep and PCR protocols for a multiplex diagnostic assay targeting emerging diseases.',
    tags: ['Diagnostics', 'PCR', 'Sample Prep'],
  },
  {
    company: 'UC Davis',
    logo: '/logos/ucdavis.svg',
    role: 'Lab Associate & Teaching Assistant',
    period: 'Aug 2021 — Jun 2022',
    description:
      'Taught sequencing analysis and improved student lab-report accuracy by 20%.',
    tags: ['Education', 'Lab Techniques', 'Protein Purification'],
  },
]

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
    <section id="experience" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-20 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Work &amp; Experience
        </h2>

        <div className="relative">
          {/* Animated timeline line */}
          <motion.div
            ref={lineRef}
            initial={{ height: 0 }}
            animate={controls}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="absolute left-5 top-0 w-0.5 origin-top bg-border"
          />

          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative pl-14"
              >
                {/* Timeline dot */}
                <div className="absolute left-[14px] top-6 h-3 w-3 rounded-full border-2 border-foreground bg-background" />

                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:p-8">
                    {/* Logo */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted p-2">
                      <Image
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        width={40}
                        height={40}
                        className="object-contain"
                        priority={idx === 0}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold sm:text-xl">
                        {exp.role}{' '}
                        <span className="text-muted-foreground">
                          @ {exp.company}
                        </span>
                      </h3>
                      <span className="mb-3 block text-sm text-muted-foreground">
                        {exp.period}
                      </span>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {exp.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {exp.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
