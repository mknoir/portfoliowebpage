'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const projects = [
  { title: '3D Chem Viewer', link: 'https://chemview.streamlit.app/' },
  { title: 'ADME Checker', link: 'https://chemro5.streamlit.app/' },
  { title: 'Target Bioactivity', link: 'https://chembl.streamlit.app/' },
  { title: 'KEGG Query', link: 'https://keggapp-mknoir.streamlit.app/' },
  { title: 'PDB ID Retrieval App', link: 'https://keggapp-ro3drlgjs4lcoji3ycn33e.streamlit.app/' },
  { title: 'Wave Web3App', link: 'https://waveportal-starter-project.mknoir.repl.co/' },
  { title: 'NFT Wordslot Project', link: 'https://nft-starter-project.mknoir.repl.co/' },
  { title: 'Coming Soon: Molecular Dynamics Visualizer', link: '#', comingSoon: true },
  { title: 'Coming Soon: AI Compound Generator', link: '#', comingSoon: true },
]

export function Projects() {
  return (
    <section
      id="projects"
      className="relative flex flex-col items-center justify-center py-20 px-4 bg-background text-foreground"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 text-center"
      >
        Projects
      </motion.h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={`group bg-surface/60 p-6 rounded-lg shadow-lg hover:bg-surfaceDeep transition-all ${
              project.comingSoon ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <Link href={project.link} target="_blank" rel="noopener noreferrer">
              <div className="flex flex-col items-center text-center space-y-4">
                <h3 className="text-xl font-semibold text-accent-primary group-hover:text-accent-secondary transition">
                  {project.title}
                </h3>
                <p className="text-sm text-text-muted">
                  {project.comingSoon ? 'Coming Soon' : 'Click to explore this project'}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
