'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Work', href: '/experience' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // resolvedTheme is the actual theme (light/dark) - handles "system" when OS preference applies
  const isDark = resolvedTheme === 'dark'

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          onClick={closeMobileMenu}
        >
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatar.jpg" alt="Mickey Makhija" />
              <AvatarFallback>MM</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Mickey Makhija
          </span>
        </Link>

        {/* Desktop nav - hidden on mobile */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ label, href }) => (
            <Button
              key={href}
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href={href}>{label}</Link>
            </Button>
          ))}
          {mounted && (
            <div className="ml-2">
              <Switch
                checked={isDark}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          )}
        </nav>

        {/* Mobile hamburger button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile menu overlay - tap outside to close */}
      <div
        role="presentation"
        className={cn(
          'fixed inset-0 top-14 z-40 bg-background/80 backdrop-blur-sm transition-opacity md:hidden',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeMobileMenu}
        aria-hidden={!mobileMenuOpen}
      />

      {/* Mobile menu panel */}
      <div
        className={cn(
          'fixed right-0 top-14 z-50 w-full max-w-sm border-b border-l border-border/40 bg-background shadow-lg transition-transform duration-200 ease-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ label, href }) => (
            <Button
              key={href}
              variant="ghost"
              size="lg"
              asChild
              className="justify-start text-muted-foreground hover:text-foreground"
            >
              <Link href={href} onClick={closeMobileMenu}>
                {label}
              </Link>
            </Button>
          ))}
          {mounted && (
            <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
              <div className="flex items-center justify-end">
                <Switch
                  checked={isDark}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                Sync to system
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
