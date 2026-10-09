import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AppearanceProvider } from '@/components/appearance-provider'
import { APPEARANCE_BOOTSTRAP } from '@/lib/appearance'
import { ExperienceRouter } from '@/components/ExperienceRouter'
import '@/styles/appearances.css'

const spaceGrotesk = localFont({ src: './fonts/SpaceGrotesk-Variable.woff2', variable: '--font-space-grotesk', weight: '300 700', display: 'swap' })
const satoshi = localFont({ src: './fonts/Satoshi-Variable.woff2', variable: '--font-satoshi', weight: '300 900', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mknoir.com'),
  title: { default: 'Mickey Makhija — Biology, Robotics & Intelligence', template: '%s | Mickey Makhija' },
  description: 'Scientist, builder, and endlessly curious. Exploring biology, robotics, and intelligence through scientific software, lab automation, and personal experiments.',
  openGraph: { type: 'website', siteName: 'Mickey Makhija', title: 'Mickey Makhija — Biology, Robotics & Intelligence', description: 'A collection of things I build, systems I explore, and thoughts along the way.', images: [{ url: '/social-preview', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/social-preview'] },
  icons: { icon: '/mklogo.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-appearance="field" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOTSTRAP }} /></head>
      <body className={`${spaceGrotesk.variable} ${satoshi.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AppearanceProvider>
            <a className="skip-link" href="#main-content">Skip to content</a>
            <main id="main-content" tabIndex={-1}><ExperienceRouter>{children}</ExperienceRouter></main>
          </AppearanceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
