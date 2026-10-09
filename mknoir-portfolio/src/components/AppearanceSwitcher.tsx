'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Check, Palette, X } from 'lucide-react'
import { APPEARANCES, type Appearance } from '@/lib/appearance'
import { useAppearance } from '@/components/appearance-provider'
import '@/styles/appearance-switcher.css'

export function AppearanceSwitcher() {
  const { appearance, chooseAppearance } = useAppearance()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])

  function close() {
    dialogRef.current?.close()
    setOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }

  function select(next: Appearance) {
    chooseAppearance(next)
    close()
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="navigation-icon-button appearance-trigger"
        type="button"
        aria-label="Change site design"
        aria-haspopup="dialog"
        aria-controls={`${id}-dialog`}
        aria-expanded={open}
        title="Change site design"
        onClick={() => { dialogRef.current?.showModal(); setOpen(true) }}
      >
        <Palette size={19} aria-hidden="true" />
      </button>
      <dialog
        ref={dialogRef}
        id={`${id}-dialog`}
        className="appearance-dialog"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        onClose={() => setOpen(false)}
        onCancel={(event) => { event.preventDefault(); close() }}
        onClick={(event) => { if (event.target === event.currentTarget) close() }}
      >
        <div className="appearance-picker">
          <div className="appearance-picker-heading">
            <div><p className="eyebrow">Different ways in.</p><h2 id={`${id}-title`}>Choose a look.</h2></div>
            <button className="navigation-icon-button" type="button" onClick={close} aria-label="Close design picker" autoFocus><X size={20} aria-hidden="true" /></button>
          </div>
          <p id={`${id}-description`}>A random design on each visit. Or choose how you explore.</p>
          <div className="appearance-options">
            {APPEARANCES.map((option) => (
              <button key={option.id} type="button" className="appearance-option" aria-pressed={appearance === option.id} onClick={() => select(option.id)}>
                <span className={`appearance-swatch appearance-swatch-${option.id}`} aria-hidden="true"><i /><i /><i /></span>
                <span className="appearance-option-copy"><strong>{option.label}</strong><span>{option.description}</span></span>
                {appearance === option.id && <Check size={18} aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      </dialog>
    </>
  )
}
