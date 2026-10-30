'use client'

import { useId, useState, type CSSProperties, type ReactNode } from 'react'
import { searchEvidenceData as study } from '@/lib/search-evidence-data'

type Condition = 'original' | 'luna' | 'exa'
type BarRow = { label: string; value: number; condition: Condition }

const conditions: { id: Condition; label: string }[] = [
  { id: 'original', label: 'No web' },
  { id: 'luna', label: 'Luna helper' },
  { id: 'exa', label: 'Exa' },
]

const outcomeLabels: Record<string, string> = {
  pass: 'Pass',
  scientific_miss: 'Scientific miss',
  tool_format: 'Tool / format failure',
  context: 'Context-censored',
  output: 'Output-censored',
  provider: 'Provider error',
  harness: 'Harness error',
}

const pairedSettings = [...study.rows].sort((a, b) => {
  const profileDifference = study.groups.profiles.findIndex(x => x.label === a.profile) - study.groups.profiles.findIndex(x => x.label === b.profile)
  return profileDifference || study.groups.tasks.findIndex(x => x.label === a.task) - study.groups.tasks.findIndex(x => x.label === b.task)
})

function Figure({ id, number, title, children, caption }: {
  id: string; number: string; title: string; children: ReactNode; caption: ReactNode
}) {
  return (
    <figure className="se-figure" id={id} aria-labelledby={`${id}-title`}>
      <figcaption className="se-figure-heading">
        <span className="se-figure-number">Fig {number}</span>
        <h3 id={`${id}-title`}>{title}</h3>
      </figcaption>
      {children}
      <p className="se-caption">{caption}</p>
    </figure>
  )
}

function Legend({ original = true }: { original?: boolean }) {
  return <div className="se-legend" aria-label="Conditions">
    {conditions.filter(x => original || x.id !== 'original').map(x =>
      <span key={x.id}><i className={`se-swatch se-${x.id}`} aria-hidden="true" />{x.label}</span>)}
  </div>
}

function Bars({ rows, maximum, unit }: { rows: BarRow[]; maximum: number; unit: string }) {
  return <div className="se-bars" role="img" aria-label={`${unit}. ${rows.map(x => `${x.label}: ${x.value}`).join('; ')}. Axis starts at zero and ends at ${maximum}.`}>
    <div className="se-axis" aria-hidden="true"><span>0</span><span>{maximum / 2}</span><span>{maximum}</span></div>
    {rows.map((x, index) => <div className="se-bar-row" key={`${x.label}-${index}`} aria-hidden="true">
      <span className="se-bar-label">{x.label}</span>
      <div className="se-bar-track"><span className={`se-bar se-${x.condition}`} style={{ '--se-width': `${(x.value / maximum) * 100}%` } as CSSProperties} /></div>
      <span className="se-bar-value">{x.value}</span>
    </div>)}
  </div>
}

function DataTable({ label, headers, rows }: { label: string; headers: string[]; rows: (string | number)[][] }) {
  return <details className="se-data">
    <summary>Exact counts &amp; definitions</summary>
    <div className="se-table-scroll" tabIndex={0} role="region" aria-label={label}>
      <table><caption className="se-sr-only">{label}</caption>
        <thead><tr>{headers.map(x => <th scope="col" key={x}>{x}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th scope="row" key={j}>{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  </details>
}

function HistoricalLegend() {
  return <div className="se-legend" aria-label="Historical 260 conditions">
    <span><i className="se-swatch se-original" aria-hidden="true" />No web</span>
    <span><i className="se-swatch se-luna" aria-hidden="true" />Original web</span>
  </div>
}

export function BaselineModelFigure() {
  return <Figure id="figure-baseline-models" number="01" title="Five model families across the ten tasks" caption={<>Original no-web versus original web outcomes in the historical 260-setting cohort. Families retain saved source order, not performance order. Totals pool unequal profile counts, API/native routes, context allowances and compute. These are selected-setting counts, not a controlled leaderboard.</>}>
    <HistoricalLegend />
    <div className="se-historical-groups">{study.full260.models.map(model => <section className="se-historical-group" key={model.label} aria-label={model.label}>
      <h4>{model.label}</h4><p className="se-panel-kicker">{model.profiles} profile strata · {model.settings} settings</p>
      <Bars rows={[{label:'No web',value:model.originalPasses,condition:'original'},{label:'Original web',value:model.webPasses,condition:'luna'}]} maximum={30} unit={`${model.label}: whole-task passes out of ${model.settings} settings; axis is pass count`} />
    </section>)}</div>
    <DataTable label="Historical 260 whole-task passes by saved model family" headers={['Model family','Profile strata','Paired settings','No web passes','Original web passes','Gains','Losses']} rows={study.full260.models.map(x => [x.label,x.profiles,x.settings,`${x.originalPasses} / ${x.settings}`,`${x.webPasses} / ${x.settings}`,x.gains,x.losses])} />
    <p className="se-small-note">One saved observation per profile/task/condition. Reasoning levels and native/API profiles are distinct strata, not replicate trials or matched compute budgets.</p>
  </Figure>
}

export function TaskPerformanceFigure() {
  return <Figure id="figure-task-performance" number="02" title="The task mattered as much as the aggregate" caption={<>Each task has 26 profile strata, not 26 repeat trials of a single model. All settings remain in their denominators, including provider, harness, format and resource outcomes. Four tasks had zero whole-task passes in both conditions. Context and implementation changes prevent attributing these paired differences to search alone.</>}>
    <p className="se-chart-unit">Whole-task passes · out of 26 profile strata per task</p>
    <HistoricalLegend />
    <div className="se-historical-groups se-task-groups">{study.full260.taskGroups.map(task => <section className="se-historical-group" key={task.label} aria-label={task.label}>
      <h4>{task.label}</h4>
      <Bars rows={[{label:'No web',value:task.originalPasses,condition:'original'},{label:'Original web',value:task.webPasses,condition:'luna'}]} maximum={26} unit={`${task.label}: whole-task passes out of 26 profile strata`} />
    </section>)}</div>
    <DataTable label="Historical 260 whole-task passes by task" headers={['Task','Profile strata','No web passes','Original web passes','Gains','Losses']} rows={study.full260.taskGroups.map(x => [x.label,x.settings,x.originalPasses,x.webPasses,x.gains,x.losses])} />
  </Figure>
}

export function OutcomeFigure() {
  return <Figure id="figure-outcomes" number="03" title="The same 90 settings, three different conditions" caption={<>Whole-task passes across 60 Muse and 30 Nemo settings. The earlier 260-setting comparison is a separate population, shown below. These historical reruns do not isolate a causal search effect.</>}>
    <p className="se-chart-unit">Whole-task passes · out of 90 settings per condition</p>
    <Bars rows={conditions.map(x => ({ label: x.label, value: study.conditions.find(c => c.id === x.id)!.passes, condition: x.id }))} maximum={16} unit="Whole-task passes out of 90 settings per condition" />
    <div className="se-transition-note">
      <span><strong>4</strong> gains vs Luna</span><span><strong>6</strong> losses vs Luna</span>
      <span><strong>8</strong> passed both</span><span><strong>72</strong> passed neither</span>
    </div>
    <DataTable label="Whole-task passes and official parse-valid finals, same 90 settings" headers={['Condition', 'Settings', 'Whole-task passes', 'Parse-valid finals']} rows={study.conditions.map(x => [x.label,90,x.passes,x.official_parse_valid_finals])} />
    <details className="se-data se-earlier-study">
      <summary>The earlier, broader 260-setting comparison</summary>
      <p className="se-small-note">This is the earlier cohort across all included models and profiles. It is not another denominator for the Muse/Nemo 90 rerun.</p>
      <Bars rows={[{ label: 'No web', value:48, condition:'original' },{ label: 'Luna-backed web', value:55, condition:'luna' }]} maximum={60} unit="Earlier 260-setting cohort: whole-task passes" />
      <p className="se-small-note">16 gains, 9 losses, net +7 passes. Those transitions alone do not identify which component caused a change.</p>
    </details>
  </Figure>
}

const toolMetrics = [
  { label: 'Settings that searched', unit: 'of 90 settings', luna:11, exa:16, maximum:20 },
  { label: 'Issued search requests', unit: 'model requests', luna:34, exa:28, maximum:36 },
  { label: 'Executed / physical searches', unit: 'backend requests', luna:33, exa:28, maximum:36 },
  { label: 'Fetch requests', unit: 'model requests', luna:8, exa:0, maximum:10 },
  { label: 'Fetches returning bounded text', unit: 'complete HTTP200 returns', luna:5, exa:0, maximum:10 },
]

export function ToolUseFigure() {
  return <Figure id="figure-tool-use" number="04" title="More settings searched. None of the Exa runs fetched." caption={<>Each row uses its own labeled scale and unit; this is not a conversion funnel. Exa delivered 140 highlight records across its 28 searches. Luna’s comparable verbatim-excerpt count is unmeasured, not zero. A delivered excerpt does not establish that the model used it.</>}>
    <Legend original={false} />
    <div className="se-tool-metrics">{toolMetrics.map(x => <section key={x.label} className="se-tool-metric" aria-label={x.label}>
      <div className="se-metric-label"><h4>{x.label}</h4><span>{x.unit}</span></div>
      <Bars rows={[{label:'Luna helper',value:x.luna,condition:'luna'},{label:'Exa',value:x.exa,condition:'exa'}]} maximum={x.maximum} unit={`${x.label}, ${x.unit}`} />
    </section>)}</div>
    <DataTable label="Search requests, physical delivery and evidence exposure in the 90-setting cohort" headers={['Measure', 'Luna helper', 'Exa']} rows={[
      ['Settings requesting search',11,16],['Model-issued search requests',34,28],['Executed broker searches',33,28],['Physical backend requests',33,28],['Unexecuted requests after fault',1,0],['Blocked before backend',0,0],['Fee-verified receipts',31,28],['Known priced built-in search actions',38,'Not applicable'],['Search feedback calls with usable references',30,28],['Delivered verbatim highlight records','Unknown / not comparable',140],['Fetch requests',8,0],['Fetches returning bounded text',5,0],['Fetch UNAVAILABLE responses',3,0],['Search UNAVAILABLE responses',1,0],
    ]} />
    <p className="se-small-note">One Luna request was emitted but never executed after the preceding helper fault. Its 31 fee-verified receipts and 38 known built-in actions are separate accounting units from its 33 physical helper requests.</p>
  </Figure>
}

export function FieldAccuracyFigure() {
  return <Figure id="figure-field-accuracy" number="05" title="The field-level answer changes with the comparison" caption={<>Only identical fields officially graded in both named conditions enter each panel. The panels use different intersections, not a common denominator of90 settings. Ungraded fields are absent; official invalid-domain fields remain evaluated nonpasses.</>}>
    <div className="se-field-panels">
      <section aria-label="No-web and Exa common fields">
        <p className="se-panel-kicker">204 common fields · 67 settings</p>
        <Bars rows={[{label:'No web',value:52,condition:'original'},{label:'Exa',value:51,condition:'exa'}]} maximum={90} unit="Correct fields in the 204-field original/Exa intersection" />
        <p className="se-small-note">10 fields gained · 11 lost</p>
      </section>
      <section aria-label="Luna and Exa common fields">
        <p className="se-panel-kicker">249 common fields · 83 settings</p>
        <Bars rows={[{label:'Luna helper',value:77,condition:'luna'},{label:'Exa',value:85,condition:'exa'}]} maximum={90} unit="Correct fields in the 249-field Luna/Exa intersection" />
        <p className="se-small-note">21 fields gained · 13 lost</p>
      </section>
    </div>
    <DataTable label="Common-field accuracy intersections" headers={['Intersection', 'Settings', 'Fields', 'No web correct', 'Luna correct', 'Exa correct']} rows={[
      ['No web ↔ Exa',67,204,52,'Not in this pair',51],['Luna ↔ Exa',83,249,'Not in this pair',77,85],['All three',63,191,52,45,51],
    ]} />
    <p className="se-small-note">Sensitivity check: across the same 191 fields from 63 settings graded in all three conditions, the correct counts are 52 no web, 45 Luna and 51 Exa.</p>
  </Figure>
}

export function ProfileTaskExplorer() {
  const [view, setView] = useState<'profiles' | 'tasks'>('profiles')
  const [pairProfile, setPairProfile] = useState('')
  const [pairTask, setPairTask] = useState('')
  const pairFilterId = useId()
  const groups = view === 'profiles' ? study.groups.profiles : study.groups.tasks
  const denominator = view === 'profiles' ? 10 : 9
  const matchingPairs = pairedSettings.filter(x => (!pairProfile || x.profile === pairProfile) && (!pairTask || x.task === pairTask))
  return <section className="se-explorer" aria-label="Explore pass counts by profile or task">
    <div className="se-explorer-head">
      <h3>Where did the passes occur?</h3>
      <div className="se-view-switch" role="group" aria-label="Group results by">
        <button type="button" aria-pressed={view === 'profiles'} onClick={() => setView('profiles')}>By profile</button>
        <button type="button" aria-pressed={view === 'tasks'} onClick={() => setView('tasks')}>By task</button>
      </div>
    </div>
    <p className="se-small-note">{view === 'profiles' ? 'Each profile has 10 task settings. Profiles retain their preset effort/token order.' : 'Each task has 9 profile settings. Task names describe the analysis, without exposing benchmark answers.'} One observation per setting; this is not a model ranking.</p>
    <Legend />
    <div className="se-explorer-groups" aria-live="polite">{groups.map(group => <section key={group.label} className="se-explorer-group" aria-label={group.label}>
      <h4>{group.label}</h4><Bars rows={conditions.map(x => ({label:x.label,value:group.passes[x.id],condition:x.id}))} maximum={denominator} unit={`${group.label}: whole-task passes out of ${denominator}`} />
    </section>)}</div>
    <DataTable label={`Pass counts by${view === 'profiles' ? ' profile' : ' task'}`} headers={[view === 'profiles' ? 'Profile' : 'Task','Settings','No web passes','Luna passes','Exa passes']} rows={groups.map(x => [x.label,x.settings,x.passes.original,x.passes.luna,x.passes.exa])} />
    <details className="se-data se-paired-details">
      <summary>Inspect all 90 paired settings</summary>
      <p className="se-small-note">Choose a profile, a task, or both. These filters affect only this table. Outcomes retain scientific misses, format failures and resource/provider categories; they are not all labeled scientific failures.</p>
      <div className="se-pair-filters">
        <label htmlFor={`${pairFilterId}-profile`}>Profile
          <select id={`${pairFilterId}-profile`} value={pairProfile} onChange={event => setPairProfile(event.target.value)}>
            <option value="">All profiles</option>
            {study.groups.profiles.map(x => <option key={x.label} value={x.label}>{x.label}</option>)}
          </select>
        </label>
        <label htmlFor={`${pairFilterId}-task`}>Task
          <select id={`${pairFilterId}-task`} value={pairTask} onChange={event => setPairTask(event.target.value)}>
            <option value="">All tasks</option>
            {study.groups.tasks.map(x => <option key={x.label} value={x.label}>{x.label}</option>)}
          </select>
        </label>
        <button type="button" className="se-pair-reset" disabled={!pairProfile && !pairTask} onClick={() => { setPairProfile(''); setPairTask('') }}>Reset filters</button>
      </div>
      <p className="se-pair-count" aria-live="polite">{matchingPairs.length} of 90 matched settings · preset profile and task order</p>
      <div className="se-table-scroll se-paired-table" tabIndex={0} role="region" aria-label="Paired outcomes and Exa requests, filtered locally">
        <table>
          <caption className="se-sr-only">{matchingPairs.length} of 90 matched settings: original, Luna and Exa outcomes with model-issued Exa search and fetch request counts</caption>
          <thead><tr><th scope="col">Profile</th><th scope="col">Task</th><th scope="col">Original outcome</th><th scope="col">Luna outcome</th><th scope="col">Exa outcome</th><th scope="col">Exa search requests</th><th scope="col">Exa fetch requests</th></tr></thead>
          <tbody>{matchingPairs.map(x => <tr key={`${x.profile}-${x.task}`}>
            <th scope="row">{x.profile}</th><td>{x.task}</td>
            {conditions.map(condition => <td key={condition.id}>{outcomeLabels[x.conditions[condition.id].category] ?? x.conditions[condition.id].category}</td>)}
            <td>{x.conditions.exa.issuedSearches}</td><td>{x.conditions.exa.issuedFetches}</td>
          </tr>)}</tbody>
        </table>
      </div>
      {matchingPairs.length === 0 && <p className="se-small-note" role="status">No settings match these filters. Reset the filters to inspect all 90 settings.</p>}
    </details>
    <p className="se-small-note"><a href="/research/search-evidence-study.json" download>Download the public study data (JSON)</a>. Aggregates and 90 outcome/call-count records; no benchmark answer values or raw transcripts.</p>
  </section>
}

export function HistoricalProfileExplorer() {
  const [model, setModel] = useState('')
  const [profile, setProfile] = useState('')
  const [task, setTask] = useState('')
  const filterId = useId()
  const profiles = study.full260.profiles.filter(x => !model || x.model === model)
  const matchingRows = study.full260.rows.filter(x => (!model || x.model === model) && (!profile || x.profile === profile) && (!task || x.task === task))
  const formatWindow = (value: number | null) => value === null ? 'Not recorded' : value.toLocaleString('en-US')
  return <section className="se-explorer" aria-label="Inspect the historical 260 paired settings">
    <h3>All 260 historical profile/task pairs</h3>
    <p className="se-small-note">This table belongs to the original no-web/web comparison across 26 saved profile strata. It is separate from the90-setting Exa rerun. Fixed source order is retained; changing these controls affects only this table.</p>
    <div className="se-pair-filters se-historical-filters">
      <label htmlFor={`${filterId}-model`}>Model family
        <select id={`${filterId}-model`} value={model} onChange={event => { setModel(event.target.value); setProfile('') }}>
          <option value="">All model families</option>
          {study.full260.models.map(x => <option key={x.label} value={x.label}>{x.label}</option>)}
        </select>
      </label>
      <label htmlFor={`${filterId}-profile`}>Saved profile stratum
        <select id={`${filterId}-profile`} value={profile} onChange={event => setProfile(event.target.value)}>
          <option value="">All profiles</option>
          {profiles.map(x => <option key={x.label} value={x.label}>{x.label}</option>)}
        </select>
      </label>
      <label htmlFor={`${filterId}-task`}>Task
        <select id={`${filterId}-task`} value={task} onChange={event => setTask(event.target.value)}>
          <option value="">All tasks</option>
          {study.full260.taskGroups.map(x => <option key={x.label} value={x.label}>{x.label}</option>)}
        </select>
      </label>
      <button type="button" className="se-pair-reset" disabled={!model && !profile && !task} onClick={() => { setModel(''); setProfile(''); setTask('') }}>Reset 260 filters</button>
    </div>
    <p className="se-pair-count" aria-live="polite">{matchingRows.length} of 260 historical settings · 26 profile strata × 10 tasks</p>
    <div className="se-table-scroll se-paired-table se-historical-table" tabIndex={0} role="region" aria-label="Historical 260 outcomes, routes and context metadata, filtered locally">
      <table>
        <caption className="se-sr-only">{matchingRows.length} of 260 paired settings, retaining original/web outcomes, routes and context-window metadata</caption>
        <thead><tr><th scope="col">Saved profile stratum</th><th scope="col">Task</th><th scope="col">No-web outcome</th><th scope="col">Original-web outcome</th><th scope="col">Original route</th><th scope="col">Web route</th><th scope="col">Original window metadata</th><th scope="col">Web window metadata</th><th scope="col">Window metadata changed?</th></tr></thead>
        <tbody>{matchingRows.map(x => <tr key={`${x.profile}-${x.task}`}>
          <th scope="row">{x.profile}</th><td>{x.task}</td>
          <td>{outcomeLabels[x.originalCategory] ?? x.originalCategory}</td><td>{outcomeLabels[x.webCategory] ?? x.webCategory}</td>
          <td>{x.originalRoute}</td><td>{x.webRoute}</td><td>{formatWindow(x.originalContextWindowTokens)}</td><td>{formatWindow(x.webContextWindowTokens)}</td><td>{x.servingWindowChanged === true ? 'Changed' : x.servingWindowChanged === false ? 'Unchanged' : 'Unknown'}</td>
        </tr>)}</tbody>
      </table>
    </div>
    {matchingRows.length === 0 && <p className="se-small-note" role="status">No settings match these filters. Reset 260 filters to inspect every paired setting.</p>}
    <p className="se-small-note">Window metadata records the saved applied serving-window allowance, not generated tokens, identical native-product contexts or equal compute. The public data retain native-window observation flags and legacy host-sleep/overlap annotation flags. API and native-product rows remain distinct.</p>
    <p className="se-small-note"><a href="/research/search-evidence-study.json" download>Download the public study data (JSON)</a>: a separate full260 object and the original 90-setting Exa comparison, without answers or raw transcripts.</p>
  </section>
}
