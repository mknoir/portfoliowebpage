'use client'

import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="mt-12 w-full">
      <Separator className="opacity-40" />
      <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-8">
        <p className="text-sm text-muted-foreground">
          This site is a work in progress&nbsp;&mdash; feedback is always
          welcome!
        </p>
      </div>
    </footer>
  )
}
