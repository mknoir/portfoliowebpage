'use client'

import React, { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'

// ✅ Optional: Tag colors per category
const tagColors: Record<string, string> = {
  AI: 'bg-accent-primary text-black',
  Automation: 'bg-accent-primary text-black',
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
  // fallback
  default: 'bg-gray-700 text-white',
}

const experiences = [
  {
    company: 'Cornucopia Biosciences Inc.',
    logo: '/logos/cornucopia.svg',
    role: 'Founder & Lead Biotech Automation Researcher',
    period: '2025 — Present',
    description:
      'Designing the future of molecular research with AI-powered automation. Currently in stealth mode — reach out to learn more.',
    tags: ['AI', 'Automation', 'Founder', 'Biotech'],
  },
  {
    company: 'Amgen',
    logo: '/logos/amgen.svg',
    role: 'Associate Scientist',
    period: '2023 — Present',
    description:
      'Developing and optimizing high-throughput molecular assays for cardiometabolic disease research. Automated iPSC workflows using Hamilton STAR, integrated data pipelines for gene expression analysis, and contributed to cross-functional R&D projects.',
    tags: ['Automation', 'Molecular Biology', 'iPSC', 'Gene Expression'],
  },
  {
    company: 'BioMarin Pharmaceutical Inc.',
    logo: '/logos/biomarin.svg',
    role: 'Research Associate II, Gene Therapy',
    period: 'January 2023 — June 2023',
    description:
      'Worked on gene therapy process development, gaining hands-on experience with bioreactor systems up to 50L for AAV production and scale-up. Built real-time dashboards to enhance cross-functional data visibility and decision-making.',
    tags: ['Gene Therapy', 'Bioreactors', 'AAV', 'Data Integration'],
  },
  {
    company: 'Optimized Foods',
    logo: '/logos/optimized.svg',
    role: 'Research Associate',
    period: 'September 2022 — January 2023',
    description:
      'Had a fantastic time creating cell-cultured caviar! Focused on optimizing taste, texture, and production processes through cell culture innovations and process improvements.',
    tags: ['Cell Culture', 'Process Optimization', 'Food Tech'],
  },
  {
    company: 'Cepheid (Danaher)',
    logo: '/logos/cepheid.svg',
    role: 'Research & Innovation Core Intern',
    period: 'June 2022 — September 2022',
    description:
      'Assisted in optimizing sample preparation and PCR protocols for a multiplex clinical diagnostic assay targeting emerging diseases.',
    tags: ['Diagnostics', 'PCR', 'Sample Prep'],
  },
  {
    company: 'UC Davis',
    logo: '/logos/ucdavis.svg',
    role: 'Lab Associate & Teaching Assistant',
    period: 'August 2021 — June 2022',
    description:
      'Instructed students on laboratory techniques and sequencing data analysis (SEURAT, PCR). Conducted gene transformation, protein purification, and kinetic assays, improving student comprehension and report accuracy by over 20%.',
    tags: ['Education', 'Lab Techniques', 'Protein Purification'],
  },
]

export const ExperienceSection: React.FC = () => {
  const controls = useAnimation()
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const top = timelineRef.current?.getBoundingClientRect().top || 0
      const height = window.innerHeight
      if (top < height * 0.8) {
        controls.start({ height: '100%' })
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [controls])

  return (
    <section className="py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-foreground">
          Work & Experience
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <motion.div
            ref={timelineRef}
            initial={{ height: 0 }}
            animate={controls}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="absolute left-2 top-0 w-1 bg-accent-primary origin-top"
            style={{ height: '0%' }}
          />
          <div className="space-y-16 snap-y snap-mandatory overflow-y-auto max-h-screen">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative pl-10 bg-surface rounded-lg transition-shadow duration-300 hover:shadow-2xl hover:scale-[1.02] snap-start"
              >
                {/* Timeline dot */}
                <div className="absolute w-3 h-3 bg-accent-primary rounded-full left-0 top-2.5" />
                <div className="flex items-center gap-4 mb-2 flex-wrap">
                  {exp.logo && (
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      className="w-8 h-8 object-contain"
                      loading="lazy" // ✅ Lazy load
                    />
                  )}
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                    {exp.role} @ {exp.company}
                  </h3>
                </div>
                <span className="text-textMuted text-sm">{exp.period}</span>
                <p className="mt-2 text-foreground">{exp.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {exp.tags.map((tag, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{
                        scale: 1.05,
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`text-xs px-2 py-1 rounded-full cursor-default transition-colors duration-300 ${
                        tagColors[tag] || tagColors.default
                      }`}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExperienceSection
