'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { ArrowDown, ArrowUpRight, ArrowRight, Bike, Mountain, Moon, Sun, Waves, Wind } from 'lucide-react'
import { AppearanceSwitcher } from '@/components/AppearanceSwitcher'
import '@/styles/seasonal.css'

type Season = 'spring' | 'summer' | 'autumn' | 'winter'

const seasons: { id: Season; label: string; note: string }[] = [
  { id: 'spring', label: 'Spring', note: 'Longer days. Back on the bike.' },
  { id: 'summer', label: 'Summer', note: 'Early runs. Time in the water.' },
  { id: 'autumn', label: 'Autumn', note: 'Cool air. One more ride.' },
  { id: 'winter', label: 'Winter', note: 'Snowboard weather.' },
]

const jobs = [
  { company: 'Amgen', role: 'Associate Scientist / MLE', dates: 'Jan 2025 — Jan 2026', text: 'Explored EGNNs and Transformers for target triage, and performed single-cell and single-nucleus RNA-seq analyses.' },
  { company: 'Amgen', role: 'Associate Scientist', dates: 'Jun 2023 — Jan 2025', text: 'Optimised molecular assays for cardiometabolic disease, automated iPSC workflows, and built gene-expression data pipelines.' },
  { company: 'BioMarin', role: 'Research Associate II, Gene Therapy', dates: 'Jan 2023 — Jun 2023', text: 'Scaled AAV production to 50 L bioreactors and built real-time dashboards.' },
  { company: 'Optimized Foods', role: 'Research Associate', dates: 'Sep 2022 — Jan 2023', text: 'Worked on cell-cultured caviar, improving flavour, texture, and yield through process optimisation.' },
  { company: 'Cepheid', role: 'Research & Innovation Core Intern', dates: 'Jun 2022 — Sep 2022', text: 'Optimised sample preparation and PCR protocols for a multiplex diagnostic assay.' },
  { company: 'UC Davis', role: 'Lab Associate & Teaching Assistant', dates: 'Aug 2021 — Jun 2022', text: 'Taught sequencing analysis and helped students with their lab reports.' },
]

const guide = [
  { id: 'about', number: '01', label: 'A little about me', detail: 'The person' },
  { id: 'life', number: '02', label: 'Time outside', detail: 'Away from the desk' },
  { id: 'projects', number: '03', label: 'Things I’m building', detail: 'Current projects' },
  { id: 'experience', number: '04', label: 'The path so far', detail: 'Work & experience' },
  { id: 'thoughts', number: '05', label: 'Notes for later', detail: 'Coming soon' },
]

function Contours() {
  return <svg className="seasonal-contours" viewBox="0 0 640 500" fill="none" aria-hidden="true">{Array.from({ length: 15 }, (_, index) => <path key={index} d={`M ${-100 + index * 9} ${450 - index * 11} C ${-40 + index * 12} ${200 - index * 10}, ${290 - index * 6} ${450 - index * 20}, ${230 + index * 10} ${200 - index * 8} S ${400 + index * 8} ${-30 + index * 10}, ${720 + index * 3} ${70 - index * 12}`} />)}</svg>
}

export default function SeasonalPortfolio({ page = 'home' }: { page?: 'home' | 'about' | 'work' }) {
  const [season, setSeason] = useState<Season>('autumn')
  const { resolvedTheme, setTheme } = useTheme()
  const rootRef = useRef<HTMLDivElement>(null)
  const selectedSeason = seasons.find((item) => item.id === season)!

  useEffect(() => {
    const month = new Date().getMonth()
    setSeason(month < 2 || month === 11 ? 'winter' : month < 5 ? 'spring' : month < 8 ? 'summer' : 'autumn')
  }, [])

  useEffect(() => {
    let frame = 0
    function followAnchor() {
      let hash = ''
      try { hash = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
      const id = hash || (page === 'about' ? 'about' : page === 'work' ? 'experience' : 'hero')
      const target = rootRef.current?.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`)
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (id === 'hero') window.scrollTo({ top: 0, behavior: 'instant' })
        else target?.scrollIntoView({ behavior: 'instant', block: 'start' })
      })
    }
    followAnchor()
    window.addEventListener('hashchange', followAnchor)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', followAnchor) }
  }, [page])

  return (
    <div className="seasonal-site" data-season={season} ref={rootRef}>
      <header className="seasonal-masthead">
        <a className="seasonal-brand" href="#hero" aria-label="Mickey Makhija, back to the beginning"><Mountain size={25} strokeWidth={1.35} aria-hidden="true" /><span>Mickey Makhija<span>A personal field guide</span></span></a>
        <nav className="seasonal-nav" aria-label="Field guide navigation"><a href="#about">About</a><a href="#projects">Projects</a><a href="#experience">Work</a></nav>
        <div className="seasonal-header-tools"><AppearanceSwitcher /><button type="button" className="seasonal-icon-button" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>{resolvedTheme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button></div>
      </header>

      <section className="seasonal-horizon" id="hero" aria-labelledby="seasonal-title">
        <Image className="seasonal-landscape" src="/images/seasonal-ridge.webp" alt="" fill priority sizes="100vw" />
        <div className="seasonal-horizon-shade" />
        <div className="seasonal-horizon-top"><span>Biology, robotics &amp; intelligence.</span><span className="seasonal-edition">The outdoor edition</span></div>
        <div className="seasonal-horizon-copy"><p>Scientist. Builder. Usually curious.</p><h1 id="seasonal-title">Mickey<br /><em>Makhija.</em></h1></div>
        <div className="seasonal-horizon-bottom"><span>{selectedSeason.note}</span><a href="#field-guide">Take the scenic route <ArrowDown size={16} aria-hidden="true" /></a></div>
      </section>

      <div className="seasonal-weather-strip"><span className="seasonal-label">A change of season</span><div className="seasonal-seasons" role="group" aria-label="Choose the season">{seasons.map((item) => <button key={item.id} type="button" aria-pressed={season === item.id} onClick={() => setSeason(item.id)}><span className="seasonal-season-dot" aria-hidden="true" />{item.label}</button>)}</div><span className="seasonal-season-caption" aria-live="polite">{selectedSeason.label} edition</span></div>

      <div className="seasonal-main">
        <section className="seasonal-guide" id="field-guide" aria-labelledby="seasonal-guide-title">
          <div className="seasonal-guide-heading"><span className="seasonal-label">Start anywhere</span><h2 id="seasonal-guide-title">A few paths<br />worth taking.</h2><p>Some science. Some software.<br />A bit of fresh air.</p><span className="seasonal-compass" aria-hidden="true">N<span>✳</span>S</span></div>
          <nav className="seasonal-guide-list" aria-label="Explore the field guide">{guide.map((entry) => <a key={entry.id} href={`#${entry.id}`}><span className="seasonal-guide-number">{entry.number}</span><span className="seasonal-guide-name">{entry.label}<small>{entry.detail}</small></span><ArrowUpRight size={21} strokeWidth={1.3} aria-hidden="true" /></a>)}</nav>
        </section>

        <section className="seasonal-about" id="about" aria-labelledby="seasonal-about-title">
          <div className="seasonal-section-marker"><span>01</span><span>The person</span></div>
          <div className="seasonal-about-story"><h2 id="seasonal-about-title">At home at the bench.<br />And a little further out.</h2><div className="seasonal-about-columns"><p>I’m Mickey. I work across molecular biology, software, and automation. I like understanding how something works, then trying to build a better version of it.</p><p>That can mean a molecular assay, a pipeline for gene-expression data, or software that connects an experiment to an instrument. I’m especially interested in the places where those things meet.</p></div><a className="seasonal-underlined-link" href="#experience">How I got here <ArrowRight size={17} aria-hidden="true" /></a></div>
          <figure className="seasonal-portrait"><Image src="/portrait.jpg" alt="Mickey Makhija" width={500} height={620} sizes="(max-width: 760px) 65vw, 280px" /><figcaption>Mickey, away from the terminal.</figcaption></figure>
        </section>

        <section className="seasonal-outside" id="life" aria-labelledby="seasonal-outside-title">
          <Contours />
          <div className="seasonal-outside-heading"><span className="seasonal-label">02 / Away from the desk</span><h2 id="seasonal-outside-title">A different<br /><em>kind of pace.</em></h2><p>I run, cycle, snowboard, and swim.<br />I also take craft beer seriously.<br />Fermentation is biology, after all.</p></div>
          <div className="seasonal-outside-notes"><div><Wind size={30} strokeWidth={1.2} aria-hidden="true" /><h3>On foot.</h3><p>Running clears my head.</p></div><div><Bike size={30} strokeWidth={1.2} aria-hidden="true" /><h3>On two wheels.</h3><p>A little more distance. A different pace.</p></div><div><Mountain size={30} strokeWidth={1.2} aria-hidden="true" /><h3>On the mountain.</h3><p>Snowboarding takes all of my attention.</p></div><div><Waves size={30} strokeWidth={1.2} aria-hidden="true" /><h3>In the water.</h3><p>Still a better beer taster than swimmer.</p></div></div>
        </section>

        <section className="seasonal-projects" id="projects" aria-labelledby="seasonal-projects-title">
          <div className="seasonal-section-marker"><span>03</span><span>Current projects</span></div>
          <div className="seasonal-projects-heading"><h2 id="seasonal-projects-title">Back at<br /><em>the desk.</em></h2><p>Things I’m building.<br />Mostly because I want them to exist.</p></div>
          <article className="seasonal-project-feature" id="cornucopia">
            <a className="seasonal-project-print" href="https://discovery.cornucopiabio.com" target="_blank" rel="noopener noreferrer" aria-label="Explore Cornucopia Discovery (opens in a new tab)"><Image src="/projects/cornucopia.png" alt="Cornucopia, intelligence built for biology" width={1280} height={720} sizes="(max-width: 760px) 90vw, 700px" /><span><span>From the workbench / 001</span><ArrowUpRight size={19} aria-hidden="true" /></span></a>
            <div className="seasonal-project-copy"><span className="seasonal-label">Scientific AI &amp; lab automation</span><h3>Cornucopia</h3><p>Software for scientific discovery and experimental workflows. A place to connect the science, the software, and the instruments.</p><div className="seasonal-project-links"><a href="https://discovery.cornucopiabio.com" target="_blank" rel="noopener noreferrer">Explore Discovery <ArrowUpRight size={17} aria-hidden="true" /></a><a href="https://app.cornucopiabio.com" target="_blank" rel="noopener noreferrer">Open the app <ArrowUpRight size={17} aria-hidden="true" /></a></div></div>
          </article>
          <article className="seasonal-project-thread"><div className="seasonal-project-thread-intro"><span className="seasonal-label">Genetics &amp; scientific storytelling</span><h3>Thread of Life</h3><p>A way to explore genes, genetic variants, and the evidence behind their stories.</p><a className="seasonal-underlined-link" href="https://tol-two.vercel.app" target="_blank" rel="noopener noreferrer">Pull a thread <ArrowUpRight size={17} aria-hidden="true" /></a></div><a className="seasonal-thread-preview" href="https://tol-two.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Explore Thread of Life (opens in a new tab)"><Image src="/projects/thread-of-life.png" alt="Thread of Life gene and genetic variant explorer" width={1280} height={720} sizes="(max-width: 760px) 90vw, 540px" /></a></article>
        </section>

        <section className="seasonal-work" id="experience" aria-labelledby="seasonal-work-title"><div className="seasonal-work-heading"><span className="seasonal-label">04 / Work &amp; experience</span><h2 id="seasonal-work-title">The path<br /><em>so far.</em></h2><p>From molecular assays and gene therapy to computational biology and automation.</p><a className="seasonal-underlined-link" href="/Mickey_Makhija_Resume.pdf" target="_blank" rel="noopener noreferrer">Read my résumé <ArrowUpRight size={17} aria-hidden="true" /></a></div><div className="seasonal-work-list">{jobs.map((job, index) => <details key={`${job.company}-${job.dates}`} open={index === 0}><summary><span className="seasonal-job-date">{job.dates}</span><span className="seasonal-job-heading"><strong>{job.company}</strong><span>{job.role}</span></span><span className="seasonal-job-toggle" aria-hidden="true">+</span></summary><p>{job.text}</p></details>)}</div></section>

        <section className="seasonal-thoughts" id="thoughts" aria-labelledby="seasonal-thoughts-title"><div className="seasonal-thoughts-title"><span className="seasonal-label">05 / Notes for later</span><h2 id="seasonal-thoughts-title">A page<br /><em>left open.</em></h2></div><div className="seasonal-unwritten"><span>Thoughts</span><p>A few things I want to write about.<br />Still finding the words.</p><span className="seasonal-coming-soon">Coming soon</span></div></section>
      </div>

      <footer className="seasonal-footer" id="contact"><div className="seasonal-footer-top"><div><span className="seasonal-label">Before you head off</span><h2>Say <em>hello.</em></h2></div><a className="seasonal-email" href="mailto:himay75@gmail.com">himay75@gmail.com <ArrowUpRight size={29} strokeWidth={1.2} aria-hidden="true" /></a></div><div className="seasonal-footer-bottom"><span>© {new Date().getFullYear()} Mickey Makhija</span><div><a href="https://github.com/mknoir" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={13} aria-hidden="true" /></a><a href="https://www.linkedin.com/in/himay-makhija-mickey/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={13} aria-hidden="true" /></a><a href="#hero">Back to the trailhead ↑</a></div></div></footer>
    </div>
  )
}
