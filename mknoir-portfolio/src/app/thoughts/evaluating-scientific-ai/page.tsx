import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { NoteBackLink } from '@/components/NoteBackLink'
import { BaselineModelFigure, TaskPerformanceFigure, HistoricalProfileExplorer, OutcomeFigure, ToolUseFigure, FieldAccuracyFigure, ProfileTaskExplorer } from '@/components/notes/SearchEvidenceFigures'
import { SEARCH_EVIDENCE_NOTE as note, SCIENTIFIC_AI_NOTE } from '@/lib/notes'
import '@/styles/notes.css'
import '@/styles/search-evidence-article.css'
import '@/styles/search-evidence-figures.css'

const socialImage = `${note.href}/opengraph-image`

export const metadata: Metadata = {
  title: note.title,
  description: note.description,
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
  return (
    <details id={id} className="research-detour">
      <summary><span><small>A little deeper</small>{title}</span><span className="research-detour-mark" aria-hidden="true">+</span></summary>
      <div className="research-detour-body">{children}</div>
    </details>
  )
}

const chapters = [
  ['the-experiment', 'Study design'], ['model-performance', 'The models'],
  ['task-performance', 'The ten tasks'], ['the-results', 'With and without web'],
  ['backend-followup', 'The follow-up'], ['what-next', 'What next?'],
] as const

export default function SearchEvidenceArticle() {
  return (
    <div className="note-page research-note">
      <nav className="note-navigation" aria-label="Note navigation">
        <Link className="note-wordmark" href="/">Mickey Makhija<span aria-hidden="true">.</span></Link>
        <NoteBackLink />
      </nav>

      <article className="note-article research-article" aria-labelledby="note-title">
        <header className="note-heading research-heading">
          <p className="eyebrow">Thoughts / 03 · Experimental results</p>
          <h1 id="note-title">{note.title}</h1>
          <p className="research-dek">Five model families, 26 model/route/effort profiles and ten tasks. An exploratory comparison with and without web access, followed by a separate retrieval-backend study.</p>
          <div className="note-meta"><span>By Mickey Makhija</span><time dateTime={note.publishedAt}>{note.displayDate}</time><span>{note.readingTime}</span></div>
        </header>

        <div className="research-reader-note"><span className="research-reader-mark" aria-hidden="true">↳</span><p>The main read covers the results and what I think they mean. Open the rabbit holes for individual profiles, methods, traces and costs.</p></div>
        <nav className="research-toc" aria-label="In this article">{chapters.map(([id, label], i) => <a key={id} href={`#${id}`}><span>{String(i + 1).padStart(2, '0')}</span>{label}</a>)}</nav>

        <div className="note-prose research-prose">
          <p>In my <Link href={SCIENTIFIC_AI_NOTE.href}>last note</Link>, I wondered how much better context could do for scientific AI before we fine-tuned anything. I’ve now run a set of models on ten computational biology tasks, first with Python and then with access to methods search and documentation.</p>
          <p>I wanted to know where the models could complete the analysis, where they got stuck, and whether web access changed that. The results vary quite a bit by task. The answer also changes depending on whether I count whole-task passes, valid final answers or individual fields.</p>

          <section id="the-experiment" aria-labelledby="experiment-title">
            <p className="research-section-number">01 / Study design</p>
            <h2 id="experiment-title">Ten tasks, 260 matched settings.</h2>
            <p>I used ten public <a href="https://openai.com/index/introducing-genebench-pro/">GeneBench-Pro</a> tasks. These are synthetic computational biology problems with data to inspect and numerical answers to produce. Looking up a fact is only one possible part of the work. A model still has to decide what the data support, choose an analysis and implement it correctly.</p>
            <p>The main comparison covers <strong>26 model/route/effort profiles across five model families</strong>, each on the same ten tasks. That gives 260 settings, with one Python-only observation and one web-enabled observation per setting: 520 observations. These are ten scientific tasks, not 260 different questions.</p>
            <p>This is an exploratory evaluation. Profiles use different effort budgets and execution routes, and recorded serving-window allowances changed in 189 of the 260 pairs, alongside harness revisions. There is one observation per setting, without matched random seeds. I’m describing these runs, not estimating a causal effect of search or producing a general model ranking.</p>
            <RabbitHole id="protocol" title="What stayed the same, and what didn’t?">
              <p>The saved model families are GPT-6 Astra, GPT-6.1 Sol, Muse Wonder 1.0, Nemotron 3.5 Bolt E4B 4GB and gpt-oss-120b. Astra and Sol each contribute seven profiles, Muse six, and Nemotron and gpt-oss three each. Native modes are product/orchestration configurations, not simply higher API effort levels.</p>
              <p>The main analysis retains all 260 original/web pairs, saved outcome categories, routes, context-change flags and protocol strata. The 100 unsupported Claude settings remained untested; 1,440 planned repeats were cancelled. A separate 16-case schema study and 18 Muse context follow-ups are excluded from these denominators.</p>
              <p>The Exa follow-up reused the original and Luna-backed records for the same 90 Muse/Nemotron settings, then added 90 fresh Exa observations. It did not repeat the other 170 settings.</p>
              <p>The Exa follow-up preserved the task prompts, model/effort settings, data, graders, final-answer schemas and per-case solver limits. Search remained optional: use it when useful. Muse and Nemo received shared search/fetch interfaces. Luna was a helper behind that interface; Exa replaced the search backend. Neither was a native Muse/Nemo browsing tool.</p>
              <p>The recorded solver model IDs were <code>muse-wonder-1.0</code> and <code>nvidia/NVIDIA-Nemotron-3.5-Bolt-E4B-4GB</code>. Muse used six effort settings: Minimal, Low, Medium, High, XHigh and Max. Nemo used thinking budgets of 1,024, 4,096 and 16,384 tokens. These are the saved study configurations, not equivalent compute budgets across providers.</p>
              <p>Exa returned bounded source highlights. Fetch remained the same guarded direct publisher reader, rather than Exa’s contents endpoint. Search was restricted to methods and official documentation. Benchmark papers, task text, solutions, graders and prior responses were excluded.</p>
              <p>The 90 Exa owners came from three preserved versions: 34 v1 settings, two v2 settings and 54 v3 settings. The later 56 used a repaired guard with a common 42-query generic-methods menu. The final 54 also used up to five Muse workers and five shared compute slots. All 30 Nemo settings belong to the earlier stratum. These differences prevent a clean estimate of the backend alone.</p>
              <p>Limits included 20 web calls within 120 total tool calls, a separate 120 model-response limit, 40,000 output tokens per request, 256,000 per run and 60 awake minutes. Python actions retained their 180-second ceiling and four-CPU/16-GiB per-case ceilings. Ceilings were not physical reservations.</p>
              <p>The original no-web runs had narrower serving-context allowances. In the matched 90, 13 original runs ended at a context limit and five at an output limit. I retain those outcomes rather than quietly dropping them. A separate 16-case schema study is outside these comparisons. The proposed 90 directed-search follow-ups were cancelled before invocation; they are not missing results or failures.</p>
            </RabbitHole>
          </section>

          <section id="model-performance" aria-labelledby="models-title">
            <p className="research-section-number">02 / Model performance</p><h2 id="models-title">Performance differed across families and profiles.</h2>
            <p>Across the saved Python-only runs, Astra passed 22 of 70 settings, Sol 18 of 70 and Muse eight of 60. Astra and Sol each pool 50 API settings with 20 native-product settings. Nemotron and gpt-oss had no whole-task passes in their 30 settings each.</p>
            <p>With web access, those counts became <strong>19, 22, 13, one and zero</strong>, respectively. The overall increase hides different directions: Astra’s pooled count fell, while Sol and Muse rose. The figure keeps each denominator visible; the deeper profile view separates effort settings and routes.</p>
            <p>Failure types matter here. gpt-oss had 18 tool/format failures without web and 16 with it. Muse’s original runs included 13 context-limit and five output-limit outcomes, which disappeared in the web condition. More passes can reflect a workflow completing, as well as a change in the analysis.</p>
          </section>
        </div>
        <BaselineModelFigure />
        <div className="note-prose research-prose">
          <RabbitHole id="all-profiles" title="Explore all 26 profiles and 260 paired settings">
            <p>Each profile has ten task settings. These are different configurations, not repeated trials of one question. Provider, harness, format, context and output failures remain distinct from saved scientific misses. Filters change only this view.</p>
            <HistoricalProfileExplorer />
          </RabbitHole>
          <section id="task-performance" aria-labelledby="tasks-title">
            <p className="research-section-number">03 / Task performance</p><h2 id="tasks-title">The task made a substantial difference.</h2>
            <p>Wright–Fisher selection and cis-MVMR accounted for 33 of the 48 Python-only passes. With web access, they accounted for 36 of 55. Roughly two-thirds of the passes came from those two tasks in either condition.</p>
            <p>Four tasks had <strong>zero passes across all 26 profiles in both conditions</strong>: Hi-C loop strength, population sex bias, ambient-state eQTL and inversion expression risk. None of the saved runs met all endpoint criteria on those four tasks.</p>
            <p>The changes were uneven elsewhere. cis-MVMR rose from 13 to 18 passes; Wright–Fisher selection fell from 20 to 18; multiparent QTL fell from seven to six. I’d rather see that pattern than only the combined score. It tells me where to start inspecting the analyses.</p>
          </section>
        </div>
        <TaskPerformanceFigure />
        <div className="note-prose research-prose">
          <section id="the-results" aria-labelledby="results-title">
            <p className="research-section-number">04 / With and without web access</p><h2 id="results-title">Seven more passes, with gains and losses underneath.</h2>
            <p>Across all 260 matched settings, passes went from <strong>48 to 55</strong>. Sixteen settings gained a pass and nine lost one; 39 passed in both conditions.</p>
            <p>Those 16 gains were not all corrections of scientific reasoning. Seven came from previous scientific misses, six from context-limit outcomes, two from harness outcomes and one from a provider failure. Finishing a previously interrupted workflow matters, but it answers a different question from fixing the analysis.</p>
            <p>On the 607 fields graded in both conditions, correct fields fell from <strong>237 to 232</strong>. Meanwhile, field-graded final answers rose from 215 to 234. More complete answers, more whole-task passes and fewer correct shared fields can occur together, because they count different things.</p>
            <p>Search was requested in 112 web-enabled settings. Five of the 16 pass gains were in settings that searched and received documented reference URLs or page content. The other eleven gains made no recorded web calls. Neither group establishes why its outcome changed.</p>
            <RabbitHole id="metrics" title="Endpoint grading, ambiguity and sensitivity checks">
              <p>A whole-task pass requires every required endpoint field to pass the saved grader and the answer to meet the output contract. This checks deterministic endpoints and schema, not the semantic quality of every explanation. A saved scientific-miss label is not a complete expert judgment that an analysis has no merit.</p>
              <p>The common 607-field intersection had 28 gains and 33 losses. Ungraded fields do not enter that intersection; this is not accuracy across every possible answer opportunity. Field-graded finals and parse-valid finals are separate measures.</p>
              <p>Among the 201 pairs with parse-valid, gradeable finals in both conditions, task passes were 47 original and 46 web: 39 retained passes, seven gains and eight losses. This selected subset is a completion sensitivity, not a replacement for the primary 260-setting result.</p>
              <p>The study notes flag ambiguity in carrier risk, cis-MVMR and population sex bias. Keeping all 260 as the primary analysis, a descriptive sensitivity excluding those three tasks leaves 182 settings:34 original passes and 35 web passes, with nine gains and eight losses. That is a sensitivity check, not a replacement result or a newly graded experiment.</p>
              <p>One run per setting does not estimate run-to-run reliability. The profiles also share the same ten tasks, so they are not 260 independent samples from scientific research problems.</p>
            </RabbitHole>
          </section>
          <section id="backend-followup" aria-labelledby="followup-title">
            <p className="research-section-number">05 / Retrieval-backend follow-up</p><h2 id="followup-title">The same 90 Muse/Nemotron settings, with Exa.</h2>
            <p>I then asked whether changing the search backend would help the Muse and Nemotron configurations. In this matched subset, the original runs passed <strong>eight of 90</strong>, Luna-backed search passed <strong>14</strong>, and optional Exa passed <strong>12</strong>. Exa gained four passes and lost six relative to Luna.</p>
            <p>The Exa results stay separate from the original 260-setting web condition. Replacing part of that earlier cohort with whichever backend looks better after seeing the answers would make the comparison difficult to interpret.</p>
          </section>
        </div>

        <OutcomeFigure />

        <div className="note-prose research-prose">
          <p>There is another distinction hiding here. The three conditions produced 70, 86 and 87 parse-valid final answers, respectively. An answer can be complete enough to grade and still miss the saved endpoint criteria. Getting through the workflow and getting the analysis right need to be measured separately.</p>

          <RabbitHole id="search-and-traces" title="Search behavior, source exposure and the public traces">
          <section id="the-searches" aria-labelledby="searches-title">
            <p className="research-section-number">Follow-up / Search behavior</p>
            <h2 id="searches-title">A search button is not a search habit.</h2>
            <p>Exa was requested in <strong>16 of the 90 settings</strong>, compared with 11 for Luna. For Muse, that was 13 of 60 settings; for Nemo, three of 30. Most settings never requested Exa search.</p>
            <p>Those 16 settings executed 28 Exa searches and received 140 bounded excerpt records. Across all 90 Exa runs, <strong>there were zero fetch requests</strong>. The tool was available. The models didn’t ask it to retrieve a page.</p>
            <p>The distinction matters because the search response already included highlights. No fetch does not mean no source exposure. Equally, a highlight does not mean the model read a full paper, understood it, or changed its analysis.</p>
          </section>
            <ToolUseFigure />
          <p>I now want a separate record for each step: was the tool available, was it requested, did the request execute, what evidence came back, and what happened next in the computation? Counting only successful calls loses failures. Counting only citations tells me very little about what the model did with a source.</p>
          <RabbitHole id="request-accounting" title="Why the call counts don’t all match">
            <p>Luna had 34 model-issued search requests, 33 executed requests and 33 physical helper HTTP requests. One request in a batch never executed because the preceding helper request caused a hard fault. It was not an extra backend call, fee or policy rejection.</p>
            <p>There were 31 fee-verified Luna receipts and 38 known-priced built-in search actions. These are different units. Missing fee proof does not turn a real request into “no call.” Luna produced 30 usable reference-feedback calls; its count of verbatim Exa-style excerpts is unknown and not directly comparable to Exa’s 140 records.</p>
            <p>Luna also had eight fetch requests. Five returned bounded source text and three returned UNAVAILABLE. An HTTP response or navigation-heavy snippet is not the same as reading a complete methods section. Exa had 28 issued, executed, physical and fee-verified searches, with no fetch requests.</p>
          </RabbitHole>

          <section id="the-traces" aria-labelledby="traces-title">
            <p className="research-section-number">Follow-up / Trace audit</p>
            <h2 id="traces-title">The new passes hadn’t searched.</h2>
            <p>This was the result that made me pause. <strong>All seven distinct Exa pass gains over the original condition made zero Exa search or fetch requests.</strong> The four gains over Luna were a subset of those seven, not four additional cases.</p>
            <p>Four Exa settings both searched and passed. All four were Wright–Fisher selection settings that already passed in both earlier conditions. I can report more passes than the original arm, but I cannot attribute those new passes to retrieved Exa evidence.</p>
            <p>That does not establish that search was useless. A model may search when it is already struggling. It may receive useful material without turning it into a correct answer. And these were single runs, with the differences in context and execution I mentioned earlier.</p>
            <p>One trace is worth slowing down for. Muse Medium received an excerpt explaining first-order uncertainty propagation. Its next public Python computation propagated measurement variance through transformations and used the result in regression weights. There is a concrete correspondence between delivered methods text and subsequent code.</p>
            <p>But that setting already passed both baselines. The code did not explicitly attribute its choice to the source. I can point to the correspondence; I can’t show that the excerpt caused it. In the other three searched selection passes, the core analysis was already present before search.</p>
            <RabbitHole id="trace-audit" title="How far did the trace review actually go?">
              <ol className="research-timeline">
                <li><strong>Before search:</strong> the Medium selection run’s public Python inspected the files.</li>
                <li><strong>Evidence delivered:</strong> a bounded methods excerpt described first-order/Jacobian propagation of uncertainty.</li>
                <li><strong>Next public computation:</strong> code propagated read-count variance through error correction and a logit transformation, then used regression weights.</li>
                <li><strong>Outcome:</strong> a retained pass. It already passed in both earlier conditions, so this is not a retrieved-evidence pass gain.</li>
              </ol>
              <p>The audit covered all 90 public request/exposure inventories, all seven distinct gain traces, all four searched passes and three representative searched misses. The other nine searched misses received inventory review, not an exhaustive interpretation of method adoption. I am not claiming that none of their sources influenced them.</p>
              <p>This review used public tool requests, delivered feedback and computation records. It did not decode private reasoning. I’m leaving task answers and solution code out of the public data.</p>
            </RabbitHole>
          </section>

          </RabbitHole>

          <RabbitHole id="followup-metrics" title="Follow-up fields, denominators and cost estimates">
          <section id="the-fields" aria-labelledby="fields-title">
            <p className="research-section-number">Follow-up / Individual fields</p>
            <h2 id="fields-title">“Better” depends on what I count.</h2>
            <p>A whole-task pass is deliberately unforgiving: all required targets need to pass the saved grader. Individual fields let me see partial progress. They also introduce a denominator problem when some runs never produce a gradeable final answer.</p>
            <p>On the 249 fields graded in both Luna and Exa, Exa had <strong>85 correct versus Luna’s 77</strong>. On the different 204-field intersection between the original arm and Exa, it had <strong>51 correct versus the original’s 52</strong>.</p>
            <p>So Exa had fewer whole-task passes than Luna, yet more correct shared fields. Against the original arm, it had more whole-task passes, yet one fewer correct shared field. These statements can all be true. They describe different views of the same record.</p>
          </section>
            <FieldAccuracyFigure />
          <RabbitHole id="field-denominators" title="Why 204 fields in one comparison and 249 in another?">
            <p>The 90 settings contain 270 expected field opportunities. The original condition had 212 evaluated fields, Luna 257 and Exa 262. An ungraded field stays ungraded; I don’t replace it with a zero-valued answer.</p>
            <p>The original/Exa intersection contains 204 fields from 67 settings, with 10 field gains and 11 losses. Luna/Exa contains 249 fields from 83 settings, with 21 gains and 13 losses. Neither is an all-90 field-accuracy estimate.</p>
            <p>A sensitivity check keeps only fields graded in all three conditions: 191 fields from 63 settings. Correct counts are 52 original, 45 Luna and 51 Exa. That changes the apparent comparison again. Official invalid-domain values remain evaluated nonpasses; they are excluded from numeric-value plots rather than silently repaired.</p>
            <p>I would report whole-task outcomes, valid-final completion and shared-field correctness together. A single percentage hides too much of this.</p>
          </RabbitHole>
          <RabbitHole id="costs" title="And what did it cost?">
            <p>The matched 90-setting recorded usage estimates were $113.108 original, $164.790 Luna and $188.075 Exa. These are estimates, not invoices or a controlled efficiency comparison. Local Nemo hardware cost is unpriced.</p>
            <p>Exa’s service fees were $0.196; its solver-token estimate was $186.676013. A separate $1.203368 conservative allowance for a failed-request/retry group brings its known recorded total to $188.075381. That allowance is not verified token usage from the failed HTTP response.</p>
            <p>Luna’s solver estimate was $164.382950, plus $0.027471 in settled helper tokens and $0.380 in known search fees. Its separate unresolved helper bound is $1.136144. That bound is not a known charge, and it remains inside the retained historical uncertainty inventory. The original arm also retains a $0.586156 conservative retry allowance.</p>
            <p>Solver usage dominates these totals. Successful token estimates use cache-aware pricing; reasoning tokens are not added a second time to output tokens. Changing concurrency, context, timing and the model’s chosen workflow also changes what a cost comparison means.</p>
          </RabbitHole>

          </RabbitHole>

          <section id="what-next" aria-labelledby="next-title">
            <p className="research-section-number">06 / What I’d test next</p>
            <h2 id="next-title">Start with the failures on each task.</h2>
            <p>What’s clear to me is that a single score misses a lot here. I want the next experiments to address specific failures on each task. I’d compare a model finding evidence for itself with the same model receiving a small, curated evidence pack. I’d also test an explicit search-and-evidence instruction against optional search, under one fixed guard and execution setup.</p>
            <p>That instruction might only produce more calls. I’d want to see whether the model identifies a relevant method, applies it correctly, and improves on fresh cases. The directed-search follow-up discussed during this study was cancelled; it has not answered that question.</p>
            <p>Structured sources such as GWAS Catalog, ClinVar, Open Targets, PDB and Ensembl are another set of experiments, not an interchangeable pile of “more tools.” A variant annotation, a protein structure and a statistical-methods explanation help with different bottlenecks. I’d choose the source for the question, then test what changes when it is removed.</p>
            <p>I’m still curious about fine-tuning, too. These results don’t tell me which tasks a model saw in training, or whether familiarity explains a score. They don’t compare fine-tuning with retrieval. Those remain hypotheses.</p>
            <p><strong>I still think external tools can help. This run makes me pickier about what I count as help.</strong> I want to see what the model asked for, what it received, what changed in the analysis, and whether that change survived evaluation. Otherwise, I am mostly measuring a system that happens to have a search button.</p>
          </section>

          <RabbitHole id="case-explorer" title="Explore the 90-setting follow-up by profile, task and outcome">
            <p>Each profile has ten settings; each task has nine profiles. Explore the saved outcomes below. These are observations from this task set, not a general model ranking. Changing the view does not rerun or regrade anything.</p>
            <ProfileTaskExplorer />
          </RabbitHole>

          <RabbitHole id="data-and-sources" title="Data, definitions and the small print">
            <p><a href="/research/search-evidence-study.json" download>Download the public study data (JSON)</a>. It keeps the main 260 original/web pairs separate from the 90-setting Exa follow-up, including model/profile/task summaries and paired outcome/call-count records. It excludes task solutions, submitted answer values, raw provider payloads, local paths and private reasoning.</p>
            <p>The Exa follow-up was frozen on October 29, 2026, at 08:21:50 UTC. The main original/web source has SHA-256 <code className="research-hash">df499f6f288848cd03635b28577e882098c3c82281ba9ac576d4d793e07b503f</code>. The follow-up’s canonical private analysis has SHA-256 <code className="research-hash">c3f3dad2b4b876db1ee4fca9242baae7ab016e8fd35ea494efad8246462c451b</code>. The public derivative records that source hash and its definitions, rather than exposing the raw archives.</p>
            <p>For the Exa follow-up, separate automated local reviews checked 3,595 metric assertions, 230 trace assertions, 120 accounting assertions and 32 final-report assertions. Those checks reconcile this record. They are not additional benchmark trials, peer review, or evidence that the findings generalize. All 90 optional settings ended, the collection lanes were sealed, cleanup was verified and the monitor was retired.</p>
            <p>The full GeneBench-Pro benchmark has 129 questions; this personal study uses its ten public representative cases. It is not the official benchmark evaluation. The study’s saved model/profile labels are retained in the public data. Cross-provider effort labels are not equivalent compute budgets.</p>
            <ul>
              <li><a href="https://openai.com/index/introducing-genebench-pro/">GeneBench-Pro: benchmark design and public cases</a> — OpenAI.</li>
              <li><a href="/research/search-evidence-study.json">This study’s public data and metric definitions</a> — the source for the figures here.</li>
              <li><Link href={SCIENTIFIC_AI_NOTE.href}>Fine-tuning scientific AI</Link> — the earlier question that led to these runs.</li>
            </ul>
            <p>One observation per setting is not enough to estimate run-to-run reliability. Historical context allowances, repaired query guards, source availability, scheduling and provider timing confound the comparisons. The 56 common-guard pairs are all Muse; every Nemo comparison still crosses guard versions. No causal backend effect, prompting effect, training-membership claim or general model ranking follows from these results.</p>
          </RabbitHole>
        </div>

        <footer className="note-footer research-footer"><NoteBackLink /><a href="#note-title">Back to the beginning ↑</a></footer>
      </article>
    </div>
  )
}
