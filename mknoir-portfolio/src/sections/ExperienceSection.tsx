import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import '@/styles/interior.css'

interface Experience {
  company: string
  logo?: string
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
    <div id="experience" className="interior-page shell">
      <header className="experience-intro">
        <p className="eyebrow">Experience / The path so far</p>
        <h1 className="interior-title">From experiments<br />to systems.</h1>
        <div className="experience-intro-bottom">
          <p className="interior-lead">
            A path through molecular biology, therapeutics, automation, and
            machine learning. Each role adds another way to think about the next
            problem.
          </p>
          <Link className="text-link" href="/#projects">
            See what I’m building <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <ol className="experience-list" aria-label="Work experience, most recent first">
        {experiences.map((experience) => (
          <li className="experience-row" key={`${experience.company}-${experience.period}`}>
            <div className="experience-meta">
              <p className="experience-period">{experience.period}</p>
              {experience.logo && (
                <div className="experience-logo">
                  <Image
                    src={experience.logo}
                    alt=""
                    width={108}
                    height={46}
                    className="experience-logo-image"
                  />
                </div>
              )}
            </div>
            <article className="experience-content">
              <p className="experience-company">{experience.company}</p>
              <h2>{experience.role}</h2>
              <p className="experience-description">{experience.description}</p>
              <ul className="experience-tags" aria-label="Areas of work">
                {experience.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </article>
          </li>
        ))}
      </ol>

      <section className="interior-contact" aria-labelledby="experience-contact-title">
        <div>
          <p className="eyebrow">The next interesting problem</p>
          <h2 id="experience-contact-title">Let’s build something useful.</h2>
        </div>
        <a className="button-primary" href="mailto:himay75@gmail.com">
          Get in touch <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </section>
    </div>
  )
}
