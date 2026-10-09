import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

export async function GET() {
  const [font, portrait] = await Promise.all([
    readFile(join(process.cwd(), 'src/app/fonts/SpaceGrotesk-Medium.ttf')),
    readFile(join(process.cwd(), 'public/avatar.jpg')),
  ])
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#f7f7f2', color: '#202b26', padding: '70px 80px', fontFamily: 'Space', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontSize: 22, marginBottom: 35, color: '#626d65' }}>Mickey Makhija · mknoir.com</div>
        <div style={{ display: 'flex', fontSize: 85, letterSpacing: '-5px', lineHeight: 1.08 }}>Biology.</div>
        <div style={{ display: 'flex', fontSize: 85, letterSpacing: '-5px', lineHeight: 1.08 }}>Robotics.</div>
        <div style={{ display: 'flex', fontSize: 85, letterSpacing: '-5px', lineHeight: 1.08, color: '#315842' }}>Intelligence.</div>
        <div style={{ display: 'flex', fontSize: 20, marginTop: 35 }}>A scientist. A builder. Always curious.</div>
      </div>
      {/* A plain image is required by the ImageResponse renderer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/jpeg;base64,${portrait.toString('base64')}`} width="230" height="230" alt="" style={{ borderRadius: 115 }} />
    </div>,
    { width: 1200, height: 630, fonts: [{ name: 'Space', data: font, weight: 500, style: 'normal' }] },
  )
}
