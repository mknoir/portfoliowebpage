'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState, type ComponentProps } from 'react'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import '@/styles/navigation.css'
import { AppearanceSwitcher } from '@/components/AppearanceSwitcher'

const navItems = [
  { label: 'Projects', href: '/#projects' },
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/experience' },
  { label: 'Thoughts', href: '/#thoughts' },
]

function NavigationLink({ href, ...props }: ComponentProps<'a'> & { href: string }) {
  return href.includes('#') ? <a href={href} {...props} /> : <Link href={href} {...props} />
}

export default function Navbar() {
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeHash, setActiveHash] = useState('')
  const menuRef = useRef<HTMLDialogElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const isDark = resolvedTheme === 'dark'

  const closeMenu = useCallback(() => {
    if (menuRef.current?.open) {
      menuRef.current.close()
      menuButtonRef.current?.focus({ preventScroll: true })
    }
    setMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    setMounted(true)
    const updateHash = () => setActiveHash(window.location.hash)
    updateHash()
    window.addEventListener('hashchange', updateHash)
    window.addEventListener('popstate', updateHash)
    return () => {
      window.removeEventListener('hashchange', updateHash)
      window.removeEventListener('popstate', updateHash)
    }
  }, [])

  useEffect(() => {
    closeMenu()
    setActiveHash(window.location.hash)
  }, [pathname, closeMenu])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 800px)')
    const handleResize = () => {
      if (desktop.matches) closeMenu()
    }
    desktop.addEventListener('change', handleResize)
    return () => desktop.removeEventListener('change', handleResize)
  }, [closeMenu])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileMenuOpen])

  const openMenu = () => {
    menuRef.current?.showModal()
    setMobileMenuOpen(true)
  }

  const selectLink = (href: string) => {
    setActiveHash(href.includes('#') ? `#${href.split('#')[1]}` : '')
    closeMenu()
  }

  const currentLink = (href: string): 'page' | 'location' | undefined => {
    const [route, fragment] = href.split('#')
    if (pathname !== route) return undefined
    if (fragment) return activeHash === `#${fragment}` ? 'location' : undefined
    return 'page'
  }

  const themeLabel = mounted
    ? `Switch to ${isDark ? 'light' : 'dark'} theme`
    : 'Toggle color theme'

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavigationLink href="/#hero" className="site-wordmark" aria-label="Mickey Makhija, home" onClick={() => selectLink('/#hero')}>
          mickey<span>.</span>
        </NavigationLink>

        <nav className="desktop-navigation" aria-label="Main navigation">
          {navItems.map(({ label, href }) => (
            <NavigationLink key={href} href={href} className="navigation-link" aria-current={currentLink(href)} onClick={() => selectLink(href)}>
              {label}
            </NavigationLink>
          ))}
        </nav>

        <div className="header-actions">
          <AppearanceSwitcher />
          <NavigationLink href="/#contact" className="header-contact" onClick={() => selectLink('/#contact')}>
            Say hello <ArrowUpRight size={15} aria-hidden="true" />
          </NavigationLink>
          <button className="navigation-icon-button theme-toggle" type="button" aria-label={themeLabel} title={themeLabel} disabled={!mounted} onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            {mounted && isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <button ref={menuButtonRef} className="navigation-icon-button mobile-menu-toggle" type="button" aria-label="Open menu" aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" aria-haspopup="dialog" onClick={openMenu}>
            <Menu size={21} aria-hidden="true" />
          </button>
        </div>
      </div>

      <dialog
        ref={menuRef}
        id="mobile-navigation"
        className="mobile-menu-dialog"
        aria-label="Navigation menu"
        onClose={() => setMobileMenuOpen(false)}
        onCancel={(event) => { event.preventDefault(); closeMenu() }}
        onClick={(event) => { if (event.target === event.currentTarget) closeMenu() }}
      >
        <div className="mobile-menu-sheet">
          <div className="mobile-menu-top">
            <span className="mobile-menu-caption">A little exploration.</span>
            <button type="button" className="navigation-icon-button" aria-label="Close menu" onClick={closeMenu} autoFocus>
              <X size={21} aria-hidden="true" />
            </button>
          </div>
          <nav className="mobile-navigation" aria-label="Mobile navigation">
            {navItems.map(({ label, href }, index) => (
              <NavigationLink key={href} href={href} aria-current={currentLink(href)} onClick={() => selectLink(href)}>
                <span className="mobile-navigation-index" aria-hidden="true">0{index + 1}</span>
                {label}
                <ArrowUpRight size={21} aria-hidden="true" />
              </NavigationLink>
            ))}
            <NavigationLink href="/#contact" className="mobile-contact-link" onClick={() => selectLink('/#contact')}>
              Say hello <ArrowUpRight size={20} aria-hidden="true" />
            </NavigationLink>
          </nav>
          <div className="mobile-menu-bottom">
            <span>Biology. Robotics. Intelligence.</span>
            <button type="button" className="navigation-icon-button" aria-label={themeLabel} disabled={!mounted} onClick={() => setTheme(isDark ? 'light' : 'dark')}>
              {mounted && isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </dialog>
    </header>
  )
}
