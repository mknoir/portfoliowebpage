'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'

const navItems = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Work', href: '/experience' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
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

        <nav className="flex items-center gap-1">
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
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) =>
                setTheme(checked ? 'dark' : 'light')
              }
              className="ml-2"
            />
          )}
        </nav>
      </div>
    </header>
  )
}
