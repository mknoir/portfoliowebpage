'use client'

import { motion } from 'framer-motion'

export function About() {
  return (
    <section
      id="about"
      className="relative flex flex-col items-center justify-center py-20 px-4 text-center bg-background text-foreground"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
      >
        About Me
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-2xl text-lg sm:text-xl text-text-muted mb-8"
      >
        I’m a passionate scientist with a relentless drive to push the boundaries of molecular biology and biotechnology.
        My work bridges the gap between cutting-edge research and real-world applications, combining automation, data science, and bioinformatics to accelerate discovery.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="grid gap-6 sm:grid-cols-2 max-w-4xl text-left"
      >
        <div className="bg-surface/50 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-accent-primary mb-2">Mission</h3>
          <p className="text-text-secondary">
            To revolutionize the biotech landscape by integrating advanced automation and AI-driven research,
            paving the way for faster, more efficient scientific breakthroughs.
          </p>
        </div>

        <div className="bg-surface/50 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-accent-primary mb-2">Current Focus</h3>
          <p className="text-text-secondary">
            Building smarter tools for molecular research, blending robotics, automation, and data science
            to enable next-generation scientific discovery.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
