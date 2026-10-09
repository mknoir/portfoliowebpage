'use client'

/* eslint-disable @next/next/no-html-link-for-pages -- The notebook URL starts a new document so its explicit appearance is applied before paint. */

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { ArrowUpRight, AudioLines, BookOpen, BriefcaseBusiness, ChevronRight, FileText, FolderOpen, Mail, Maximize2, Minimize2, X } from 'lucide-react'
import { AppearanceSwitcher } from '@/components/AppearanceSwitcher'
import DnaLoader from '@/components/Dnaloader'
import '@/styles/orbit-desktop.css'

const ObservatoryScene = dynamic(() => import('@/components/ObservatoryScene'), { ssr: false, loading: () => <div className="desktop-loading" role="status"><DnaLoader /><span>Loading the model…</span></div> })
const Voice = dynamic(() => import('@/sections/TalkToMe').then(module => module.TalkToMe), { loading: () => <p>Opening voice experiment…</p> })

type Panel = 'projects' | 'profile' | 'work' | 'thoughts' | 'contact' | 'talk'
type Project = 'cornucopia' | 'thread' | 'experiments'
const files = [
  { id: 'projects', number: '01', label: 'Projects', filename: 'projects.dir', icon: FolderOpen, detail: 'Things I’m building' },
  { id: 'profile', number: '02', label: 'Read me', filename: 'mickey.txt', icon: FileText, detail: 'The person at the keyboard' },
  { id: 'work', number: '03', label: 'Experience', filename: 'experience.log', icon: BriefcaseBusiness, detail: 'From the bench to the terminal' },
  { id: 'contact', number: '04', label: 'Contact', filename: 'contact.app', icon: Mail, detail: 'A conversation with the human' },
] as const
const panelTitles: Record<Panel, string> = { projects: 'projects.dir', profile: 'mickey.txt', work: 'experience.log', thoughts: 'thoughts.md', contact: 'contact.app', talk: 'ai-mickey.app' }
const archive = [
  ['3D Chem Viewer', 'Molecular visualization', 'https://chemview.streamlit.app/'],
  ['ADME Checker', 'Drug-likeness explorer', 'https://chemro5.streamlit.app/'],
  ['Target Bioactivity', 'ChEMBL data explorer', 'https://chembl.streamlit.app/'],
  ['KEGG Query', 'Pathways and genes', 'https://keggapp-mknoir.streamlit.app/'],
  ['PDB ID Retrieval', 'Protein structure lookup', 'https://keggapp-ro3drlgjs4lcoji3ycn33e.streamlit.app/'],
  ['Wave Web3 App', 'An early Ethereum experiment', 'https://waveportal-starter-project.mknoir.repl.co/'],
  ['NFT Wordslot', 'An on-chain word-slot experiment', 'https://nft-starter-project.mknoir.repl.co/'],
]
const work = [
  ['Jan 2025 — Jan 2026', 'Amgen', 'Associate Scientist / MLE', 'Computational biology, EGNNs and Transformers for target triage, and single-cell and single-nucleus RNA-seq analysis.'],
  ['Jun 2023 — Jan 2025', 'Amgen', 'Associate Scientist', 'High-throughput molecular assays for cardiometabolic disease, iPSC automation, and gene-expression pipelines.'],
  ['Jan 2023 — Jun 2023', 'BioMarin', 'Research Associate II, Gene Therapy', 'AAV production in 50 L bioreactors and real-time data dashboards.'],
  ['Sep 2022 — Jan 2023', 'Optimized Foods', 'Research Associate', 'Cell-cultured caviar and process improvements for flavour, texture, and yield.'],
  ['Jun 2022 — Sep 2022', 'Cepheid (Danaher)', 'Research & Innovation Core Intern', 'Sample preparation and PCR for multiplex diagnostics.'],
  ['Aug 2021 — Jun 2022', 'UC Davis', 'Lab Associate & Teaching Assistant', 'Sequencing analysis and student laboratory instruction.'],
]

function panelFromHash(hash: string): Panel | null {
  const value = hash.replace('#', '')
  if (value === 'cornucopia') return 'projects'
  if (value === 'about' || value === 'skills' || value === 'memo') return 'profile'
  if (value === 'experience') return 'work'
  return Object.hasOwn(panelTitles, value) ? value as Panel : null
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={16} aria-hidden="true" /></a>
}

export default function OrbitDesktop({ initialPanel }: { initialPanel?: Panel }) {
  const [panel, setPanel] = useState<Panel | null>(null)
  const [project, setProject] = useState<Project>('cornucopia')
  const [maximized, setMaximized] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const focusReturnRef = useRef<HTMLElement | null>(null)
  const dragRef = useRef<{ x: number; y: number; startX: number; startY: number; maxX: number; maxY: number } | null>(null)

  const openPanel = useCallback((next: Panel, recordHistory = true) => {
    if (!dialogRef.current?.open) focusReturnRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setPanel(next)
    setOffset({ x: 0, y: 0 })
    setMaximized(false)
    if (recordHistory) window.history.pushState(null, '', `#${next}`)
  }, [])

  const closePanel = useCallback((recordHistory = true) => {
    dialogRef.current?.close()
    setPanel(null)
    if (recordHistory) window.history.pushState(null, '', '#hero')
    focusReturnRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const syncHash = () => {
      const next = panelFromHash(window.location.hash)
      if (next) openPanel(next, false)
      else closePanel(false)
      if (window.location.hash === '#cornucopia') setProject('cornucopia')
    }
    if (window.location.hash) syncHash()
    else if (initialPanel) openPanel(initialPanel, false)
    window.addEventListener('hashchange', syncHash)
    window.addEventListener('popstate', syncHash)
    return () => {
      window.removeEventListener('hashchange', syncHash)
      window.removeEventListener('popstate', syncHash)
    }
  }, [initialPanel, openPanel, closePanel])

  useEffect(() => {
    if (!panel) return
    dialogRef.current?.showModal()
    closeRef.current?.focus({ preventScroll: true })
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [panel])

  useEffect(() => {
    const reset = () => { setOffset({ x: 0, y: 0 }); dragRef.current = null; setDragging(false) }
    window.addEventListener('resize', reset)
    return () => window.removeEventListener('resize', reset)
  }, [])

  function startDrag(event: PointerEvent<HTMLElement>) {
    if (maximized || window.innerWidth < 700 || (event.target as HTMLElement).closest('button')) return
    const bounds = dialogRef.current?.getBoundingClientRect()
    if (!bounds) return
    dragRef.current = { x: event.clientX, y: event.clientY, startX: offset.x, startY: offset.y, maxX: Math.max(0, (innerWidth - bounds.width) / 2 - 10), maxY: Math.max(0, (innerHeight - bounds.height) / 2 - 10) }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  function moveDrag(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current
    if (!drag) return
    setOffset({ x: Math.max(-drag.maxX, Math.min(drag.maxX, drag.startX + event.clientX - drag.x)), y: Math.max(-drag.maxY, Math.min(drag.maxY, drag.startY + event.clientY - drag.y)) })
  }

  return (
    <div className="orbit-desktop" id="hero">
      <header className="desktop-menubar">
        <a href="#hero" className="desktop-brand" onClick={() => closePanel(false)} aria-label="Orbit desktop home">M<span>↗</span></a>
        <span className="desktop-system-name">ORBIT <span>/ MICKEY’S DESKTOP</span></span>
        <div className="desktop-menu-actions"><button type="button" onClick={() => openPanel('projects')}>Files</button><button type="button" onClick={() => openPanel('profile')}>About</button><AppearanceSwitcher /></div>
      </header>

      <div className="desktop-stage">
        <div className="desktop-model"><ObservatoryScene /></div>
        <div className="desktop-coordinates" aria-hidden="true"><span>SUBJECT / HUMAN</span><span>MODE / EXPLORATION</span></div>
        <div className="desktop-identity"><p>Biology · Robotics · Intelligence</p><h1>Mickey<br /><span>Makhija</span></h1><span className="desktop-identity-note">Scientist. Builder. Still figuring things out.</span></div>
        <nav className="desktop-files" aria-label="Explore the desktop">
          {files.map(({ id, number, label, filename, icon: Icon, detail }) => <button type="button" key={id} className={`desktop-file desktop-file-${id}`} onClick={() => openPanel(id)}><span className="desktop-file-meta">{number} <Icon size={20} strokeWidth={1.3} aria-hidden="true" /></span><strong>{label}<ArrowUpRight size={22} aria-hidden="true" /></strong><span className="desktop-filename">{filename}</span><span className="desktop-file-detail">{detail}</span></button>)}
        </nav>
        <p className="desktop-model-note">A living system.<br /><span>Drag to turn it around.</span></p>
      </div>

      <footer className="desktop-taskbar"><span className="desktop-taskbar-label">OPEN SOMETHING.</span><button type="button" onClick={() => openPanel('thoughts')}><BookOpen size={17} aria-hidden="true" /> Thoughts <span>Coming soon</span></button><button type="button" onClick={() => openPanel('talk')}><AudioLines size={17} aria-hidden="true" /> AI Mickey</button><span className="desktop-copyright">© {new Date().getFullYear()} MM</span></footer>

      <dialog ref={dialogRef} className={`desktop-window${maximized ? ' desktop-window-maximized' : ''}`} aria-labelledby="desktop-window-title" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }} onCancel={event => { event.preventDefault(); closePanel() }} onClose={() => setPanel(null)} onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closePanel() } }}>
        <header className="desktop-window-bar" data-dragging={dragging} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => { dragRef.current = null; setDragging(false) }} onPointerCancel={() => { dragRef.current = null; setDragging(false) }}>
          <span className="desktop-window-mark" aria-hidden="true">▧</span><h2 id="desktop-window-title">{panel ? panelTitles[panel] : 'Desktop file'}</h2><span className="desktop-window-path">/ mickey / {panel}</span>
          <button type="button" className="desktop-window-maximize" aria-label={maximized ? 'Restore window size' : 'Maximize window'} onClick={() => { setMaximized(!maximized); setOffset({ x: 0, y: 0 }) }}>{maximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
          <button type="button" ref={closeRef} aria-label="Close window" onClick={() => closePanel()}><X size={19} /></button>
        </header>
        <div className="desktop-window-body" key={panel}>
          {panel === 'projects' && <div className="desktop-project-browser"><nav aria-label="Project files" className="desktop-project-list"><p>COLLECTION / 03</p>{([['cornucopia', 'Cornucopia', '01'], ['thread', 'Thread of Life', '02'], ['experiments', 'Small experiments', '03']] as const).map(([id, name, number]) => <button type="button" key={id} aria-pressed={project === id} onClick={() => setProject(id)}><span>{number}</span><span>{name}</span><ChevronRight size={15} aria-hidden="true" /></button>)}</nav><div className="desktop-project-detail" key={project}>
            {project === 'cornucopia' && <article id="cornucopia"><p className="desktop-kicker">SCIENTIFIC SOFTWARE / LAB AUTOMATION</p><h3>Cornucopia</h3><p>I’m building tools to connect scientific knowledge, experimental workflows, and laboratory instruments.</p><Image src="/projects/cornucopia-discovery-team.png" width={1810} height={1024} sizes="(max-width: 700px) 90vw, 680px" alt="Cornucopia Discovery Full Lab Team: ask a research question and Aster directs the specialists" className="desktop-project-preview" /><div className="desktop-project-links"><ExternalLink href="https://discovery.cornucopiabio.com">Open Discovery</ExternalLink><ExternalLink href="https://app.cornucopiabio.com">Open app</ExternalLink></div></article>}
            {project === 'thread' && <article><p className="desktop-kicker">GENETICS / EVIDENCE / STORIES</p><h3>Thread of Life</h3><p>An interface for exploring genes and variants, following the evidence, and seeing where the answers are still incomplete.</p><Image src="/projects/thread-of-life.png" width={1280} height={720} sizes="(max-width: 700px) 90vw, 680px" alt="Thread of Life website preview" className="desktop-project-preview" /><div className="desktop-project-links"><ExternalLink href="https://tol-two.vercel.app/">Explore Thread of Life</ExternalLink></div></article>}
            {project === 'experiments' && <article><p className="desktop-kicker">THE SMALL STUFF ADDS UP</p><h3>Experiments</h3><p>Small tools and early projects, kept here as part of the process.</p><div className="desktop-archive">{archive.map(([name, description, href]) => <ExternalLink key={name} href={href}><span><strong>{name}</strong><small>{description}</small></span></ExternalLink>)}</div></article>}
          </div></div>}

          {panel === 'profile' && <article className="desktop-document desktop-profile"><div className="desktop-profile-heading"><div><p className="desktop-kicker">A LITTLE CONTEXT</p><h3>Hi, I’m Mickey.</h3><p>I’m really into biology, robotics, and intelligence. Mostly, I want to understand how things work well enough to build with them.</p></div><Image src="/portrait.jpg" alt="Mickey Makhija" width={180} height={220} sizes="180px" /></div><div className="desktop-profile-notes"><p>My work moves between molecular assays, gene-expression data, and the instruments that run experiments. I like working on the parts that need all three.</p><p>Right now I’m building Cornucopia. Before that, my work took me through therapeutics, cell culture, diagnostics, and computational biology.</p><p>Away from the bench and the keyboard: running, biking, snowboarding, and a good craft beer.</p></div><div className="desktop-profile-bottom"><span>Want the longer version?</span><a href="/?look=mono#memo">Read my notebook <ArrowUpRight size={16} /></a></div></article>}

          {panel === 'work' && <article className="desktop-document"><p className="desktop-kicker">EXPERIENCE / REVERSE CHRONOLOGICAL</p><h3>Where I’ve worked.</h3><div className="desktop-work-log">{work.map(([period, company, role, description]) => <section key={period}><span>{period}</span><div><h4>{company}</h4><p className="desktop-work-role">{role}</p><p>{description}</p></div></section>)}</div></article>}

          {panel === 'thoughts' && <article className="desktop-document desktop-empty"><FileText size={46} strokeWidth={1} aria-hidden="true" /><p className="desktop-kicker">THOUGHTS.MD</p><h3>Nothing published. Yet.</h3><p>Notes on biology, robotics, intelligence, and whatever else I get stuck thinking about.</p><span className="desktop-stamp">Coming soon</span></article>}

          {panel === 'contact' && <article className="desktop-document desktop-contact"><p className="desktop-kicker">THIS ONE GOES TO THE HUMAN</p><h3>Say hello.</h3><p>Working on something interesting? I’d like to hear about it.</p><a className="desktop-email" href="mailto:himay75@gmail.com">himay75@gmail.com <ArrowUpRight size={23} /></a><div className="desktop-contact-links"><ExternalLink href="https://www.linkedin.com/in/himay-makhija-mickey/">LinkedIn</ExternalLink><ExternalLink href="https://github.com/mknoir">GitHub</ExternalLink><a href="tel:323-398-9379">Call me <ArrowUpRight size={16} /></a></div></article>}

          {panel === 'talk' && <div className="desktop-voice"><Voice /></div>}
        </div>
        <footer className="desktop-window-footer"><span>{panel === 'thoughts' ? 'No entries yet' : 'Mickey Makhija / personal files'}</span><span>ESC TO CLOSE</span></footer>
      </dialog>
    </div>
  )
}
