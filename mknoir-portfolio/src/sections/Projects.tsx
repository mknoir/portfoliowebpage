import Image from 'next/image'
import { ArrowUpRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const experiments = [
  { title: '3D Chem Viewer', description: 'Molecular structures, made explorable.', category: 'Visualization', href: 'https://chemview.streamlit.app/' },
  { title: 'ADME Checker', description: 'A small tool for exploring drug-likeness.', category: 'Cheminformatics', href: 'https://chemro5.streamlit.app/' },
  { title: 'Target Bioactivity', description: 'Making ChEMBL bioactivity data easier to work with.', category: 'Scientific data', href: 'https://chembl.streamlit.app/' },
  { title: 'KEGG Query', description: 'A window into pathway and gene data.', category: 'Bioinformatics', href: 'https://keggapp-mknoir.streamlit.app/' },
  { title: 'PDB ID Retrieval', description: 'Finding a protein’s structure in the PDB.', category: 'Bioinformatics', href: 'https://keggapp-ro3drlgjs4lcoji3ycn33e.streamlit.app/' },
  { title: 'Wave Web3 App', description: 'An early experiment with Ethereum.', category: 'Early experiments', href: 'https://waveportal-starter-project.mknoir.repl.co/' },
  { title: 'NFT Wordslot', description: 'An on-chain word-slot experiment.', category: 'Early experiments', href: 'https://nft-starter-project.mknoir.repl.co/' },
]

export function Projects() {
  return (
    <section id="projects" className="projects-section section-pad" aria-labelledby="projects-title">
      <div className="shell">
        <div className="section-heading">
          <div><p className="eyebrow">01 / Selected work</p><h2 id="projects-title">Curiosity, put to work.</h2></div>
          <p>Things I&apos;m building to make<br className="desktop-break" /> science a little more accessible.</p>
        </div>
        <div className="featured-projects">
          <article id="cornucopia" aria-labelledby="cornucopia-title">
          <Card className="featured-project">
            <a href="https://discovery.cornucopiabio.com" target="_blank" rel="noopener noreferrer" className="project-image-link cornucopia-preview" aria-label="Explore Cornucopia Discovery (opens in a new tab)">
              <Image src="/projects/cornucopia-discovery-team.png" alt="Cornucopia Discovery Full Lab Team: ask a research question and Aster directs the specialists" width={1810} height={1024} sizes="(max-width: 700px) 90vw, 580px" /><span className="project-open"><ArrowUpRight size={21} aria-hidden="true" /></span>
            </a>
            <div className="project-body">
            <div className="project-caption"><Badge variant="secondary">Scientific AI &amp; lab automation</Badge><span className="project-index">01</span></div>
            <h3 id="cornucopia-title"><a href="https://discovery.cornucopiabio.com" target="_blank" rel="noopener noreferrer">Cornucopia</a></h3>
            <p>Connecting the science, the software, and the instruments. Building tools that turn experimental workflows into working systems.</p>
            <div className="project-actions" role="group" aria-label="Cornucopia apps">
              <Button asChild><a href="https://discovery.cornucopiabio.com" target="_blank" rel="noopener noreferrer" aria-label="Open Cornucopia Discovery (opens in a new tab)">Discovery <ArrowUpRight aria-hidden="true" /></a></Button>
              <Button asChild variant="outline"><a href="https://app.cornucopiabio.com" target="_blank" rel="noopener noreferrer" aria-label="Open Cornucopia app (opens in a new tab)">Open app <ArrowUpRight aria-hidden="true" /></a></Button>
            </div>
            </div>
          </Card>
          </article>
          <article>
          <Card className="featured-project">
            <a href="https://tol-two.vercel.app/" target="_blank" rel="noopener noreferrer" className="project-image-link thread-preview" aria-label="Explore Thread of Life (opens in a new tab)">
              <Image src="/projects/thread-of-life.png" alt="Thread of Life, with evidence-based journeys through genes and genetic variation" width={1280} height={720} sizes="(max-width: 700px) 90vw, 580px" /><span className="project-open"><ArrowUpRight size={21} aria-hidden="true" /></span>
            </a>
            <div className="project-body">
            <div className="project-caption"><Badge variant="secondary">Genetics &amp; scientific storytelling</Badge><span className="project-index">02</span></div>
            <h3><a href="https://tol-two.vercel.app/" target="_blank" rel="noopener noreferrer">Thread of Life</a></h3>
            <p>Pull the thread on a gene or variant. An interface for exploring what the evidence says, what it doesn&apos;t, and the stories in between.</p>
            <div className="project-actions"><Button asChild variant="outline"><a href="https://tol-two.vercel.app/" target="_blank" rel="noopener noreferrer">Explore project <ArrowUpRight aria-hidden="true" /></a></Button></div>
            </div>
          </Card>
          </article>
        </div>
        <details className="experiment-drawer">
          <summary><span>More experiments <Badge variant="outline" className="experiment-count">07</Badge></span><Plus size={20} aria-hidden="true" /></summary>
          <div className="experiment-list">{experiments.map((project) => (
            <a key={project.title} href={project.href} target="_blank" rel="noopener noreferrer" className="experiment-row"><div><h3>{project.title}</h3><p>{project.description}</p></div><span className="experiment-category">{project.category}</span><ArrowUpRight size={19} aria-hidden="true" /></a>
          ))}</div>
        </details>
      </div>
    </section>
  )
}
