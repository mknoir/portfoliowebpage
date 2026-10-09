import DnaLoader from '@/components/Dnaloader'

export default function Loading() {
  return (
    <div className="route-loading shell">
      <DnaLoader label="Loading page" />
      <p aria-hidden="true">Loading…</p>
    </div>
  )
}
