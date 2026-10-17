import type { Metadata } from 'next'
import Link from 'next/link'
import { NoteBackLink } from '@/components/NoteBackLink'
import { SCIENTIFIC_METHOD_NOTE as note } from '@/lib/notes'
import '@/styles/notes.css'

export const metadata: Metadata = {
  title: note.title,
  description: note.description,
  authors: [{ name: 'Mickey Makhija', url: 'https://www.mknoir.com' }],
  alternates: { canonical: note.href },
  openGraph: {
    type: 'article',
    title: note.title,
    description: note.description,
    url: note.href,
    publishedTime: note.publishedAt,
    authors: ['Mickey Makhija'],
    images: [{ url: '/social-preview', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: note.title,
    description: note.description,
    images: ['/social-preview'],
  },
}

export default function ScientificMethodNote() {
  return (
    <div className="note-page">
      <nav className="note-navigation" aria-label="Note navigation">
        <Link className="note-wordmark" href="/">Mickey Makhija<span aria-hidden="true">.</span></Link>
        <NoteBackLink />
      </nav>

      <article className="note-article" aria-labelledby="note-title">
        <header className="note-heading">
          <p className="eyebrow">Thoughts / 01</p>
          <h1 id="note-title">{note.title}</h1>
          <div className="note-meta">
            <span>By Mickey Makhija</span>
            <time dateTime={note.publishedAt}>{note.displayDate}</time>
            <span>{note.readingTime}</span>
          </div>
        </header>

        <div className="note-prose">
          <p>We’re throwing the kitchen sink at AI: retrieval, tools, skills, specialist agents. I’d like to know which parts are earning their keep.</p>

          <p>For a system that informs scientific decisions, every added component carries a hypothesis about what it improves. We should be able to test it.</p>

          <p>Biotech’s uneven adoption makes this important. A fluent answer can travel further than the expertise needed to check it. In its <a href="https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/purolea-cosmetics-lab-722591-04022026">April 2026 warning to Purolea Cosmetics Lab</a>, the FDA reported that, when asked about missing process validation, the company said its AI agent had never told it this was required. The letter also recorded that drug production had ceased.</p>

          <p><a href="https://openai.com/index/introducing-life-sci-bench/">LifeSciBench</a>, developed by <a href="https://www.linkedin.com/posts/tacit-labs_introducing-tacit-labs-an-applied-research-activity-7473122166142730240-5b3i">Tacit Labs and OpenAI</a>, tests realistic research tasks against expert-written criteria. In the June 2026 evaluation, GPT-5.5 passed 25.7% of tasks and GPT-Rosalind passed 36.1%; a pass required 70% of a task’s rubric points.</p>

          <p>I think about specialization at three levels:</p>

          <ul>
            <li><strong>Pretraining:</strong> choose data and training objectives for the scientific domain.</li>
            <li><strong>Post-training:</strong> adapt an existing model through fine-tuning and other forms of feedback.</li>
            <li><strong>The application:</strong> supply evidence, tools, skills, and a workflow for the task.</li>
          </ul>

          <p>Maybe we need all three. I’d expect the combination to depend on the job. I haven’t run enough comparisons to know.</p>

          <p>Take target triage. My hypothesis might be that curated retrieval puts more experimentally supported targets in the top ten recommendations. I’d compare the same model with and without retrieval on cases kept out of development, using a scoring rubric fixed in advance.</p>

          <p>I’d include positive and negative reference cases grounded in experiments on the same disease model and endpoint, with unresolved cases kept separate. Measure ranking quality and unsupported claims; have experts review the assessments without knowing which system produced them. This tests evidence assessment. A claim about discovering new targets would need prospective validation.</p>

          <p>Removing retrieval is an ablation. It measures retrieval’s contribution <em>within that particular system.</em> Add another tool or agent and that contribution may change. I’d repeat the runs, track compute costs, and test combinations of components. An apparent improvement might come from giving the system more attempts.</p>

          <p>Each new component adds possible interactions to test. That is an experimental cost, and one I think we underestimate.</p>

          <p>Once we use an expert’s correction to improve the system, that case is part of development. The fix needs a fresh test. I want a system that revises its conclusions when new evidence warrants it, and leaves a question open when the evidence cannot settle it.</p>
        </div>

        <footer className="note-footer">
          <NoteBackLink />
          <span>More thoughts to come.</span>
        </footer>
      </article>
    </div>
  )
}
