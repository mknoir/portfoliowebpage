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
          <p>What’s clear to me is that folks are throwing the kitchen sink at AI, asking it to solve everything with little understanding of what it can and cannot do. Most of the attention seems to be on applications, while the guardrails and evals side seems to be falling behind. Adoption in biotech is heterogeneous, and so is people’s familiarity with AI. That seems to compound the problem.</p>

          <p>It’s moments like these where work by <a href="https://www.linkedin.com/posts/tacit-labs_introducing-tacit-labs-an-applied-research-activity-7473122166142730240-5b3i">Tacit Labs and OpenAI</a> comes in handy. Before we hand everyone the power to design drugs, we need systems that work the way they should, with safeguards appropriate to how they’re used.</p>

          <p>The <a href="https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/purolea-cosmetics-lab-722591-04022026">FDA’s warning to Purolea Cosmetics Lab</a> is a strange example of what can go wrong. Asked about missing process validation, the company said its AI agent had never told it this was required. The letter also recorded that drug production had ceased. Overreliance poses a real threat—more on that in another essay. For now, I’d like to touch on how we build these systems reliably.</p>

          <p>The AI most folks use is general-purpose and can seem “all-knowing.” But a subject-matter expert can spot flaws that someone outside the field might miss. In life sciences, <a href="https://openai.com/index/introducing-life-sci-bench/">LifeSciBench</a> puts some numbers to this: GPT-5.5 passed 25.7% of tasks and GPT-Rosalind passed 36.1% in the June 2026 evaluation. A pass required 70% of a task’s rubric points.</p>

          <p>One way to address this is to specialize AI for the domain. I see three ways to do that:</p>

          <ul>
            <li><strong>Training:</strong> train a model on data and objectives chosen for the domain.</li>
            <li><strong>Post-training:</strong> adapt an existing model through fine-tuning and other forms of feedback.</li>
            <li><strong>The application layer:</strong> add relevant context through retrieval (RAG), tools, and skills.</li>
          </ul>

          <p>Maybe we need all three. I haven’t run enough experiments to know.</p>

          <p>That said, I believe AI for life sciences needs to stand up to scrutiny from experts in each domain. A genomics expert should be able to tell me whether a system weighs the evidence for a variant’s pathogenicity and considers alternative explanations. That alone doesn’t establish a mechanistic understanding of biology, but it feels like the right direction.</p>

          <p>The way I think we accomplish this is how we accomplish most things in science: a hypothesis, positive and negative controls, and an experiment that could support or challenge the hypothesis.</p>

          <p>For target triage, my hypothesis might be that curated retrieval improves the ranking of experimentally supported targets. Targets with known positive and negative results in the same experimental setting give us reference controls. We can hold the cases and evaluation criteria constant, change one component, and see whether the improvement survives independent review.</p>

          <p>This is also why ablation studies matter: remove a component and see what changes. With the scale at which we’re combining tools and agents, those experiments get harder. Components interact, so I’d want repeated runs and comparisons of different combinations, accounting for the compute budget.</p>

          <p>If expert feedback helps us improve the system, we’d then need fresh cases to see whether the improvement holds.</p>
        </div>

        <footer className="note-footer">
          <NoteBackLink />
          <span>More thoughts to come.</span>
        </footer>
      </article>
    </div>
  )
}
