export type LabStoryId = 'mickey' | 'laptop' | 'cells' | 'mouse' | 'robot' | 'reagents' | 'snowboard' | 'bike' | 'wetsuit'

export type LabStory = {
  id: LabStoryId
  object: string
  category: string
  title: string
  preview: string
  paragraphs: string[]
  notes: string[]
  links?: { label: string; href: string }[]
}

export const LAB_STORIES: LabStory[] = [
  {
    id: 'mickey', object: 'Mickey', category: 'The person in the lab coat',
    title: 'Hey, I’m Mickey.',
    preview: 'Biology, robotics, intelligence. And a few things that get me away from a screen.',
    paragraphs: [
      'My full name is Himay Makhija, but most people call me Mickey. I work across molecular biology, lab automation, and machine learning. I like the parts of a problem where those disciplines meet.',
      'This room is a little map of that: the experiments, the code, the equipment, and the things I do when I leave the lab. Pick something up and have a look.',
    ],
    notes: ['Scientist', 'Builder', 'Usually curious'],
    links: [{ label: 'Read the longer version', href: '/about?look=mono' }, { label: 'My résumé', href: '/Mickey_Makhija_Resume.pdf' }],
  },
  {
    id: 'laptop', object: 'The laptop', category: 'Intelligence & software',
    title: 'The other kind of experiment.',
    preview: 'From gene-expression data to machine learning and the tools I’m building at Cornucopia.',
    paragraphs: [
      'I started writing code to help with problems in the lab. That grew into gene-expression pipelines, single-cell and single-nucleus RNA-seq analysis, and exploring EGNNs and Transformers for target triage at Amgen.',
      'Cornucopia is where I’m putting that interest into tools for scientific work. You can explore the discovery site or open the app below.',
    ],
    notes: ['Scientific software', 'Machine learning', 'Computational biology'],
    links: [{ label: 'Cornucopia Discovery', href: 'https://discovery.cornucopiabio.com' }, { label: 'Open Cornucopia', href: 'https://app.cornucopiabio.com' }, { label: 'GitHub', href: 'https://github.com/mknoir' }],
  },
  {
    id: 'cells', object: 'The cells', category: 'In vitro',
    title: 'Start with the cells.',
    preview: 'Cell culture, iPSCs, and high-throughput molecular assays.',
    paragraphs: [
      'A lot of my work starts here: growing cells, setting up assays, and figuring out whether the result answers the question we meant to ask.',
      'At Amgen, I worked on high-throughput molecular assays for cardiometabolic disease and automated iPSC workflows. Earlier, at Optimized Foods, I worked on cell-cultured caviar. Very different products; plenty of shared lessons about cell culture and process development.',
    ],
    notes: ['Cell culture', 'iPSC workflows', 'Molecular assays'],
  },
  {
    id: 'mouse', object: 'The mouse', category: 'In vivo',
    title: 'Beyond the dish.',
    preview: 'The in vivo side of my experimental background.',
    paragraphs: [
      'My experimental background includes both in vitro and in vivo work. Moving between the two changes the questions you can ask and the context you need to interpret an answer.',
      'The mouse belongs next to the cells in this room because both are part of how I think about biology. A result in a dish is one piece of a much bigger picture.',
    ],
    notes: ['In vivo experiments', 'Experimental design', 'Biological context'],
  },
  {
    id: 'robot', object: 'The robot arm', category: 'Robotics & automation',
    title: 'Let the machine do the repeats.',
    preview: 'Turning repetitive lab work into reliable, repeatable workflows.',
    paragraphs: [
      'Lab automation sits right between my interests in biology and robotics. At Amgen, that included automating iPSC workflows and connecting experimental work with data pipelines.',
      'I’m interested in the whole loop: what the experiment needs, what the equipment can actually do, and how to make the next run more reliable. The arm is a stand-in for that part of my work.',
    ],
    notes: ['Lab automation', 'Workflow development', 'Robotics'],
  },
  {
    id: 'reagents', object: 'The reagents', category: 'At the bench',
    title: 'A lot of small details.',
    preview: 'PCR, assay development, gene expression, and the hands-on work behind the data.',
    paragraphs: [
      'Before the analysis, there’s sample prep, reagents, controls, and a protocol that needs to work. My bench experience includes PCR and diagnostic assay work at Cepheid, molecular assays at Amgen, and AAV production at BioMarin.',
      'I like building software with that experience in mind. It helps to remember what had to happen before a data point arrived in a file.',
    ],
    notes: ['PCR', 'Assay development', 'Gene therapy'],
  },
  {
    id: 'snowboard', object: 'The snowboard', category: 'Outside the lab',
    title: 'Waiting for snow.',
    preview: 'One of my favorite reasons to close the laptop.',
    paragraphs: ['I’m into snowboarding. The board gets a spot in the lab because the things I do outside work are part of the story too.', 'No productivity lesson here. I just really like being on the mountain.'],
    notes: ['Snowboarding', 'Mountains', 'Winter'],
  },
  {
    id: 'bike', object: 'The bike', category: 'Outside the lab',
    title: 'Take the long way.',
    preview: 'Cycling, running, and spending more time outside.',
    paragraphs: ['Cycling and running are two ways I like to spend time away from the bench and the screen.', 'The bike is here alongside the snowboard and wetsuit: a small reminder that this is a personal website, and there’s more to me than the résumé.'],
    notes: ['Cycling', 'Running', 'Outdoors'],
  },
  {
    id: 'wetsuit', object: 'The wetsuit', category: 'Outside the lab',
    title: 'Room for the water, too.',
    preview: 'Swimming gets its own corner.',
    paragraphs: ['Swimming rounds out the collection. I’m still learning, which is part of why I enjoy it.', 'If you’ve read the skill chart on my original site, you’ll know I rate my swimming a little more modestly than my snowboarding. I’m keeping that honest.'],
    notes: ['Swimming', 'Still learning'],
    links: [{ label: 'See the original skill chart', href: '/about?look=mono#skills' }],
  },
]

export const LAB_PROJECTS = [
  { name: 'Cornucopia', detail: 'Tools for scientific discovery.', href: 'https://discovery.cornucopiabio.com', extra: 'https://app.cornucopiabio.com', image: '/projects/cornucopia-discovery-team.png', imageWidth: 1810, imageHeight: 1024, imageAlt: 'Cornucopia Discovery Full Lab Team: ask a research question and Aster directs the specialists' },
  { name: 'Thread of Life', detail: 'An interactive journey through biology.', href: 'https://tol-two.vercel.app/', image: '/projects/thread-of-life.png', imageWidth: 1280, imageHeight: 720, imageAlt: 'Thread of Life gene and genetic variant explorer' },
  { name: '3D Chem Viewer', detail: 'Explore molecular structures in 3D.', href: 'https://chemview.streamlit.app/' },
  { name: 'ADME Checker', detail: 'A quick look at molecular properties.', href: 'https://chemro5.streamlit.app/' },
  { name: 'Target Bioactivity', detail: 'Explore ChEMBL bioactivity data.', href: 'https://chembl.streamlit.app/' },
  { name: 'KEGG Query', detail: 'Find pathways and gene information.', href: 'https://keggapp-mknoir.streamlit.app/' },
]
