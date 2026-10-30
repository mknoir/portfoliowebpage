'use client'

import { useId, useState, type ReactNode } from 'react'
import {
  scientificContextData as study, type ContextCondition, type ContextRow,
  type TokenMetric, type ContextOutcome,
} from '@/lib/scientific-context-data'

const integer = (n: number | null) => n === null ? 'Not reported' : n.toLocaleString('en-US')
const money = (n: number | null) => n === null ? 'Unpriced / not reported' : n === 0 ? '$0' : '$' + n.toFixed(n < 1 ? 3 : 2)
const short = (n: number) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'm' : n >= 1000 ? (n / 1000).toFixed(n < 10000 ? 1 : 0) + 'k' : n.toFixed(0)
const effortOrder = ['minimal', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra']
const metricLabels: Record<TokenMetric, string> = { inputTokens: 'Input tokens', outputTokens: 'Output tokens', reasoningTokens: 'Reported reasoning tokens' }
const contextOutcome = (o: ContextOutcome | null) => !o ? 'Not observed' : !o.endpointTypesComplete ? 'Incomplete execution / answer' : o.passed ? 'Scientific hit' : 'Scientific miss'

function Figure({ id, number, title, children, caption }: { id: string; number: string; title: string; children: ReactNode; caption: ReactNode }) {
  return <figure className="se-figure sc-figure" id={id} aria-labelledby={id + '-title'}>
    <figcaption className="se-figure-heading"><span className="se-figure-number">Fig {number}</span><h3 id={id + '-title'}>{title}</h3></figcaption>
    {children}<p className="se-caption">{caption}</p>
  </figure>
}

function ExactTable({ label, headers, rows }: { label: string; headers: string[]; rows: (string | number)[][] }) {
  return <details className="se-data"><summary>Exact values and reported coverage</summary>
    <div className="se-table-scroll" role="region" aria-label={label} tabIndex={0}><table><caption className="se-sr-only">{label}</caption>
      <thead><tr>{headers.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th scope="row" key={j}>{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody>
    </table></div>
  </details>
}

export function ScientificToolsFigure() {
  const [comparison, setComparison] = useState<'luna' | 'exa'>('luna')
  const id = useId()
  const profiles = study.profiles.filter(p => p.conditions[comparison].settings > 0)
  const baseline = profiles.reduce((n, p) => n + p.conditions[comparison].passes, 0)
  const treatment = profiles.reduce((n, p) => n + p.conditions.scientific_context.passes, 0)
  const count = profiles.reduce((n, p) => n + p.conditions[comparison].settings, 0)
  const webLabel = comparison === 'luna' ? 'Web baseline · Luna' : 'Web baseline · Exa'
  return <Figure id="figure-scientific-tools" number="06" title="Web alone, then web plus scientific tools" caption={<>Each row contains the same ten profile/task settings. {comparison === 'luna' ? 'The full 50-setting baseline uses a Luna helper; treatment uses Exa, so the backend also changes.' : 'These 20 settings match the Exa backend family; historical guard, prompt, scheduling and delivery differences remain.'} All observations remain in the denominator, including incomplete executions.</>}>
    <label className="sc-select" htmlFor={id}>Saved web comparison<select id={id} value={comparison} onChange={e => setComparison(e.target.value as 'luna' | 'exa')}><option value="luna">All five profiles · 50 settings · Luna baseline</option><option value="exa">Muse + Nemotron · 20 settings · Exa baseline</option></select></label>
    <p className="sc-comparison-total" aria-live="polite"><span>{webLabel}<strong>{baseline}<small>/{count}</small></strong></span><span aria-hidden="true">→</span><span>Web + scientific tools<strong>{treatment}<small>/{count}</small></strong></span></p>
    <div className="sc-pair-legend"><span><i className="sc-open-dot" />{webLabel}</span><span><i className="sc-solid-dot" />Web + scientific tools</span></div>
    <div className="sc-pairs" role="img" aria-label={profiles.map(p => `${p.model} ${p.effort}: ${p.conditions[comparison].passes} web passes and ${p.conditions.scientific_context.passes} tool passes, each out of ten`).join('; ')}>
      <div className="sc-pair-axis" aria-hidden="true"><span>Passes / 10</span><div>{[0, 2, 4, 6, 8, 10].map(n => <span key={n} style={{ left: n * 10 + '%' }}>{n}</span>)}</div><span /></div>
      {profiles.map(p => { const a = p.conditions[comparison].passes, b = p.conditions.scientific_context.passes
        return <div className="sc-pair-row" key={p.id} aria-hidden="true"><span className="sc-profile-name">{p.model}<small>{p.effort.replace(' thinking tokens', ' thinking')}</small></span><div className="sc-pair-track"><span className="sc-pair-connector" style={{ left: Math.min(a, b) * 10 + '%', width: Math.abs(a - b) * 10 + '%' }} /><i className="sc-pair-point sc-pair-web" style={{ left: a * 10 + '%' }} /><i className="sc-pair-point sc-pair-tools" style={{ left: b * 10 + '%' }} /></div><span className="sc-pair-count">{a} → {b}</span></div>
      })}
    </div>
    <ExactTable label="Paired web and scientific-tool pass counts" headers={['Profile', webLabel, 'Web + tools', 'Settings per condition']} rows={profiles.map(p => [`${p.model} ${p.effort}`, p.conditions[comparison].passes, p.conditions.scientific_context.passes, 10])} />
  </Figure>
}

export function CostReasoningFigure() {
  const [model, setModel] = useState('GPT-6.1 Sol')
  const [measure, setMeasure] = useState<'solverEstimateUsd' | 'outputTokens'>('solverEstimateUsd')
  const [chosen, setChosen] = useState<string | null>(null)
  const id = useId()
  const eligible = study.broadProfiles.filter(p => p.route === 'API' && p.conditions.original.solverEstimateUsd !== null)
  const models = [...new Set(eligible.map(p => p.model))]
  const rows = eligible.filter(p => p.model === model).sort((a, b) => effortOrder.indexOf(a.effort.toLowerCase()) - effortOrder.indexOf(b.effort.toLowerCase()))
  const selected = rows.find(p => p.id === chosen) ?? rows[rows.length - 1]
  const maximum = Math.max(...rows.map(p => p.conditions.original[measure] ?? 0)) * 1.12
  const x = (n: number) => 55 + n / maximum * 470
  const y = (n: number) => 285 - n / 10 * 230
  const xTitle = measure === 'solverEstimateUsd' ? 'Recorded solver estimate across ten settings (USD)' : 'Reported output tokens across ten settings'
  return <Figure id="figure-cost-reasoning" number="07" title="Reasoning effort, recorded cost and task success" caption={<>Original Python-only API sweep; ten settings per point. Select a point or effort to inspect its exact values. Each family has its own x-axis range; the y-axis stays 0–10 passes. Costs are saved solver estimates, exclude retrieval and retain the original execution/failure mix. Missing failed-request usage and unpriced local hardware prevent a complete economic comparison. Native product modes and local Nemotron are excluded from the monetary plot.</>}>
    <div className="sc-controls"><label className="sc-select" htmlFor={id + '-model'}>Model family<select id={id + '-model'} value={model} onChange={e => { setModel(e.target.value); setChosen(null) }}>{models.map(m => <option key={m}>{m}</option>)}</select></label><label className="sc-select" htmlFor={id + '-metric'}>Resource measure<select id={id + '-metric'} value={measure} onChange={e => setMeasure(e.target.value as 'solverEstimateUsd' | 'outputTokens')}><option value="solverEstimateUsd">Estimated solver cost</option><option value="outputTokens">Reported output tokens</option></select></label></div>
    <div className="sc-plot-scroll" role="region" aria-label="Interactive effort and resource scatter plot" tabIndex={0}>
      <svg className="sc-scatter" viewBox="0 0 560 350" role="group" aria-label={`${model}; ${xTitle}; whole-task passes out of ten`}>
        <g className="sc-axes" aria-hidden="true">{[0, 2, 4, 6, 8, 10].map(n => <g key={n}><line x1="55" x2="525" y1={y(n)} y2={y(n)} /><text x="43" y={y(n) + 4} textAnchor="end">{n}</text></g>)}{[0, .25, .5, .75, 1].map(r => <g key={r}><text x={x(maximum * r)} y="309" textAnchor="middle">{measure === 'solverEstimateUsd' ? money(maximum * r) : short(maximum * r)}</text></g>)}<text x="55" y="24">Whole-task passes / 10</text><text x="290" y="340" textAnchor="middle">{xTitle}</text></g>
        {rows.map(p => { const d = p.conditions.original, value = d[measure]; if (value === null) return null
          const active = selected?.id === p.id
          return <g key={p.id} className="sc-interactive-point" role="button" tabIndex={0} aria-pressed={active} aria-label={`${p.model}, ${p.effort}: ${d.passes} passes out of ten, ${measure === 'solverEstimateUsd' ? money(value) : integer(value)} ${measure === 'solverEstimateUsd' ? 'recorded solver estimate' : 'reported output tokens'}`} onMouseEnter={() => setChosen(p.id)} onFocus={() => setChosen(p.id)} onClick={() => setChosen(p.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setChosen(p.id) } }}>
            <circle className="sc-point-target" cx={x(value)} cy={y(d.passes)} r="15" /><circle className={active ? 'sc-data-point sc-data-point-active' : 'sc-data-point'} cx={x(value)} cy={y(d.passes)} r={active ? 7 : 5} />
          </g>
        })}
      </svg>
    </div>
    <div className="sc-effort-choices" role="group" aria-label="Inspect reasoning setting">{rows.map(p => <button key={p.id} type="button" aria-pressed={selected?.id === p.id} onClick={() => setChosen(p.id)}>{p.effort.toLowerCase() === 'xhigh' ? 'XHigh' : p.effort[0].toUpperCase() + p.effort.slice(1)}</button>)}</div>
    {selected && <div className="sc-point-detail" aria-live="polite"><strong>{selected.model} · {selected.effort}</strong><span>{selected.conditions.original.passes}/10 passes</span><span>{money(selected.conditions.original.solverEstimateUsd)} solver estimate</span><span>{integer(selected.conditions.original.outputTokens)} output tokens</span><span>{integer(selected.conditions.original.reasoningTokens)} reported reasoning tokens</span></div>}
    <ExactTable label={`${model} reasoning effort and recorded resource use`} headers={['Effort', 'Passes / 10', 'Solver estimate', 'Input tokens', 'Output tokens', 'Reported reasoning tokens']} rows={rows.map(p => [p.effort, p.conditions.original.passes, money(p.conditions.original.solverEstimateUsd), integer(p.conditions.original.inputTokens), integer(p.conditions.original.outputTokens), integer(p.conditions.original.reasoningTokens)])} />
  </Figure>
}

function quantile(sorted: number[], q: number) {
  const position = (sorted.length - 1) * q, lo = Math.floor(position)
  return sorted[lo] + (sorted[Math.ceil(position)] - sorted[lo]) * (position - lo)
}

export function ContextTokenFigure() {
  const [metric, setMetric] = useState<TokenMetric>('outputTokens')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const id = useId()
  const known = study.rows.filter(r => r.conditions.scientific_context?.[metric] != null)
  const maximum = Math.max(...known.map(r => r.conditions.scientific_context![metric]!)) * 1.08
  const x = (n: number) => 140 + n / maximum * 425
  const selected = known.find(r => r.id === selectedId)
  return <Figure id="figure-context-tokens" number="08" title="The token distribution behind the 50 runs" caption={<>One mark per run with a reported subtotal. Filled circles are hits, open circles scientific misses, crosses incomplete executions/answers. Boxes span the middle 50%; vertical marks show medians, not confidence intervals. Input sums include repeated conversation history. Reasoning tokens are provider-reported subsets of output where available; they are not added on top. Missing failed-request usage stays unknown.</>}>
    <label className="sc-select" htmlFor={id}>Token counter<select id={id} value={metric} onChange={e => {setMetric(e.target.value as TokenMetric);setSelectedId(null)}}>{Object.entries(metricLabels).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label>
    <p className="se-small-note" aria-live="polite">{known.length}/50 settings have a {metric === 'reasoningTokens' ? 'reported reasoning-token' : `reported ${metric === 'inputTokens' ? 'input-token' : 'output-token'}`} subtotal. Missing counters are omitted, not plotted at zero.</p>
    <div className="sc-plot-scroll" role="region" aria-label="Interactive token distributions by profile" tabIndex={0}>
      <svg className="sc-token-plot" viewBox="0 0 610 380" role="group" aria-label={metricLabels[metric] + ' per run by profile'}>
        <g className="sc-axes" aria-hidden="true">{[0, .25, .5, .75, 1].map(r => <g key={r}><line x1={x(maximum * r)} x2={x(maximum * r)} y1="15" y2="320" /><text x={x(maximum * r)} y="345" textAnchor="middle">{short(maximum * r)}</text></g>)}<text x="352" y="373" textAnchor="middle">{metricLabels[metric]} per run</text></g>
        {study.profiles.map((p, index) => { const center = 42 + index * 60, rows = known.filter(r => r.profileId === p.id), values = rows.map(r => r.conditions.scientific_context![metric]!).sort((a, b) => a - b)
          return <g key={p.id}><g aria-hidden="true"><text className="sc-token-name" x="120" y={center - 3} textAnchor="end">{p.model}</text><text className="sc-token-count" x="120" y={center + 13} textAnchor="end">{rows.length}/10 reported</text>{values.length ? <><line className="sc-range" x1={x(values[0])} x2={x(values[values.length - 1])} y1={center} y2={center} /><rect className="sc-iqr" x={x(quantile(values, .25))} y={center - 16} width={Math.max(1, x(quantile(values, .75)) - x(quantile(values, .25)))} height="32" /><line className="sc-median" x1={x(quantile(values, .5))} x2={x(quantile(values, .5))} y1={center - 18} y2={center + 18} /></> : <text className="sc-token-count" x="150" y={center + 4}>Not reported</text>}</g>
            {rows.map((r, j) => { const d = r.conditions.scientific_context!, cx = x(d[metric]!), cy = center + [-9, -4, 1, 6, 11][j % 5], incomplete = !d.endpointTypesComplete
              return <g className="sc-interactive-point" key={r.id} role="button" tabIndex={0} aria-label={`${r.model}, ${r.task}: ${integer(d[metric])} ${metricLabels[metric]}, ${contextOutcome(d)}`} onMouseEnter={() => setSelectedId(r.id)} onFocus={() => setSelectedId(r.id)} onClick={() => setSelectedId(r.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();setSelectedId(r.id)} }}><circle className="sc-point-target" cx={cx} cy={cy} r="9" />{incomplete ? <path className="sc-incomplete-mark" d={`M${cx - 4},${cy - 4}l8,8m-8,0l8,-8`} /> : <circle className={d.passed ? 'sc-run-hit' : 'sc-run-miss'} cx={cx} cy={cy} r={selectedId === r.id ? 6 : 4} />}</g>
            })}
          </g>
        })}
      </svg>
    </div>
    <p className="sc-token-selection" aria-live="polite">{selected ? `${selected.model} · ${selected.task}: ${integer(selected.conditions.scientific_context![metric])} ${metricLabels[metric].toLowerCase()} · ${contextOutcome(selected.conditions.scientific_context)}` : 'Select a mark to inspect the task, reported token subtotal and completion status.'}</p>
    <ExactTable label="Scientific-tool profiles and reported token subtotals" headers={['Profile / effort', 'Input tokens', 'Output tokens', 'Reported reasoning tokens', 'Known solver estimate', 'Exa fees', 'Closed unknown bound']} rows={study.profiles.map(p => [`${p.model} ${p.effort}`, integer(p.conditions.scientific_context.inputTokens), integer(p.conditions.scientific_context.outputTokens), integer(p.conditions.scientific_context.reasoningTokens), money(p.conditions.scientific_context.solverEstimateUsd), '$' + p.contextExaFeeUsd.toFixed(3), '$' + p.contextClosedUnknownBoundUsd.toFixed(6)])} />
  </Figure>
}

export function ContextExplorer() {
  const [profile, setProfile] = useState('')
  const [condition, setCondition] = useState<ContextCondition>('scientific_context')
  const id = useId()
  const rows: ContextRow[] = study.rows.filter(r => (!profile || r.profileId === profile) && r.conditions[condition])
  return <section className="se-explorer sc-explorer" aria-label="Inspect the scientific-tool comparison and usage">
    <h3>Inspect the runs and reported usage</h3><div className="sc-controls"><label className="sc-select" htmlFor={id + '-condition'}>Condition<select id={id + '-condition'} value={condition} onChange={e => setCondition(e.target.value as ContextCondition)}><option value="scientific_context">Web + scientific tools</option><option value="luna">Web baseline · Luna</option><option value="exa">Web baseline · Exa (20 settings)</option><option value="original">Python-only background</option></select></label><label className="sc-select" htmlFor={id + '-profile'}>Profile<select id={id + '-profile'} value={profile} onChange={e => setProfile(e.target.value)}><option value="">All five profiles</option>{study.profiles.map(p => <option key={p.id} value={p.id}>{p.model} · {p.effort}</option>)}</select></label></div>
    <p className="se-pair-count" aria-live="polite">{rows.length} observed settings in this view</p><div className="se-table-scroll se-paired-table" role="region" aria-label="Filtered outcomes, token counters and solver estimates" tabIndex={0}><table><caption className="se-sr-only">Saved outcomes with separate endpoint completeness; token sums cover reported replies only</caption><thead><tr>{['Profile / effort', 'Task', 'Answer / execution', 'Saved outcome', 'Input tokens', 'Output tokens', 'Reasoning tokens', 'Solver estimate'].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map(r => { const d = r.conditions[condition]!
      return <tr key={r.id}><th scope="row">{r.model} · {r.effort}</th><td>{r.task}</td><td>{contextOutcome(d)}</td><td>{d.rawOutcome.replaceAll('_', ' ')}</td><td>{integer(d.inputTokens)}</td><td>{integer(d.outputTokens)}</td><td>{integer(d.reasoningTokens)}</td><td>{money(d.solverEstimateUsd)}</td></tr>
    })}</tbody></table></div>
    {!rows.length && <p role="status" className="se-small-note">No archived observations match this profile and condition.</p>}
    <p className="se-small-note">Original outcome labels are retained. The separate completeness column uses required public field types and finite numbers; it never filters out a finite but wrong scientific estimate. Input sums include replayed history. Unknown failed-request usage and retrieval fees are outside these per-run solver subtotals. Nemotron’s local hardware is unpriced.</p>
  </section>
}
