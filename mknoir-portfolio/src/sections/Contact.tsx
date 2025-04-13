// src/sections/Contact.tsx

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Phone, Github, Linkedin } from 'lucide-react'

export function Contact() {
  return (
    <section
      id="contact"
      className="relative flex flex-col items-center justify-center py-20 px-4 bg-black text-white"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center"
      >
        Get in Touch
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-xl text-lg sm:text-xl text-gray-300 mb-12 text-center"
      >
        Interested in collaboration, biotech innovation, or just a good conversation? Reach out to me!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex flex-wrap justify-center gap-6"
      >
        <Link
          href="mailto:himay75@gmail.com"
          className="flex items-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-lg shadow hover:bg-teal-400 transition"
        >
          <Mail className="w-5 h-5" /> Email Me
        </Link>

        <Link
          href="tel:323-398-9379"
          className="flex items-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-lg shadow hover:bg-teal-400 transition"
        >
          <Phone className="w-5 h-5" /> Call Me
        </Link>

        <Link
          href="https://github.com/mknoir"
          target="_blank"
          className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-700 transition"
        >
          <Github className="w-5 h-5" /> GitHub
        </Link>

        <Link
          href="https://www.linkedin.com/in/himay-makhija-mickey/"
          target="_blank"
          className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-700 transition"
        >
          <Linkedin className="w-5 h-5" /> LinkedIn
        </Link>
      </motion.div>
    </section>
  )
}
