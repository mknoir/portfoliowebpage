'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex flex-col justify-between min-h-screen bg-background text-center px-6 py-16"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accentPrimary/40 via-surfaceDeep to-background opacity-60" />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-foreground"
        >
          Hi, I&apos;m{' '}
          <span className="relative inline-block text-accentPrimary transition-all duration-300 group">
            <span className="group-hover:border-b-2 border-accentPrimary transition-all duration-300">
              Mickey
            </span>
          </span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl sm:text-2xl md:text-3xl mb-4 leading-snug text-foreground"
        >
          Exploring the intersection of science and technology.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl text-base sm:text-lg md:text-xl mb-8 text-textSecondary"
        >
          On a journey to build smarter tools for scientific discovery.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 sm:gap-10 md:gap-16 lg:gap-20"
        >
          <Link
            href="#projects"
            className="inline-flex items-center justify-center rounded-lg bg-accentPrimary text-foreground px-8 sm:px-10 md:px-12 py-3 font-semibold shadow-md hover:bg-accentSecondary transition-transform transform hover:-translate-y-1 duration-300"
          >
            View Projects
          </Link>

          <Link
            href="/experience"
            className="inline-flex items-center justify-center rounded-lg bg-surfaceDeep text-foreground px-8 sm:px-10 md:px-12 py-3 font-semibold shadow-md hover:bg-surface transition-transform transform hover:-translate-y-1 duration-300"
          >
            Explore My Experience
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="flex flex-col items-center mt-8 text-textSecondary"
      >
        <span className="text-sm mb-1">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-6 h-6 text-accentPrimary" />
        </motion.div>
      </motion.div>
    </section>
  )
}
