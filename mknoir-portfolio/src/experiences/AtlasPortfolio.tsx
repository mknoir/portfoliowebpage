'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { AppearanceSwitcher } from '@/components/AppearanceSwitcher'
import { skillsData } from '@/lib/skills'
import { LAB_PROJECTS } from '@/lib/lab-stories'
import '@/styles/atlas.css'

type ChapterId = 'about' | 'biology' | 'intelligence' | 'robotics' | 'outdoors' | 'projects' | 'experience' | 'thoughts' | 'contact'
type AtlasPage = 'home' | 'about' | 'work'

const chapters: { id: ChapterId; number: string; label: string; subtitle: string; x?: number; y?: number }[] = [
  { id: 'about', number: '01', label: 'Mickey', subtitle: 'The person in the middle', x: 50, y: 49.34 },
  { id: 'biology', number: '02', label: 'Biology', subtitle: 'Start with the experiment', x: 20, y: 27.63 },
  { id: 'intelligence', number: '03', label: 'Intelligence', subtitle: 'Code, data & questions', x: 79.5, y: 26.32 },
  { id: 'robotics', number: '04', label: 'Robotics', subtitle: 'The physical part', x: 79, y: 71.05 },
  { id: 'outdoors', number: '05', label: 'Outside', subtitle: 'A change of pace', x: 20.5, y: 75.66 },
  { id: 'projects', number: '06', label: 'Projects', subtitle: 'Things you can open', x: 50.5, y: 12.5 },
  { id: 'experience', number: '07', label: 'The path', subtitle: 'Work & experience', x: 50, y: 85.53 },
  { id: 'thoughts', number: '08', label: 'Thoughts', subtitle: 'Coming soon' },
  { id: 'contact', number: '09', label: 'Say hello', subtitle: 'Start a conversation' },
]

const work = [
  { company: 'Amgen', role: 'Associate Scientist / MLE', dates: 'Jan 2025 — Jan 2026', copy: 'Explored EGNNs and Transformers for target triage. Worked with single-cell and single-nucleus RNA-seq data.' },
  { company: 'Amgen', role: 'Associate Scientist', dates: 'Jun 2023 — Jan 2025', copy: 'High-throughput molecular assays for cardiometabolic disease, automated iPSC workflows, and gene-expression pipelines.' },
  { company: 'BioMarin', role: 'Research Associate II, Gene Therapy', dates: 'Jan 2023 — Jun 2023', copy: 'AAV production in 50 L bioreactors and real-time process dashboards.' },
  { company: 'Optimized Foods', role: 'Research Associate', dates: 'Sep 2022 — Jan 2023', copy: 'Cell-cultured caviar: process work on flavour, texture, and yield.' },
  { company: 'Cepheid', role: 'Research & Innovation Core Intern', dates: 'Jun 2022 — Sep 2022', copy: 'Sample preparation and PCR protocols for a multiplex diagnostic assay.' },
  { company: 'UC Davis', role: 'Lab Associate & Teaching Assistant', dates: 'Aug 2021 — Jun 2022', copy: 'Teaching sequencing analysis and helping students with their lab reports.' },
]

const readingTitles: Record<ChapterId, string> = {
  about: 'Most people call me Mickey.',
  biology: 'It starts at the bench.',
  intelligence: 'One more way to ask a question.',
  robotics: 'Make the next run better.',
  outdoors: 'Close the laptop.',
  projects: 'Made to be used.',
  experience: 'The path so far.',
  thoughts: 'Still taking notes.',
  contact: 'Good things start with a conversation.',
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="atlas-text-link" href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={16} aria-hidden="true" /></a>
}

function AtlasReading({ chapter, select }: { chapter: ChapterId; select: (id: ChapterId) => void }) {
  if (chapter === 'about') return <>
    <p className="atlas-lede">Biology, robotics, and intelligence. I keep finding reasons to work on all three.</p>
    <figure className="atlas-portrait"><Image src="/portrait.jpg" alt="Mickey Makhija" width={1892} height={2832} sizes="(max-width: 760px) 85vw, 360px" /><figcaption>Himay Makhija. Mickey, for short.</figcaption></figure>
    <p>I’m a scientist and builder. My work has taken me from molecular assays and cell culture to automation, scientific software, and machine learning.</p>
    <p>I like getting into the details: what an experiment is actually measuring, why a workflow keeps breaking, whether the tool I’m building makes someone’s day easier.</p>
    <p>Outside that, there’s running, cycling, swimming, snowboarding, and a fairly serious interest in craft beer.</p>
    <ExternalLink href="/Mickey_Makhija_Resume.pdf">Read my résumé</ExternalLink>
    <div className="atlas-related"><span className="atlas-mono">Connected to</span><button type="button" onClick={() => select('experience')}>The path so far <ArrowRight size={16} /></button><button type="button" onClick={() => select('outdoors')}>Time outside <ArrowRight size={16} /></button></div>
  </>
  if (chapter === 'biology') return <>
    <p className="atlas-lede">Cells, controls, reagents, a question. Before a data point arrives in a file, quite a lot has already happened.</p>
    <p>My bench work includes molecular assays for cardiometabolic disease, iPSC workflows, gene expression, PCR, and cell culture. I’ve worked in both in vitro and in vivo settings.</p>
    <div className="atlas-specimen-note"><span className="atlas-mono">Two perspectives</span><div><span>In vitro</span><p>Cells and assays. A closer look at one part of the problem.</p></div><div><span>In vivo</span><p>The wider biological context. Different questions, different constraints.</p></div></div>
    <p>At BioMarin, I worked on AAV production. At Optimized Foods, it was cell-cultured caviar. I enjoy how much process development carries across very different applications.</p>
    <p>The lab is still my reference point when I write software. I want the tools to make sense to the person running the experiment.</p>
    <div className="atlas-related"><span className="atlas-mono">Connected to</span><button type="button" onClick={() => select('robotics')}>Lab automation <ArrowRight size={16} /></button><button type="button" onClick={() => select('intelligence')}>The data after the experiment <ArrowRight size={16} /></button></div>
  </>
  if (chapter === 'intelligence') return <>
    <p className="atlas-lede">I started writing code to solve problems in the lab. There turned out to be a lot of them.</p>
    <p>That grew into gene-expression pipelines, single-cell and single-nucleus RNA-seq analyses, and exploring EGNNs and Transformers for target triage at Amgen.</p>
    <p>I’m interested in machine learning as something you can put to work: a way to investigate a biological question or help a scientist get from data to the next experiment.</p>
    <div className="atlas-inline-project"><span className="atlas-mono">Currently building</span><h3>Cornucopia</h3><p>Tools for scientific discovery and experimental workflows.</p><ExternalLink href="https://discovery.cornucopiabio.com">Explore Discovery</ExternalLink><ExternalLink href="https://app.cornucopiabio.com">Open the app</ExternalLink></div>
    <ExternalLink href="https://github.com/mknoir">Find me on GitHub</ExternalLink>
    <div className="atlas-related"><span className="atlas-mono">Connected to</span><button type="button" onClick={() => select('projects')}>Things I’ve built <ArrowRight size={16} /></button></div>
  </>
  if (chapter === 'robotics') return <>
    <p className="atlas-lede">The interesting part is getting the experiment, the equipment, and the software to agree.</p>
    <p>At Amgen, I worked on automated iPSC workflows and the data pipelines around experimental work. Automation asks you to be specific about all the steps that felt obvious when a person was doing them.</p>
    <ol className="atlas-loop"><li><span>01</span><div><h3>The experiment</h3><p>What needs to happen, and what counts as a good run?</p></div></li><li><span>02</span><div><h3>The equipment</h3><p>What can the instrument actually do reliably?</p></div></li><li><span>03</span><div><h3>The feedback</h3><p>What did we learn that should change the next run?</p></div></li></ol>
    <p>That’s the kind of robotics I’m drawn to. A physical system, a useful job, and enough feedback to keep improving it.</p>
    <div className="atlas-related"><span className="atlas-mono">Connected to</span><button type="button" onClick={() => select('biology')}>The experiment <ArrowRight size={16} /></button><button type="button" onClick={() => select('projects')}>Cornucopia & other projects <ArrowRight size={16} /></button></div>
  </>
  if (chapter === 'outdoors') return <>
    <p className="atlas-lede">Some days call for two wheels. Others, a mountain. Or a swim.</p>
    <p>I run, cycle, snowboard, and swim. I like having things in my life that take my attention somewhere other than a screen.</p>
    <p>It’s good to get outside.</p>
    <div className="atlas-ratings"><span className="atlas-mono">An entirely personal scale / 100</span>{skillsData.filter((skill) => ['Bike', 'Swim', 'Run', 'Snowboarding', 'Beer Tasting'].includes(skill.skill)).map((skill) => <div className="atlas-rating" key={skill.skill}><div><span>{skill.skill}</span><span>{skill.value}<small>/100</small></span></div><div className="atlas-rating-track" aria-hidden="true"><span style={{ width: `${skill.value}%` }} /></div></div>)}</div>
    <p className="atlas-footnote">A playful self-assessment. Beer tasting remains a relative strength.</p>
    <a className="atlas-text-link" href="/about?look=mono#skills">The full skill chart <ArrowUpRight size={16} aria-hidden="true" /></a>
  </>
  if (chapter === 'projects') return <>
    <p className="atlas-lede">Scientific software, small experiments, and tools I wanted to exist.</p>
    {LAB_PROJECTS.map((project, index) => <article className="atlas-project" key={project.name}>
      <div className="atlas-project-caption"><span className="atlas-mono">Project / {String(index + 1).padStart(2, '0')}</span><ArrowUpRight size={16} aria-hidden="true" /></div>
      {project.image && <a href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} (new tab)`}><Image src={project.image} alt={`${project.name} website preview`} width={1280} height={720} sizes="(max-width: 760px) 90vw, 400px" /></a>}
      <h3>{project.name}</h3><p>{project.detail}</p><div className="atlas-project-links"><ExternalLink href={project.href}>{project.extra ? 'Discovery' : 'Open project'}</ExternalLink>{project.extra && <ExternalLink href={project.extra}>Open the app</ExternalLink>}</div>
    </article>)}
    <ExternalLink href="https://github.com/mknoir">More on GitHub</ExternalLink>
  </>
  if (chapter === 'experience') return <>
    <p className="atlas-lede">From the wet lab to the software around it. Sometimes both at once.</p>
    <ol className="atlas-timeline">{work.map((job) => <li key={`${job.company}-${job.dates}`}><span className="atlas-mono">{job.dates}</span><h3>{job.company}</h3><h4>{job.role}</h4><p>{job.copy}</p></li>)}</ol>
    <ExternalLink href="/Mickey_Makhija_Resume.pdf">Read my résumé</ExternalLink>
  </>
  if (chapter === 'thoughts') return <>
    <p className="atlas-lede">A place for the things I want to think through in writing.</p>
    <div className="atlas-coming-soon"><span className="atlas-mono">First entry</span><span>Coming<br />soon.</span><span className="atlas-mono">No entries published yet.</span></div>
    <p>Science, things I’m building, and whatever else sticks around long enough to become a post.</p>
    <a className="atlas-text-link" href="mailto:himay75@gmail.com">Have something to talk about? <ArrowUpRight size={16} aria-hidden="true" /></a>
  </>
  return <>
    <p className="atlas-lede">Working on something in biology, robotics, or scientific software? I’d like to hear about it.</p>
    <div className="atlas-contact-links"><a href="mailto:himay75@gmail.com"><span className="atlas-mono">Email</span><span>himay75@gmail.com <ArrowUpRight size={18} aria-hidden="true" /></span></a><a href="https://www.linkedin.com/in/himay-makhija-mickey/" target="_blank" rel="noopener noreferrer"><span className="atlas-mono">Elsewhere</span><span>LinkedIn <ArrowUpRight size={18} aria-hidden="true" /></span></a><a href="https://github.com/mknoir" target="_blank" rel="noopener noreferrer"><span className="atlas-mono">Things in progress</span><span>GitHub <ArrowUpRight size={18} aria-hidden="true" /></span></a></div>
    <p>Or send a good cycling route. That works too.</p>
  </>
}

function chapterFromHash(page: AtlasPage): ChapterId | null {
  let hash = ''
  try { hash = decodeURIComponent(window.location.hash.slice(1)) } catch { /* Ignore malformed anchors. */ }
  if (hash === 'cornucopia') return 'projects'
  if (hash === 'skills' || hash === 'life') return 'outdoors'
  if (hash === 'work') return 'experience'
  if (hash === 'map' || hash === 'hero') return null
  return chapters.some((chapter) => chapter.id === hash) ? hash as ChapterId : page === 'about' ? 'about' : page === 'work' ? 'experience' : null
}

export default function AtlasPortfolio({ page = 'home' }: { page?: AtlasPage }) {
  const [active, setActive] = useState<ChapterId | null>(page === 'about' ? 'about' : page === 'work' ? 'experience' : null)
  const [hovered, setHovered] = useState<ChapterId | null>(null)
  const readerRef = useRef<HTMLElement>(null)
  const exploreRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const originRef = useRef<HTMLButtonElement | null>(null)
  const mapScrollRef = useRef(0)
  const activeChapter = chapters.find((chapter) => chapter.id === active)
  const previewChapter = chapters.find((chapter) => chapter.id === (hovered ?? active))

  useEffect(() => {
    function syncChapter() {
      setActive(chapterFromHash(page))
      if (window.matchMedia('(max-width: 760px)').matches) window.scrollTo({ top: 0, behavior: 'instant' })
    }
    syncChapter()
    window.addEventListener('hashchange', syncChapter)
    window.addEventListener('popstate', syncChapter)
    return () => { window.removeEventListener('hashchange', syncChapter); window.removeEventListener('popstate', syncChapter) }
  }, [page])

  useEffect(() => { if (readerRef.current) readerRef.current.scrollTop = 0 }, [active])

  function select(id: ChapterId) {
    if (!active) mapScrollRef.current = window.scrollY
    if (document.activeElement instanceof HTMLButtonElement && !document.activeElement.closest('.atlas-reader')) originRef.current = document.activeElement
    setActive(id)
    setHovered(null)
    const url = new URL(window.location.href)
    url.hash = id
    window.history.pushState(window.history.state, '', url)
    requestAnimationFrame(() => {
      if (window.matchMedia('(max-width: 760px)').matches) window.scrollTo({ top: 0, behavior: 'instant' })
      headingRef.current?.focus({ preventScroll: true })
    })
  }

  function closeReading() {
    setActive(null)
    setHovered(null)
    const url = new URL(window.location.href)
    url.hash = 'map'
    window.history.pushState(window.history.state, '', url)
    requestAnimationFrame(() => {
      if (window.matchMedia('(max-width: 760px)').matches) window.scrollTo({ top: mapScrollRef.current, behavior: 'instant' })
      const target = originRef.current?.isConnected ? originRef.current : exploreRef.current?.querySelector<HTMLButtonElement>('.atlas-node')
      target?.focus({ preventScroll: true })
    })
  }

  return <div className={`atlas-site${active ? ' atlas-reading-open' : ''}`}>
    <header className="atlas-masthead"><button className="atlas-brand" type="button" onClick={closeReading} aria-label="Mickey Makhija, return to the atlas"><span className="atlas-monogram" aria-hidden="true">m.</span><span>A personal atlas<span>Mickey Makhija</span></span></button><div className="atlas-masthead-note atlas-mono">Biology / Robotics / Intelligence</div><div className="atlas-masthead-tools"><button type="button" className="atlas-header-contact" onClick={() => select('contact')}>Say hello <ArrowUpRight size={15} aria-hidden="true" /></button><AppearanceSwitcher /></div></header>

    <div className="atlas-workspace">
      <section ref={exploreRef} className="atlas-explore" aria-label="Explore Mickey’s atlas">
        <div className="atlas-intro"><span className="atlas-mono">An ongoing exploration</span><h1><span>A few</span><span>connected</span><em>things.</em></h1><p>I’m Mickey. I work on biology, robotics, and intelligence.<br /><br />This is a map of what keeps me curious.</p><span className="atlas-map-hint atlas-mono"><ArrowRight size={14} aria-hidden="true" /> Pick a point. Follow a thread.</span></div>

        <div className="atlas-map-area">
          <div className="atlas-map-coordinates atlas-mono"><span>Fig. 01 / A map of interests</span><span>Not to scale</span></div>
          <div className="atlas-map" data-highlight={hovered ?? active ?? 'none'}>
            <svg viewBox="0 0 1000 760" className="atlas-connections" role="img" aria-label="A concept map connects Mickey with biology, intelligence, robotics, outdoor interests, projects, and work experience. Each topic is available as a button.">
              <defs><pattern id="atlas-grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="currentColor" strokeWidth=".7" /></pattern></defs>
              <rect width="1000" height="760" fill="url(#atlas-grid)" className="atlas-grid" />
              <g className="atlas-survey-marks" stroke="currentColor" fill="none"><path d="M25 25h18m-9-9v18M975 25h-18m9-9v18M25 735h18m-9-9v18M975 735h-18m9-9v18" /><circle cx="500" cy="375" r="260" strokeDasharray="2 9" /><circle cx="500" cy="375" r="150" strokeDasharray="2 9" /></g>
              <g className="atlas-secondary-connections" fill="none" stroke="currentColor"><path d="M200 210C240 100 360 80 505 95M505 95C650 50 770 90 795 200M795 200C855 350 860 420 790 540M790 540C730 650 625 665 500 650M500 650C375 690 260 675 205 575M205 575C110 425 100 290 200 210" strokeDasharray="5 7" /></g>
              <g className="atlas-primary-connections" fill="none" stroke="currentColor"><path data-connection="biology" d="M500 375C360 375 320 270 200 210" /><path data-connection="intelligence" d="M500 375C635 375 650 250 795 200" /><path data-connection="robotics" d="M500 375C640 430 715 500 790 540" /><path data-connection="outdoors" d="M500 375C350 460 300 500 205 575" /><path data-connection="projects" d="M500 375C465 250 480 205 505 95" /><path data-connection="experience" d="M500 375V650" /></g>
              <g className="atlas-map-annotations" fill="currentColor" aria-hidden="true"><text x="295" y="118">EXPERIMENT</text><text x="692" y="362" transform="rotate(90 692 362)">BUILD</text><text x="252" y="650" transform="rotate(15 252 650)">EXPLORE</text></g>
            </svg>
            {chapters.filter((chapter) => chapter.x !== undefined).map((chapter) => <button key={chapter.id} className={`atlas-node atlas-node-${chapter.id}`} style={{ left: `${chapter.x}%`, top: `${chapter.y}%` }} type="button" onClick={() => select(chapter.id)} onPointerEnter={() => setHovered(chapter.id)} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(chapter.id)} onBlur={() => setHovered(null)} aria-current={active === chapter.id ? 'true' : undefined} aria-label={`Explore ${chapter.label}: ${chapter.subtitle}`}><span className="atlas-node-dot" aria-hidden="true">{chapter.id === 'about' ? 'm.' : chapter.number}</span><span className="atlas-node-label">{chapter.label}</span><span className="atlas-node-detail">{chapter.subtitle}</span></button>)}
          </div>
          <div className="atlas-map-legend"><span className="atlas-mono"><i aria-hidden="true" />{previewChapter ? `${previewChapter.number} / ${previewChapter.subtitle}` : 'Every point is a place to begin'}</span><span className="atlas-mono">Select to read <ArrowDown size={13} aria-hidden="true" /></span></div>
        </div>

        <nav className="atlas-chapter-index" aria-label="Atlas chapter index"><span className="atlas-mono atlas-index-label">Index</span>{chapters.map((chapter) => <button key={chapter.id} type="button" onClick={() => select(chapter.id)} aria-current={active === chapter.id ? 'page' : undefined}><span className="atlas-mono">{chapter.number}</span><span>{chapter.id === 'about' ? 'About me' : chapter.label}</span><ArrowUpRight size={14} aria-hidden="true" /></button>)}</nav>
      </section>

      {active && activeChapter && <aside ref={readerRef} className="atlas-reader" aria-labelledby="atlas-reading-title" onKeyDown={(event) => { if (event.key === 'Escape') closeReading() }}>
        <div className="atlas-reader-top"><span className="atlas-mono">{activeChapter.number} / {activeChapter.label}</span><button type="button" onClick={closeReading} aria-label="Close reading and return to the map"><X size={20} aria-hidden="true" /></button></div>
        <article className="atlas-reading"><h2 ref={headingRef} id="atlas-reading-title" tabIndex={-1}>{readingTitles[active]}</h2><AtlasReading chapter={active} select={select} /><button type="button" className="atlas-back" onClick={closeReading}><ArrowLeft size={16} aria-hidden="true" /> Back to the atlas</button></article>
      </aside>}
    </div>

    <footer className="atlas-footer atlas-mono"><span>Science. Software. Fresh air.</span><button type="button" onClick={() => select('thoughts')}>Thoughts <span>Coming soon</span><ArrowUpRight size={13} aria-hidden="true" /></button><span>Mickey Makhija / Personal atlas</span></footer>
  </div>
}
