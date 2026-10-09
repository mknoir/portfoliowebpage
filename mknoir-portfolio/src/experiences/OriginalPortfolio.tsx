'use client'

import Link from 'next/link'
import localFont from 'next/font/local'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { MotionConfig } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { AppearanceSwitcher } from '@/components/AppearanceSwitcher'
import { Button } from './original/button'
import { Hero } from './original/Hero'
import { AboutPreview } from './original/AboutPreview'
import { About } from './original/About'
import { Projects } from './original/Projects'
import ExperienceSection from './original/ExperienceSection'
import { OriginalVoice } from './original/OriginalVoice'
import { Contact } from './original/Contact'
import { Footer } from './original/Footer'
import '@/styles/original.css'

const inter = localFont({
  src: './original/Inter-Latin.woff2',
  variable: '--font-original-inter',
  display: 'swap',
  weight: '100 900',
})

const links = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Work', href: '/experience' },
  { label: 'Talk to Me', href: '/#talk' },
  { label: 'Contact', href: '/#contact' },
]

function OriginalNavigation() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a')?.focus()
    const handleMenuKey = (event: KeyboardEvent) => {
      // The native appearance dialog owns focus while it is open.
      if (headerRef.current?.querySelector('dialog[open]')) return
      if (event.key === 'Escape') {
        setOpen(false)
        menuRef.current?.focus()
      }
      if (event.key !== 'Tab') return
      const controls = Array.from(headerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
        .filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0)
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    document.addEventListener('keydown', handleMenuKey)
    window.addEventListener('resize', closeOnDesktop)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleMenuKey)
      window.removeEventListener('resize', closeOnDesktop)
    }
  }, [open])

  const themeSwitch = mounted && <Switch
    checked={resolvedTheme === 'dark'}
    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
    aria-label="Dark mode"
  />

  function navigationLinks() {
    return links.map(({ label, href }) => <Button key={href} variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
      {href.includes('#')
        ? <a href={href} onClick={() => setOpen(false)}>{label}</a>
        : <Link href={href} onClick={() => setOpen(false)}>{label}</Link>}
    </Button>)
  }

  return <header ref={headerRef} className="original-header">
    <div className="original-header-inner">
      <Link href="/" className="original-brand" onClick={() => setOpen(false)}>
        <span className="original-avatar">
          <Avatar className="h-8 w-8"><AvatarImage src="/avatar.jpg" alt="" /><AvatarFallback>MM</AvatarFallback></Avatar>
          <span className="original-presence" />
        </span>
        <span>Mickey Makhija</span>
      </Link>
      <nav className="original-desktop-nav" aria-label="Main navigation">
        {navigationLinks()}
        <span className="original-theme-toggle">{themeSwitch}</span>
      </nav>
      <div className="original-header-tools">
        <AppearanceSwitcher />
        <Button ref={menuRef} variant="ghost" size="icon" className="original-menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="original-mobile-nav" onClick={() => setOpen(!open)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </div>
    </div>
    {open && <>
      <button className="original-menu-backdrop" type="button" aria-label="Close navigation" tabIndex={-1} onClick={() => { setOpen(false); menuRef.current?.focus() }} />
      <nav id="original-mobile-nav" ref={panelRef} className="original-mobile-nav" aria-label="Mobile navigation">
        {navigationLinks()}
        <div className="original-mobile-theme"><span>Dark mode</span>{themeSwitch}</div>
        <button type="button" className="original-sync-theme" onClick={() => setTheme('system')}>Sync to system</button>
      </nav>
    </>}
  </header>
}

export function OriginalPortfolio({ page = 'home' }: { page?: 'home' | 'about' | 'work' }) {
  const portfolioRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.location.hash) return
    const hash = window.location.hash
    let cancelled = false
    let frame = 0
    let id: string
    try {
      id = decodeURIComponent(hash.slice(1))
    } catch {
      return
    }
    const target = document.getElementById(id)
    if (!target || !portfolioRef.current?.contains(target)) return

    // This experience is loaded dynamically, after the browser's initial
    // fragment jump. Wait for its font metrics before restoring that position.
    target.getBoundingClientRect()
    void document.fonts.ready.then(() => {
      if (cancelled) return
      frame = window.requestAnimationFrame(() => {
        if (!cancelled && window.location.hash === hash) {
          // Entrance motion temporarily translates this target or an ancestor.
          // Offset positions follow its settled layout rather than that transform.
          let top = 0
          let element: HTMLElement | null = target
          while (element) {
            top += element.offsetTop
            element = element.offsetParent as HTMLElement | null
          }
          const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
          const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0
          window.scrollTo({ top: Math.max(0, top - padding - margin), behavior: 'instant' })
        }
      })
    })
    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
    }
  }, [page])

  return <MotionConfig reducedMotion="user">
    <div ref={portfolioRef} className={`original-portfolio ${inter.variable}`}>
      <OriginalNavigation />
      <div className="original-content">
        {page === 'about' ? <About /> : page === 'work' ? <ExperienceSection /> : <>
          <Hero />
          <AboutPreview />
          <Projects />
          <section id="thoughts" className="original-thoughts py-24 px-6">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Thoughts</h2>
            <p className="text-muted-foreground">Coming soon.</p>
          </section>
          <OriginalVoice />
          <Contact />
        </>}
      </div>
      <Footer />
    </div>
  </MotionConfig>
}
