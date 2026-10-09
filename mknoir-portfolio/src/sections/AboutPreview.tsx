import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
export function AboutPreview() {
  return (
    <section id="about" className="about-preview section-pad shell" aria-labelledby="about-preview-title">
      <div><p className="eyebrow">02 / A little context</p><h2 id="about-preview-title">A scientist who<br />thinks in systems.</h2></div>
      <div className="about-preview-copy">
        <p>I&apos;m drawn to the space where biology, software, and hardware meet. From molecular assays to data pipelines and lab automation, I like turning complicated questions into things we can actually build and test.</p>
        <p>Outside the lab and the terminal, you&apos;ll usually find me snowboarding, biking, running, or looking for a good craft beer.</p>
        <div className="about-preview-links"><Link href="/about" className="text-link">More about me <ArrowUpRight size={17} aria-hidden="true" /></Link><Link href="/experience" className="text-link">Where I&apos;ve worked <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </div>
    </section>
  )
}
