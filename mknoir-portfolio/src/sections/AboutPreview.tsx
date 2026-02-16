'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function AboutPreview() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          About Me
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          I&apos;m a scientist who thinks like an engineer. I&apos;m drawn to
          the natural alignment between biology and software. I design systems
          that make biology more structured and less chaotic by applying
          automation and engineering principles to experimental science, turning
          ideas into executable workflows. Outside of work, I&apos;m usually
          snowboarding, biking, running, or chasing down a good craft beer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Button variant="outline" asChild>
            <Link href="/about" className="gap-2">
              Learn more about me
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
