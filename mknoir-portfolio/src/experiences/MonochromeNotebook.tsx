'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Copy, Moon, Sun } from 'lucide-react'
import { AppearanceSwitcher } from '@/components/AppearanceSwitcher'
import SkillsRadarChart, { skillsData } from '@/components/SkillsRadarChart'
import '@/styles/notebook.css'

const TalkToMe = dynamic(() => import('@/sections/TalkToMe').then((module) => module.TalkToMe), {
  loading: () => <p className="notebook-voice-loading" role="status">Opening the voice experiment…</p>,
})

const contents = [
  { id: 'about', number: '01', label: 'A personal memo' },
  { id: 'stack', number: '02', label: 'The stack' },
  { id: 'life', number: '03', label: 'Outside the lab' },
  { id: 'projects', number: '04', label: 'Things I’m building' },
  { id: 'experience', number: '05', label: 'Work, so far' },
  { id: 'thoughts', number: '06', label: 'Thoughts' },
  { id: 'contact', number: '07', label: 'Say hello' },
] as const

const stack = ['Molecular biology', 'Cell culture', 'PCR / qPCR', 'Gene expression', 'Python', 'R', 'Machine learning', 'scRNA-seq', 'Statistics', 'Automation', 'Robotics', 'Bioinformatics']

// Dates, titles, and work are retained from the existing experience page.
const experience = [
  { company: 'Amgen', role: 'Associate Scientist / MLE', dates: 'Jan 2025 — Jan 2026', text: 'Explored EGNNs and Transformers for target triage in a hybrid Computational Biology / MLE role. Performed single-cell and single-nucleus RNA-seq analyses.' },
  { company: 'Amgen', role: 'Associate Scientist', dates: 'Jun 2023 — Jan 2025', text: 'Optimised molecular assays for cardiometabolic disease, automated iPSC workflows, and built gene-expression data pipelines.' },
  { company: 'BioMarin Pharmaceutical Inc.', role: 'Research Associate II, Gene Therapy', dates: 'Jan 2023 — Jun 2023', text: 'Scaled AAV production to 50 L bioreactors and built real-time dashboards.' },
  { company: 'Optimized Foods', role: 'Research Associate', dates: 'Sep 2022 — Jan 2023', text: 'Worked on cell-cultured caviar, improving flavour, texture, and yield through process optimisation.' },
  { company: 'Cepheid (Danaher)', role: 'Research & Innovation Core Intern', dates: 'Jun 2022 — Sep 2022', text: 'Optimised sample preparation and PCR protocols for a multiplex diagnostic assay.' },
  { company: 'UC Davis', role: 'Lab Associate & Teaching Assistant', dates: 'Aug 2021 — Jun 2022', text: 'Taught sequencing analysis and helped students improve their lab reports.' },
]

export function MonochromeNotebook({ initialSection = 'memo' }: { initialSection?: 'memo' | 'work' }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState<string>(initialSection === 'work' ? 'experience' : 'about')
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveSection(entry.target.id)
      }
    }, { rootMargin: '-18% 0px -64% 0px', threshold: 0 })
    const root = rootRef.current
    contents.forEach(({ id }) => {
      const section = root?.querySelector(`#${id}`)
      if (section) observer.observe(section)
    })

    let scrollFrame = 0
    function scrollToSection(id: string) {
      if (!root) return
      const targetId = id === 'memo' ? 'about' : id === 'work' ? 'experience' : id
      const target = targetId === 'hero'
        ? root
        : targetId === 'talk'
          ? root.querySelector<HTMLElement>('.notebook-voice-drawer')
          : Array.from(root.querySelectorAll<HTMLElement>('[id]')).find((element) => element.id === targetId)
      if (!target) return
      const topbarHeight = root.querySelector<HTMLElement>('.notebook-topbar')?.offsetHeight ?? 82
      const contentsHeight = window.matchMedia('(max-width: 800px)').matches
        ? root.querySelector<HTMLElement>('.notebook-sidebar')?.offsetHeight ?? 60
        : 0
      const targetTop = target.getBoundingClientRect().top + window.scrollY - topbarHeight - contentsHeight - 20
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'instant' })
    }
    function handleHash() {
      let id = ''
      try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
      if (id === 'talk') setVoiceOpen(true)
      cancelAnimationFrame(scrollFrame)
      scrollFrame = requestAnimationFrame(() => scrollToSection(id || (initialSection === 'work' ? 'experience' : 'hero')))
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(scrollFrame)
      window.removeEventListener('hashchange', handleHash)
      if (copyTimer.current) clearTimeout(copyTimer.current)
    }
  }, [initialSection])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('himay75@gmail.com')
      if (!rootRef.current) return
      setCopyState('copied')
    } catch {
      if (!rootRef.current) return
      setCopyState('failed')
    }
    if (copyTimer.current) clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopyState('idle'), 3000)
  }

  return (
    <div className="notebook" id="hero" ref={rootRef}>
      <header className="notebook-topbar">
        <a className="notebook-identity" href="#hero" aria-label="Mickey Makhija, back to top">
          <span className="notebook-monogram" aria-hidden="true">m.</span>
          <span>Mickey Makhija<span className="notebook-identity-detail">A personal notebook</span></span>
        </a>
        <div className="notebook-topbar-right">
          <span className="notebook-edition">Notebook / 001</span>
          <AppearanceSwitcher />
          <button className="notebook-icon-button" type="button" aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
            {resolvedTheme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div className="notebook-layout">
        <aside className="notebook-sidebar">
          <div className="notebook-sidebar-inner">
            <p className="notebook-label notebook-contents-label">Contents</p>
            <nav className="notebook-contents" aria-label="Notebook contents">
              {contents.map((item) => (
                <a key={item.id} href={`#${item.id}`} aria-current={activeSection === item.id ? 'location' : undefined} onClick={() => setActiveSection(item.id)}>
                  <span className="notebook-content-number">{item.number}</span><span>{item.label}</span>
                </a>
              ))}
            </nav>
            <div className="notebook-sidebar-note">
              <span className="notebook-small-rule" aria-hidden="true" />
              <p>Biology, robotics,<br />and intelligence.</p>
              <a href="https://github.com/mknoir" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={12} aria-hidden="true" /></a>
              <a href="https://www.linkedin.com/in/himay-makhija-mickey/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={12} aria-hidden="true" /></a>
            </div>
          </div>
        </aside>

        <div className="notebook-pages">
          <article className="notebook-memo" aria-labelledby="notebook-title">
            <section id="about" className="notebook-memo-opening">
              <p className="notebook-label notebook-page-label"><span>01 / A personal memo</span><span>By Mickey Makhija</span></p>
              <h1 id="notebook-title">On biology,<br />software, and the<br /><span>space between.</span></h1>
              <div className="notebook-memo-meta"><span>How I think. What I work on. A few other things.</span><a href="#stack">Keep reading <ArrowDown size={13} aria-hidden="true" /></a></div>
              <div className="notebook-prose">
                <p className="notebook-first-line">I’ve always been drawn to systems.</p>
                <p>Biology is often described as messy, stochastic, and unpredictable. Software is described as structured and exact. I’m interested in what each can teach us about the other.</p>
                <p>I think we can give biology more structure without pretending we understand all of it. We haven’t uncovered all of its logic, and we probably never will. But better ways of describing experiments, collecting data, and connecting instruments can help us work with that complexity.</p>
                <p>That’s the kind of work I want to do: build systems that connect molecular biology, automation, and software.</p>
                <p>Biology cannot be reduced to code (yet). But experiments should be reproducible, scalable, and well documented. I want us to be able to describe an experimental process, run it, see what happened, and improve it with some of the fluency we already have in software.</p>
                <p>The physical part matters just as much. Biology grows in incubators, responds to force and temperature, and unfolds through time. A good model or a clean script still has to deal with what happens at the bench.</p>
                <blockquote>A command becomes a movement.<br />An instrument makes a measurement.<br />That measurement changes the next experiment.</blockquote>
                <p>That’s why I’m interested in hardware. I find that sequence beautiful, especially when I can understand and build each part of it.</p>
                <p>I want to get better at working across those parts. An analysis pipeline is more useful when it understands how the data was collected. An automated experiment is more useful when its results can shape what happens next.</p>
                <p>There’s also a lot of ordinary friction in this work: disconnected instruments, difficult handoffs, and processes that depend on someone remembering every detail. Those are interesting problems to me. Solving them gives people more room to think about the science.</p>
                <p>I keep coming back to the same questions: how do these systems interact, where do they break down, and what would make them easier to work with?</p>
              </div>
            </section>

            <section id="stack" className="notebook-chapter">
              <div className="notebook-chapter-heading"><span className="notebook-label">02</span><h2>The stack.</h2></div>
              <div className="notebook-prose">
                <p>My work moves between the bench and the terminal. I might be designing a molecular assay, writing a pipeline for gene expression data, or connecting a liquid handler to an analysis script.</p>
                <p>At the bench, I work with molecular biology, cell culture, PCR, gene expression analysis, and high-throughput assays. My experience spans cardiometabolic disease and gene therapy.</p>
                <p>On the computational side, I use Python and R, and I’ve been working more with machine learning. I’ve explored EGNNs and Transformers for target triage, built single-cell and single-nucleus RNA-seq pipelines, and developed dashboards and data tools.</p>
                <p>Statistics runs through all of that: designing an experiment, deciding what the data supports, and working out what to try next.</p>
                <p>Robotics and automation bring these interests together. I want to build instruments and workflows that make it easier to run an experiment, understand the result, and repeat it.</p>
              </div>
              <ul className="notebook-tags" aria-label="Skills and tools">{stack.map((skill) => <li key={skill}>{skill}</li>)}</ul>
              <figure id="skills" className="notebook-skills">
                <figcaption><div><span className="notebook-label">Fig. 01</span><h3>Skills &amp; interests</h3></div><p>A very unofficial self-assessment.</p></figcaption>
                <SkillsRadarChart />
                <p className="notebook-chart-note">Still a better beer taster than swimmer.</p>
                <details className="notebook-skill-values"><summary>Read the levels</summary><dl>{skillsData.map(({ skill, value }) => <div key={skill}><dt>{skill}</dt><dd>{value} / 100</dd></div>)}</dl></details>
              </figure>
            </section>

            <section id="life" className="notebook-chapter notebook-life">
              <div className="notebook-chapter-heading"><span className="notebook-label">03</span><h2>Outside the lab.</h2></div>
              <div className="notebook-prose">
                <p>Outside of work, I run, cycle, snowboard, and explore new places.</p>
                <p>Running clears my head. Cycling gives me time to think at a different pace. Snowboarding takes all of my attention, which is part of why I like it.</p>
                <p>And yes, I take craft beer seriously. Fermentation is biology too.</p>
              </div>
              <p className="notebook-life-list">Snowboarding / Running / Cycling / Swimming / Craft beer / Travel</p>
            </section>
          </article>

          <section id="projects" className="notebook-chapter">
            <div className="notebook-chapter-heading"><span className="notebook-label">04</span><h2>Things I’m building.</h2></div>
            <div className="notebook-project-list">
              <article className="notebook-project" id="cornucopia">
                <span className="notebook-project-marker" aria-hidden="true">C /</span>
                <div><h3>Cornucopia</h3><p>Software for scientific discovery and experimental workflows. This is where a lot of the ideas above become things I can build and test.</p><div className="notebook-project-links"><a href="https://discovery.cornucopiabio.com" target="_blank" rel="noopener noreferrer">Discovery <ArrowUpRight size={14} aria-hidden="true" /></a><a href="https://app.cornucopiabio.com" target="_blank" rel="noopener noreferrer">Open the app <ArrowUpRight size={14} aria-hidden="true" /></a></div></div>
              </article>
              <article className="notebook-project">
                <span className="notebook-project-marker" aria-hidden="true">T /</span>
                <div><h3>Thread of Life</h3><p>A way to explore genes, genetic variants, and the evidence behind their stories.</p><div className="notebook-project-links"><a href="https://tol-two.vercel.app" target="_blank" rel="noopener noreferrer">Explore the project <ArrowUpRight size={14} aria-hidden="true" /></a></div></div>
              </article>
            </div>
          </section>

          <section id="experience" className="notebook-chapter">
            <div className="notebook-chapter-heading"><span className="notebook-label">05</span><h2>Work, so far.</h2></div>
            <p className="notebook-section-intro">A few places I’ve learned by doing.</p>
            <ol className="notebook-work-list" aria-label="Work experience, most recent first">
              {experience.map((job) => <li key={`${job.company}-${job.dates}`}><span className="notebook-work-date">{job.dates}</span><div><h3>{job.company}</h3><p className="notebook-work-role">{job.role}</p><p className="notebook-work-description">{job.text}</p></div></li>)}
            </ol>
          </section>

          <section id="thoughts" className="notebook-chapter notebook-thoughts">
            <div className="notebook-chapter-heading"><span className="notebook-label">06</span><h2>Thoughts.</h2></div>
            <div className="notebook-unwritten"><span className="notebook-unwritten-mark" aria-hidden="true">[&nbsp;&nbsp;]</span><div><span className="notebook-coming-soon">Coming soon</span><p>A place for the longer version.<br />Notes, questions, and things I’m working out.</p></div></div>
          </section>

          <section id="contact" className="notebook-chapter notebook-contact">
            <div className="notebook-chapter-heading"><span className="notebook-label">07</span><h2>Say hello.</h2></div>
            <p>Have a question, an idea, or something I should read?</p>
            <div className="notebook-email-row"><a href="mailto:himay75@gmail.com">himay75@gmail.com <ArrowUpRight size={20} aria-hidden="true" /></a><button type="button" className="notebook-icon-button notebook-copy" onClick={copyEmail} aria-label={copyState === 'copied' ? 'Email address copied' : 'Copy email address'}>{copyState === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}</button></div>
            <p className="notebook-copy-status" role="status" aria-live="polite">{copyState === 'copied' ? 'Copied.' : copyState === 'failed' ? 'Couldn’t copy. You can select the address above.' : ''}</p>
            <details className="notebook-voice-drawer" open={voiceOpen} onToggle={(event) => setVoiceOpen(event.currentTarget.open)}>
              <summary><span>Or, meet AI Mickey <span className="notebook-voice-tag">Voice experiment</span></span><ChevronDown size={17} aria-hidden="true" /></summary>
              <div className="notebook-voice-content">{voiceOpen && <TalkToMe />}</div>
            </details>
            {!voiceOpen && <span id="talk" className="notebook-anchor" aria-hidden="true" />}
          </section>

          <footer className="notebook-footer"><span>© {new Date().getFullYear()} Mickey Makhija</span><a href="#hero">Back to the beginning ↑</a><span className="notebook-footer-end" aria-hidden="true">■</span></footer>
        </div>
      </div>
    </div>
  )
}
