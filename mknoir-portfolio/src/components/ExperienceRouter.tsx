'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useAppearance } from '@/components/appearance-provider'
import DnaLoader from '@/components/Dnaloader'

function LoadingExperience() {
  return <div className="experience-pending" role="status"><DnaLoader /><span>Getting things ready…</span></div>
}

const OriginalPortfolio = dynamic(() => import('@/experiences/OriginalPortfolio').then(module => module.OriginalPortfolio), { loading: LoadingExperience })
const SeasonalPortfolio = dynamic(() => import('@/experiences/SeasonalPortfolio'), { loading: LoadingExperience })
const LabExperience = dynamic(() => import('@/experiences/LabExperience'), { loading: LoadingExperience })
const AfterHoursPortfolio = dynamic(() => import('@/experiences/AfterHoursPortfolio'), { loading: LoadingExperience })
const AtlasPortfolio = dynamic(() => import('@/experiences/AtlasPortfolio'), { loading: LoadingExperience })

export function ExperienceRouter({ children }: { children: React.ReactNode }) {
  const { appearance } = useAppearance()
  const pathname = usePathname()
  if (!['/', '/about', '/experience'].includes(pathname)) return <>{children}</>
  const page = pathname === '/about' ? 'about' : pathname === '/experience' ? 'work' : 'home'
  if (appearance === 'mono') return <OriginalPortfolio key={pathname} page={page} />
  if (appearance === 'field') return <SeasonalPortfolio key={pathname} page={page} />
  if (appearance === 'orbit') return <LabExperience key={pathname} page={page} />
  if (appearance === 'afterhours') return <AfterHoursPortfolio key={pathname} page={page} />
  if (appearance === 'atlas') return <AtlasPortfolio key={pathname} page={page} />
  return <><div className="experience-source" aria-hidden="true">{children}</div><LoadingExperience /></>
}
