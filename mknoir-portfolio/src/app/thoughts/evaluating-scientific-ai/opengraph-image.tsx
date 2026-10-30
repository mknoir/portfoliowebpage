import { ImageResponse } from 'next/og'

export const alt = 'Evaluating Scientific AI on Ten Public GeneBench-Pro Tasks. Reasoning effort first, then web search: 8 Python-only passes and 12 Exa passes across 90 matched Muse and Nemotron settings.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#f5f2e9', color: '#23251f', padding: '60px 70px', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 19, color: '#59604e' }}><span>MICKEY MAKHIJA · THOUGHTS / 03</span><span>mknoir.com</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 990 }}><div style={{ fontSize: 59, lineHeight: 1.1, letterSpacing: '-2px' }}>Evaluating Scientific AI on Ten Public GeneBench-Pro Tasks</div><div style={{ fontSize: 25, lineHeight: 1.4, color: '#586c42', marginTop: 22 }}>Reasoning effort first. Then web search.</div></div>
      <div style={{ display: 'flex', gap: 52, alignItems: 'flex-end' }}>
        {[['Python only', 8, '#788595'], ['Exa search', 12, '#167b77']].map(([label, count, color]) => <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 45, fontWeight: 700, color: String(color) }}>{count}</span><span style={{ fontSize: 22 }}>{label}</span></div>)}
        <span style={{ fontSize: 18, color: '#59604e', marginLeft: 'auto', marginBottom: 9 }}>passes / 90 Muse + Nemotron settings</span>
      </div>
    </div>, size,
  )
}
