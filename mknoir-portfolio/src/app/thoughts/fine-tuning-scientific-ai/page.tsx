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

const studies = [
  {
    intervention: 'Pretraining data',
    evidence: <><strong>BioT5+</strong> removes PubMed Central and bioRxiv additions in an ablation. Performance falls slightly on molecule description generation and description-guided molecule design. It separately compares single-task and multitask fine-tuning.</>,
    limits: <>Scientific training corpora help these tasks. This is a specialized molecular/protein model; transfer to general agents doing statistical analysis is unestablished.</>,
    href: 'https://aclanthology.org/2024.findings-acl.71.pdf#page=9',
    source: 'BioT5+, §4.3',
  },
  {
    intervention: 'Fine-tuning',
    evidence: <><strong>Aviary</strong> compares an untuned Llama-3.1-8B-Instruct agent with supervised behavior cloning followed by expert iteration. LitQA2 test accuracy rises from <strong>30% to 72%</strong> in the PaperQA environment.</>,
    limits: <>Training successful tool-use trajectories helps within a shared scientific environment. This does not isolate pretraining. The authors also observe overfitting on a separate task, SeqQA.</>,
    href: 'https://arxiv.org/html/2412.21154v1#S5.SS1',
    source: 'Aviary, §5.1',
  },
  {
    intervention: 'Application layer',
    evidence: <><strong>Biomni</strong> compares agent setups using the same Claude Sonnet 3.7 backbone, without task-specific fine-tuning. It reports <strong>20.4% average relative improvement</strong> over Biomni-ReAct across eight realistic biomedical tasks.</>,
    limits: <>Agent architecture matters independently of task-specific weight training. The gain is relative, not percentage points. These are not GeneBench-Pro results.</>,
    href: 'https://biomni.stanford.edu/paper.pdf#page=8',
    source: 'Biomni, p. 7',
  },
  {
    intervention: 'Fine-tuning + application components',
    evidence: <><strong>SciAgent</strong> ablates training-data construction and planning. Its Coder 7B system scores <strong>32.2%</strong>, versus <strong>30.3% without planning</strong>, on the human-annotated SCITOOLBENCH subset. Tools can hurt untuned models; tool-use training makes them beneficial.</>,
    limits: <>Training and tool scaffolding can interact. The ablations use nested variants, not every possible combination. The tasks are broader scientific questions, rather than biological dataset analysis.</>,
    href: 'https://aclanthology.org/2024.emnlp-main.880.pdf',
    source: 'SciAgent, Table 3 & Figure 5',
  },
]

export default function ScientificAINote() {
  return (
    <div className="note-page">
      <nav className="note-navigation" aria-label="Note navigation">
        <Link className="note-wordmark" href="/">Mickey Makhija<span aria-hidden="true">.</span></Link>
        <NoteBackLink />
      </nav>

      <article className="note-article note-article--evidence" aria-labelledby="note-title">
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

          <p>Here’s some of the evidence I’ve been looking at:</p>

          <table className="note-evidence-table" role="table">
            <caption>Four studies on specializing scientific AI</caption>
            <thead role="rowgroup">
              <tr role="row">
                <th id="intervention" scope="col" role="columnheader">Intervention</th>
                <th id="evidence" scope="col" role="columnheader">Relevant evidence</th>
                <th id="limits" scope="col" role="columnheader">What it shows, and the limits</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {studies.map((study, index) => (
                <tr key={study.intervention} role="row">
                  <th id={`study-${index}`} headers="intervention" scope="row" role="rowheader">{study.intervention}</th>
                  <td headers={`study-${index} evidence`} role="cell">
                    <span className="note-evidence-label" aria-hidden="true">Relevant evidence</span>
                    <p>{study.evidence}</p>
                  </td>
                  <td headers={`study-${index} limits`} role="cell">
                    <span className="note-evidence-label" aria-hidden="true">What it shows, and the limits</span>
                    <p>{study.limits}</p>
                    <a href={study.href}>{study.source}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>We’ll be running some tests to see how well these approaches perform and appending the results here. I’m particularly interested in whether fine-tuning helps on biological data analysis, and how much of the improvement depends on the tools and workflow around the model.</p>

          <p>If you’re interested in collaborating, send me a <a href="sms:+13233989379">text</a> or <a href="mailto:himay75@gmail.com?subject=Scientific%20AI%20evals">email</a>. If you have evals you’d like us to test against, let me know.</p>
        </div>

        <footer className="note-footer">
          <NoteBackLink />
          <span>More thoughts to come.</span>
        </footer>
      </article>
    </div>
  )
}
