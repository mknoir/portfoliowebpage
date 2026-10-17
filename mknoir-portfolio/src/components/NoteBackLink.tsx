'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAppearance } from '@/components/appearance-provider'

export function NoteBackLink() {
  const { appearance } = useAppearance()

  return (
    <Link className="note-back-link" href={appearance ? `/?look=${appearance}#thoughts` : '/#thoughts'}>
      <ArrowLeft size={17} aria-hidden="true" />
      Back to thoughts
    </Link>
  )
}
