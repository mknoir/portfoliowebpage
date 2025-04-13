// src/app/layout.tsx

import '@/styles/globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import DnaLoader from '@/components/Dnaloader'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Himay Makhija | Biotech Portfolio',
  description: 'Biotech portfolio showcasing projects, publications, and research.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-background text-foreground`}>
        {/* DNA Loader — displays globally on first load */}
        <DnaLoader />

        {/* Global Navbar */}
        <Navbar />

        {/* Main page content */}
        <main className="min-h-screen">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  )
}
