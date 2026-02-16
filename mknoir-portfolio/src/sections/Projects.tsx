'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

const projects = [
  {
    title: '3D Chem Viewer',
    description: 'Interactive 3D molecular structure visualization tool.',
    link: 'https://chemview.streamlit.app/',
  },
  {
    title: 'ADME Checker',
    description: 'Drug-likeness and ADME property predictor.',
    link: 'https://chemro5.streamlit.app/',
  },
  {
    title: 'Target Bioactivity',
    description: 'Bioactivity data explorer via ChEMBL database.',
    link: 'https://chembl.streamlit.app/',
  },
  {
    title: 'KEGG Query',
    description: 'Pathway and gene data queried from the KEGG database.',
    link: 'https://keggapp-mknoir.streamlit.app/',
  },
  {
    title: 'PDB ID Retrieval',
    description: 'Protein structure lookup from the PDB.',
    link: 'https://keggapp-ro3drlgjs4lcoji3ycn33e.streamlit.app/',
  },
  {
    title: 'Wave Web3 App',
    description: 'Decentralised wave portal built on Ethereum.',
    link: 'https://waveportal-starter-project.mknoir.repl.co/',
  },
  {
    title: 'NFT Wordslot',
    description: 'On-chain NFT word-slot game project.',
    link: 'https://nft-starter-project.mknoir.repl.co/',
  },
  {
    title: 'Molecular Dynamics Visualizer',
    description: 'Simulation visualizer for molecular dynamics trajectories.',
    link: '#',
    comingSoon: true,
  },
  {
    title: 'AI Compound Generator',
    description: 'Generative AI for novel molecular compound design.',
    link: '#',
    comingSoon: true,
  },
]

export function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Projects
        </motion.h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Card
                className={`group h-full transition-colors hover:bg-accent/50 ${
                  project.comingSoon ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    {project.title}
                    {project.comingSoon && (
                      <Badge variant="outline" className="text-xs font-normal">
                        Coming Soon
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </CardContent>
                {!project.comingSoon && (
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="gap-2" asChild>
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Explore
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
