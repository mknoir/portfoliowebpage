'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import localFont from 'next/font/local'
import { ArrowDown, ArrowRight, ArrowUpRight, Bike, Mountain, Waves, Wind } from 'lucide-react'
import { AppearanceSwitcher } from '@/components/AppearanceSwitcher'
import { skillsData } from '@/lib/skills'
import '@/styles/afterhours.css'

type Mode = 'work' | 'play'

const barlowCondensed = localFont({
  src: '../app/fonts/BarlowCondensed-Bold.ttf',
  variable: '--font-barlow-condensed',
  display: 'swap',
  weight: '700',
})

const projects = [
  {
    name: 'Cornucopia',
    type: 'Scientific AI / Lab automation',
    image: '/projects/cornucopia-discovery-team.png',
    alt: 'Cornucopia Discovery Full Lab Team: ask a research question and Aster directs the specialists',
    width: 1810,
    height: 1024,
    description: 'I’m building software for scientific discovery. Connecting the research, the experiments, and the tools it takes to do the work.',
    links: [
      { label: 'Explore Discovery', href: 'https://discovery.cornucopiabio.com' },
      { label: 'Open the app', href: 'https://app.cornucopiabio.com' },
    ],
  },
  {
    name: 'Thread of Life',
    type: 'Genetics / Scientific storytelling',
    image: '/projects/thread-of-life.png',
    alt: 'Thread of Life gene and genetic variant explorer',
    width: 1280,
    height: 720,
    description: 'An explorer for genes and genetic variants. Follow a question, look at the evidence, and see where the thread takes you.',
    links: [{ label: 'Pull a thread', href: 'https://tol-two.vercel.app/' }],
  },
]

const tools = [
  { name: '3D Chem Viewer', kind: 'Molecular structures', href: 'https://chemview.streamlit.app/' },
  { name: 'ADME Checker', kind: 'Drug-likeness', href: 'https://chemro5.streamlit.app/' },
  { name: 'Target Bioactivity', kind: 'ChEMBL data', href: 'https://chembl.streamlit.app/' },
  { name: 'KEGG Query', kind: 'Pathway exploration', href: 'https://keggapp-mknoir.streamlit.app/' },
]

const jobs = [
  { company: 'Amgen', role: 'Associate Scientist / MLE', dates: '2025—2026', detail: 'EGNNs and Transformers for target triage. Single-cell and single-nucleus RNA-seq analyses.' },
  { company: 'Amgen', role: 'Associate Scientist', dates: '2023—2025', detail: 'Molecular assays for cardiometabolic disease, automated iPSC workflows, and gene-expression pipelines.' },
  { company: 'BioMarin', role: 'Research Associate II, Gene Therapy', dates: '2023', detail: 'AAV production at 50 L scale, with real-time dashboards to track the process.' },
  { company: 'Optimized Foods', role: 'Research Associate', dates: '2022—2023', detail: 'Cell-cultured caviar. Worked on flavour, texture, and yield through process optimisation.' },
  { company: 'Cepheid', role: 'Research & Innovation Core Intern', dates: '2022', detail: 'Sample preparation and PCR protocols for a multiplex diagnostic assay.' },
  { company: 'UC Davis', role: 'Lab Associate & Teaching Assistant', dates: '2021—2022', detail: 'Sequencing analysis, teaching, and helping students make sense of their lab work.' },
]

const outside = [
  { skill: 'Bike', title: 'Two wheels.', text: 'A good reason to take the longer route.', icon: Bike },
  { skill: 'Snowboarding', title: 'Fresh snow.', text: 'The mountain gets my full attention.', icon: Mountain },
  { skill: 'Run', title: 'One more mile.', text: 'A little time to clear my head.', icon: Wind },
  { skill: 'Swim', title: 'Still learning.', text: 'More time in the water. Room to improve.', icon: Waves },
]

function Projects({ index }: { index: number }) {
  const [selected, setSelected] = useState(0)
  const project = projects[selected]

  return <section className="afterhours-projects" id="projects" aria-labelledby="afterhours-project-title">
    <div className="afterhours-section-line"><span>0{index} / Selected projects</span><span>Built out of curiosity.</span></div>
    <div className="afterhours-project-layout">
      <div className="afterhours-project-index">
        <h2 id="afterhours-project-title">A FEW<br />GOOD<br /><span>QUESTIONS.</span></h2>
        <p>Usually followed by a lot of code.</p>
        <div className="afterhours-project-select" role="group" aria-label="Choose a project to preview">
          {projects.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} aria-controls="afterhours-project-preview" onClick={() => setSelected(index)}>
            <span className="afterhours-small-number">0{index + 1}</span><span>{item.name}</span><ArrowUpRight size={25} aria-hidden="true" />
          </button>)}
        </div>
      </div>
      <div className="afterhours-project-preview" id="afterhours-project-preview" aria-live="polite" aria-atomic="true">
        <div className="afterhours-preview-label"><span>{project.type}</span><span>0{selected + 1} / 02</span></div>
        <a className="afterhours-project-image" href={project.links[0].href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} (opens in a new tab)`}>
          <Image src={project.image} alt={project.alt} width={project.width} height={project.height} sizes="(max-width: 800px) 92vw, 54vw" />
          <span className="afterhours-preview-arrow"><ArrowUpRight size={30} aria-hidden="true" /></span>
        </a>
        <div className="afterhours-project-description"><h3>{project.name}</h3><p>{project.description}</p><div className="afterhours-link-row">{project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={17} aria-hidden="true" /></a>)}</div></div>
      </div>
    </div>
    <div className="afterhours-tool-list"><p>Smaller experiments</p>{tools.map((tool) => <a href={tool.href} key={tool.name} target="_blank" rel="noopener noreferrer"><span>{tool.name}</span><span>{tool.kind}</span><ArrowUpRight size={18} aria-hidden="true" /></a>)}</div>
  </section>
}

function Outside({ index }: { index: number }) {
  return <section className="afterhours-outside" id="life" aria-labelledby="afterhours-outside-title">
    <div className="afterhours-section-line"><span>0{index} / Away from the desk</span><span>No lab coat required.</span></div>
    <div className="afterhours-outside-top"><h2 id="afterhours-outside-title">OUT<br /><span>OF OFFICE.</span></h2><p>Bikes, snowboards, running shoes.<br />I like having more than one way<br />to spend a day.</p><ArrowDown size={64} strokeWidth={1.3} aria-hidden="true" /></div>
    <div className="afterhours-outside-list">{outside.map((item, index) => {
      const value = skillsData.find((entry) => entry.skill === item.skill)?.value ?? 0
      const Icon = item.icon
      return <article key={item.skill} className="afterhours-interest">
        <div className="afterhours-interest-meta"><span>0{index + 1} / {item.skill}</span><Icon size={29} strokeWidth={1.4} aria-hidden="true" /></div>
        <h3>{item.title}</h3><p>{item.text}</p>
        <div className="afterhours-rating"><strong>{value}<span>/100</span></strong><div className="afterhours-rating-track" role="img" aria-label={`${item.skill}: ${value} out of 100, personal self-rating`}><i style={{ '--rating': `${value}%` } as CSSProperties} /></div></div>
      </article>
    })}</div>
    <div className="afterhours-outside-foot"><p>Entirely subjective scores. Still working on all of them.</p><p>Beer tasting? <strong>{skillsData.find((entry) => entry.skill === 'Beer Tasting')?.value ?? 90}/100.</strong> Priorities.</p></div>
  </section>
}

function Career({ index }: { index: number }) {
  return <section className="afterhours-career" id="experience" aria-labelledby="afterhours-career-title">
    <div className="afterhours-career-heading"><span className="afterhours-label">0{index} / Work history</span><h2 id="afterhours-career-title">THE<br /><span>DAY JOBS.</span></h2><p>Molecular biology, gene therapy, computational biology, and a lot of learning by doing.</p><a className="afterhours-text-link" href="/Mickey_Makhija_Resume.pdf" target="_blank" rel="noopener noreferrer">My résumé <ArrowUpRight size={18} aria-hidden="true" /></a></div>
    <div className="afterhours-career-list">{jobs.map((job, index) => <details key={`${job.company}-${job.dates}`} open={index === 0}><summary><span className="afterhours-job-date">{job.dates}</span><span className="afterhours-job-name"><strong>{job.company}</strong><span>{job.role}</span></span><span className="afterhours-job-plus" aria-hidden="true">+</span></summary><p>{job.detail}</p></details>)}</div>
  </section>
}

export default function AfterHoursPortfolio({ page = 'home' }: { page?: 'home' | 'about' | 'work' }) {
  const [mode, setMode] = useState<Mode>('work')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let frame = 0
    function followAnchor() {
      const requestedHash = window.location.hash
      let hash = ''
      try { hash = decodeURIComponent(requestedHash.slice(1)) } catch { return }
      if (hash === 'cornucopia') hash = 'projects'
      const id = hash || (page === 'about' ? 'about' : page === 'work' ? 'experience' : 'hero')
      const target = rootRef.current?.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`)
      if (!target) return
      void document.fonts.ready.then(() => {
        if (cancelled || window.location.hash !== requestedHash) return
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          if (cancelled || window.location.hash !== requestedHash) return
          const headerHeight = rootRef.current?.querySelector<HTMLElement>('.afterhours-header')?.getBoundingClientRect().height ?? 0
          window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight), behavior: 'instant' })
        })
      })
    }
    followAnchor()
    window.addEventListener('hashchange', followAnchor)
    return () => { cancelled = true; cancelAnimationFrame(frame); window.removeEventListener('hashchange', followAnchor) }
  }, [page])

  function changeMode(next: Mode) {
    if (mode === next) return
    setMode(next)
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`)
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }))
  }

  return <div className={`afterhours-site ${barlowCondensed.variable}`} data-mode={mode} ref={rootRef}>
    <header className="afterhours-header">
      <a className="afterhours-brand" href="#hero" aria-label="Mickey Makhija, back to the top"><strong>MM<span>↗</span></strong><span>Mickey Makhija<br />Scientist &amp; builder</span></a>
      <div className="afterhours-mode" role="group" aria-label="Explore work or play"><button type="button" onClick={() => changeMode('work')} aria-pressed={mode === 'work'} aria-controls="afterhours-content">Work<span>01</span></button><button type="button" onClick={() => changeMode('play')} aria-pressed={mode === 'play'} aria-controls="afterhours-content">Play<span>02</span></button></div>
      <div className="afterhours-header-right"><a href="#contact">Say hello <ArrowUpRight size={16} aria-hidden="true" /></a><AppearanceSwitcher /></div>
    </header>

    <section className="afterhours-hero" id="hero" aria-labelledby="afterhours-title">
      <div className="afterhours-hero-top"><span>{mode === 'work' ? 'Biology. Robotics. Intelligence.' : 'Bikes. Boards. A breath of fresh air.'}</span><span>Personal portfolio / {new Date().getFullYear()}</span></div>
      <div className="afterhours-hero-layout">
        <div className="afterhours-hero-type"><p>{mode === 'work' ? 'Hi, I’m Mickey. I’m' : 'Same Mickey. A little'}</p><h1 id="afterhours-title">{mode === 'work' ? <>SERIOUS<br />ABOUT<br /><span>SCIENCE.</span></> : <>LESS<br />SCREEN.<br /><span>MORE SKY.</span></>}</h1></div>
        <div className="afterhours-hero-aside"><span className="afterhours-edition">{mode === 'work' ? 'THE WORK EDITION' : 'THE AFTER HOURS EDITION'}</span><div className="afterhours-hero-note"><span className="afterhours-star" aria-hidden="true">✳</span><p>{mode === 'work' ? 'I build tools for the science I care about. Usually somewhere between a lab bench and a laptop.' : 'I run, cycle, snowboard, and swim. Getting outside is a pretty good way to get out of my own head.'}</p><a href={mode === 'work' ? '#projects' : '#life'}>{mode === 'work' ? 'See what I’m building' : 'Catch me outside'}<ArrowDown size={21} aria-hidden="true" /></a></div></div>
      </div>
      <div className="afterhours-hero-bottom"><span>{mode === 'work' ? 'Good questions make good projects.' : 'The best route is not always the shortest.'}</span><nav aria-label="Page navigation"><a href="#about">About</a><a href="#experience">Experience</a><a href="#thoughts">Thoughts</a></nav></div>
    </section>

    <div id="afterhours-content">
      {mode === 'work' ? <><Projects index={1} /><Career index={2} /><Outside index={3} /></> : <><Outside index={1} /><Projects index={2} /><Career index={3} /></>}
    </div>

    <section className="afterhours-about" id="about" aria-labelledby="afterhours-about-title">
      <div className="afterhours-about-image"><Image src="/portrait.jpg" alt="Mickey Makhija" width={1892} height={2832} sizes="(max-width: 680px) 84vw, 30vw" /><span>MICKEY, OFF THE CLOCK.</span></div>
      <div className="afterhours-about-copy"><span className="afterhours-label">04 / A little context</span><h2 id="afterhours-about-title">CURIOUS<br />BY<br /><span>DEFAULT.</span></h2><p>I’m Mickey. Molecular biology was my way in. Software and robotics gave me more ways to work on the questions I kept running into.</p><p>I’ve worked on molecular assays, gene therapy, cell culture, and computational biology. These days, I’m particularly interested in how AI and automation can help scientists do their work.</p><p>Outside of that: see the Play tab. The beer-tasting score is probably my most defensible one.</p><a className="afterhours-text-link" href="/about?look=mono">The longer version <ArrowRight size={19} aria-hidden="true" /></a></div>
    </section>

    <section className="afterhours-thoughts" id="thoughts" aria-labelledby="afterhours-thoughts-title"><span className="afterhours-label">05 / Notes to self</span><h2 id="afterhours-thoughts-title">THOUGHTS<span>IN PROGRESS.</span></h2><div><p>Things I want to write about.<br />Science, building, and whatever sticks.</p><span className="afterhours-soon">Coming soon <span aria-hidden="true">↗</span></span></div></section>

    <footer className="afterhours-footer" id="contact"><div className="afterhours-footer-top"><span className="afterhours-label">Got a good question?</span><a href="mailto:himay75@gmail.com">LET’S<br /><span>TALK.</span><ArrowUpRight strokeWidth={1} aria-hidden="true" /></a><span className="afterhours-email">himay75@gmail.com</span></div><div className="afterhours-footer-bottom"><span>© {new Date().getFullYear()} Mickey Makhija</span><div><a href="https://github.com/mknoir" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a><a href="https://www.linkedin.com/in/himay-makhija-mickey/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} aria-hidden="true" /></a><a href="#hero">Back to top ↑</a></div></div></footer>
  </div>
}
