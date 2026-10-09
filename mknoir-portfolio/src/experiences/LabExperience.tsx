'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, FlaskConical, X } from 'lucide-react'
import { AppearanceSwitcher } from '@/components/AppearanceSwitcher'
import DnaLoader from '@/components/Dnaloader'
import { LAB_PROJECTS, LAB_STORIES, type LabStoryId } from '@/lib/lab-stories'
import '@/styles/lab-experience.css'

const LabScene = dynamic(() => import('@/components/LabScene'), {
  ssr: false,
  loading: () => <div className="lab-loading" role="status"><DnaLoader /><span>Opening the lab…</span></div>,
})

type Panel = LabStoryId | 'projects' | 'work' | 'thoughts' | 'contact' | null
const career = [
  ['2025—2026', 'Amgen', 'Associate Scientist / MLE', 'EGNNs, Transformers, target triage, and single-cell / single-nucleus RNA-seq analysis.'],
  ['2023—2025', 'Amgen', 'Associate Scientist', 'High-throughput molecular assays, iPSC automation, and gene-expression pipelines.'],
  ['2023', 'BioMarin', 'Research Associate II · Gene Therapy', 'AAV production, 50 L bioreactors, and real-time dashboards.'],
  ['2022—2023', 'Optimized Foods', 'Research Associate', 'Cell-cultured caviar and process development.'],
  ['2022', 'Cepheid', 'Research & Innovation Core Intern', 'Sample preparation and PCR for multiplex diagnostics.'],
  ['2021—2022', 'UC Davis', 'Lab Associate & Teaching Assistant', 'Teaching sequencing analysis and working in the lab.'],
]

export default function LabExperience({ page = 'home' }: { page?: 'home' | 'about' | 'work' }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [panel, setPanel] = useState<Panel>(page === 'about' ? 'mickey' : page === 'work' ? 'work' : null)
  const [tourOpen, setTourOpen] = useState(false)
  const [visited, setVisited] = useState<LabStoryId[]>([])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const tourRef = useRef<HTMLButtonElement>(null)
  const activeStory = LAB_STORIES.find(story => story.id === hovered)
  const story = LAB_STORIES.find(story => story.id === panel)
  const storyIndex = LAB_STORIES.findIndex(story => story.id === panel)

  useEffect(() => {
    if (!panel) return
    const dialog = dialogRef.current
    if (!dialog?.open) returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    dialog?.querySelector<HTMLElement>('.lab-close')?.focus({ preventScroll: true })
    dialog?.querySelector('.lab-story-sheet')?.scrollTo({ top: 0 })
    return () => { document.body.style.overflow = previous }
  }, [panel])

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash === 'projects' || hash === 'work' || hash === 'thoughts' || hash === 'contact') setPanel(hash)
    else if (hash === 'cornucopia') setPanel('laptop')
  }, [])

  function closePanel() {
    dialogRef.current?.close()
    setPanel(null)
    setHovered(null)
    const previous = returnFocus.current
    if (previous?.isConnected && !dialogRef.current?.contains(previous) && previous !== document.body) previous.focus({ preventScroll: true })
    else tourRef.current?.focus({ preventScroll: true })
  }

  function selectObject(id: string) {
    const match = LAB_STORIES.find(item => item.id === id)
    if (!match) return
    setPanel(match.id)
    setVisited(previous => previous.includes(match.id) ? previous : [...previous, match.id])
  }

  return <div className="lab-experience">
    <header className="lab-header">
      <button className="lab-wordmark" onClick={() => selectObject('mickey')} aria-label="Meet Mickey"><span className="lab-mark"><FlaskConical size={20} strokeWidth={1.6} /></span><span>Mickey’s lab<small>BIOLOGY, ROBOTICS & INTELLIGENCE</small></span></button>
      <nav className="lab-nav" aria-label="Lab navigation">
        <button onClick={() => setPanel('projects')}>Projects</button>
        <button onClick={() => setPanel('work')}>Work</button>
        <button onClick={() => setPanel('thoughts')}>Thoughts</button>
        <button onClick={() => setPanel('contact')} className="lab-contact-link">Say hello <ArrowUpRight size={14} /></button>
        <AppearanceSwitcher />
      </nav>
    </header>

    <div className="lab-stage">
      <LabScene activeId={story?.id ?? hovered} onHover={setHovered} onSelect={selectObject} />
    </div>

    <div className="lab-welcome">
      <p className="lab-small-label">A FEW THINGS THAT MAKE ME, ME.</p>
      <h1>Come on in.</h1>
      <p>Science on the bench.<br /> A few adventures by the door.</p>
      <button ref={tourRef} className="lab-tour-toggle" aria-expanded={tourOpen} aria-controls="lab-object-index" onClick={() => setTourOpen(!tourOpen)}>Choose an object <ArrowDown size={14} className={tourOpen ? 'is-open' : ''} /></button>
    </div>

    <div className={`lab-hover-note ${activeStory && !panel ? 'is-visible' : ''}`} aria-hidden={!activeStory || !!panel}>
      {activeStory && <><span className="lab-small-label">{activeStory.category}</span><h2>{activeStory.object}</h2><p>{activeStory.preview}</p><span className="lab-hover-hint">Click to read the story <ArrowUpRight size={14} /></span></>}
    </div>

    <div id="lab-object-index" className={`lab-object-index ${tourOpen ? 'is-open' : ''}`}>
      <div className="lab-index-heading"><span className="lab-small-label">AROUND THE ROOM</span><span>{visited.length} / {LAB_STORIES.length} explored</span><button aria-label="Close object list" onClick={() => { setTourOpen(false); tourRef.current?.focus() }}><X size={17} /></button></div>
      <div className="lab-object-buttons">
        {LAB_STORIES.map((item, index) => <button key={item.id} onPointerEnter={() => setHovered(item.id)} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(item.id)} onBlur={() => setHovered(null)} onClick={() => selectObject(item.id)} aria-label={`Explore ${item.object}`} data-visited={visited.includes(item.id)}><span>{String(index + 1).padStart(2, '0')}</span>{item.object}<ArrowUpRight size={13} /></button>)}
      </div>
    </div>

    <footer className="lab-footer"><span>HIMAY “MICKEY” MAKHIJA</span><p><span className="lab-desktop-instruction">Hover to explore · Click for the story · Drag to look around</span><span className="lab-touch-instruction">Tap an object to explore</span></p><button onClick={() => setPanel('contact')}>Get in touch <ArrowUpRight size={13} /></button></footer>

    <dialog ref={dialogRef} className="lab-story-dialog" aria-labelledby="lab-panel-title" onCancel={event => { event.preventDefault(); closePanel() }} onClick={event => { if (event.target === event.currentTarget) closePanel() }} onClose={() => setPanel(null)}>
      <div className="lab-story-sheet">
        <div className="lab-sheet-top"><span className="lab-small-label">MICKEY’S LAB / {story ? String(storyIndex + 1).padStart(2, '0') : 'FIELD NOTES'}</span><button className="lab-close" aria-label="Close story" onClick={closePanel} autoFocus><X size={22} /></button></div>
        {story ? <>
          {story.id === 'mickey' && <Image className="lab-portrait" src="/portrait.jpg" alt="Mickey Makhija" width={1892} height={2832} sizes="140px" />}
          <p className="lab-story-category">{story.category}</p><h2 id="lab-panel-title">{story.title}</h2>
          <div className="lab-story-copy">{story.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          <ul className="lab-story-tags">{story.notes.map(note => <li key={note}>{note}</li>)}</ul>
          {story.links && <div className="lab-story-links">{story.links.map(link => <a key={link.href} href={link.href} target={link.href.startsWith('https:') ? '_blank' : undefined} rel={link.href.startsWith('https:') ? 'noopener noreferrer' : undefined}>{link.label}<ArrowUpRight size={17} /></a>)}</div>}
          <div className="lab-story-pagination"><button onClick={() => selectObject(LAB_STORIES[(storyIndex + LAB_STORIES.length - 1) % LAB_STORIES.length].id)} aria-label="Previous object"><ChevronLeft size={17} /></button><span>{storyIndex + 1} / {LAB_STORIES.length}</span><button onClick={() => selectObject(LAB_STORIES[(storyIndex + 1) % LAB_STORIES.length].id)}>Next object <ChevronRight size={17} /></button></div>
        </> : panel === 'projects' ? <>
          <p className="lab-story-category">Things I’m building</p><h2 id="lab-panel-title">Off the bench.</h2><p className="lab-panel-intro">Some tools, experiments, and projects you can try.</p>
          <div className="lab-project-list">{LAB_PROJECTS.map(project => <article key={project.name}>{project.image && <Image src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} sizes="(max-width: 600px) 90vw, 440px" />}<a href={project.href} target="_blank" rel="noopener noreferrer"><h3>{project.name}</h3><ArrowUpRight size={18} /></a><p>{project.detail}</p>{project.extra && <a className="lab-project-extra" href={project.extra} target="_blank" rel="noopener noreferrer">Open the app <ArrowUpRight size={14} /></a>}</article>)}</div>
        </> : panel === 'work' ? <>
          <p className="lab-story-category">The path so far</p><h2 id="lab-panel-title">Time at the bench.<br />Time at the keyboard.</h2>
          <ol className="lab-career">{career.map(([year, company, role, detail]) => <li key={year + role}><span>{year}</span><h3>{company}</h3><h4>{role}</h4><p>{detail}</p></li>)}</ol><a className="lab-inline-link" href="/Mickey_Makhija_Resume.pdf" target="_blank" rel="noopener noreferrer">Open my résumé <ArrowUpRight size={16} /></a>
        </> : panel === 'thoughts' ? <>
          <p className="lab-story-category">An open notebook</p><h2 id="lab-panel-title">Thoughts.</h2><div className="lab-notebook"><span>01 / FIRST ENTRY</span><p>Coming soon.</p><div /><div /><div /></div>
        </> : panel === 'contact' ? <>
          <p className="lab-story-category">Say hello</p><h2 id="lab-panel-title">Something on<br />your mind?</h2><p className="lab-panel-intro">Science, software, an interesting project, or a good trail. I’m happy to chat.</p><div className="lab-story-links"><a href="mailto:himay75@gmail.com">himay75@gmail.com <ArrowUpRight size={17} /></a><a href="https://www.linkedin.com/in/himay-makhija-mickey/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={17} /></a><a href="https://github.com/mknoir" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={17} /></a></div>
        </> : <h2 id="lab-panel-title">Around the lab</h2>}
        <button className="lab-back-to-room" onClick={closePanel}>Back to the room <ArrowRight size={15} /></button>
      </div>
    </dialog>
  </div>
}
