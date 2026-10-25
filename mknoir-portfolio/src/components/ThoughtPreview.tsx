import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Appearance } from '@/lib/appearance'
import { NOTES } from '@/lib/notes'
import '@/styles/thought-preview.css'

export function ThoughtPreview({ appearance }: { appearance?: Appearance }) {
  return (
    <ul className="thought-preview-list" data-look={appearance} role="list" aria-label="Published notes">
      {NOTES.map((note) => (
        <li key={note.href}>
          <article className="thought-preview">
            <Link className="thought-preview-link" href={appearance ? `${note.href}?look=${appearance}` : note.href}>
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
        </li>
      ))}
    </ul>
  )
}
