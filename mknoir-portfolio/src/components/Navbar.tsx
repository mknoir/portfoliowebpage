// src/components/Navbar.tsx

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => {
        const el = document.querySelector(item.href)
        if (!el) return { id: item.href, top: Infinity }
        const rect = el.getBoundingClientRect()
        return { id: item.href, top: rect.top }
      })

      const active = sections
        .filter(section => section.top <= window.innerHeight / 2)
        .sort((a, b) => b.top - a.top)[0]

      if (active && active.id !== activeSection) {
        setActiveSection(active.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeSection])

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur border-b border-gray-700 transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="text-lg font-bold text-white">Mickey</div>
        <div className="flex space-x-6 text-sm text-gray-300">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-white transition-colors ${
                activeSection === item.href ? 'text-teal-400' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
