import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section id="hero" className="hero shell" aria-labelledby="hero-title">
      <div className="hero-main">
        <div className="hero-copy">
          <p className="eyebrow hero-intro">Hi, I&apos;m Mickey Makhija</p>
          <h1 id="hero-title">Biology.<br />Robotics.<br /><span>Intelligence.</span></h1>
          <p className="hero-description">I&apos;m fascinated by how these systems work.<br className="desktop-break" /> And what happens when we bring them together.</p>
          <div className="hero-actions">
            <Button asChild size="lg"><a href="#projects">Explore my work <ArrowDown size={17} aria-hidden="true" /></a></Button>
            <Link href="/about" className="text-link">A little about me <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="hero-aside">
          <figure className="portrait-frame">
            <div className="portrait-image"><Image src="/portrait.jpg" alt="Mickey Makhija" fill priority sizes="(max-width: 700px) 76vw, 350px" /></div>
            <figcaption><span>A scientist. A builder.</span><span>Always curious.</span></figcaption>
          </figure>
          <p className="portrait-note">Somewhere between the<br />bench and the terminal.</p>
        </div>
      </div>
      <div className="hero-footnote">
        <a href="#cornucopia" className="current-work"><span className="eyebrow">Currently building</span><span>Cornucopia <ArrowDown size={15} aria-hidden="true" /></span></a>
        <p>Science, software, and a few side quests.</p>
        <a href="#projects" className="scroll-link" aria-label="Scroll to selected projects"><ArrowDown size={20} aria-hidden="true" /></a>
      </div>
    </section>
  )
}
