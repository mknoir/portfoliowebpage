import { ImageResponse } from 'next/og'

export const alt = 'Evaluating Scientific AI on Ten Public GeneBench-Pro Tasks: reasoning effort, web search and scientific tools, with token use and estimated costs.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#f5f2e9', color: '#23251f', padding: '60px 70px', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 19, color: '#59604e' }}><span>MICKEY MAKHIJA · THOUGHTS / 03</span><span>mknoir.com</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 990 }}><div style={{ fontSize: 59, lineHeight: 1.1, letterSpacing: '-2px' }}>Evaluating Scientific AI on Ten Public GeneBench-Pro Tasks</div><div style={{ fontSize: 25, lineHeight: 1.4, color: '#586c42', marginTop: 22 }}>Reasoning effort. Web search. Scientific tools.</div></div>
      <div style={{ display: 'flex', fontSize: 22, color: '#59604e' }}>Task outcomes · Token use · Estimated costs</div>
    </div>, size,
  )
}
