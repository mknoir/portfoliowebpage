import { ArrowUpRight } from 'lucide-react'
export function Contact() {
  return (
    <section id="contact" className="contact-section section-pad" aria-labelledby="contact-title">
      <div className="shell contact-layout">
        <div><p className="eyebrow">05 / Let&apos;s connect</p><h2 id="contact-title">Good things start<br />with a conversation.</h2><p>Working on something interesting?<br />I&apos;d love to hear about it.</p></div>
        <div className="contact-actions"><a href="mailto:himay75@gmail.com" className="contact-email">Say hello <ArrowUpRight size={38} strokeWidth={1.3} aria-hidden="true" /></a><a href="mailto:himay75@gmail.com" className="email-address">himay75@gmail.com</a><div className="contact-socials"><a href="https://www.linkedin.com/in/himay-makhija-mickey/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} aria-hidden="true" /></a><a href="https://github.com/mknoir" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a><a href="tel:323-398-9379">Call me <ArrowUpRight size={14} aria-hidden="true" /></a></div></div>
      </div>
    </section>
  )
}
