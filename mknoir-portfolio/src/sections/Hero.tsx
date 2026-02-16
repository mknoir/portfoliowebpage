'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100vh-3.5rem)] flex-col justify-between px-6 py-20"
    >
      {/* Main content */}
      <div className="mx-auto flex w-full max-w-3xl flex-grow flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl"
        >
          Hi, I&apos;m Mickey
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-4 text-xl leading-snug text-muted-foreground sm:text-2xl md:text-3xl"
        >
          Exploring the intersection of science and technology.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl"
        >
          On a journey to build smarter tools for scientific discovery.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-4"
        >
          <Button size="lg" asChild>
            <Link href="#projects">View Projects</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/experience">Explore My Experience</Link>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="flex flex-col items-center text-muted-foreground"
      >
        <span className="mb-1 text-sm">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}
