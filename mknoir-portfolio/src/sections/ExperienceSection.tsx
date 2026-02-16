'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

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
  return (
    <section id="experience" className="py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Work &amp; Experience
        </h2>

        <div>
          {experiences.map((exp, idx) => (
            <div key={`${exp.company}-${exp.period}`}>
              {idx > 0 && <Separator className="my-8" />}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex flex-col gap-4 md:flex-row md:items-start"
              >
                {/* Logo */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted p-2">
                  <Image
                    src={exp.logo}
                    alt={`${exp.company} logo`}
                    width={32}
                    height={32}
                    className="object-contain"
                    priority={idx === 0}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base font-semibold sm:text-lg">
                    {exp.role}{' '}
                    <span className="text-muted-foreground">
                      @ {exp.company}
                    </span>
                  </h3>
                  <span className="mb-2 block text-sm text-muted-foreground">
                    {exp.period}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {exp.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
