'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { APPEARANCE_SESSION_KEY, DEFAULT_COLOR_MODES, isAppearance, type Appearance } from '@/lib/appearance'

type AppearanceContextValue = {
  appearance: Appearance | null
  chooseAppearance: (appearance: Appearance) => void
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null)

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearance] = useState<Appearance | null>(null)
  const initialized = useRef(false)
  const { setTheme } = useTheme()

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const initial = document.documentElement.dataset.appearance
    setAppearance(isAppearance(initial) ? initial : 'field')
    const initialMode = document.documentElement.dataset.appearanceColorMode
    if (initialMode === 'light' || initialMode === 'dark') setTheme(initialMode)
  }, [setTheme])

  const chooseAppearance = (next: Appearance) => {
    document.documentElement.dataset.appearance = next
    document.documentElement.dataset.appearanceColorMode = DEFAULT_COLOR_MODES[next]
    setAppearance(next)
    setTheme(DEFAULT_COLOR_MODES[next])
    const url = new URL(window.location.href)
    if (url.searchParams.has('look')) {
      url.searchParams.set('look', next)
      window.history.replaceState(window.history.state, '', url)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    try {
      sessionStorage.setItem(APPEARANCE_SESSION_KEY, next)
    } catch {
      // Switching still works when a browser does not allow storage.
    }
  }

  return <AppearanceContext.Provider value={{ appearance, chooseAppearance }}>{children}</AppearanceContext.Provider>
}

export function useAppearance() {
  const value = useContext(AppearanceContext)
  if (!value) throw new Error('useAppearance must be used inside AppearanceProvider')
  return value
}
