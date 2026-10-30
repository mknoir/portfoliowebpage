import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { NoteBackLink } from '@/components/NoteBackLink'
import { ReasoningEffortFigure, BaselineTaskFigure, ExaOutcomeFigure, ExaToolUseFigure, BaselineExplorer, ExaExplorer, ExaFieldFigure } from '@/components/notes/ReasoningExaFigures'
import { SEARCH_EVIDENCE_NOTE as note, SCIENTIFIC_AI_NOTE } from '@/lib/notes'
import '@/styles/notes.css'
import '@/styles/search-evidence-article.css'
import '@/styles/search-evidence-figures.css'
import '@/styles/reasoning-exa-figures.css'

const socialImage = `${note.href}/opengraph-image`
export const metadata: Metadata = {
  title: note.title, description: note.description,
  authors: [{ name: 'Mickey Makhija', url: 'https://www.mknoir.com' }],
  alternates: { canonical: note.href },
  openGraph: {
    type: 'article', title: note.title, description: note.description,
    url: note.href, publishedTime: note.publishedAt, authors: ['Mickey Makhija'],
    images: [{ url: socialImage, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: note.title, description: note.description, images: [socialImage] },
}

function RabbitHole({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <details id={id} className="research-detour">
    <summary><span><small>A little deeper</small>{title}</span><span className="research-detour-mark" aria-hidden="true">+</span></summary>
    <div className="research-detour-body">{children}</div>
  </details>
}

const chapters = [
  ['reasoning-effort', 'Reasoning effort'], ['task-performance', 'The ten tasks'],
  ['web-search', 'Adding search'], ['analysis-behavior', 'Inside the analysis'], ['what-next', 'What next?'],
] as const

export default function SearchEvidenceArticle() {
  return <div className="note-page research-note">
    <nav className="note-navigation" aria-label="Note navigation">
      <Link className="note-wordmark" href="/">Mickey Makhija<span aria-hidden="true">.</span></Link>
      <NoteBackLink />
    </nav>
    <article className="note-article research-article" aria-labelledby="note-title">
      <header className="note-heading research-heading">
        <p className="eyebrow">Thoughts / 03 · Experimental results</p>
        <h1 id="note-title">{note.title}</h1>
        <div className="note-meta"><span>By Mickey Makhija</span><time dateTime={note.publishedAt}>{note.displayDate}</time><span>{note.readingTime}</span></div>
      </header>
      <nav className="research-toc" aria-label="In this article">{chapters.map(([id, label], i) => <a key={id} href={`#${id}`}><span>{String(i + 1).padStart(2, '0')}</span>{label}</a>)}</nav>
      <div className="note-prose research-prose">
        <p>How much does more reasoning effort help a model solve a scientific problem? And what changes when it can look up a method instead of relying on what it already knows?</p>
        <p>I started with the ten public <a href="https://openai.com/index/introducing-genebench-pro/">GeneBench-Pro</a> tasks, testing models at different reasoning settings with Python. Then I added methods search and documentation. The aim is to work out which changes help, and understand the analytical choices behind the results.</p>
        <p><strong>GeneBench-Pro was created by Jeremiah H Li, Suyash Shringarpure, Edmund Wong and Andrew J Ho at OpenAI.</strong> Their <a href="https://www.biorxiv.org/content/10.64898/2026.06.29.735386v4">paper</a> and <a href="https://huggingface.co/datasets/openai/genebench-pro-public-package">public release</a> provide the tasks, synthetic datasets and reference graders. This is an independent evaluation built on their work.</p>

        <section id="reasoning-effort" aria-labelledby="reasoning-title">
          <p className="research-section-number">01 / Reasoning effort</p>
          <h2 id="reasoning-title">More thinking did not produce a steady climb.</h2>
          <p>The first phase varied reasoning effort before adding web access. For Astra’s API settings, passes rose from two of ten at Low to four at XHigh and Max. Sol went from two at Low to four at XHigh, then three at Max.</p>
          <p>Muse passed two tasks each at Low and Medium, and one each at Minimal, High, XHigh and Max. Nemotron had no whole-task passes at any of its three thinking budgets. gpt-oss also had none across Low, Medium and High.</p>
          <p>The execution record explains part of that pattern. Seven of Muse’s ten XHigh runs and seven of its Max runs ended at context or output limits. gpt-oss had 18 tool/format failures across its 30 settings. Giving a model more room to think and getting a completed analysis are separate problems.</p>
        </section>
      </div>
      <ReasoningEffortFigure />
      <div className="note-prose research-prose">
        <RabbitHole id="baseline-profiles" title="Inspect all 260 baseline settings">
          <p>Each profile ran the same ten tasks once. Native product modes are shown separately from API effort settings. The table retains endpoint misses, formatting failures, resource limits and operational failures as different outcomes.</p>
          <BaselineExplorer />
        </RabbitHole>
        <section id="task-performance" aria-labelledby="tasks-title">
          <p className="research-section-number">02 / The ten tasks</p>
          <h2 id="tasks-title">Some tasks accounted for almost all the passes.</h2>
          <p>The Python-only phase produced 48 passes across 260 settings. Twenty came from Wright–Fisher selection and 13 from cis-MVMR. CRISPRi/CasRx and multiparent QTL contributed seven each; carrier residual risk contributed one.</p>
          <p>The other five tasks had no whole-task passes: Hi-C loop strength, population sex bias, ambient-state eQTL, inversion expression risk and structural-variant-guided tumor therapy benefit–risk. That last task represents a molecular tumor board, or MTB.</p>
          <p>This is where I want to spend more time. A model might notice a data problem and still carry on with an estimator that assumes the problem is absent. A score tells me that an endpoint was missed. The computation is where I can inspect what happened.</p>
        </section>
      </div>
      <BaselineTaskFigure />
      <div className="note-prose research-prose">
        <section id="web-search" aria-labelledby="search-title">
          <p className="research-section-number">03 / Adding web search</p>
          <h2 id="search-title">Then I gave the models access to methods.</h2>
          <p>Could external evidence help with those analytical choices? I tested search through a Luna-backed helper and through Exa. The results below focus on the Exa arm: the same 60 Muse and 30 Nemotron settings compared with their Python-only runs.</p>
          <p>Whole-task passes went from <strong>eight of 90 to twelve of 90</strong>. Seven settings gained a pass, three lost one and five passed in both conditions. All twelve Exa passes were Muse settings; Nemotron remained at zero.</p>
          <p>Final answers also became easier to grade: 70 were parse-valid without web access and 87 with Exa. That matters, but a valid answer can still miss the scientific endpoints. On the same 204 fields graded in both conditions, correct fields went from 52 to 51.</p>
        </section>
      </div>
      <ExaOutcomeFigure />
      <div className="note-prose research-prose">
        <RabbitHole id="fields-and-costs" title="Field accuracy, completion and costs">
          <ExaFieldFigure />
          <p>The shared-field comparison covers 67 settings. Ten fields gained a pass and eleven lost one. Ungraded fields do not enter this intersection. It answers a different question from the whole-task comparison across all 90 settings.</p>
          <p>The Exa arm’s recorded estimate was $188.0754: $186.6760 in solver usage, $0.1960 in Exa fees and a $1.2034 conservative failed-request allowance. The allowance is not verified usage from the failed response. Local Nemotron hardware cost is unpriced; these figures are usage estimates rather than invoices.</p>
        </RabbitHole>
        <section id="analysis-behavior" aria-labelledby="behavior-title">
          <p className="research-section-number">04 / Inside the analysis</p>
          <h2 id="behavior-title">The new passes had not searched.</h2>
          <p>Exa was requested in 16 of the 90 settings: 13 Muse and three Nemotron. Those settings made 28 searches and received 140 bounded highlight records. None requested a page fetch.</p>
          <p>All seven settings that gained a pass over the original condition made <strong>zero Exa search or fetch requests</strong>. The four settings that both searched and passed were Wright–Fisher runs that already passed without web access.</p>
          <p>That makes the next question more interesting than “did the score go up?” I want to know whether a model acquired a missing method, recognized its relevance, and changed the analysis. Receiving evidence is one step in that sequence.</p>
        </section>
      </div>
      <ExaToolUseFigure />
      <div className="note-prose research-prose">
        <RabbitHole id="trace-example" title="A closer look at one Wright–Fisher trace">
          <p>Muse Medium received an excerpt explaining first-order uncertainty propagation. Its next saved Python computation propagated measurement variance through transformations and used the result in regression weights. There is a concrete correspondence between delivered methods text and subsequent code.</p>
          <p>That setting had already passed without web access. The code did not explicitly attribute the choice to the source. In the other three searched passes, the core method was present before search. These traces help locate possible changes in behavior; they do not establish that an excerpt caused a pass.</p>
          <p>The audit inspected all seven gain traces, all four searched passes and three searched misses beyond the call inventory. The other nine searched misses were not semantically audited. This examines saved tool calls, code and outputs, rather than private internal reasoning.</p>
          <p>Search responses already contained highlights, so zero fetches does not mean zero source exposure. A highlight also does not establish that a full paper was read or applied.</p>
        </RabbitHole>
        <RabbitHole id="exa-explorer" title="Explore the 90 matched Exa settings">
          <ExaExplorer />
        </RabbitHole>
        <section id="what-next" aria-labelledby="next-title">
          <p className="research-section-number">05 / What I’d test next</p>
          <h2 id="next-title">Connect each failure to a change we can test.</h2>
          <p>What’s clear to me is that “more reasoning” and “more tools” are both too broad. I want ablations that address a specific bottleneck: finding a method, understanding the data, choosing an estimator, or carrying a diagnostic finding into the final computation.</p>
          <p>I’d compare models finding evidence for themselves with the same models receiving a small, curated evidence pack. I’d also compare optional search with explicit search-and-evidence instructions under one fixed setup. The directed-search follow-up discussed during this study was cancelled before it ran.</p>
          <p>Structured sources such as GWAS Catalog, ClinVar, Open Targets, PDB and Ensembl belong in that program too. A variant annotation and a statistical-methods explanation serve different purposes. I’d choose the tool for the question, then see what changes when it is removed.</p>
          <p><strong>I want to understand which interventions help models do better science, and why.</strong> That means following the path from information to analytical choice to computation to answer. The pass rate is part of the evidence, not the whole investigation.</p>
        </section>
        <RabbitHole id="related-benchmarks" title="GeneBench-Pro, LABBench2 and LifeSciBench">
          <p><a href="https://www.biorxiv.org/content/10.64898/2026.06.29.735386v4">GeneBench-Pro</a> supplies this study’s tasks. Its simulated data and known targets let us inspect concrete analytical decisions and check numerical endpoints. The full benchmark has 129 questions; this study uses ten released cases.</p>
          <p><a href="https://arxiv.org/abs/2604.09554v2">LABBench2, by Laurent and colleagues</a>, evaluates practical biology research capabilities across information, data and literature tasks. Its access and tool comparisons are relevant to separating information availability from successful use.</p>
          <p><a href="https://doi.org/10.64898/2026.08.13.744657">LifeSciBench, by Liu and colleagues</a>, uses expert-authored research tasks and detailed rubrics to evaluate scientific correctness and usefulness. That broader perspective matters when endpoints alone do not explain the quality of an analysis.</p>
          <p>This study builds on those efforts. It does not include new LABBench2 or LifeSciBench evaluations, or pool their scores with GeneBench-Pro.</p>
        </RabbitHole>
        <RabbitHole id="data-and-methods" title="Methods, limitations and the complete versioned data">
          <p>The baseline covers 26 model/route/effort profiles across five families, with one observation per profile on each of the ten tasks. Effort labels and native modes are provider-specific configurations, rather than equal compute budgets. The public package is pinned at revision <code className="research-hash">eb75a3c0996b3cedcc9af685bad02fd166848fa2</code>.</p>
          <p>A whole-task pass requires every required endpoint to pass the saved grader and the final answer to meet its output contract. The grader checks deterministic endpoints and schema, not the semantic quality of a reasoning string. Some task conventions remain ambiguous; the saved labels are endpoint outcomes, rather than a comprehensive expert assessment of each analysis.</p>
          <p>The Exa comparison reuses 90 baseline settings and adds 90 new observations. Task prompts, model/effort settings, data, graders and per-case solver limits were preserved. Serving-context allowances, guard versions, timing and concurrency differed. A single observation per setting and these historical differences limit attribution and do not estimate run-to-run reliability.</p>
          <p>Search used a shared interface backed by a Luna helper and, in a separate arm, Exa. Exa supplied bounded highlights; fetch remained a guarded direct publisher reader. Only methods and official documentation were permitted. Benchmark papers, solutions, graders and prior responses were excluded from retrieval.</p>
          <p>The Exa owners are 34 initial settings, two continuations and 54 later settings. The last 56 used a repaired guard with a common 42-query methods menu; the final 54 also used up to five Muse workers. All Nemotron settings belong to the earlier stratum. Limits retained 20 web calls within 120 aggregate tools, 120 model responses, 40,000 output tokens per request, 256,000 per run and 60 awake minutes.</p>
          <p><a href="/research/search-evidence-study.json" download>Download the complete versioned study data (JSON)</a>. It preserves the baseline, the earlier Luna-backed comparisons and Exa as separate conditions. This article presents the baseline reasoning sweep and the Exa follow-up; the archived arms have not been replaced or removed. The data exclude answer values, raw transcripts, credentials and private reasoning.</p>
          <p>The main source has SHA-256 <code className="research-hash">df499f6f288848cd03635b28577e882098c3c82281ba9ac576d4d793e07b503f</code>; the follow-up source has SHA-256 <code className="research-hash">c3f3dad2b4b876db1ee4fca9242baae7ab016e8fd35ea494efad8246462c451b</code>. All optional runs ended, collection was sealed and the monitor was retired. No new observations were created for this article.</p>
          <ul>
            <li>Li, Shringarpure, Wong and Ho. <a href="https://www.biorxiv.org/content/10.64898/2026.06.29.735386v4">GeneBench-Pro: Evaluating Multistage Statistical Reasoning in Genomics, Quantitative Biology, and Translational Biomedicine</a>. <a href="https://huggingface.co/datasets/openai/genebench-pro-public-package">Public task package</a>.</li>
            <li>Laurent and colleagues. <a href="https://arxiv.org/abs/2604.09554v2">LABBench2: An Improved Benchmark for AI Systems Performing Biology Research</a>.</li>
            <li>Liu and colleagues. <a href="https://doi.org/10.64898/2026.08.13.744657">LifeSciBench: Evaluating Language Models on Realistic, Expert-Level Tasks in the Life Sciences</a>.</li>
            <li><Link href={SCIENTIFIC_AI_NOTE.href}>Fine-tuning scientific AI</Link> — the question that led to these experiments.</li>
          </ul>
        </RabbitHole>
      </div>
      <footer className="note-footer research-footer"><NoteBackLink /><a href="#note-title">Back to the beginning ↑</a></footer>
    </article>
  </div>
}
