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
  description: 'GeneBench-Pro got me thinking about context, tool use, and how fine-tuned models might compare with closed frontier models.',
  publishedAt: '2026-10-25',
  displayDate: 'October 25, 2026',
  readingTime: '2 min read',
} as const

export const SEARCH_EVIDENCE_NOTE = {
  title: 'Evaluating Scientific AI on Ten Public GeneBench-Pro Tasks',
  href: '/thoughts/evaluating-scientific-ai',
  description: 'An independent exploration of model behavior and tool ablations on OpenAI’s ten public GeneBench-Pro tasks, comparing performance with and without web access.',
  publishedAt: '2026-10-29',
  displayDate: 'October 29, 2026',
  readingTime: '8 min read + rabbit holes',
} as const

export const NOTES = [SEARCH_EVIDENCE_NOTE, SCIENTIFIC_AI_NOTE, SCIENTIFIC_METHOD_NOTE] as const
