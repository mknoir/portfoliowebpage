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
          <p>I’ve been diving into <a href="https://openai.com/index/introducing-genebench-pro/">GeneBench-Pro</a>, and it’s sent me back to the three ways to specialize AI in my <Link href={SCIENTIFIC_METHOD_NOTE.href}>last note</Link>. Fine-tuning still looks promising to me, but I’m curious how much can be done by giving a model better context.</p>

          <p>In <a href="https://aclanthology.org/2024.emnlp-main.880.pdf#page=7">SciAgent</a>, giving the untuned models tools actually hurt performance. After tool-use training, those tools helped. <a href="https://arxiv.org/html/2412.21154v1#S5.SS1">Aviary</a> gives me another reason to try fine-tuning: training a Llama-3.1-8B-Instruct agent on successful tool-use trajectories, followed by expert iteration, took LitQA2 test accuracy from 30% to 72% in the PaperQA environment. The agent already had the tools. Learning to use them made a substantial difference.</p>

          <p><a href="https://biomni.stanford.edu/paper.pdf#page=8">Biomni</a> improved performance over its ReAct variant using the same Claude Sonnet 3.7 backbone, without task-specific fine-tuning. So there’s room to improve how the agent works around the model, too. And <a href="https://aclanthology.org/2024.findings-acl.71.pdf#page=9">BioT5+</a> found that removing the added PubMed Central and bioRxiv training data slightly hurt its molecule-description and description-guided design results.</p>

          <p>What caught my attention in <a href="https://arxiv.org/html/2604.09554v2#S4.SS1">LABBench2</a> is that models do worse when they have to find the relevant figures and tables in papers themselves. The authors suggest in the discussion that better reasoning alone won’t solve this. Evidence curation clearly matters here, but I’d like to run a study to test that suggestion.</p>

          <p>It’s funny how much of this comes back to context. <a href="https://openai.com/index/introducing-genebench-pro/">More reasoning helps on GeneBench-Pro</a>, too. I’m curious whether better context could save reasoning tokens, improve the answers even when the model has plenty of room to reason, or both. I don’t have an answer to that yet.</p>

          <p>I’m also very curious to compare individual models fine-tuned for these tasks with closed frontier models, given the same evidence and tools. These papers use different tasks and setups, so they don’t settle that comparison. I’ll be running tests and adding the results here.</p>

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
