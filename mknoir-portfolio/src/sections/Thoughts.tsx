import { NotebookPen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
export function Thoughts() {
  return (
    <section id="thoughts" className="thoughts-section shell" aria-labelledby="thoughts-title">
      <Card className="thoughts-panel">
        <div className="thoughts-copy"><p className="eyebrow">03 / Thoughts</p><h2 id="thoughts-title">Thinking out loud.</h2><p>Notes on biology, robotics, intelligence, and the questions I keep coming back to.</p></div>
        <div className="thoughts-soon"><NotebookPen size={30} strokeWidth={1.3} aria-hidden="true" /><Badge variant="outline" className="coming-soon">Coming soon</Badge><p>A few ideas are taking shape.<br />{' '}They&apos;ll live here.</p></div>
      </Card>
    </section>
  )
}
