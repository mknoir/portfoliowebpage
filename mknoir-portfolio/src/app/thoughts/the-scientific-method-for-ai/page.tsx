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
          <p>We’re throwing the kitchen sink at AI. Every workflow is becoming an application, every application is getting an agent. I share the excitement, but I worry that our ability to build these systems is outpacing our ability to evaluate them.</p>

          <p>Biotech teams are adopting these tools with very different levels of expertise. Before we expand what people can do with AI, we need evidence that it works reliably in the settings where they’ll use it.</p>

          <p>The consequences are already becoming visible. In an <a href="https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/purolea-cosmetics-lab-722591-04022026">April 2026 warning letter</a>, the FDA cited a manufacturer that relied on AI for compliance documents without adequate review. When asked about missing process validation, the company explained that its AI had never told it this was required. The company had ceased production.</p>

          <p>Overreliance deserves its own essay. Here, I want to focus on how we know these systems actually work.</p>

          <p>General-purpose AI can sound knowledgeable across almost anything. A specialist can often see where that fluency breaks down. Work like <a href="https://www.linkedin.com/posts/tacit-labs_introducing-tacit-labs-an-applied-research-activity-7473122166142730240-5b3i">Tacit Labs and OpenAI’s LifeSciBench</a> helps make those gaps measurable: in the June 2026 evaluation, GPT-5.5 passed 25.7% of tasks and GPT-Rosalind passed 36.1%, using a threshold of 70% of each task’s rubric points. These are benchmark results, not measures of readiness for every lab. <a href="https://openai.com/index/introducing-life-sci-bench/">Methodology and results</a>.</p>

          <p>I see three places to work on this:</p>

          <ul>
            <li><strong>Training:</strong> build a model with a stronger foundation in life sciences.</li>
            <li><strong>Fine-tuning and other post-training:</strong> adapt an existing model to specific scientific tasks.</li>
            <li><strong>The application:</strong> give the model relevant context, tools, and skills.</li>
          </ul>

          <p>Maybe we need all three. I haven’t run enough experiments to know. But if I add retrieval to a target-prioritization workflow, I should be able to show that it helps.</p>

          <p>I’d start with a hypothesis: access to curated evidence improves the model’s rankings. Choose appropriate positive and negative controls, run the same cases with and without retrieval, and have domain experts assess the results.</p>

          <p>This is why ablation studies matter. Take a component away and see what changes. As we pile on tools and specialist agents, their interactions make those experiments harder to run and interpret. I worry we’re adding components faster than we can establish what each one contributes.</p>

          <p>For a genomics system, I want a genomics expert telling me where it gets things wrong—whether it missed conflicting evidence, overlooked another explanation, or sounded certain when it shouldn’t. Then I want to test whether fixing those problems helps on cases it hasn’t seen.</p>
        </div>

        <footer className="note-footer">
          <NoteBackLink />
          <span>More thoughts to come.</span>
        </footer>
      </article>
    </div>
  )
}
