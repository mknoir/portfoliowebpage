'use client'

import { useId, useState, type CSSProperties, type ReactNode } from 'react'
import { searchEvidenceData as study } from '@/lib/search-evidence-data'

type DisplayCondition = 'original' | 'exa'
type BarRow = { label: string; value: number; condition: DisplayCondition }
const conditions: { id: DisplayCondition; label: string }[] = [
  { id: 'original', label: 'Python only' }, { id: 'exa', label: 'With Exa' },
]
const categories: Record<string, string> = {
  pass: 'Pass', scientific_miss: 'Scientific miss', tool_format: 'Tool / format failure',
  context: 'Context limit', output: 'Output limit', provider: 'Provider error', harness: 'Harness error',
}
const effortOrder = ['Minimal', 'Low', 'Medium', 'High', 'Xhigh', 'Max', 'Ultra']
const profiles = [...study.full260.profiles].sort((a, b) => {
  const family = study.full260.models.findIndex(x => x.label === a.model) - study.full260.models.findIndex(x => x.label === b.model)
  if (family) return family
  if (a.route !== b.route) return a.route === 'API' ? -1 : 1
  if (a.effort.includes('thinking tokens')) return Number(a.effort.replace(/[^0-9]/g, '')) - Number(b.effort.replace(/[^0-9]/g, ''))
  return effortOrder.indexOf(a.effort) - effortOrder.indexOf(b.effort)
})
const exaRows = [...study.rows].sort((a, b) =>
  study.groups.profiles.findIndex(x => x.label === a.profile) - study.groups.profiles.findIndex(x => x.label === b.profile)
  || study.groups.tasks.findIndex(x => x.label === a.task) - study.groups.tasks.findIndex(x => x.label === b.task))

function Figure({ id, number, title, children, caption }: {
  id: string; number: string; title: string; children: ReactNode; caption: ReactNode
}) {
  return <figure className="se-figure re-figure" id={id} aria-labelledby={id + '-title'}>
    <figcaption className="se-figure-heading"><span className="se-figure-number">Fig {number}</span><h3 id={id + '-title'}>{title}</h3></figcaption>
    {children}<p className="se-caption">{caption}</p>
  </figure>
}
function Legend() {
  return <div className="se-legend" aria-label="Conditions">{conditions.map(c => <span key={c.id}><i className={'se-swatch se-' + c.id} aria-hidden="true" />{c.label}</span>)}</div>
}
function Bars({ rows, maximum, unit, denominator }: { rows: BarRow[]; maximum: number; unit: string; denominator?: number }) {
  const accessible = unit + '. ' + rows.map(x => x.label + ': ' + x.value + (denominator ? ' of ' + denominator : '')).join('; ') + '. Axis starts at zero and ends at ' + maximum + '.'
  return <div className="se-bars re-bars" role="img" aria-label={accessible}>
    <div className="se-axis" aria-hidden="true"><span>0</span><span>{maximum / 2}</span><span>{maximum}</span></div>
    {rows.map((row, i) => <div className="se-bar-row" key={row.label + i} aria-hidden="true">
      <span className="se-bar-label">{row.label}</span>
      <div className="se-bar-track"><span className={'se-bar se-' + row.condition} style={{ '--se-width': (row.value / maximum * 100) + '%' } as CSSProperties} /></div>
      <span className="se-bar-value">{row.value}{denominator && <small>/{denominator}</small>}</span>
    </div>)}
  </div>
}
function ExactTable({ label, headers, rows }: { label: string; headers: string[]; rows: (string | number)[][] }) {
  return <details className="se-data"><summary>Exact counts</summary><div className="se-table-scroll" tabIndex={0} role="region" aria-label={label}>
    <table><caption className="se-sr-only">{label}</caption><thead><tr>{headers.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i}>{row.map((value, j) => j === 0 ? <th scope="row" key={j}>{value}</th> : <td key={j}>{value}</td>)}</tr>)}</tbody>
    </table>
  </div></details>
}

export function ReasoningEffortFigure() {
  const native = study.full260.models.filter(model => profiles.some(p => p.model === model.label && p.route === 'Native product'))
  return <Figure id="figure-reasoning-effort" number="01" title="Reasoning effort across the ten tasks" caption={<>Python-only baseline. Each effort or native-mode setting has one observation on each of ten tasks. Effort labels are provider-specific; native modes also change orchestration.</>}>
    <p className="se-chart-unit">Whole-task passes out of 10 · each panel uses the same 0–10 count axis</p>
    <div className="re-effort-grid">{study.full260.models.map(model => <section className="re-effort-panel" key={model.label} aria-label={model.label + ' API effort'}>
      <h4>{model.label}</h4><p className="re-panel-label">{model.label.startsWith('Nemotron') ? 'Local API · thinking-token budget' : 'API · reasoning effort'}</p>
      <Bars rows={profiles.filter(p => p.model === model.label && p.route === 'API').map(p => ({ label: p.effort.replace(' thinking tokens', ''), value: p.originalPasses, condition: 'original' }))} maximum={10} denominator={10} unit={model.label + ', Python-only whole-task passes by API effort'} />
    </section>)}</div>
    <div className="re-native-section"><h4>Native product modes</h4><div className="re-effort-grid">{native.map(model => <section className="re-effort-panel" key={model.label} aria-label={model.label + ' native modes'}>
      <h4>{model.label}</h4><Bars rows={profiles.filter(p => p.model === model.label && p.route === 'Native product').map(p => ({ label: p.effort, value: p.originalPasses, condition: 'original' }))} maximum={10} denominator={10} unit={model.label + ', Python-only whole-task passes by native product mode'} />
    </section>)}</div></div>
    <ExactTable label="Python-only whole-task passes for all 26 profiles" headers={['Model', 'Route', 'Effort / mode', 'Passes', 'Tasks']} rows={profiles.map(p => [p.model, p.route, p.effort, p.originalPasses, p.settings])} />
  </Figure>
}

export function BaselineTaskFigure() {
  return <Figure id="figure-baseline-tasks" number="02" title="Where the baseline passed" caption={<>Python-only observations across all 26 profiles. The five families share these ten tasks; profiles are different configurations rather than independent biological problems.</>}>
    <p className="se-chart-unit">Whole-task passes out of 26 profiles · Python only</p>
    <Bars rows={study.full260.taskGroups.map(t => ({ label: t.label, value: t.originalPasses, condition: 'original' }))} maximum={26} denominator={26} unit="Python-only task passes across 26 profiles" />
    <ExactTable label="Python-only passes by task" headers={['Task', 'Passes', 'Profiles']} rows={study.full260.taskGroups.map(t => [t.label, t.originalPasses, t.settings])} />
  </Figure>
}

export function ExaOutcomeFigure() {
  const transition = study.transitions.original_vs_exa
  return <Figure id="figure-exa-outcomes" number="03" title="The same 90 settings, with Exa search available" caption={<>Matched Muse/Nemotron subset: 60 Muse and 30 Nemotron settings. Both conditions use the same profile/task identities. These 90 baseline observations are a subset of the earlier 260, not an additional baseline cohort.</>}>
    <p className="se-chart-unit">Whole-task passes out of 90 settings per condition</p><Legend />
    <Bars rows={conditions.map(c => ({ label: c.label, value: study.conditions.find(x => x.id === c.id)!.passes, condition: c.id }))} maximum={20} denominator={90} unit="Matched whole-task passes, Python only and Exa" />
    <div className="se-transition-note"><span><strong>{transition.gain}</strong> gained a pass</span><span><strong>{transition.loss}</strong> lost a pass</span><span><strong>{transition.retained_pass}</strong> passed both</span><span><strong>{transition.retained_nonpass}</strong> passed neither</span></div>
    <ExactTable label="Whole-task passes and valid finals in the matched 90" headers={['Condition', 'Settings', 'Task passes', 'Parse-valid finals']} rows={conditions.map(c => { const d = study.conditions.find(x => x.id === c.id)!; return [c.label, d.settings, d.passes, d.official_parse_valid_finals] })} />
    <p className="se-small-note">Parse-valid final answers: 70/90 Python only and 87/90 with Exa. A valid final can still miss the scientific endpoint.</p>
  </Figure>
}

export function ExaToolUseFigure() {
  const d = study.retrieval.exa
  const metrics = [
    { label: 'Settings that searched', value: d.cases_with_model_issued_search_requests, unit: 'of 90 settings' },
    { label: 'Search requests', value: d.model_issued_search_requests, unit: 'model-issued requests' },
    { label: 'Physical searches', value: d.verified_physical_client_search_requests, unit: 'backend HTTP requests' },
    { label: 'Delivered highlights', value: d.delivered_search_excerpt_records, unit: 'bounded excerpt records' },
    { label: 'Fetch requests', value: d.model_issued_fetch_requests, unit: 'model-issued requests' },
  ]
  return <Figure id="figure-exa-tool-use" number="04" title="How much did the models use Exa?" caption={<>Search replies already included source highlights. A delivered excerpt records source exposure; applying it in an analysis requires trace evidence. These are separate units, not stages of a conversion funnel.</>}>
    <div className="re-tool-counts">{metrics.map(m => <section key={m.label} aria-label={m.label + ': ' + m.value + ' ' + m.unit}><strong>{m.value}</strong><h4>{m.label}</h4><p>{m.unit}</p></section>)}</div>
    <ExactTable label="Exa call and evidence inventory" headers={['Measure', 'Count', 'Unit']} rows={[
      ['Settings requesting search',d.cases_with_model_issued_search_requests,'of 90 settings'],['Issued search requests',d.model_issued_search_requests,'model requests'],['Physical searches',d.verified_physical_client_search_requests,'HTTP requests'],['Verified search fee receipts',d.verified_search_fee_receipts,'receipts'],['Delivered highlights',d.delivered_search_excerpt_records,'excerpt records'],['Fetch requests',d.model_issued_fetch_requests,'model requests'],['Fetches returning text',d.verified_direct_fetch_text_calls,'bounded text returns'],['Search UNAVAILABLE',d.search_UNAVAILABLE,'responses'],['Fetch UNAVAILABLE',d.fetch_UNAVAILABLE,'responses'],['Pre-backend blocked requests',d.search_policy_blocked_or_prebackend,'requests'],
    ]} />
  </Figure>
}

export function ExaFieldFigure() {
  const d = study.fieldComparisons.originalExa
  return <Figure id="figure-exa-fields" number="05" title="Accuracy on the same graded fields" caption={<>The intersection contains {d.fields} identical fields graded in both conditions, from {d.settings} settings. Ungraded fields are excluded, while evaluated invalid numeric records remain nonpasses.</>}>
    <p className="se-chart-unit">Correct fields out of {d.fields} · {d.settings} matched settings</p><Legend />
    <Bars rows={[{label:'Python only',value:d.original,condition:'original'},{label:'With Exa',value:d.exa,condition:'exa'}]} maximum={60} denominator={d.fields} unit="Correct shared fields, Python only and Exa" />
    <p className="se-small-note">{d.gains} field gains · {d.losses} field losses</p>
  </Figure>
}

export function BaselineExplorer() {
  const [model, setModel] = useState('')
  const [profile, setProfile] = useState('')
  const [task, setTask] = useState('')
  const id = useId()
  const matchingProfiles = profiles.filter(p => !model || p.model === model)
  const rows = study.full260.rows.filter(r => (!model || r.model === model) && (!profile || r.profile === profile) && (!task || r.task === task))
  return <section className="se-explorer re-explorer" aria-label="Explore the 260 Python-only observations">
    <h3>Inspect the baseline runs</h3>
    <div className="se-pair-filters se-historical-filters">
      <label htmlFor={id + '-model'}>Model family<select id={id + '-model'} value={model} onChange={e => {setModel(e.target.value);setProfile('')}}><option value="">All model families</option>{study.full260.models.map(m => <option key={m.label} value={m.label}>{m.label}</option>)}</select></label>
      <label htmlFor={id + '-profile'}>Reasoning profile<select id={id + '-profile'} value={profile} onChange={e => setProfile(e.target.value)}><option value="">All profiles</option>{matchingProfiles.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}</select></label>
      <label htmlFor={id + '-task'}>Task<select id={id + '-task'} value={task} onChange={e => setTask(e.target.value)}><option value="">All tasks</option>{study.full260.taskGroups.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}</select></label>
      <button type="button" className="se-pair-reset" disabled={!model && !profile && !task} onClick={() => {setModel('');setProfile('');setTask('')}}>Reset baseline filters</button>
    </div>
    <p className="se-pair-count" aria-live="polite">{rows.length} of 260 baseline settings</p>
    <div className="se-table-scroll se-paired-table re-baseline-table" tabIndex={0} role="region" aria-label="Filtered baseline outcomes and recorded configuration">
      <table><caption className="se-sr-only">{rows.length} Python-only outcomes, with route and serving-window metadata</caption><thead><tr><th scope="col">Profile</th><th scope="col">Task</th><th scope="col">Outcome</th><th scope="col">Route</th><th scope="col">Recorded window allowance</th></tr></thead><tbody>{rows.map(r => <tr key={r.profile + r.task}><th scope="row">{r.profile}</th><td>{r.task}</td><td>{categories[r.originalCategory] ?? r.originalCategory}</td><td>{r.originalRoute}</td><td>{r.originalContextWindowTokens === null ? 'Not recorded' : r.originalContextWindowTokens.toLocaleString('en-US')}</td></tr>)}</tbody></table>
    </div>
    {rows.length === 0 && <p role="status" className="se-small-note">No settings match these filters.</p>}
    <p className="se-small-note">Recorded windows are serving allowances, not generated-token counts. Outcomes retain scientific misses, format failures and resource/provider interruptions.</p>
  </section>
}

export function ExaExplorer() {
  const [view, setView] = useState<'profiles' | 'tasks'>('profiles')
  const [profile, setProfile] = useState('')
  const [task, setTask] = useState('')
  const id = useId()
  const groups = view === 'profiles' ? study.groups.profiles : study.groups.tasks
  const rows = exaRows.filter(r => (!profile || r.profile === profile) && (!task || r.task === task))
  return <section className="se-explorer re-explorer" aria-label="Explore the 90 Python-only and Exa pairs">
    <div className="se-explorer-head"><h3>Search results by profile and task</h3><div className="se-view-switch" role="group" aria-label="Group Exa comparison by"><button type="button" aria-pressed={view === 'profiles'} onClick={() => setView('profiles')}>By profile</button><button type="button" aria-pressed={view === 'tasks'} onClick={() => setView('tasks')}>By task</button></div></div>
    <Legend /><div className="se-explorer-groups">{groups.map(g => <section className="se-explorer-group" key={g.label} aria-label={g.label}><h4>{g.label}</h4><Bars rows={conditions.map(c => ({label:c.label,value:g.passes[c.id],condition:c.id}))} maximum={g.settings} denominator={g.settings} unit={g.label + ', whole-task passes'} /></section>)}</div>
    <details className="se-data se-paired-details"><summary>Inspect all 90 matched settings</summary>
      <div className="se-pair-filters"><label htmlFor={id + '-profile'}>Profile<select id={id + '-profile'} value={profile} onChange={e => setProfile(e.target.value)}><option value="">All profiles</option>{study.groups.profiles.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}</select></label><label htmlFor={id + '-task'}>Task<select id={id + '-task'} value={task} onChange={e => setTask(e.target.value)}><option value="">All tasks</option>{study.groups.tasks.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}</select></label><button type="button" className="se-pair-reset" disabled={!profile && !task} onClick={() => {setProfile('');setTask('')}}>Reset Exa filters</button></div>
      <p className="se-pair-count" aria-live="polite">{rows.length} of 90 matched settings</p>
      <div className="se-table-scroll se-paired-table" tabIndex={0} role="region" aria-label="Filtered original and Exa outcomes and Exa requests"><table><caption className="se-sr-only">{rows.length} matched settings, Python-only and Exa outcomes</caption><thead><tr><th scope="col">Profile</th><th scope="col">Task</th><th scope="col">Python-only outcome</th><th scope="col">Exa outcome</th><th scope="col">Exa search requests</th><th scope="col">Exa fetch requests</th></tr></thead><tbody>{rows.map(r => <tr key={r.profile + r.task}><th scope="row">{r.profile}</th><td>{r.task}</td>{conditions.map(c => <td key={c.id}>{categories[r.conditions[c.id].category] ?? r.conditions[c.id].category}</td>)}<td>{r.conditions.exa.issuedSearches}</td><td>{r.conditions.exa.issuedFetches}</td></tr>)}</tbody></table></div>
      {rows.length === 0 && <p role="status" className="se-small-note">No settings match these filters.</p>}
    </details>
  </section>
}
