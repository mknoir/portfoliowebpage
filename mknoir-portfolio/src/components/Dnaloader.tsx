import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import './Dnaloader.css'

type DnaLoaderProps = {
  active?: boolean
  className?: string
  /** Omit when nearby status text already describes the operation. */
  label?: string
}

export default function DnaLoader({
  active = true,
  className,
  label,
}: DnaLoaderProps) {
  return (
    <div
      className={cn('dna-indicator', className)}
      data-active={active}
      role={label ? 'status' : undefined}
      aria-live={label ? 'polite' : undefined}
      aria-hidden={label ? undefined : true}
    >
      <span className="dna-helix" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => {
          const phase = Math.sin(index * Math.PI / 4)
          return (
            <span
              key={index}
              className="dna-rung"
              style={{
                '--dna-offset': (phase * 0.34).toFixed(4),
                '--dna-bar-scale': Math.max(0.12, Math.abs(phase)).toFixed(4),
                '--dna-delay': `${-index * 0.18}s`,
              } as CSSProperties}
            >
              <i />
            </span>
          )
        })}
      </span>
      {label && <span className="dna-accessible-label">{label}</span>}
    </div>
  )
}
