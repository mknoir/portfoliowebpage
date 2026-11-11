import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { NoteBackLink } from '@/components/NoteBackLink'
import { ReasoningEffortFigure, BaselineTaskFigure, ExaOutcomeFigure, ExaToolUseFigure, BaselineExplorer, ExaExplorer, ExaFieldFigure } from '@/components/notes/ReasoningExaFigures'
import { ScientificToolsFigure, ContextTokenFigure, CostReasoningFigure, ContextExplorer } from '@/components/notes/ScientificContextFigures'
import { SEARCH_EVIDENCE_NOTE as note, SCIENTIFIC_AI_NOTE } from '@/lib/notes'
import '@/styles/notes.css'
import '@/styles/search-evidence-article.css'
import '@/styles/search-evidence-figures.css'
import '@/styles/reasoning-exa-figures.css'
import '@/styles/scientific-context-figures.css'

const socialImage = `${note.href}/opengraph-image`
export const metadata: Metadata = {
  title: note.title, description: note.description,
  authors: [{ name: 'Mickey Makhija', url: 'https://www.mknoir.com' }],
  alternates: { canonical: note.href },
  openGraph: {
    type: 'article', title: note.title, description: note.description,
    url: note.href, publishedTime: note.publishedAt, modifiedTime: note.updatedAt, authors: ['Mickey Makhija'],
    images: [{ url: socialImage, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: note.title, description: note.description, images: [socialImage] },
}

function RabbitHole({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <details id={id} className="research-detour">
    <summary><span><small>Supplementary analysis</small>{title}</span><span className="research-detour-mark" aria-hidden="true">+</span></summary>
    <div className="research-detour-body">{children}</div>
  </details>
}

const chapters = [
  ['reasoning-effort', 'Reasoning effort'], ['task-performance', 'Task performance'],
  ['web-search', 'Web search'], ['analysis-behavior', 'Evidence use'],
  ['scientific-tools', 'Scientific tools'], ['tokens-and-costs', 'Tokens and costs'],
  ['groq-repair', 'gpt-oss repair follow-up'], ['what-next', 'Further work'],
] as const

const repairFieldChecks = [
  { task: 'Structural inversion', settings: 4, passed: 1, required: 16 },
  { task: 'cis-MVMR', settings: 1, passed: 0, required: 2 },
  { task: 'Hi-C loop strength', settings: 1, passed: 0, required: 3 },
  { task: 'Multiparent QTL', settings: 1, passed: 0, required: 2 },
  { task: 'Ambient-state eQTL', settings: 1, passed: 0, required: 1 },
  { task: 'CRISPRi/CasRx', settings: 2, passed: 2, required: 6 },
  { task: 'Molecular tumor board', settings: 1, passed: 1, required: 4 },
  { task: 'Carrier residual risk', settings: 2, passed: 0, required: 10 },
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
        <div className="note-meta"><span>By Mickey Makhija</span><time dateTime={note.publishedAt}>{note.displayDate}</time><span>Updated <time dateTime={note.updatedAt}>November 11, 2026</time></span><span>{note.readingTime}</span></div>
      </header>
      <nav className="research-toc" aria-label="In this article">{chapters.map(([id, label], i) => <a key={id} href={`#${id}`}><span>{String(i + 1).padStart(2, '0')}</span>{label}</a>)}</nav>
      <div className="note-prose research-prose">
        <p>This study evaluates reasoning effort, web access and scientific tools on the ten public <a href="https://openai.com/index/introducing-genebench-pro/">GeneBench-Pro</a> tasks. The experiments began with model and reasoning-effort comparisons using Python, then added web search, followed by scientific tools and explicit instructions to use relevant evidence.</p>
        <p>The analysis examines whole-task outcomes, numerical field accuracy, execution completeness, token use and estimated cost. Saved tool calls and Python computations provide a record of the models’ analytical choices and their use of external information.</p>
        <p><strong>GeneBench-Pro was created by Jeremiah H Li, Suyash Shringarpure, Edmund Wong and Andrew J Ho at OpenAI.</strong> Their <a href="https://www.biorxiv.org/content/10.64898/2026.06.29.735386v4">paper</a> and <a href="https://huggingface.co/datasets/openai/genebench-pro-public-package">public release</a> provide the tasks, synthetic datasets and reference graders. This is an independent evaluation built on their work.</p>

        <section id="reasoning-effort" aria-labelledby="reasoning-title">
          <p className="research-section-number">01 / Reasoning effort</p>
          <h2 id="reasoning-title">Higher reasoning effort did not consistently improve task accuracy.</h2>
          <p>The first phase varied reasoning effort before adding web access. For Astra’s API settings, passes rose from two of ten at Low to four at XHigh and Max. Sol went from two at Low to four at XHigh, then three at Max.</p>
          <p>Muse passed two tasks each at Low and Medium, and one each at Minimal, High, XHigh and Max. Nemotron had no whole-task passes at any of its three thinking budgets. gpt-oss also had none across Low, Medium and High.</p>
          <p>Execution failures limit the interpretation of these scores. Seven of Muse’s ten XHigh runs and seven of its Max runs ended at context or output limits. gpt-oss had 18 tool/format failures across its 30 settings. These observations do not isolate scientific accuracy from the ability to complete a run within the configured limits.</p>
          <p>A separate full-context follow-up covered all 18 Muse settings originally censored by context or headroom limits. It recorded six passes, nine scientific misses and three runtime failures, with no context- or output-limit terminations. Those follow-ups are retained separately from the 660 observations in the main comparison.</p>
        </section>
      </div>
      <ReasoningEffortFigure />
      <div className="note-prose research-prose">
        <RabbitHole id="baseline-profiles" title="Outcomes for all 260 baseline settings">
          <p>Each profile ran the same ten tasks once. Native product modes are shown separately from API effort settings. The table retains endpoint misses, formatting failures, resource limits and operational failures as different outcomes.</p>
          <p>The separate full-context Muse follow-up increased the serving window from 131,072 to 1,048,576 tokens while preserving task prompts, model settings, data, graders and output budgets. It did not replace the original outcomes. Its three remaining runtime terminations comprised two 60-minute deadlines and one 120-response-turn limit. One deadline retained documented host-sleep exposure.</p>
          <div className="se-table-scroll" tabIndex={0} role="region" aria-label="Selected full-context Muse follow-up outcomes"><table><caption>Supplemental context-capacity evaluation: 18 previously censored settings</caption><thead><tr><th scope="col">Effort</th><th scope="col">Follow-ups</th><th scope="col">Passes</th><th scope="col">Scientific misses</th><th scope="col">Time / turn limits</th></tr></thead><tbody><tr><th scope="row">Medium</th><td>1</td><td>0</td><td>0</td><td>1</td></tr><tr><th scope="row">High</th><td>3</td><td>0</td><td>2</td><td>1</td></tr><tr><th scope="row">XHigh</th><td>7</td><td>3</td><td>3</td><td>1</td></tr><tr><th scope="row">Max</th><td>7</td><td>3</td><td>4</td><td>0</td></tr></tbody></table></div>
          <p><a href="/research/context-capacity-followup-20261031.json" download>Download the 18 source-to-follow-up mappings and context-limit audit (JSON)</a>. These selected follow-ups remain separate from the main cohort.</p>
          <BaselineExplorer />
        </RabbitHole>
        <section id="task-performance" aria-labelledby="tasks-title">
          <p className="research-section-number">02 / The ten tasks</p>
          <h2 id="tasks-title">Wright–Fisher and cis-MVMR accounted for 33 of 48 passes.</h2>
          <p>The Python-only phase produced 48 passes across 260 settings. Twenty came from Wright–Fisher selection and 13 from cis-MVMR. CRISPRi/CasRx and multiparent QTL contributed seven each; carrier residual risk contributed one.</p>
          <p>The other five tasks had no whole-task passes: Hi-C loop strength, population sex bias, ambient-state eQTL, inversion expression risk and structural-variant-guided tumor therapy benefit–risk. That last task represents a molecular tumor board, or MTB.</p>
          <p>Whole-task scores identify whether every required endpoint was recovered. Field-level results and saved computations provide a more detailed basis for examining errors in data handling, model specification and numerical estimation.</p>
        </section>
      </div>
      <BaselineTaskFigure />
      <div className="note-prose research-prose">
        <section id="web-search" aria-labelledby="search-title">
          <p className="research-section-number">03 / Adding web search</p>
          <h2 id="search-title">Parse-valid answers increased from 70/90 to 87/90 with web access.</h2>
          <p>The second phase added optional web search for methods and official documentation. Two search backends were evaluated; the results shown here use Exa. The paired comparison covers the same 60 Muse and 30 Nemotron settings as their Python-only runs.</p>
          <p>Whole-task passes went from <strong>eight of 90 to twelve of 90</strong>. Seven settings gained a pass, three lost one and five passed in both conditions. All twelve Exa passes were Muse settings; Nemotron remained at zero.</p>
          <p>Parse-valid final answers increased from 70 without web access to 87 with Exa. On the same 204 fields graded in both conditions, correct fields went from 52 to 51. Improved answer validity therefore did not correspond to higher accuracy on this shared field set.</p>
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
          <p className="research-section-number">04 / Evidence use</p>
          <h2 id="behavior-title">No pass gain involved a search or fetch request.</h2>
          <p>Exa was requested in 16 of the 90 settings: 13 Muse and three Nemotron. Those settings made 28 searches and received 140 bounded highlight records. None requested a page fetch.</p>
          <p>All seven settings that gained a pass over the original condition made <strong>zero Exa search or fetch requests</strong>. The four settings that both searched and passed were Wright–Fisher runs that already passed without web access.</p>
          <p>The trace analysis distinguishes evidence retrieval from subsequent use. Establishing use requires a correspondence between delivered information and a later analytical decision; a tool request or improved score alone is insufficient.</p>
        </section>
      </div>
      <ExaToolUseFigure />
      <div className="note-prose research-prose">
        <RabbitHole id="trace-example" title="Source and code correspondence in a Wright–Fisher trace">
          <p>Muse Medium received an excerpt explaining first-order uncertainty propagation. Its next saved Python computation propagated measurement variance through transformations and used the result in regression weights. There is a concrete correspondence between delivered methods text and subsequent code.</p>
          <p>That setting had already passed without web access, and the code did not explicitly attribute the choice to the source. In the other three searched passes, the core method was present before search. Source and code correspondence alone cannot establish that retrieval changed the task outcome.</p>
          <p>The audit inspected all seven gain traces, all four searched passes and three searched misses beyond the call inventory. The other nine searched misses were not semantically audited. This examines saved tool calls, code and outputs, rather than private internal reasoning.</p>
          <p>Search responses already contained highlights, so zero fetches does not mean zero source exposure. A highlight also does not establish that a full paper was read or applied.</p>
        </RabbitHole>
        <RabbitHole id="exa-explorer" title="Outcomes for the 90 paired web-search settings">
          <ExaExplorer />
        </RabbitHole>
        <section id="scientific-tools" aria-labelledby="tools-title">
          <p className="research-section-number">05 / Adding scientific tools</p>
          <h2 id="tools-title">Scientific tools yielded 8/50 passes, compared with 9/50 for web alone.</h2>
          <p>The next experiment kept web search available and added GWAS Catalog, ClinVar, ClinGen, Open Targets, PDB, Ensembl, GenBank and Hail resources. The models were explicitly told to consult relevant scientific tools, inspect the returned evidence and explain its application in their public analysis.</p>
          <p>Budget constraints restricted this phase to the highest selected API settings: Sol Max, Astra Max, Muse Max, gpt-oss High and Nemotron with a 16,384-token thinking budget. Each ran the same ten tasks once, for 50 new settings.</p>
          <p>The web-plus-tools condition passed <strong>eight of 50</strong>, compared with <strong>nine of 50</strong> in the full 50-setting historical web baseline. A backend-matched comparison covers the 20 Muse Max and Nemotron settings that used Exa in both conditions: <strong>two of 20</strong> passed with scientific tools, versus <strong>three of 20</strong> with web alone. The full comparison also changes search backend; both comparisons retain historical differences in prompts, context allowances and execution conditions.</p>
        </section>
      </div>
      <ScientificToolsFigure />
      <div className="note-prose research-prose">
        <p>Thirty-two of the 50 settings requested search or fetch, and 38 requested a named scientific tool. The scientific responses consisted of 41 staged documentation responses and <strong>zero complete biological records</strong>. The single Open Targets lookup was blocked.</p>
        <p>The scientific-tool arm therefore primarily evaluated documentation consultation alongside web search. The delivery record does not support conclusions about performance with successfully retrieved variant, structure or other biological records.</p>
        <RabbitHole id="scientific-tool-details" title="Tool use, incomplete executions and all 50 settings">
          <p>The scientific tools received 42 requests across 38 settings. Thirty-four settings successfully read at least one staged documentation file in Python. Source text from 35 files subsequently appeared in model inputs across 32 settings, including 24 entire staged documentation objects. The trace audit established two bounded generic-QC code correspondences. It did not establish broad downstream evidence adoption.</p>
          <p>Five gpt-oss settings ended in tool-generation failures, and one Nemotron final contained required numeric nulls. A secondary type-and-finite-value audit identified 44 complete answers and six incomplete executions. The five tool-generation failures are not scientific misses. The saved scientific graders and results remain unchanged; the explorer reports completeness separately from the recorded outcome.</p>
          <p>Before launch, four of five profiles passed the full known-question check. Nemotron’s extraction and output-contract miss was retained and explicitly accepted. The <a href="#groq-repair">November gpt-oss repair follow-up</a> reports new grades separately from these historical outcomes.</p>
          <ContextExplorer />
        </RabbitHole>
        <section id="tokens-and-costs" aria-labelledby="cost-title">
          <p className="research-section-number">06 / Tokens and costs</p>
          <h2 id="cost-title">Token use and estimated cost across reasoning settings.</h2>
          <p>The original API sweep compares task outcomes with token use and estimated cost at each reasoning setting. Effort labels specify provider configurations; they do not establish comparable compute expenditure across models.</p>
        </section>
      </div>
      <CostReasoningFigure />
      <div className="note-prose research-prose">
        <p>The new 50-setting tool experiment had a known recorded estimate of <strong>$86.02</strong>: $85.65 in solver token estimates and $0.364 in Exa fees. Five failed gpt-oss requests retain a separate $0.388 unknown bound. Local Nemotron hardware and electricity are unpriced. These are estimates and retained uncertainty, rather than invoices.</p>
        <RabbitHole id="token-breakdown" title="Input, output and reported reasoning tokens">
          <p>The distribution below uses provider-reported token counters for the 50 new settings. Input totals include repeated conversation history. Output tokens are not automatically reasoning tokens: separate reasoning counters were reported for 40 settings and remain missing for Nemotron. Usage from failed requests can be absent, so low totals may reflect interrupted execution.</p>
          <ContextTokenFigure />
        </RabbitHole>
        <section id="groq-repair" aria-labelledby="groq-repair-title">
          <p className="research-section-number">07 / gpt-oss repair follow-up</p>
          <h2 id="groq-repair-title">The gpt-oss repair yielded 34 valid grades and zero whole-task passes.</h2>
          <p>All 34 historical settings selected for this follow-up ended in tool or format failures. They were gpt-oss-120b runs on Groq, with 18 Python-only settings, 11 with helper-backed web search and five with web search and scientific tools. The follow-up used the same tasks, data, model settings and graders under a revised interface and execution setup. All 34 follow-up submissions could be scored. Each missed at least one required endpoint, so the whole-task pass count stayed at zero.</p>
          <p>The final 13 settings all submitted answers that passed the format checks. They passed <strong>4 of 44 required field checks</strong>. The four correct fields were a structural inversion support call, two CRISPRi/CasRx target decisions and a tumor-board therapy class. All 36 quantitative checks failed. A whole-task pass required every endpoint to pass, so none of these 13 settings earned one.</p>
          <p>These were selected reruns of unresolved settings. The results add valid grades for that group and leave the historical comparison tables and pass totals as recorded. The saved grades identify which endpoints were missed. They do not isolate why the estimates were wrong or the effect of any single interface change.</p>
        </section>
        <RabbitHole id="groq-repair-fields" title="Field accuracy in the final 13 gpt-oss repair settings">
          <div className="se-table-scroll" tabIndex={0} role="region" aria-label="Field accuracy by task for the final 13 gpt-oss repair settings">
            <table>
              <caption>Required field checks from the saved original grades</caption>
              <thead><tr><th scope="col">Task</th><th scope="col">Settings</th><th scope="col">Passed fields</th><th scope="col">Required fields</th></tr></thead>
              <tbody>{repairFieldChecks.map(({ task, settings, passed, required }) => <tr key={task}><th scope="row">{task}</th><td>{settings}</td><td>{passed}</td><td>{required}</td></tr>)}</tbody>
            </table>
          </div>
        </RabbitHole>
        <section id="what-next" aria-labelledby="next-title">
          <p className="research-section-number">08 / Further work</p>
          <h2 id="next-title">Validate delivery and execution before further tool comparisons.</h2>
          <p>Further experiments should verify that task-relevant biological records can be requested, delivered and read, then evaluate their use in the analysis. Separate tool groups would help distinguish the contribution of individual resources from the combined bundle and its instructions.</p>
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
          <p>The 90-setting web comparison reuses 90 baseline settings and adds 90 new observations. Task prompts, model/effort settings, data, graders and per-case solver limits were preserved. Serving-context allowances, guard versions, timing and concurrency differed. A single observation per setting and these historical differences limit attribution and do not estimate run-to-run reliability.</p>
          <p>The historical full web baseline used helper-backed web search. The 90-setting optional web arm and the 50-setting scientific-tool arm used Exa, which supplied bounded highlights. Fetch remained a guarded direct publisher reader. Only methods and official documentation were permitted. Benchmark papers, solutions, graders and prior responses were excluded from retrieval.</p>
          <p>The Exa owners are 34 initial settings, two continuations and 54 later settings. The last 56 used a repaired guard with a common 42-query methods menu; the final 54 also used up to five Muse workers. All Nemotron settings belong to the earlier stratum. Limits retained 20 web calls within 120 aggregate tools, 120 model responses, 40,000 output tokens per request, 256,000 per run and 60 awake minutes.</p>
          <p>The scientific-tool follow-up adds 50 observations to the earlier 520 original/web observations and 90 Exa observations: 660 observations in the main comparison, excluding separate diagnostics and other earlier follow-ups. It reuses the saved controls. Scientific tools and web share a combined 20 context calls inside the same 120 aggregate tools. The highest-profile selection reflects budget limits, not an equal-compute comparison. Historical prompts, guards, context allowances, timing, scheduling and delivery differ, and the instruction and tool bundle were added together.</p>
          <p><a href="/research/scientific-context-publication-20261030.json" download>Download the scientific-tool comparison, token counts and cost data (JSON)</a>. This public projection contains aggregate field counts and usage metadata, without answer values, grading targets, raw transcripts or private reasoning. All 50 settings ended once. Nothing was rerun or regraded for this update.</p>
          <p><a href="/research/search-evidence-study.json" download>Download the complete versioned study data (JSON)</a>. It preserves the original baseline and both historical search backends as separate conditions, including arms summarized only in the supplementary data. The data exclude answer values, raw transcripts, credentials and private reasoning.</p>
          <p>The main source has SHA-256 <code className="research-hash">df499f6f288848cd03635b28577e882098c3c82281ba9ac576d4d793e07b503f</code>; the October scientific-tool source has SHA-256 <code className="research-hash">c3f3dad2b4b876db1ee4fca9242baae7ab016e8fd35ea494efad8246462c451b</code>. All optional runs ended, collection was sealed and the monitor was retired. The November gpt-oss follow-up is reported separately above.</p>
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
