import type { Metadata } from 'next'
import Link from 'next/link'
import { NoteBackLink } from '@/components/NoteBackLink'
import { SCIENTIFIC_AI_NOTE as note, SCIENTIFIC_METHOD_NOTE } from '@/lib/notes'
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

export default function ScientificAINote() {
  return (
    <div className="note-page">
      <nav className="note-navigation" aria-label="Note navigation">
        <Link className="note-wordmark" href="/">Mickey Makhija<span aria-hidden="true">.</span></Link>
        <NoteBackLink />
      </nav>

      <article className="note-article" aria-labelledby="note-title">
        <header className="note-heading">
          <p className="eyebrow">Thoughts / 02</p>
          <h1 id="note-title">{note.title}</h1>
          <div className="note-meta">
            <span>By Mickey Makhija</span>
            <time dateTime={note.publishedAt}>{note.displayDate}</time>
            <span>{note.readingTime}</span>
          </div>
        </header>

        <div className="note-prose">
          <p>Diving into <a href="https://www.biorxiv.org/content/10.64898/2026.06.29.735386v1">GeneBench-Pro</a> got me thinking again about the three ways to specialize AI I mentioned in my <Link href={SCIENTIFIC_METHOD_NOTE.href}>last note</Link>. Fine-tuning seems to have the strongest upside, at least from what I’ve read so far. That’s my working hypothesis; these papers use different models and tasks.</p>

          <p>What caught my attention in the <a href="https://arxiv.org/html/2604.09554v2#S4.SS1">LABBench2 discussion</a> is the authors’ suggestion that better reasoning alone won’t solve the problem. Models do worse when they have to locate figures or tables in papers, rather than having them supplied. Evidence curation clearly matters here. But I’d like to run a study before deciding how much more reasoning can help. These results point to retrieval and navigation failures; they don’t isolate the effect of increasing the reasoning budget.</p>

          <p>I’d hold the model and questions fixed, vary the reasoning budget, and compare a curated evidence set with the original retrieval workflow. That would let me test whether better evidence, more reasoning, or the combination improves performance. The distinction matters if I’m trying to decide where to invest the effort.</p>

          <p>Pretraining data matters too. In <a href="https://aclanthology.org/2024.findings-acl.71.pdf#page=9">BioT5+</a>, removing the added PubMed Central and bioRxiv data slightly hurts molecule-description and description-guided design performance. That gives some support to training on scientific corpora for those tasks. It leaves me wondering how much would transfer to an agent making statistical decisions about a biological dataset.</p>

          <p><a href="https://arxiv.org/html/2412.21154v1#S5.SS1">Aviary</a> is the result that makes me want to test fine-tuning. Training a Llama-3.1-8B-Instruct agent on successful tool-use trajectories, followed by expert iteration, takes LitQA2 test accuracy from 30% to 72% in the PaperQA environment. The agent already had access to tools; training improved how well it performed with them. I’d like to see how much that approach helps on biological data analysis, where an early choice of method can affect the rest of the workflow.</p>

          <p><a href="https://biomni.stanford.edu/paper.pdf#page=8">Biomni</a> reports a 20.4% average relative improvement over its ReAct variant across eight biomedical tasks, using the same Claude Sonnet 3.7 backbone without task-specific fine-tuning. Changing the agent design improved performance without changing the model’s weights. That makes the comparison more demanding: fine-tuning needs to add something to a well-built agent.</p>

          <p>In <a href="https://aclanthology.org/2024.emnlp-main.880.pdf#page=7">SciAgent</a>, tools hurt the untuned models in its comparison, then became useful after tool-use training. A useful tool doesn’t guarantee that a model knows when or how to use it. These are broader scientific questions, rather than biological dataset analyses, but the interaction is worth testing: training may be what lets the application layer work well.</p>

          <p>I’ll be running tests to compare these approaches and appending the results here. I want to see what fine-tuning adds once the reasoning budget and tools are accounted for, and whether the gains hold on fresh tasks.</p>

          <p>If you’re interested in collaborating, send me a <a href="sms:+13233989379">text</a> or <a href="mailto:himay75@gmail.com?subject=Scientific%20AI%20evals">email</a>. If you have evals you’d like me to test against, let me know.</p>
        </div>

        <footer className="note-footer">
          <NoteBackLink />
          <span>More thoughts to come.</span>
        </footer>
      </article>
    </div>
  )
}
