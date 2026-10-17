import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Appearance } from '@/lib/appearance'
import { SCIENTIFIC_METHOD_NOTE } from '@/lib/notes'
import '@/styles/thought-preview.css'

export function ThoughtPreview({ appearance }: { appearance?: Appearance }) {
  const note = SCIENTIFIC_METHOD_NOTE
  const href = appearance ? `${note.href}?look=${appearance}` : note.href

  return (
    <article className="thought-preview" data-look={appearance}>
      <Link className="thought-preview-link" href={href}>
        <p className="thought-preview-meta">
          <time dateTime={note.publishedAt}>{note.displayDate}</time>
          <span aria-hidden="true">/</span>
          <span>{note.readingTime}</span>
        </p>
        <h3 className="thought-preview-title">{note.title}</h3>
        <p className="thought-preview-description">{note.description}</p>
        <span className="thought-preview-read">Read the note <ArrowUpRight size={17} aria-hidden="true" /></span>
      </Link>
    </article>
  )
}
