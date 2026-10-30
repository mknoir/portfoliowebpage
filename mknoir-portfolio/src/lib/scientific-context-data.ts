import data from '../../public/research/scientific-context-publication-20261030.json'

export type ContextCondition = 'original' | 'luna' | 'exa' | 'scientific_context'
export type TokenMetric = 'inputTokens' | 'outputTokens' | 'reasoningTokens'
export type UsageTotals = {
  settings: number; passes: number; parseValid: number | null; endpointTypesComplete: number | null
  inputTokens: number | null; outputTokens: number | null; reasoningTokens: number | null
  solverEstimateUsd: number | null
}
export type ContextProfile = {
  id: string; model: string; effort: string; route: string
  conditions: Record<ContextCondition, UsageTotals>
  contextExaFeeUsd: number; contextClosedUnknownBoundUsd: number
}
export type ContextOutcome = {
  passed: boolean; category: string; rawOutcome: string; parseValid: boolean | null
  endpointTypesComplete: boolean; fieldCorrect: number; fieldGraded: number
  inputTokens: number | null; outputTokens: number | null; reasoningTokens: number | null
  solverEstimateUsd: number | null; modelCalls: number; toolCalls: number
}
export type ContextRow = {
  id: string; profileId: string; model: string; effort: string; taskId: string; task: string
  conditions: Record<ContextCondition, ContextOutcome | null>
}
export type BroadProfile = {
  id: string; model: string; effort: string; route: string
  conditions: { original: UsageTotals; web: UsageTotals }
}

// Public projection is source-hashed and independently checked before release.
// It contains no submitted answers, targets, tolerances or private reasoning.
export const scientificContextData: {
  profiles: ContextProfile[]; rows: ContextRow[]; broadProfiles: BroadProfile[]
} = data
