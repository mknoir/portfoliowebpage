import { ImageResponse } from 'next/og'

export const alt = 'Evaluating Scientific AI on Ten Public GeneBench-Pro Tasks. 260 matched settings: 48 Python-only passes and 55 web-enabled passes.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#f5f2e9', color: '#23251f', padding: '60px 70px', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 19, color: '#59604e' }}><span>MICKEY MAKHIJA · THOUGHTS / 03</span><span>mknoir.com</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 990 }}><div style={{ fontSize: 59, lineHeight: 1.1, letterSpacing: '-2px' }}>Evaluating Scientific AI on Ten Public GeneBench-Pro Tasks</div><div style={{ fontSize: 25, lineHeight: 1.4, color: '#586c42', marginTop: 22 }}>Model performance with and without web access</div></div>
      <div style={{ display: 'flex', gap: 52, alignItems: 'flex-end' }}>
        {[['Python only', 48, '#788595'], ['Web enabled', 55, '#167b77']].map(([label, count, color]) => <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 45, fontWeight: 700, color: String(color) }}>{count}</span><span style={{ fontSize: 22 }}>{label}</span></div>)}
        <span style={{ fontSize: 18, color: '#59604e', marginLeft: 'auto', marginBottom: 9 }}>passes / 260 matched settings</span>
      </div>
    </div>, size,
  )
}
