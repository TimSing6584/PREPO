import type { SpeechEvaluation } from '@/components/audio/speechEvaluation.types'

export type StoredQuestionProgress = {
  mode?: 'mcq' | 'written'
  mcq?: {
    selectedOption: number | null
    isSubmitted: boolean
    isCorrect: boolean | null
  }
  written?: {
    draft: string
    speechEvaluation?: SpeechEvaluation
  }
}

export type QuestionProgressPatch = {
  mode?: 'mcq' | 'written'
  mcq?: StoredQuestionProgress['mcq']
  written?: Partial<NonNullable<StoredQuestionProgress['written']>>
}

export function mergeQuestionProgress(
  current: StoredQuestionProgress | undefined,
  patch: QuestionProgressPatch,
): StoredQuestionProgress {
  const next: StoredQuestionProgress = { ...current }

  if (patch.mode !== undefined) next.mode = patch.mode
  if (patch.mcq !== undefined) next.mcq = patch.mcq
  if (patch.written !== undefined) {
    next.written = {
      draft: current?.written?.draft ?? '',
      ...current?.written,
      ...patch.written,
    }
  }

  return next
}
