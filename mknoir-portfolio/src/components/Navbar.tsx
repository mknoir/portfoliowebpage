'use client'
import Link from 'next/link'

const navItems = [
  { label: 'About',    href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Work',     href: '#experience' },
  { label: 'Contact',  href: '#contact' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-surface backdrop-blur">
      <div className="flex w-full items-center justify-between px-6 py-3">
        {/* Brand / logo */}
        <Link
          href="/"
          className="font-semibold text-lg text-foreground tracking-tight"
        >
          Mickey
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-6 md:space-x-8 text-sm text-foreground">
            {navItems.map(({ label, href }) => (
              <li key={href} className="group relative">
                <Link
                  href={href}
                  className="relative block pb-0.5 transition-transform duration-200
                             group-hover:scale-105 group-hover:text-accentPrimary"
                >
                  {label}
                  <span
                    className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0
                               bg-accentPrimary transition-transform duration-200
                               group-hover:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
