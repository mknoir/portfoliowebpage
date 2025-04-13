// src/sections/Hero.tsx

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center text-center px-4"
    >
      {/* Optional Background Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-900/40 via-black to-black opacity-60" />

      {/* Main Content */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4"
      >
        Welcome, I'm{' '}
        <span className="text-teal-400 hover:text-teal-300 transition-colors">
          Mickey
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="max-w-xl text-lg sm:text-xl text-gray-300 mb-8"
      >
        A dedicated scientist committed to revolutionizing the molecular
        landscape through cutting-edge technology.
      </motion.p>

      {/* Call to Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Link
          href="#projects"
          className="inline-block rounded-lg bg-teal-500 px-8 py-3 text-white font-semibold shadow-lg hover:bg-teal-400 transition"
        >
          View Projects
        </Link>
      </motion.div>
    </section>
  )
}
