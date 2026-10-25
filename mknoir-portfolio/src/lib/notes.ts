export const SCIENTIFIC_METHOD_NOTE = {
  title: 'The scientific method for AI',
  href: '/thoughts/the-scientific-method-for-ai',
  description: 'Folks are throwing the kitchen sink at AI. Some thoughts on building reliable systems for life sciences, and the experiments we need to get there.',
  publishedAt: '2026-10-17',
  displayDate: 'October 17, 2026',
  readingTime: '3 min read',
} as const

export const SCIENTIFIC_AI_NOTE = {
  title: 'Fine-tuning scientific AI',
  href: '/thoughts/fine-tuning-scientific-ai',
  description: 'Diving into GeneBench-Pro sent me back to the evidence on training, fine-tuning, and tools. Here’s what I’d like to test.',
  publishedAt: '2026-10-25',
  displayDate: 'October 25, 2026',
  readingTime: '3 min read',
} as const

export const NOTES = [SCIENTIFIC_AI_NOTE, SCIENTIFIC_METHOD_NOTE] as const
