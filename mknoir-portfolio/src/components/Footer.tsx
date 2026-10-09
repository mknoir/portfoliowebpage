import { ArrowUp } from 'lucide-react'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="footer-copyright">© {new Date().getFullYear()} Mickey Makhija</p>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="https://github.com/mknoir" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/himay-makhija-mickey/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Native fragment navigation also scrolls when the current hash already matches. */}
          <a href="/#talk">Ask my AI</a>
        </nav>
        <a href="#main-content" className="footer-back-top">Back to top <ArrowUp size={15} aria-hidden="true" /></a>
      </div>
    </footer>
  )
}
